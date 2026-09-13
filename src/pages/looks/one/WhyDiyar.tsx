/**
 * Look 1 — "Why Diyar" (section 09).
 *
 * The section arrives through its own title. The heading starts the width of
 * the screen and, as the stage holds, shrinks and slides into the corner where
 * a heading normally lives; the four figures rise in under it and count up once
 * it has landed. Type does the whole job — this is the one section on the page
 * with no photograph, and the move suits that.
 *
 * The start position is measured, not guessed: the title's centre is read off
 * layout (offsets, which ignore transforms) and the travel is the difference
 * between that and the stage's centre, so it lands exactly where the static
 * layout puts it. The starting scale is capped to the stage width so a long
 * title never runs off the sides.
 *
 * Every figure is real or defensible, and none is invented for effect:
 *   · the catalogue count is summed from STYLES at render, so it cannot drift
 *     away from what the style pages actually list;
 *   · 360° is the preview itself, not a claim about it;
 *   · 13 is the number of administrative regions in Saudi Arabia, which is what
 *     "kingdom-wide delivery" means;
 *   · 4 is the payment methods named in the promise's own body copy.
 *
 * Self-contained: removing this file and its one line in LookOneHome restores
 * the previous static row.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useTransform, useReducedMotion } from 'motion/react';
import { STYLES, WHY_DIYAR, formatSAR } from '../lookShared';
import { HAIR, OLIVE, SectionHeading, useLook } from './ui';
import { settle, usePinned } from './stage';

/** What leads each promise, in the order WHY_DIYAR declares them. */
interface Figure {
  /** counted up to, when it is a plain number */
  to?: number;
  /** shown as-is when the figure is not a number to count (360°) */
  flat?: string;
  suffix?: string;
  unit: { en: string; ar: string };
}

const FIGURES: Figure[] = [
  // filled in at render: the catalogue total is summed from the style counts
  { to: 0, suffix: '+', unit: { en: 'pieces listed', ar: 'قطعة معروضة' } },
  { flat: '360°', unit: { en: 'preview, before you buy', ar: 'معاينة قبل الشراء' } },
  { to: 13, unit: { en: 'regions covered', ar: 'منطقة نغطيها' } },
  { to: 4, unit: { en: 'ways to pay', ar: 'طرق للدفع' } },
];

/** How far into the hold the title has finished landing. Later than the
 *  midpoint on purpose, and the figures start rising before it gets there
 *  (see `openAt`): with the title down early and the figures held back, the
 *  stage sat empty for a quarter of the scroll. */
const LAND_AT = 0.62;

/** Counts from zero once, on the way in. */
function Tally({ to, suffix = '', run }: { to: number; suffix?: string; run: boolean }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!run || reduce) { setN(run ? to : 0); return; }
    let raf = 0;
    const started = performance.now();
    const ms = 1400;
    const tick = (now: number) => {
      const u = Math.min(1, (now - started) / ms);
      setN(Math.round(to * settle(u)));
      if (u < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, reduce]);

  return <>{formatSAR(n)}{suffix}</>;
}

export function WhyDiyar({ no }: { no: string }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { track, p, animate, open, trackStyle, stageCls } = usePinned({ openAt: 0.48 });

  /* Where the title starts from: the stage's centre, measured against the
     title's own laid-out centre. Offsets ignore transforms, so this reads the
     same whatever the title is doing at the moment of measuring. */
  const stage = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const start = useRef({ dx: 0, dy: 0, scale: 1 });
  useLayoutEffect(() => {
    if (!animate) return;
    const measure = () => {
      const s = stage.current;
      const h = head.current;
      if (!s || !h) return;
      const hx = h.offsetLeft + h.offsetWidth / 2;
      const hy = h.offsetTop + h.offsetHeight / 2;
      start.current = {
        dx: s.clientWidth / 2 - hx,
        dy: s.clientHeight / 2 - hy,
        // as large as the stage allows, never so large it runs off the sides
        scale: Math.min(3.6, (s.clientWidth * 0.84) / h.offsetWidth),
      };
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [animate]);

  const land = (v: number) => settle(v / LAND_AT);
  const x = useTransform(p, (v) => start.current.dx * (1 - land(v)));
  const y = useTransform(p, (v) => start.current.dy * (1 - land(v)));
  const scale = useTransform(p, (v) => start.current.scale - (start.current.scale - 1) * land(v));

  // the headline figure is the catalogue itself, added up where it is defined
  const listed = STYLES.reduce((sum, s) => sum + s.count, 0);
  const figures = FIGURES.map((f, i) => (i === 0 ? { ...f, to: listed } : f));

  return (
    <section data-testid="why-diyar" className="overflow-x-clip border-t" style={{ borderColor: HAIR }}>
      <div ref={track} style={trackStyle}>
        <div
          ref={stage}
          className={`relative flex flex-col justify-center py-20 md:py-28 ${stageCls}`}
        >
          <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
            {/* the title — travelling while the stage holds, then simply a heading */}
            <motion.div
              ref={head}
              data-testid="why-title"
              className="inline-block origin-center"
              style={animate && !open ? { x, y, scale } : undefined}
            >
              <SectionHeading
                eyebrow={t(`Our Promise — ${no}`, `وعدنا — ${no}`)}
                title={t('Why Diyar', 'لماذا ديار')}
              />
            </motion.div>

            {/* the figures — held back until the title has landed */}
            <div
              data-testid="why-figures"
              className={`mt-14 grid gap-x-12 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-4 xl:gap-x-16 ${
                animate ? 'transition-[opacity,transform] duration-700 ease-out' : ''
              } ${animate && !open ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}
            >
              {WHY_DIYAR.map((u, i) => {
                const f = figures[i];
                return (
                  <div
                    key={u.title.en}
                    className="border-t border-[#171512]/15 pt-7 sm:row-span-4 sm:grid sm:grid-rows-subgrid sm:gap-y-0 md:pt-9"
                    style={animate ? { transitionDelay: `${i * 80}ms` } : undefined}
                  >
                    {/* the figure — the part that is only true of Diyar */}
                    <p
                      dir="ltr"
                      className={`font-['Outfit',sans-serif] font-extrabold leading-[0.9] tracking-tight ${
                        isAr ? 'text-end' : ''
                      } text-[44px] md:text-[52px] xl:text-[60px]`}
                      style={{ color: OLIVE }}
                    >
                      {f.flat ?? <Tally to={f.to ?? 0} suffix={f.suffix} run={open} />}
                    </p>
                    <p
                      className={`mt-2 text-[11px] text-neutral-500 ${
                        isAr ? "font-['Tajawal',sans-serif] tracking-normal" : 'uppercase tracking-[0.22em]'
                      }`}
                    >
                      {t(f.unit.en, f.unit.ar)}
                    </p>

                    <h3
                      className={`mt-7 font-extrabold leading-[1.25] ${
                        isAr
                          ? "font-['Alexandria',sans-serif] text-[19px] tracking-normal md:text-[21px]"
                          : "font-['Outfit',sans-serif] text-[16px] uppercase tracking-[0.06em] md:text-[18px]"
                      }`}
                    >
                      {t(u.title.en, u.title.ar)}
                    </h3>
                    <p className="mt-3.5 max-w-[34ch] text-[14.5px] font-light leading-[1.8] text-neutral-600">
                      {t(u.body.en, u.body.ar)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
