/**
 * Look 1 — "Find Your Style" (section 13).
 *
 * Was an uneven grid of five photographs, which asked the visitor to read five
 * rooms at once and told them nothing until they did. It is now an index: the
 * style names set large, one room held beside them, and whichever name the
 * cursor or keyboard rests on takes the picture. Reading the list is the
 * browsing — the photograph answers it.
 *
 * The list is the section on a phone too, where there is no hover: each row
 * carries its own thumbnail so nothing is hidden behind an interaction that
 * touch cannot perform.
 *
 * Self-contained: removing this file and its one line in LookOneHome restores
 * the previous grid.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { STYLES, formatSAR, searchPath } from '../lookShared';
import { HAIR, INK, OLIVE, Reveal, SectionHeading, useLook } from './ui';

export function StyleIndex({ no }: { no: string }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [active, setActive] = useState(0);
  const shown = STYLES[active];

  return (
    <section data-testid="find-your-style" className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <SectionHeading eyebrow={t(`Styles — ${no}`, `الأساليب — ${no}`)} title={t('Find Your Style', 'اكتشف أسلوبك')} />
        </Reveal>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-16">
          {/* ---- the index ---- */}
          <div className="lg:col-span-7">
            {STYLES.map((s, i) => {
              const on = i === active;
              return (
                <Link
                  key={s.key}
                  to={searchPath(1, { style: s.key })}
                  data-testid="style-row"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group/st flex items-center gap-5 border-t py-5 md:gap-8 md:py-7"
                  style={{ borderColor: HAIR }}
                >
                  {/* the row's own picture — carries the list where there is no hover */}
                  <span className="h-16 w-14 shrink-0 overflow-hidden md:hidden">
                    <img src={s.img} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </span>

                  <span
                    dir="ltr"
                    className={`hidden shrink-0 font-['Outfit',sans-serif] text-[11px] font-medium tracking-[0.2em] transition-colors duration-300 md:block ${
                      on ? '' : 'text-neutral-300'
                    }`}
                    style={on ? { color: OLIVE } : undefined}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span
                    className={`min-w-0 flex-1 font-extrabold uppercase transition-colors duration-300 ${
                      isAr
                        ? "font-['Alexandria',sans-serif] text-[26px] leading-[1.2] tracking-normal md:text-[40px] xl:text-[46px]"
                        : "font-['Outfit',sans-serif] text-[26px] leading-[0.98] tracking-tight md:text-[44px] xl:text-[52px]"
                    }`}
                    style={{ color: on ? INK : '#C9C4BA' }}
                  >
                    {t(s.en, s.ar)}
                  </span>

                  <span
                    className={`shrink-0 text-[10px] transition-colors duration-300 ${
                      isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]'
                    } ${on ? 'text-neutral-500' : 'text-neutral-300'}`}
                  >
                    {isAr ? `${formatSAR(s.count)} منتج` : `${formatSAR(s.count)} Products`}
                  </span>

                  <ArrowRight
                    size={18}
                    strokeWidth={1.25}
                    aria-hidden
                    className={`hidden shrink-0 transition-all duration-300 md:block ${
                      isAr ? 'rotate-180' : ''
                    } ${on ? 'opacity-100' : 'opacity-0'} ${
                      isAr ? 'group-hover/st:-translate-x-1' : 'group-hover/st:translate-x-1'
                    }`}
                    style={{ color: OLIVE }}
                  />
                </Link>
              );
            })}
            <div className="border-t" style={{ borderColor: HAIR }} />
          </div>

          {/* ---- the room the index is pointing at ---- */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[3/4] overflow-hidden" style={{ backgroundColor: HAIR }}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={shown.key}
                    src={shown.img}
                    alt={t(shown.en, shown.ar)}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={shown.key}
                      className={`text-white ${
                        isAr
                          ? "font-['Alexandria',sans-serif] text-xl font-bold tracking-normal"
                          : "font-['Outfit',sans-serif] text-xl font-extrabold uppercase tracking-tight"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      {t(shown.en, shown.ar)}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
