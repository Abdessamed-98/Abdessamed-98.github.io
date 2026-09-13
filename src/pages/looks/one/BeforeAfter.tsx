/**
 * Look 1 — the AI studio's before / after.
 *
 * The original site showed the two states as a fixed split with two chips. Here
 * the split is yours to drag: the empty room is the base, the furnished version
 * is clipped to the left of the handle, and the whole frame is the control.
 *
 * On first view the handle sweeps in once so the two states are seen without
 * anyone touching anything; the first pointer or key press ends that for good.
 * The divider, handle and chips are square and hairline — no pills, no rounding.
 */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLook } from './ui';

const START = 100;
const RESTING = 44;

export function BeforeAfter({
  before,
  after,
  beforeLabel,
  afterLabel,
  alt,
  className = '',
}: {
  /** the untouched room — the base layer */
  before: string;
  /** the arranged room — clipped to the start edge of the handle */
  after: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
  className?: string;
}) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const frame = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const [pos, setPos] = useState(START);
  const [seen, setSeen] = useState(false);
  const [dragging, setDragging] = useState(false);

  /* reveal: wait until a real share of the frame is on screen */
  useEffect(() => {
    const el = frame.current;
    if (!el || seen) return;
    const reached = () => {
      const r = el.getBoundingClientRect();
      const shown = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      return shown > Math.min(r.height, window.innerHeight) * 0.45;
    };
    if (reached()) {
      setSeen(true);
      return;
    }
    const check = () => {
      if (!reached()) return;
      setSeen(true);
      io.disconnect();
      window.removeEventListener('scroll', check);
    };
    const io = new IntersectionObserver(check, { threshold: [0, 0.25, 0.45] });
    io.observe(el);
    window.addEventListener('scroll', check, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', check);
    };
  }, [seen]);

  /* the one-time sweep */
  useEffect(() => {
    if (!seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (seen) setPos(RESTING);
      return;
    }
    let raf = 0;
    const started = performance.now();
    const run = (now: number) => {
      if (touched.current) return;
      const p = Math.min(1, (now - started - 350) / 1400);
      if (p > 0) {
        const eased = 1 - Math.pow(1 - p, 3);
        setPos(START - (START - RESTING) * eased);
      }
      if (p < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [seen]);

  const setFromClientX = useCallback((clientX: number) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box) return;
    // physical, never mirrored: the arranged room always sits on the left
    const ratio = ((clientX - box.left) / box.width) * 100;
    setPos(Math.min(100, Math.max(0, ratio)));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    touched.current = true;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setFromClientX(e.clientX);
  };
  const stop = (e: PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    const map: Record<string, number> = { ArrowLeft: -step, ArrowRight: step, Home: -100, End: 100 };
    if (!(e.key in map)) return;
    e.preventDefault();
    touched.current = true;
    setPos((p) => Math.min(100, Math.max(0, p + map[e.key])));
  };

  const chip =
    'pointer-events-none absolute bottom-5 z-20 border border-white/25 bg-black/45 px-3.5 py-2 text-[10px] text-white backdrop-blur-sm transition-opacity duration-300 md:bottom-6';

  return (
    <div
      ref={frame}
      data-testid="before-after"
      data-pos={Math.round(pos)}
      dir="ltr"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
      className={`relative touch-none select-none overflow-hidden ${dragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
    >
      {/* the room as it is */}
      <img src={before} alt={alt} className="absolute inset-0 h-full w-full object-cover" draggable={false} />

      {/* the room arranged, clipped to the handle */}
      <img
        src={after}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* divider + handle */}
      <div className="absolute inset-y-0 z-10 w-px bg-white/85" style={{ left: `${pos}%` }}>
        <button
          type="button"
          role="slider"
          aria-label={t('Drag to compare', 'اسحب للمقارنة')}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-orientation="horizontal"
          onKeyDown={onKey}
          onPointerDown={(e) => {
            touched.current = true;
            e.stopPropagation();
            setDragging(true);
            (e.currentTarget.parentElement?.parentElement as HTMLElement | null)?.focus?.();
          }}
          className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/70 bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-[#5A6B4D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronLeft size={14} strokeWidth={1.75} className="-me-0.5" />
          <ChevronRight size={14} strokeWidth={1.75} className="-ms-0.5" />
        </button>
      </div>

      {/* which side is which */}
      <span className={`${chip} left-5 md:left-6`} style={{ opacity: pos > 18 ? 1 : 0 }} dir={isAr ? 'rtl' : 'ltr'}>
        {afterLabel}
      </span>
      <span className={`${chip} right-5 md:right-6`} style={{ opacity: pos < 88 ? 1 : 0 }} dir={isAr ? 'rtl' : 'ltr'}>
        {beforeLabel}
      </span>
    </div>
  );
}
