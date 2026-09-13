/**
 * Look 1 — "Featured Stores" (section 04).
 *
 * Six shops, three to a row, each one a single photograph of the place with its
 * mark on it. The cards are landscape rather than portrait — a shopfront is a
 * wide thing, and keeping them short puts all six on screen at once. The gaps
 * are hairline-thin so they read as one wall of shops rather than six separate
 * cards, the same treatment the category band uses.
 *
 * The mark is a monogram plate for now. Every store carries an optional `logo`
 * in lookShared and this renders it the moment one exists, so putting the real
 * partner logos in is a matter of adding files and filling that field; nothing
 * here changes.
 *
 * Self-contained: removing this file and its one line in LookOneHome restores
 * the previous grid.
 */
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { STORES, formatSAR, searchPath } from '../lookShared';
import { HAIR, Reveal, SectionHeading, ViewMore, useLook } from './ui';

export function FeaturedStores({ no }: { no: string }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';

  return (
    <section data-testid="featured-stores" className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={t(`Marketplace — ${no}`, `المنصة — ${no}`)}
              title={t('Featured Stores', 'متاجر مختارة')}
            />
            <div className="pb-2">
              <ViewMore label={t('All Stores', 'كل المتاجر')} to={searchPath(1)} />
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:mt-16 md:gap-2 lg:grid-cols-3">
          {STORES.map((s, i) => {
            const name = t(s.name.en, s.name.ar);
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.07 }}
              >
                <Link
                  to={searchPath(1, { store: s.key })}
                  data-testid="store-card"
                  aria-label={name}
                  className="group/st relative block overflow-hidden"
                >
                  <img
                    src={s.cover}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover/st:scale-[1.05] sm:aspect-[4/3] lg:aspect-[16/10]"
                  />
                  {/* the shop's own photograph carries the card, so the wash is
                      kept to the lower half where the name has to be read */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  <span
                    dir="ltr"
                    className="absolute end-4 top-4 bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm"
                  >
                    ★ {s.rating}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-5 md:p-6">
                    {/* the mark — a real logo when there is one, the monogram until then */}
                    <span
                      aria-hidden
                      className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-[#FDFCF9] md:h-[72px] md:w-[72px]"
                    >
                      {s.logo ? (
                        <img src={s.logo} alt="" className="h-full w-full object-contain p-3" />
                      ) : (
                        <span
                          dir="ltr"
                          className="font-['Outfit',sans-serif] text-[19px] font-bold tracking-[0.06em] text-[#171512] md:text-[21px]"
                        >
                          {s.initials}
                        </span>
                      )}
                    </span>

                    <span className="min-w-0 flex-1 pb-1">
                      <span
                        className={`block truncate font-extrabold text-white ${
                          isAr
                            ? "font-['Alexandria',sans-serif] text-[17px] leading-snug tracking-normal md:text-[19px]"
                            : "font-['Outfit',sans-serif] text-[16px] uppercase leading-tight tracking-tight md:text-[18px]"
                        }`}
                      >
                        {name}
                      </span>
                      <span className="mt-1.5 block truncate text-[12px] font-light text-white/70">
                        {t(s.specialty.en, s.specialty.ar)}
                      </span>
                      <span
                        className={`mt-1 block text-[10px] text-white/50 ${
                          isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]'
                        }`}
                      >
                        {isAr ? `${formatSAR(s.products)} قطعة` : `${formatSAR(s.products)} pieces`}
                      </span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
