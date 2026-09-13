/**
 * Look 1 — Featured categories as a compressed catalogue.
 *
 * All six categories sit in one band: closed panels are tall strips, one panel
 * is open at a time, hovering (or focusing) a strip opens it. Nothing moves on
 * its own — the visitor decides which panel is open.
 *
 * The band is aligned to the page container like every other section, and it is
 * given real height rather than being sized to fit a screen alongside its
 * heading — squeezed into what a heading leaves over, the photographs read as a
 * strip of swatches instead of a catalogue.
 * The open panel is sized to the photographs' own 4:5, derived from the band
 * height, so the picture is shown as shot rather than cropped to whatever the
 * flex ratios happen to leave. Panels wipe up into view one after another as
 * the band arrives, and the photograph settles out of a slow zoom.
 *
 * Touch has no hover, so below lg it is a column of the same 4:5 photographs.
 *
 * The reveal does not use whileInView. An IntersectionObserver only reports at
 * frame boundaries, so a fast flick or a jump down the page can carry a card
 * from below the fold to above it without ever registering — leaving it blank
 * for good. Here anything at or past the viewport top counts as seen, which is
 * checked on scroll as well as by the observer.
 *
 * Self-contained: removing this file and restoring the old section in
 * LookOneHome (git revert) puts the rail back exactly.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES, searchPath } from '../lookShared';
import { useLook, Reveal, SectionHeading, ViewMore } from './ui';

const pad = (n: number) => String(n).padStart(2, '0');
const EASE = [0.22, 1, 0.36, 1] as const;
/** The band's height drives the open panel's width, keeping the photo at 4:5.
 *  It takes most of a screen but is floored and capped, so it stays a tall
 *  catalogue on a laptop without becoming a wall on a large display. */
const BAND: CSSProperties = { '--band-h': 'clamp(560px, calc(100svh - 220px), 780px)' } as CSSProperties;

/** True once the element has reached the fold — and stays true. */
function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;

    const reached = () => el.getBoundingClientRect().top < window.innerHeight - 80;
    if (reached()) {
      setSeen(true);
      return;
    }
    const check = () => {
      if (!reached()) return;
      setSeen(true);
      io.disconnect();
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
    const io = new IntersectionObserver(check, { rootMargin: '0px 0px -80px 0px' });
    io.observe(el);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [seen]);

  return { ref, seen };
}

