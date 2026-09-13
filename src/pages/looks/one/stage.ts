/**
 * Look 1 — the pinned stage the scroll-driven sections share.
 *
 * A section that "arrives through its own title" needs the same three things
 * every time: a track taller than the screen to give the move somewhere to
 * happen, a stage that holds still while it does, and a progress value that
 * runs 0→1 across exactly the time the stage is held. This is that, once.
 *
 * Two rules learnt the hard way on the room stage:
 *   · progress must be measured 'start start' → 'end end'. The sticky child
 *     lets go when the track's bottom reaches the bottom of the screen, so
 *     'end start' spends half its range on travel that happens after the stage
 *     has already scrolled away.
 *   · the end state hangs off `open`, a one-way switch, never off a transform
 *     past its last keyframe. Transforms are for the travel; the switch is for
 *     where things land.
 *
 * Nothing pins below lg or under reduced motion — the two-column layouts stack
 * and grow taller than a screen there, which would cut the pin short — and the
 * runway is not charged to anyone who will not see the move.
 */
import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';

export function useWide(query = '(min-width: 1024px)') {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setWide(m.matches);
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, [query]);
  return wide;
}

export function usePinned({ openAt = 0.6, runway = 2 }: { openAt?: number; runway?: number } = {}) {
  const track = useRef<HTMLDivElement>(null);
  const wide = useWide();
  const reduce = useReducedMotion();
  const animate = wide && !reduce;

  const { scrollYProgress: p } = useScroll({ target: track, offset: ['start start', 'end end'] });

  const [open, setOpen] = useState(!animate);
  useMotionValueEvent(p, 'change', (v) => {
    if (animate) setOpen(v > openAt);
  });
  useEffect(() => {
    setOpen(!animate || p.get() > openAt);
  }, [animate, p, openAt]);

  return {
    track,
    p,
    animate,
    open,
    /** on the track: the runway, only when there is a move to run */
    trackStyle: animate ? { height: `${runway * 100}svh` } : undefined,
    /** on the stage: holds still for the length of the runway */
    stageCls: animate ? 'sticky top-0 min-h-[100svh]' : '',
  };
}

/** ease-out cubic on a 0–1 progress, for travel that should settle rather than stop */
export const settle = (u: number) => 1 - (1 - Math.min(1, Math.max(0, u))) ** 3;
