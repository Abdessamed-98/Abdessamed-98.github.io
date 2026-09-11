/**
 * Look 1 — Featured categories as a compressed catalogue (TRIAL).
 *
 * Six categories needed a rail, arrows and auto-advance just to be seen, which
 * is the format telling you it is wrong. Here all six sit in one band: closed
 * panels are tall strips, one panel is open at a time, hovering (or focusing)
 * a strip opens it. Nothing moves on its own — the visitor decides which
 * panel is open.
 *
 * Touch has no hover, so below lg it is a plain 2/3-column grid.
 *
 * Self-contained on purpose: removing this file and restoring the old section
 * in LookOneHome (git revert) puts the rail back exactly.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES, searchPath } from '../lookShared';
import { useLook, Reveal, SectionHeading, ViewMore } from './ui';

const pad = (n: number) => String(n).padStart(2, '0');

export function CategoryPanels() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [active, setActive] = useState(0);

  const bigName = isAr
    ? "font-['Alexandria',sans-serif] text-[30px] tracking-normal xl:text-[34px]"
    : "font-['Outfit',sans-serif] text-[30px] uppercase tracking-tight xl:text-[34px]";
  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.24em]';

  return (
    <section data-testid="featured-categories" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={t('Collection — 01', 'التشكيلة — 01')}
              title={t('Featured Categories', 'أبرز التصنيفات')}
            />
            <ViewMore label={t('All Categories', 'كل التصنيفات')} to={searchPath(1)} />
          </div>
        </Reveal>

        <div className="mt-10 md:mt-14">
          {/* ---- desktop: one band, every category visible, one open ----
              Height follows the viewport (64vh) between 460px on short laptops
              and 640px on tall screens, so it fills the space instead of sitting squat. */}
          <div
            data-testid="cat-band"
            className="hidden h-[clamp(460px,64vh,640px)] gap-2 lg:flex"
          >
            {CATEGORIES.map((c, i) => {
              const open = i === active;
              const name = t(c.en, c.ar);
              return (
                <Link
                  key={c.key}
                  to={searchPath(1, { category: c.key })}
                  data-testid={`cat-panel-${i}`}
                  data-open={open}
                  aria-label={name}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group relative min-w-0 overflow-hidden transition-[flex-grow] duration-700 ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none"
                  style={{ flexGrow: open ? 3.4 : 1, flexBasis: 0 }}
                >
                  <img
                    src={c.img}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out motion-reduce:transition-none ${
                      open ? 'scale-100' : 'scale-110'
                    }`}
                  />
                  {/* closed strips recede so the open one reads first */}
                  <div
                    className={`absolute inset-0 bg-[#171512] transition-opacity duration-700 motion-reduce:transition-none ${
                      open ? 'opacity-0' : 'opacity-40'
                    }`}
                  />
                  {/* legibility kept to the lower half, as elsewhere on the page */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5 text-start text-white xl:p-6" aria-hidden>
                    {/* closed: index + a short name that fits a strip. Both fade out
                        together when the panel opens — the open label below carries
                        its own index, so nothing sits underneath it. */}
                    <span className={`block transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100 delay-200'}`}>
                      <span className={`block text-[11px] text-white/70 ${caps}`}>{pad(i + 1)}</span>
                      <span className="mt-2 block text-[13px] font-bold leading-tight">{name}</span>
                    </span>

                    {/* open: the full label. A fixed minimum width stops the text
                        reflowing while the panel widens; the panel clips it. */}
                    <span
                      className={`absolute bottom-5 start-5 block min-w-[300px] transition-opacity duration-500 xl:bottom-6 xl:start-6 ${
                        open ? 'opacity-100 delay-300' : 'opacity-0'
                      }`}
                    >
                      <span className={`block text-[11px] text-white/70 ${caps}`}>{pad(i + 1)}</span>
                      <span className={`mt-3 block font-extrabold leading-[1.05] ${bigName}`}>{name}</span>
                      <span className={`mt-4 inline-flex items-center gap-2.5 border-b border-white/50 pb-1.5 text-[11px] ${caps}`}>
                        {t('View More', 'عرض المزيد')}
                        <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ---- touch: no hover, so a plain compact grid ---- */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                to={searchPath(1, { category: c.key })}
                className="group relative block aspect-[4/3] overflow-hidden sm:aspect-[4/5]"
              >
                <img
                  src={c.img}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-3.5 text-start text-[13px] font-bold leading-tight text-white">
                  {t(c.en, c.ar)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
