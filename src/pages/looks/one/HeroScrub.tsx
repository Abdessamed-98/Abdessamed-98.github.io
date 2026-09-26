/**
 * Look 1 hero — the room orbit, scrubbed.
 *
 * Two ways in, one per kind of device:
 *
 * - Pointer (desktop): the pointer's horizontal position across the hero picks
 *   the frame. Every frame of a 5-second 1926x1074 orbit render — 150 stills,
 *   sharpened (the render is soft and gets upscaled) and kept at high quality:
 *   ~133KB each, ~21MB. Sampling every third frame visibly stepped on slow moves
 *   (7.5/255 mean change between kept frames against 3.3 between native ones).
 *
 * - Scroll (touch): there is no hover, so scrolling drives the orbit instead —
 *   the page scrolls as normal and the room turns as the hero leaves. Phones get their
 *   own set — 38 frames, the second half of the orbit, centre-cropped to
 *   portrait (a phone shows that slice of a 16:9 frame anyway), ~2.7MB. The set
 *   starts on the poster's own frame, so the hand-over is seamless.
 *
 * Either way the drawn frame eases towards its target so it glides instead of
 * snapping, and frames go to a canvas, which avoids the flicker of swapping
 * <img> sources. Nothing is shown half-ready: the poster (sharper than any scrub
 * frame) holds the hero until every frame has decoded. Reduced motion and
 * data-saver keep the poster and fetch nothing.
 *
 * Frames live in public/looks/hero-scrub (ffmpeg recipes in the scratchpad).
 */
import { useEffect, useRef, useState } from 'react';

type Mode = 'pointer' | 'scroll';

const SETS: Record<Mode, { count: number; src: (i: number) => string; ease: number }> = {
  pointer: {
    count: 150,
    src: (i) => `/looks/hero-scrub/f${String(i + 1).padStart(3, '0')}.avif`,
    ease: 0.18,
  },
  scroll: {
    count: 38,
    src: (i) => `/looks/hero-scrub/m${String(i + 1).padStart(3, '0')}.avif`,
    // no easing: the scroll is already smooth, and a picture that chases it
    // reads as lag. Each frame shows exactly where the page is.
    ease: 1,
  },
};

/** parallel image requests while filling the sequence */
const LANES = 8;

function pickMode(): Mode | null {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  if (still || saveData) return null;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches ? 'pointer' : 'scroll';
}

