/**
 * Look 1 — a section that opens like a curtain.
 *
 * The stage pins with two drapes drawn across it and the section's title set
 * across the seam, half on each. As the stage holds they are drawn to the
 * wings and the section is simply there behind; then the drapes leave the tree
 * — nothing to composite once there is nothing to hide.
 *
 * What makes it cloth rather than a sliding board, in order of how much it
 * matters:
 *   · it gathers. The fabric is compressed towards its own outer edge as it is
 *     drawn, so the folds bunch up the way a drape stacks in the wing, instead
 *     of the whole picture translating off-screen intact.
 *   · the hem trails. A curtain is pulled from the track at the top; the bottom
 *     follows late and swings. So the leading edge is not a vertical line but a
 *     curve, top ahead of hem, which straightens again as it settles.
 *   · it has weight. The travel eases in as well as out — slow off the mark,
 *     fast across the middle, settling into the wing — not a constant slide.
 *
 * Each drape is a full-stage layer cut down to its half by a polygon whose
 * inner edge is the moving curve; the fabric inside is scaled towards the outer
 * edge so its seam always rides that curve. The title halves sit over the
 * fabric and move with the leading edge but are not compressed with the cloth
 * — set type that squashed would read as a glitch, not a fold.
 *
 * Generic on purpose: it wraps whatever is given to it and knows nothing about
 * the content. AI Studio uses it; anything else with a dark band could.
 */
import type { ReactNode } from 'react';
import { motion, useMotionTemplate, useTransform, type MotionValue } from 'motion/react';
import { CREAM, useLook } from './ui';
import { usePinned } from './stage';

/** how far the hem trails the track at the widest, as % of the stage width */
const HEM_LAG = 7;
/** the hem's curve, top to bottom, as fractions of HEM_LAG at 0/25/50/75/100% height */
const CURVE = [0, 0.28, 0.58, 0.86, 1];
/** slow off the mark, fast through the middle, settling in — a drape has weight */
const inOut = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** a point on the leading curve: the track edge plus this much of the hem's lag */
function useCurvePoint(edge: MotionValue<number>, lag: MotionValue<number>, k: number) {
  return useTransform([edge, lag], ([e, l]: number[]) => e + l * k);
}

export function CurtainStage({
  title,
  testId,
  bg,
  image,
  children,
}: {
  title: string;
  testId: string;
  /** the band's ground — the drapes are cut from it, and it shows through
   *  before the image has loaded */
  bg: string;
  /** closed curtains, seam at the exact centre */
  image?: string;
  children: ReactNode;
}) {
  const { lang } = useLook();
  const isAr = lang === 'ar';
  const { track, p, animate, open, trackStyle, stageCls } = usePinned({ openAt: 0.64 });

  /* one eased progress for the whole draw, across the first ~60% of the hold */
  const u = useTransform(p, (v) => inOut(clamp01((v - 0.04) / 0.56)));
  /* where the track (top) edge of each drape has got to, from the seam, in % of stage */
  const edge = useTransform(u, (x) => 50 * (1 - x));
  /* how far the hem is still behind it — nothing at rest, most mid-draw */
  const lag = useTransform(u, (x) => HEM_LAG * Math.sin(Math.PI * x));
  /* the fabric is squeezed towards its outer edge so its seam rides the curve's furthest point */
  const gather = useTransform([u, lag], ([x, l]: number[]) => Math.max(0.001, 1 - x + l / 50));
  /* the title halves travel with the track edge */
  const leftTitle = useMotionTemplate`${edge}%`;
  const rightTitle = useTransform(edge, (e) => `${100 - e}%`);

  /* the leading curve, five points top to bottom, for each side */
  const l0 = useCurvePoint(edge, lag, CURVE[0]);
  const l1 = useCurvePoint(edge, lag, CURVE[1]);
  const l2 = useCurvePoint(edge, lag, CURVE[2]);
  const l3 = useCurvePoint(edge, lag, CURVE[3]);
  const l4 = useCurvePoint(edge, lag, CURVE[4]);
  const leftClip = useMotionTemplate`polygon(0% 0%, ${l0}% 0%, ${l1}% 25%, ${l2}% 50%, ${l3}% 75%, ${l4}% 100%, 0% 100%)`;
  const r0 = useTransform(l0, (x) => 100 - x);
  const r1 = useTransform(l1, (x) => 100 - x);
  const r2 = useTransform(l2, (x) => 100 - x);
  const r3 = useTransform(l3, (x) => 100 - x);
  const r4 = useTransform(l4, (x) => 100 - x);
  const rightClip = useMotionTemplate`polygon(${r0}% 0%, 100% 0%, 100% 100%, ${r4}% 100%, ${r3}% 75%, ${r2}% 50%, ${r1}% 25%)`;

  const titleCls = `absolute top-1/2 w-max -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center font-extrabold uppercase ${
    isAr
      ? "font-['Alexandria',sans-serif] text-[64px] leading-[1.15] tracking-normal xl:text-[84px]"
      : "font-['Outfit',sans-serif] text-[72px] leading-[0.95] tracking-tight xl:text-[96px]"
  }`;

  const drape = (side: 'left' | 'right') => (
    <motion.div
      key={side}
      data-testid={`curtain-${side}`}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20"
      style={{ clipPath: side === 'left' ? leftClip : rightClip, backgroundColor: bg }}
    >
      {/* the cloth — gathered towards its own wing as it is drawn */}
      {image && (
        <motion.img
          src={image}
          alt=""
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ scaleX: gather, transformOrigin: side === 'left' ? '0% 50%' : '100% 50%' }}
        />
      )}
      {/* half the title, riding the leading edge, not squashed with the cloth */}
      <motion.span className={titleCls} style={{ left: side === 'left' ? leftTitle : rightTitle, color: CREAM }}>
        {title}
      </motion.span>
    </motion.div>
  );

  return (
    <section data-testid={testId} className="relative overflow-x-clip" style={{ backgroundColor: bg, color: CREAM }}>
      <div ref={track} style={trackStyle}>
        <div className={`relative ${stageCls}`}>
          {/* the section itself, exactly as it would be without the curtain */}
          <div className={animate ? 'flex min-h-[100svh] flex-col [&>*]:flex-1' : ''}>{children}</div>

          {animate && !open && (
            <>
              {drape('left')}
              {drape('right')}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
