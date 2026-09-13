/**
 * Look 1 hero — the room orbit, scrubbed by the pointer.
 *
 * Every frame of a 5-second 1926x1074 orbit render: 150 stills. Sampling every
 * third frame skipped visibly more motion than the render has (7.5/255 mean
 * change between kept frames against 3.3 between native ones), which reads as
 * stepping on slow moves. Frames are sharpened before encoding (the render is
 * soft, and it is upscaled on wide screens) and kept at high quality: ~133KB
 * each, ~21MB for the sequence, which only desktops fetch. Quality is not
 * traded for weight here.
 *
 * The pointer's horizontal position across the hero picks the frame; the drawn
 * frame eases towards that target so it glides instead of snapping, and
 * reverses as naturally as it advances. Frames go to a canvas, which avoids the
 * flicker of swapping <img> sources.
 *
 * Nothing is shown half-ready: the poster (sharper than any scrub frame) holds
 * the hero until every frame has decoded, and the canvas takes over on the
 * first pointer move after that. If no frame decodes, the poster simply stays.
 *
 * It only loads where it can be used: a fine pointer (touch has no hover), no
 * reduced-motion preference, no data-saver — so phones pay nothing.
 *
 * Frames live in public/looks/hero-scrub (ffmpeg recipe in the scratchpad).
 */
import { useEffect, useRef, useState } from 'react';

const COUNT = 150;
const frameSrc = (i: number) => `/looks/hero-scrub/f${String(i + 1).padStart(3, '0')}.avif`;
/** how fast the drawn frame catches up with the pointer (0-1 per frame) */
const EASE = 0.18;
/** parallel image requests while filling the sequence */
const LANES = 8;

export function HeroScrub({ poster, alt }: { poster: string; alt: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>(Array(COUNT).fill(null));
  const target = useRef((COUNT - 1) / 2);
  const shown = useRef((COUNT - 1) / 2);
  const [ready, setReady] = useState(false);
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!fine || still || saveData) return;

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
        img.src = frameSrc(i);
      });

    const draw = () => {
      const el = canvas.current;
      const img = frames.current[Math.round(shown.current)];
      if (!el || !img) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = el.clientWidth, h = el.clientHeight;
      if (el.width !== Math.round(w * dpr) || el.height !== Math.round(h * dpr)) {
        el.width = Math.round(w * dpr);
        el.height = Math.round(h * dpr);
      }
      const ctx = el.getContext('2d');
      if (!ctx) return;
      // every frame is upscaled (1920 source, wider hero): use the good filter
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      // cover, matching the object-cover poster underneath
      const scale = Math.max((w * dpr) / img.naturalWidth, (h * dpr) / img.naturalHeight);
      const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
      ctx.drawImage(img, ((w * dpr) - dw) / 2, ((h * dpr) - dh) / 2, dw, dh);
    };

    const tick = () => {
      if (stop) return;
      const gap = target.current - shown.current;
      if (Math.abs(gap) > 0.01) {
        shown.current += gap * EASE;
        draw();
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const box = wrap.current?.getBoundingClientRect();
      if (!box || e.clientY < box.top || e.clientY > box.bottom) return;
      const ratio = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
      target.current = ratio * (COUNT - 1);
      setMoved(true);
    };

    const onResize = () => draw();

    (async () => {
      // fill the whole sequence before handing over — a partly loaded scrub
      // jumps between neighbours, which is worse than a still hero
      let next = 0;
      const lane = async () => {
        while (!stop) {
          const i = next++;
          if (i >= COUNT) return;
          // the frame store outlives a remount, so never fetch one twice
          if (!frames.current[i]) await load(i);
        }
      };
      await Promise.all(Array.from({ length: LANES }, lane));
      if (stop || !frames.current.some(Boolean)) return;
      setReady(true);
      draw();
      raf = requestAnimationFrame(tick);
    })();

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      stop = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const live = ready && moved;
  return (
    <div ref={wrap} data-testid="hero-scrub" data-live={live} data-ready={ready} className="absolute inset-0">
      <img src={poster} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      <canvas
        ref={canvas}
        aria-hidden
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${live ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