export function HeroScrub({ poster, alt }: { poster: string; alt: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  /* phone frames, decoded ahead of time (see prepareBitmaps) */
  const bitmaps = useRef<ImageBitmap[]>([]);
  const target = useRef(0);
  const shown = useRef(0);
  const [mode, setMode] = useState<Mode | null>(null);
  const [ready, setReady] = useState(false);
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    const m = pickMode();
    if (!m) return;
    const set = SETS[m];
    setMode(m);

    // desktop rests on the middle of the orbit (the poster); the phone set
    // begins on that same frame and runs forward as the page scrolls
    const start = m === 'pointer' ? (set.count - 1) / 2 : 0;
    target.current = start;
    shown.current = start;
    if (frames.current.length !== set.count) frames.current = Array(set.count).fill(null);

    let stop = false;
    let raf = 0;

    const load = (i: number) =>
      new Promise<void>((done) => {
        const img = new Image();
        img.onload = () => {
          frames.current[i] = img;
          done();
        };
        img.onerror = () => done();
        img.src = set.src(i);
      });

    const draw = () => {
      const el = canvas.current;
      const index = Math.round(shown.current);
      if (!el) return;

      const bm = bitmaps.current[index];
      if (bm) {
        // the bitmap is already decoded and cropped to this canvas's shape:
        // drawing it is a straight copy, cheap enough for every scroll frame
        if (el.width !== bm.width || el.height !== bm.height) {
          el.width = bm.width;
          el.height = bm.height;
        }
        el.getContext('2d')?.drawImage(bm, 0, 0);
        if (wrap.current) wrap.current.dataset.frame = String(index);
        return;
      }

      const img = frames.current[index];
      if (!img) return;
      // which frame is on screen, for anyone inspecting the page
      if (wrap.current) wrap.current.dataset.frame = String(index);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = el.clientWidth, h = el.clientHeight;
      if (el.width !== Math.round(w * dpr) || el.height !== Math.round(h * dpr)) {
        el.width = Math.round(w * dpr);
        el.height = Math.round(h * dpr);
      }
      const ctx = el.getContext('2d');
      if (!ctx) return;
      // the frames are upscaled on most screens: use the good filter
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      // cover, matching the object-cover poster underneath
      const scale = Math.max((w * dpr) / img.naturalWidth, (h * dpr) / img.naturalHeight);
      const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
      ctx.drawImage(img, ((w * dpr) - dw) / 2, ((h * dpr) - dh) / 2, dw, dh);
    };

    const tick = () => {
      if (stop) return;
      // phones deliver scroll events in bursts while momentum-scrolling, so the
      // position is read every frame instead of waiting for them
      if (m === 'scroll') onScroll();
      const gap = target.current - shown.current;
      if (Math.abs(gap) > 0.01) {
        const before = Math.round(shown.current);
        shown.current = set.ease >= 1 ? target.current : shown.current + gap * set.ease;
        // the scroll moves every frame, the picture only every few pixels:
        // repaint only when a different frame is due
        if (Math.round(shown.current) !== before || set.ease < 1) draw();
      }
      raf = requestAnimationFrame(tick);
    };

    /* pointer: horizontal position across the hero */
    const onMove = (e: PointerEvent) => {
      const box = wrap.current?.getBoundingClientRect();
      if (!box || e.clientY < box.top || e.clientY > box.bottom) return;
      const ratio = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
      target.current = ratio * (set.count - 1);
      setMoved(true);
    };

    /* scroll: nothing is held back — the page scrolls as usual and the orbit
       plays as the hero leaves. It completes within the first 35% of the
       hero's height, so the whole turn happens while the room fills the
       screen, and quickly enough to read as motion rather than as a slideshow. */
    // The hero is the first thing on the page, so how far it has scrolled away
    // is just the page's scroll offset. Reading that costs nothing; measuring
    // the element every frame forced the browser to redo layout mid-scroll.
    let heroHeight = 0;
    function onScroll() {
      if (!heroHeight) heroHeight = wrap.current?.clientHeight ?? 0;
      if (heroHeight <= 0) return;
      const ratio = Math.min(1, Math.max(0, window.scrollY / (heroHeight * 0.35)));
      target.current = ratio * (set.count - 1);
    }

    /* A phone decoding a frame the first time it is shown costs 20-70ms —
       several screen refreshes — and it will drop decoded frames it is not
       showing and decode them again later. That was the stutter. So every
       phone frame is decoded once here, in the background, and cropped to
       the canvas's own shape; scrolling then only ever copies pixels. */
    async function prepareBitmaps() {
      const el = canvas.current;
      if (!el || typeof createImageBitmap !== 'function') return;
      const aspect = el.clientWidth / Math.max(1, el.clientHeight);
      try {
        const made = await Promise.all(
          frames.current.map((img) => {
            if (!img) return Promise.resolve(null);
            // the centre slice this screen shows, at the source's own resolution
            const h = img.naturalHeight;
            const w = Math.min(img.naturalWidth, Math.round(h * aspect));
            const x = Math.round((img.naturalWidth - w) / 2);
            return createImageBitmap(img, x, 0, w, h);
          }),
        );
        if (stop) {
          made.forEach((b) => b?.close());
          return;
        }
        bitmaps.current.forEach((b) => b.close());
        bitmaps.current = made.filter((b): b is ImageBitmap => !!b);
        // the Image elements are no longer needed; let the browser drop them
        if (bitmaps.current.length === frames.current.length) frames.current = [];
      } catch {
        // no bitmaps: the per-frame image path below still works, just less smoothly
      }
    }

    const onResize = () => {
      heroHeight = 0;
      if (m === 'scroll') onScroll();
      draw();
    };

    (async () => {
      // fill the whole sequence before handing over — a partly loaded scrub
      // jumps between neighbours, which is worse than a still hero
      let next = 0;
      const lane = async () => {
        while (!stop) {
          const i = next++;
          if (i >= set.count) return;
          // the frame store outlives a remount, so never fetch one twice
          if (!frames.current[i]) await load(i);
        }
      };
      await Promise.all(Array.from({ length: LANES }, lane));
      if (stop || !frames.current.some(Boolean)) return;
      if (m === 'scroll') await prepareBitmaps();
      if (stop) return;
      if (m === 'scroll') {
        // the visitor may already be part-way down: start where they are
        onScroll();
        shown.current = target.current;
      }
      setReady(true);
      draw();
      raf = requestAnimationFrame(tick);
    })();

    if (m === 'pointer') window.addEventListener('pointermove', onMove, { passive: true });
    else window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      stop = true;
      cancelAnimationFrame(raf);
      bitmaps.current.forEach((b) => b.close());
      bitmaps.current = [];
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // desktop waits for the first pointer move; on a phone the first frame is the
  // poster's own, so the canvas can take over the moment it is ready
  const live = ready && (mode === 'scroll' || moved);
  return (
    <div
      ref={wrap}
      data-testid="hero-scrub"
      data-mode={mode ?? 'poster'}
      data-live={live}
      data-ready={ready}
      className="absolute inset-0"
    >
      <img src={poster} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      <canvas
        ref={canvas}
        aria-hidden
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${live ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