export function CategoryPanels() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [active, setActive] = useState(0);
  const band = useSeen<HTMLDivElement>();

  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.24em]';
  const bigName = isAr
    ? "font-['Alexandria',sans-serif] text-[30px] tracking-normal xl:text-[34px]"
    : "font-['Outfit',sans-serif] text-[30px] uppercase tracking-tight xl:text-[34px]";

  return (
    <section data-testid="featured-categories" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={t('Collection — 01', 'التشكيلة — 01')}
              title={t('Featured Categories', 'أبرز التصنيفات')}
            />
            <div className="pb-2">
              <ViewMore label={t('All Categories', 'كل التصنيفات')} to={searchPath(1)} />
            </div>
          </div>
        </Reveal>
      </div>

      {/* ---- desktop: one full-screen band, every category visible, one open ---- */}
      <div className="mx-auto mt-10 hidden max-w-[1400px] px-6 md:mt-14 md:px-10 lg:block">
        <div
          ref={band.ref}
          data-testid="cat-band"
          style={BAND}
          className="flex h-[var(--band-h)] w-full gap-2"
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
                data-seen={band.seen}
                aria-label={name}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group relative min-w-0 overflow-hidden transition-[flex-basis,flex-grow] duration-700 ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none"
                // open: exactly 4:5 of the band height. closed: share what is left
                style={{
                  flexGrow: open ? 0 : 1,
                  flexBasis: open ? 'calc(var(--band-h) * 0.8)' : 0,
                }}
              >
                <motion.div
                  initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
                  animate={band.seen ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
                  transition={{ duration: 0.95, ease: EASE, delay: i * 0.1 }}
                  className="absolute inset-0"
                >
                  <motion.img
                    src={c.img}
                    alt=""
                    initial={{ scale: 1.16 }}
                    animate={band.seen ? { scale: 1 } : undefined}
                    transition={{ duration: 1.6, ease: EASE, delay: i * 0.1 }}
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out motion-reduce:transition-none ${
                      open ? 'scale-100' : 'scale-[1.06]'
                    }`}
                  />
                  {/* closed strips recede so the open one reads first */}
                  <div
                    className={`absolute inset-0 bg-[#171512] transition-opacity duration-700 motion-reduce:transition-none ${
                      open ? 'opacity-0' : 'opacity-40'
                    }`}
                  />
                  {/* legibility kept to the lower half, as elsewhere on the page */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                  {/* closed: the name set on its side and running up the strip,
                      which is the one direction a strip has room in. Arabic has
                      no vertical typesetting, so the browser turns the whole run
                      on its side — which is what is wanted here — and the extra
                      half-turn is what makes it read bottom-to-top. */}
                  <span
                    className={`absolute inset-0 flex flex-col items-start justify-end gap-5 p-5 text-start text-white transition-opacity duration-300 xl:p-6 ${
                      open ? 'opacity-0' : 'opacity-100 delay-200'
                    }`}
                    aria-hidden
                  >
                    <span className="max-h-full rotate-180 text-[14px] font-bold leading-none [writing-mode:vertical-rl]">
                      {name}
                    </span>
                    <span className={`shrink-0 text-[11px] leading-none text-white/70 ${caps}`}>{pad(i + 1)}</span>
                  </span>

                  {/* open: the full label, set normally again. A fixed minimum
                      width stops the text reflowing while the panel widens; the
                      panel clips it. */}
                  <span
                    className={`absolute bottom-5 start-5 block min-w-[300px] text-start text-white transition-opacity duration-500 xl:bottom-6 xl:start-6 ${
                      open ? 'opacity-100 delay-300' : 'opacity-0'
                    }`}
                    aria-hidden
                  >
                    <span className={`block text-[11px] text-white/70 ${caps}`}>{pad(i + 1)}</span>
                    <span className={`mt-3 block font-extrabold leading-[1.05] ${bigName}`}>{name}</span>
                    <span className={`mt-4 inline-flex items-center gap-2.5 border-b border-white/50 pb-1.5 text-[11px] ${caps}`}>
                      {t('View More', 'عرض المزيد')}
                      <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                    </span>
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ---- touch: no hover, so the photographs stack at their own 4:5 ---- */}
      <div className="mx-auto mt-10 grid max-w-[1400px] gap-5 px-6 sm:grid-cols-2 sm:gap-6 md:mt-14 md:px-10 lg:hidden">
        {CATEGORIES.map((c, i) => (
          <CategoryCard key={c.key} index={i} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ index }: { index: number; key?: string | number }) {
  const c = CATEGORIES[index];
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]';
  const { ref, seen } = useSeen<HTMLDivElement>();
  const name = t(c.en, c.ar);

  return (
    <Link
      to={searchPath(1, { category: c.key })}
      data-testid={`cat-card-${index}`}
      data-seen={seen}
      aria-label={name}
      className="group/cat block"
    >
      <motion.div
        ref={ref}
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={seen ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative overflow-hidden"
      >
        <motion.img
          src={c.img}
          alt=""
          loading="lazy"
          initial={{ scale: 1.14 }}
          animate={seen ? { scale: 1 } : undefined}
          transition={{ duration: 1.4, ease: EASE }}
          className="aspect-[4/5] w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <span className={`absolute start-5 top-5 text-[11px] text-white/75 ${caps}`}>{pad(index + 1)}</span>
        <div className="absolute inset-x-0 bottom-0 p-5 text-start">
          <h3
            className={`font-extrabold text-white ${
              isAr
                ? "font-['Alexandria',sans-serif] text-[19px] leading-snug tracking-normal"
                : "font-['Outfit',sans-serif] text-[17px] uppercase leading-tight tracking-[0.04em]"
            }`}
          >
            {name}
          </h3>
          <span className="mt-3 block h-px w-8 bg-white/70" />
        </div>
      </motion.div>
    </Link>
  );
}
