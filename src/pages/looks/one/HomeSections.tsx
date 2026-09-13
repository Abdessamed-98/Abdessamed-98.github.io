/**
 * Look 1 — "Editorial Light": the homepage sections carried over from the
 * original site (Look 4) so the page mirrors its structure section for
 * section — quick categories, promo mosaic, trending, featured deals with a
 * countdown, the two campaign banners, suggestions, brands and the newsletter.
 * Same language as the rest of the look: warm canvas, sharp corners, hairlines,
 * olive accents, red only for sale, black rectangle buttons.
 */
import { useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from 'react';
import { motion, useInView, useMotionTemplate, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, ChevronLeft, ChevronRight, Eye, Heart, Bookmark, Check,
} from 'lucide-react';
import {
  QUICK_CATEGORIES, PROMO_PANELS, TRENDING, FEATURED_DEALS, SUGGESTED_IDS, BRANDS, NEWSLETTER,
  msUntilMidnight, findProduct, storeOf, searchPath, productPath, formatSAR, lookBase, ROOMS, SERVICES,
  type Campaign, type CatalogProduct, type TrendingItem, type QuickCategory, type RoomKey,
} from '../lookShared';
import { serviceSlug } from './ServicePage';
import {
  INK, OLIVE, HAIR, RED, TILE, OLIVE_LT, CREAM,
  useLook, Reveal, SectionHeading, ViewMore, Stars, ProductCard, primaryBtnCls, eyebrowCls,
  useRail, RailArrows,
} from './ui';

/* ------------------------------------------------------------------ */
/* Small local helpers                                                 */
/* ------------------------------------------------------------------ */

const CONTAINER = 'mx-auto max-w-[1400px] px-6 md:px-10';

/** the look's reveal curve — a quick start that settles rather than bounces */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Display face for titles outside SectionHeading — Outfit in EN, Alexandria in AR (never letterspaced). */
const titleFont = (isAr: boolean) =>
  isAr
    ? "font-['Alexandria',sans-serif] leading-[1.15] tracking-normal"
    : "font-['Outfit',sans-serif] leading-[0.98] tracking-tight";

/** Scroll helpers for the snap rails: `next` always moves towards the content end, in both directions. */
function Rail({ railRef, children, className = '' }: { railRef: RefObject<HTMLDivElement | null>; children: ReactNode; className?: string }) {
  return (
    <div
      ref={railRef}
      className={`scrollbar-hide -mx-6 flex snap-x scroll-px-6 md:scroll-px-10 snap-mandatory gap-5 overflow-x-auto overflow-y-hidden px-6 md:-mx-10 md:gap-6 md:px-10 ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Quick categories — the original's icon strip under the hero      */
/* ------------------------------------------------------------------ */

export function QuickCategories() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const shop = QUICK_CATEGORIES.filter((c) => c.kind === 'shop');
  const services = QUICK_CATEGORIES.filter((c) => c.kind === 'service');

  return (
    <section
      data-testid="quick-categories"
      className="overflow-x-clip border-b py-16 md:py-20"
      style={{ borderColor: HAIR }}
    >
      <QuickRow
        label={t('Browse Categories', 'تصفّح الأقسام')}
        allLabel={t('All Categories', 'جميع الأقسام')}
        allTo={searchPath(1)}
        items={shop}
        isAr={isAr}
      />
      <div className="mt-16 md:mt-20">
        <QuickRow
          label={t('Diyar Services', 'خدمات ديار')}
          allLabel={t('All Services', 'جميع الخدمات')}
          items={services}
          isAr={isAr}
        />
      </div>
    </section>
  );
}

/**
 * One run of ten plates. The run is aligned to the page container like every
 * other section — the cards that peek past the edge are the container's, not
 * the screen's, so nothing looks accidentally sliced. The title carries the row
 * at section scale with the "all" link opposite it, the arrows straddle the two
 * ends of the run where they are actually aimed, and names stay printed inside
 * the plate in the opposite tone (the treatment chosen for this section).
 *
 * The reveal is driven by the run's own visibility, not each card's: cards
 * parked off to the side of a scroll rail never enter the viewport by
 * themselves, so a per-card trigger strands them half-drawn. Plates wipe up
 * from their bottom edge in sequence while the picture inside settles back to
 * size, and the name follows a beat later.
 */
function QuickRow({
  label,
  allLabel,
  allTo,
  items,
  isAr,
}: {
  label: string;
  allLabel: string;
  /** left off for the service run, which has no listing page of its own */
  allTo?: string;
  items: QuickCategory[];
  isAr: boolean;
}) {
  const { lang, t } = useLook();
  // Arrows turn the batch over; the timer travels a card at a time and never
  // rewinds — see the doubled run below, which is what lets it roll over.
  const rail = useRail({ page: true, auto: 3200, loop: true });
  const reduce = useReducedMotion();
  const run = useRef<HTMLDivElement>(null);
  const shown = useInView(run, { once: true, margin: '-90px' });
  const on = shown || !!reduce;
  const stepIn = (i: number) => (reduce ? 0 : Math.min(i, 9) * 0.07);

  // half of h-11, so each button sits centred on the end of the run
  const arrowCls =
    'absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border bg-[#FDFCF9] text-[#171512] transition-colors duration-300 hover:border-[#171512] hover:bg-[#171512] hover:text-white md:flex';
  const arrowInset = '-1.375rem';

  return (
    <div className={CONTAINER}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h3 className={`font-extrabold uppercase ${titleFont(isAr)} text-[26px] md:text-[34px]`} style={{ color: INK }}>
          {label}
        </h3>
        <div className="pb-1">
          <ViewMore label={allLabel} to={allTo} />
        </div>
      </div>

      <div ref={run} className="relative mt-7 md:mt-9">
        {/* No bleed past the container here, unlike the product rails: the run
            is cut to the row so the plates on screen are whole ones and the
            arrows have a real edge to sit on. The arrows carry the cue that
            there is more to the side. */}
        <div
          ref={rail.ref}
          {...rail.hold}
          className="scrollbar-hide flex snap-x gap-1.5 overflow-x-auto overflow-y-hidden md:gap-2"
        >
          {/* The run is rendered twice. The timer scrolls forward for good and
              swaps copy one for copy two when it has been used up, which lands
              on the same cards and so cannot be seen. The second copy is a
              duplicate of things already on the page, so it is hidden from
              assistive tech and taken out of the tab order. */}
          {[...items, ...items].map((c, idx) => {
            const twin = idx >= items.length;
            const i = idx % items.length;
            const name = lang === 'ar' ? c.ar : c.en;
            const dark = c.tone === 'dark';
            const inner = (
              <motion.div
                initial={reduce || twin ? false : { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' }}
                animate={on ? { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
                transition={{ duration: 0.8, ease: EASE, delay: stepIn(i) }}
                className="relative overflow-hidden border transition-colors duration-300"
                style={{ borderColor: dark ? 'rgba(255,255,255,0.14)' : HAIR }}
              >
                {/* the picture settles back to its own size as the plate draws.
                    It scales on a wrapper so the hover zoom below keeps its own
                    transform instead of being overwritten. */}
                <motion.div
                  initial={reduce || twin ? false : { scale: 1.16 }}
                  animate={on ? { scale: 1 } : undefined}
                  transition={{ duration: 1.2, ease: EASE, delay: stepIn(i) }}
                >
                  <img
                    src={c.icon}
                    alt=""
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-[900ms] ease-out group-hover/plate:scale-[1.06]"
                  />
                </motion.div>

                <motion.div
                  className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-5"
                  initial={reduce || twin ? false : { opacity: 0, y: 14 }}
                  animate={on ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.6, ease: EASE, delay: stepIn(i) + 0.28 }}
                >
                  <p
                    className={`text-start font-bold leading-snug transition-colors duration-300 ${
                      isAr ? 'text-[15px] tracking-normal' : 'text-[13px]'
                    } ${dark ? 'text-[#F6F3EC]' : 'text-[#171512] group-hover/plate:text-[#5A6B4D]'}`}
                  >
                    {name}
                  </p>
                  <ArrowRight
                    size={15}
                    strokeWidth={1.5}
                    aria-hidden
                    className={`shrink-0 translate-y-1.5 opacity-0 transition-all duration-300 group-hover/plate:translate-y-0 group-hover/plate:opacity-100 ${
                      isAr ? 'rotate-180' : ''
                    } ${dark ? 'text-[#F6F3EC]' : 'text-[#5A6B4D]'}`}
                  />
                </motion.div>
              </motion.div>
            );
            // A whole number of plates fills the run exactly, so nothing is left
            // sliced at either end and both arrows sit on a real card edge. The
            // width is the row divided by the count less its gaps, so the plates
            // stretch with the container instead of stepping at breakpoints.
            // Gaps here must match the rail's own: gap-1.5 (0.375rem), gap-2 from md.
            const cls =
              'group/plate shrink-0 snap-start w-[calc((100%-0.375rem)/2)] sm:w-[calc((100%-0.75rem)/3)] md:w-[calc((100%-1.5rem)/4)] lg:w-[calc((100%-2rem)/5)] xl:w-[calc((100%-2.5rem)/6)]';
            const twinProps = twin ? { 'aria-hidden': true, tabIndex: -1 } : {};
            return c.kind === 'shop' ? (
              <Link
                key={`${c.en}${twin ? '-twin' : ''}`}
                to={searchPath(1, { category: c.category, room: c.room })}
                className={cls}
                data-testid="quick-plate"
                {...twinProps}
              >
                {inner}
              </Link>
            ) : (
              <button key={`${c.en}${twin ? '-twin' : ''}`} type="button" className={cls} data-testid="quick-plate" {...twinProps}>
                {inner}
              </button>
            );
          })}
        </div>

        {/* aimed at the run, so they sit on its two ends rather than up in the
            heading. `start`/`end` follow the language, as the rail itself does. */}
        <button
          type="button"
          onClick={rail.prev}
          aria-label={t('Previous', 'السابق')}
          className={arrowCls}
          style={{ borderColor: HAIR, insetInlineStart: arrowInset }}
        >
          <ChevronLeft size={18} strokeWidth={1.25} className={isAr ? 'rotate-180' : ''} />
        </button>
        <button
          type="button"
          onClick={rail.next}
          aria-label={t('Next', 'التالي')}
          className={arrowCls}
          style={{ borderColor: HAIR, insetInlineEnd: arrowInset }}
        >
          <ChevronRight size={18} strokeWidth={1.25} className={isAr ? 'rotate-180' : ''} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Trending — the original's "most interactive" rail                */
/** Promo panels are laid out on a 6-column grid. */
const SPAN_CLS = { 2: 'md:col-span-2', 3: 'md:col-span-3' } as const;

export function PromoMosaic() {
  const { lang } = useLook();
  const isAr = lang === 'ar';
  return (
    <section data-testid="promo-mosaic" className="border-t py-16 md:py-20" style={{ borderColor: HAIR }}>
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
          {PROMO_PANELS.map((p, i) => {
            const title = isAr ? p.title.ar : p.title.en;
            const body = (
              <>
                <img
                  src={p.img}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/pp:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                  <p className={`text-[10px] uppercase text-white/80 ${isAr ? 'tracking-normal' : 'tracking-[0.3em]'}`}>
                    {isAr ? p.eyebrow.ar : p.eyebrow.en}
                  </p>
                  <h3
                    className={`mt-2.5 max-w-md text-xl font-extrabold uppercase md:text-2xl ${
                      isAr ? "font-['Alexandria',sans-serif] leading-snug tracking-normal" : "font-['Outfit',sans-serif] leading-tight tracking-tight"
                    }`}
                  >
                    {title}
                  </h3>
                  <span
                    className={`mt-5 inline-flex items-center gap-2.5 border-b border-white/50 pb-1.5 text-[11px] uppercase transition-colors group-hover/pp:border-white ${
                      isAr ? 'tracking-normal' : 'tracking-[0.28em]'
                    }`}
                  >
                    {isAr ? p.cta.ar : p.cta.en}
                    <ArrowRight
                      size={12}
                      strokeWidth={1.5}
                      className={`transition-transform duration-300 ${
                        isAr ? 'rotate-180 group-hover/pp:-translate-x-1' : 'group-hover/pp:translate-x-1'
                      }`}
                    />
                  </span>
                </div>
              </>
            );
            const cls = 'group/pp relative block aspect-[2/1] h-full w-full overflow-hidden';
            return (
              <Reveal key={p.title.en} delay={i * 0.05} className={SPAN_CLS[p.span]}>
                {p.query ? (
                  <Link to={searchPath(1, p.query)} className={cls}>
                    {body}
                  </Link>
                ) : (
                  <a href="#" className={cls}>
                    {body}
                  </a>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Trending — the original's "most interactive" rail                */
/* ------------------------------------------------------------------ */

function TrendingCard({ tr, p }: { tr: TrendingItem; p: CatalogProduct; key?: string | number }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const stat = 'inline-flex items-center gap-1.5';
  return (
    <div className="flex h-full flex-col">
      <ProductCard p={p} testId="home-product-card" />
      {/* live activity row */}
      <div
        className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t pt-3.5 text-[11px] text-neutral-500"
        style={{ borderColor: HAIR }}
      >
        <span className={stat} title={t('Views', 'مشاهدات')}>
          <Eye size={13} strokeWidth={1.5} />
          <span dir="ltr">{formatSAR(tr.views)}</span>
        </span>
        <span className={stat} title={t('Likes', 'إعجابات')}>
          <Heart size={13} strokeWidth={1.5} />
          <span dir="ltr">{formatSAR(tr.likes)}</span>
        </span>
        <span className={stat} title={t('Saves', 'حفظ')}>
          <Bookmark size={13} strokeWidth={1.5} />
          <span dir="ltr">{formatSAR(tr.saves)}</span>
        </span>
        {tr.hot && (
          <span
            className={`ms-auto inline-flex items-center gap-1.5 text-[9.5px] font-semibold uppercase ${
              isAr ? 'tracking-normal' : 'tracking-[0.22em]'
            }`}
            style={{ color: OLIVE }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: OLIVE }} />
            {t('Very active', 'نشط جداً')}
          </span>
        )}
      </div>
    </div>
  );
}

export function Trending({ no }: { no: string }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const rail = useRail({ auto: 5600 });
  const items = TRENDING.flatMap((tr) => {
    const p = findProduct(tr.productId);
    return p ? [{ tr, p }] : [];
  });

  return (
    <section data-testid="trending" className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
      <div className={CONTAINER}>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionHeading eyebrow={t(`Right Now — ${no}`, `الآن — ${no}`)} title={t('Trending Now', 'الأكثر تفاعلاً')} />
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                {/* live indicator */}
                <span className={`inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`} style={{ color: OLIVE }}>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ backgroundColor: OLIVE }} />
                    <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: OLIVE }} />
                  </span>
                  {t('Live now', 'الآن مباشر')}
                </span>
                <p className="text-sm font-light leading-relaxed text-neutral-600 md:text-[15px]">
                  {t(
                    'The most viewed, liked and saved pieces in the last hours.',
                    'المنتجات الأكثر تصفحاً وإعجاباً وحفظاً في الساعات الماضية.',
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 pb-2">
              <ViewMore label={t('Browse all', 'تصفح الكل')} to={searchPath(1)} />
              <RailArrows onPrev={rail.prev} onNext={rail.next} />
            </div>
          </div>
        </Reveal>
      </div>

      <div className={`${CONTAINER} mt-12 md:mt-16`}>
        <Rail railRef={rail.ref}>
          {items.map(({ tr, p }, i) => (
            <Reveal y={0} key={p.id} delay={i * 0.05} className="w-[68vw] shrink-0 snap-start sm:w-[300px] lg:w-[312px]">
              <TrendingCard tr={tr} p={p} />
            </Reveal>
          ))}
        </Rail>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Featured deals — countdown to midnight over the discounted items */
/* ------------------------------------------------------------------ */

const pad2 = (n: number) => String(n).padStart(2, '0');

/** HH:MM:SS to local midnight, ticking every second. Lives outside any Reveal. */
function Countdown() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [ms, setMs] = useState(() => msUntilMidnight());
  useEffect(() => {
    const id = window.setInterval(() => setMs(msUntilMidnight()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const total = Math.max(0, Math.floor(ms / 1000));
  const parts = [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60];
  return (
    <div data-testid="countdown" className="flex items-center gap-4">
      <span className={eyebrowCls(isAr, 'text-[10px] text-neutral-500')}>{t('Ends in', 'تنتهي خلال')}</span>
      <div dir="ltr" className="flex items-center gap-1.5">
        {parts.map((v, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-[15px] font-bold" style={{ color: INK }}>:</span>}
            <span
              className="flex h-11 min-w-[44px] items-center justify-center px-2 font-['Outfit',sans-serif] text-[15px] font-bold tabular-nums text-white"
              style={{ backgroundColor: INK }}
            >
              {pad2(v)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** ProductCard's sibling for the deals rail — same bones, deal price + red discount tag. */
function DealCard({ p }: { p: CatalogProduct; key?: string | number }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const original = p.oldPrice ?? p.price;
  const deal = p.oldPrice ? p.price : Math.round(p.price * (1 - FEATURED_DEALS.fallbackDiscount / 100));
  const pct = Math.max(1, Math.round((1 - deal / original) * 100));
  const name = p.name[lang];
  const to = productPath(1, p.id);
  const [added, setAdded] = useState(false);
  const addToCart = () => {
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="group flex h-full flex-col border bg-white" style={{ borderColor: HAIR }}>
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: TILE }}>
        <span
          dir="ltr"
          className="absolute start-4 top-4 z-10 px-2 py-1 font-['Outfit',sans-serif] text-[11px] font-bold text-white"
          style={{ backgroundColor: RED }}
        >
          −{pct}%
        </span>
        <Link to={to} className="block h-full w-full" aria-label={name}>
          <img
            src={p.img}
            alt={name}
            className="h-full w-full object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className={eyebrowCls(isAr)}>{storeOf(p.store).name[lang]}</p>
        <h3 className="mt-1.5 truncate text-sm font-medium" title={name}>
          <Link to={to} className="decoration-[#5A6B4D] underline-offset-4 hover:underline">
            {name}
          </Link>
        </h3>
        <div className="mt-2">
          <Stars rating={p.rating} />
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[17px] font-bold">{formatSAR(deal)}</span>
          <span className={`text-[10px] uppercase text-neutral-500 ${isAr ? 'tracking-normal' : 'tracking-[0.1em]'}`}>
            {t('SAR', 'ر.س')}
          </span>
          <span className="text-xs text-neutral-400 line-through">{formatSAR(original)}</span>
        </div>
        <button
          type="button"
          onClick={addToCart}
          className={`mt-5 inline-flex w-full items-center justify-center gap-2 border border-[#171512] py-3.5 text-[10px] font-medium uppercase transition-colors duration-300 ${
            added ? 'border-[#5A6B4D] bg-[#5A6B4D] text-white' : 'hover:bg-[#171512] hover:text-white'
          } ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`}
        >
          {added && <Check size={13} strokeWidth={2} />}
          {added ? t('Added', 'أُضيف') : t('Add to Cart', 'أضف إلى السلة')}
        </button>
      </div>
    </div>
  );
}

export function FeaturedDeals({ no }: { no: string }) {
  const { t } = useLook();
  const rail = useRail({ auto: 6200 });
  const items = FEATURED_DEALS.productIds.flatMap((id) => {
    const p = findProduct(id);
    return p ? [p] : [];
  });

  return (
    <section data-testid="featured-deals" className="border-t py-20 md:py-28" style={{ borderColor: HAIR, backgroundColor: TILE }}>
      <div className={CONTAINER}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading eyebrow={t(`Offers — ${no}`, `العروض — ${no}`)} title={t('Featured Deals', 'عروض مميزة')} />
          </Reveal>
          {/* the countdown re-renders every second, so it stays out of the Reveal */}
          <div className="flex flex-wrap items-center gap-6 pb-2">
            <Countdown />
            <RailArrows onPrev={rail.prev} onNext={rail.next} />
          </div>
        </div>
      </div>

      <div className={`${CONTAINER} mt-12 md:mt-16`}>
        <Rail railRef={rail.ref}>
          {items.map((p, i) => (
            <Reveal y={0} key={p.id} delay={i * 0.05} className="w-[68vw] shrink-0 snap-start sm:w-[300px] lg:w-[312px]">
              <DealCard p={p} />
            </Reveal>
          ))}
        </Rail>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 7 & 13. Campaign banners — full-bleed, typographic                  */
/* ------------------------------------------------------------------ */

export function CampaignBanner({ c, testId }: { c: Campaign; testId: string }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const dark = c.tone === 'dark';
  const title = isAr ? c.title.ar : c.title.en;
  return (
    <section data-testid={testId} className="relative flex min-h-[420px] items-center overflow-hidden md:min-h-[520px]">
      <img src={c.img} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      {/* overlay removed on request — the photograph carries the banner on its own */}

      <div className={`${CONTAINER} relative w-full py-20 md:py-28`}>
        <Reveal>
          <p
            className={`text-[11px] uppercase ${isAr ? "font-['Tajawal',sans-serif] tracking-normal" : 'tracking-[0.32em]'}`}
            style={{ color: dark ? '#FFFFFF' : INK }}
          >
            {isAr ? c.eyebrow.ar : c.eyebrow.en}
          </p>
          <h2
            className={`mt-4 max-w-2xl text-4xl font-extrabold uppercase md:text-5xl lg:text-6xl ${titleFont(isAr)}`}
            style={{ color: dark ? '#FFFFFF' : INK }}
          >
            {title}
          </h2>
          <p
            className={`mt-6 max-w-xl text-[15px] font-light leading-relaxed ${dark ? 'text-white' : 'text-[#171512]'}`}
          >
            {isAr ? c.body.ar : c.body.en}
          </p>
          <Link
            to={c.query ? searchPath(1, c.query) : searchPath(1)}
            className={`mt-9 inline-block px-10 py-4 text-[11px] font-medium uppercase transition-colors duration-300 ${
              isAr ? 'tracking-normal' : 'tracking-[0.28em]'
            } ${
              dark
                ? 'bg-[#F6F3EC] text-[#171512] hover:bg-[#5A6B4D] hover:text-white'
                : 'bg-[#171512] text-white hover:bg-[#5A6B4D]'
            }`}
          >
            {t(c.cta.en, c.cta.ar)}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 19. Suggested for you                                               */
/* ------------------------------------------------------------------ */

export function SuggestedForYou({ no }: { no: string }) {
  const { t } = useLook();
  const items = SUGGESTED_IDS.flatMap((id) => {
    const p = findProduct(id);
    return p ? [p] : [];
  });
  return (
    <section data-testid="suggested" className="border-t bg-white py-20 md:py-28" style={{ borderColor: HAIR }}>
      <div className={CONTAINER}>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={t(`Based on your browsing — ${no}`, `بناءً على تصفحك — ${no}`)}
              title={t('Suggested for You', 'مقترح لك')}
            />
            <div className="pb-2">
              <ViewMore label={t('View All', 'عرض الكل')} to={searchPath(1)} />
            </div>
          </div>
        </Reveal>
      </div>

      {/* rail on small screens, settles into a 5-up row from lg */}
      <div className={`${CONTAINER} mt-12 md:mt-16`}>
        <div className="scrollbar-hide -mx-6 flex snap-x scroll-px-6 md:scroll-px-10 snap-mandatory gap-5 overflow-x-auto overflow-y-hidden px-6 md:-mx-10 md:gap-6 md:px-10 lg:mx-0 lg:overflow-visible lg:px-0">
          {items.map((p, i) => (
            <Reveal y={0} key={p.id} delay={i * 0.05} className="w-[68vw] shrink-0 snap-start sm:w-[300px] lg:w-auto lg:flex-1 lg:shrink">
              <ProductCard p={p} testId="home-product-card" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 23. Brands strip — typographic wordmarks, no logos                  */
/* ------------------------------------------------------------------ */

export function BrandsStrip() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  return (
    <section data-testid="brands-strip" className="border-y py-12 md:py-14" style={{ borderColor: HAIR }}>
      <div className={CONTAINER}>
        <Reveal>
          <p className={`text-center ${eyebrowCls(isAr, 'text-[10px] text-neutral-400')}`}>
            {t('Brands on Diyar', 'علامات على ديار')}
          </p>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:justify-between md:gap-x-6">
            {BRANDS.map((b) => (
              <li
                key={b.en}
                className={`text-[15px] font-semibold uppercase text-[#171512]/45 transition-colors duration-300 hover:text-[#171512] md:text-[17px] ${
                  isAr ? "font-['Alexandria',sans-serif] tracking-normal" : "font-['Outfit',sans-serif] tracking-[0.28em]"
                }`}
              >
                {isAr ? b.ar : b.en}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 27. Newsletter — standalone band before the footer                  */
/* ------------------------------------------------------------------ */

export function Newsletter() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <section data-testid="newsletter" className="border-t py-20 md:py-28" style={{ borderColor: HAIR, backgroundColor: TILE }}>
      <div className={CONTAINER}>
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <p
              className={`text-[11px] uppercase ${isAr ? "font-['Tajawal',sans-serif] tracking-normal" : 'tracking-[0.32em]'}`}
              style={{ color: OLIVE }}
            >
              {t('Newsletter', 'النشرة البريدية')}
            </p>
            <h2 className={`mt-4 text-3xl font-extrabold uppercase md:text-4xl lg:text-5xl ${titleFont(isAr)}`} style={{ color: INK }}>
              {isAr ? NEWSLETTER.title.ar : NEWSLETTER.title.en}
            </h2>
            <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-neutral-600">
              {isAr ? NEWSLETTER.body.ar : NEWSLETTER.body.en}
            </p>
          </Reveal>

          <Reveal className="lg:col-span-6" delay={0.1}>
            {done ? (
              <p role="status" className="flex items-center gap-2.5 text-[15px] font-medium" style={{ color: OLIVE }}>
                <Check size={16} strokeWidth={2} />
                {isAr ? NEWSLETTER.success.ar : NEWSLETTER.success.en}
              </p>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isAr ? NEWSLETTER.placeholder.ar : NEWSLETTER.placeholder.en}
                  aria-label={t('Email address', 'البريد الإلكتروني')}
                  className="h-14 w-full min-w-0 border bg-white px-5 text-[13px] text-[#171512] placeholder:text-neutral-400 transition-colors focus:border-[#171512] focus:outline-none"
                  style={{ borderColor: HAIR }}
                />
                <button type="submit" className={`${primaryBtnCls(isAr)} h-14 shrink-0 px-10`}>
                  {isAr ? NEWSLETTER.cta.ar : NEWSLETTER.cta.en}
                </button>
              </form>
            )}
            <p className="mt-3 text-[11px] text-neutral-400">
              {t('No spam — unsubscribe any time.', 'بلا رسائل مزعجة — يمكنك إلغاء الاشتراك في أي وقت.')}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Shop by room — interactive isometric apartment                      */
/* ------------------------------------------------------------------ */

/**
 * Room hit regions traced over /looks/apartment.jpg, as percentages of the
 * image box. Each polygon covers the room's whole VISIBLE VOLUME (floor, back
 * walls and tall furniture), not just its floor — in an isometric view the
 * furniture is drawn above its footprint, so a floor-only mask would leave the
 * bed, wardrobe and olive tree outside the highlight.
 * The mask edge is feathered, so a few percent of imprecision never shows.
 */
const ROOM_SHAPES: Record<RoomKey, [number, number][]> = {
  living: [[8, 40], [30, 16], [42, 33], [28, 63], [12, 50]],
  dining: [[28, 64], [44, 39], [52, 47], [36, 74]],
  bedroom: [[34, 24], [51, 3], [69, 26], [52, 47], [37, 32]],
  majlis: [[38, 69], [57, 47], [79, 68], [58, 90]],
  office: [[59, 41], [69, 26], [80, 38], [68, 53]],
  outdoor: [[75, 58], [84, 31], [97, 50], [97, 62], [87, 75]],
};

/** The render's own background, so the plate melts into the band behind it. */
const APARTMENT_BG = '#F3E9DA';

const pointsOf = (k: RoomKey) => ROOM_SHAPES[k].map(([x, y]) => `${x},${y}`).join(' ');
const centroidOf = (k: RoomKey) => {
  const pts = ROOM_SHAPES[k];
  return {
    x: pts.reduce((a, p) => a + p[0], 0) / pts.length,
    y: pts.reduce((a, p) => a + p[1], 0) / pts.length,
  };
};

export function ApartmentRooms() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const [active, setActive] = useState<RoomKey | null>(null);
  const activeRoom = active ? ROOMS.find((r) => r.key === active) : undefined;

  /* The plan is the whole section now, so it has to teach its own interaction:
     it draws itself in, then walks through the rooms once and settles. Touching
     it at any point cancels the tour — the visitor outranks the demo. */
  const plate = useRef<HTMLDivElement>(null);
  /* The plan opens from under its own title: a circle at the top centre of
     the plate that blooms as the plate scrolls up into place, so the apartment
     grows out of the heading rather than wiping in from an edge. Once it has
     covered the plate the clip comes off for good. */
  const reduceMotion = useReducedMotion();
  const { scrollYProgress: bloom } = useScroll({ target: plate, offset: ['start 92%', 'center 55%'] });
  const irisR = useTransform(bloom, [0, 1], [3, 130]);
  const iris = useMotionTemplate`circle(${irisR}% at 50% 0%)`;
  const [bloomed, setBloomed] = useState(false);
  useMotionValueEvent(bloom, 'change', (v) => { if (v >= 0.999) setBloomed(true); });
  const [seen, setSeen] = useState(false);
  const touched = useRef(false);

  useEffect(() => {
    const el = plate.current;
    if (!el || seen) return;
    // The plan is taller than most viewports, so "its top edge appeared" fires
    // while it is still below the fold and the reveal is over before anyone
    // sees it. Wait until a real share of it is actually on screen.
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
    const io = new IntersectionObserver(check, { threshold: [0, 0.25, 0.45, 0.6] });
    io.observe(el);
    window.addEventListener('scroll', check, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', check);
    };
  }, [seen]);

  useEffect(() => {
    if (!seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timers = ROOMS.map((r, i) =>
      window.setTimeout(() => {
        if (!touched.current) setActive(r.key);
      }, 1200 + i * 300),
    );
    timers.push(
      window.setTimeout(() => {
        if (!touched.current) setActive(null);
      }, 1200 + ROOMS.length * 300),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [seen]);

  const hold = (key: RoomKey | null) => {
    touched.current = true;
    setActive(key);
  };

  return (
    <section
      data-testid="shop-by-room"
      className="border-t py-20 md:py-28"
      style={{ borderColor: HAIR, backgroundColor: APARTMENT_BG }}
    >
      <div className={CONTAINER}>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading eyebrow={t('Rooms — 07', 'الغرف — 07')} title={t('Shop by Room', 'تسوق حسب الغرفة')} />
            <p className={`mx-auto mt-5 max-w-md text-[15px] font-light leading-relaxed ${isAr ? 'tracking-normal' : ''}`} style={{ color: '#4A443C' }}>
              {t(
                'Hover a room to see everything that furnishes it — from the sofa down to the vases.',
                'مرّر على غرفة لترى كل ما يؤثثها — من الأريكة حتى المزهريات.',
              )}
            </p>
            <div className="mt-6 flex justify-center">
              <ViewMore label={t('All Rooms', 'كل الغرف')} to={searchPath(1)} />
            </div>
          </div>
        </Reveal>

        <motion.div
          ref={plate}
          data-testid="apartment-plate"
          data-seen={seen}
          className="relative mx-auto mt-12 max-w-[1120px] select-none md:mt-16"
          style={reduceMotion ? undefined : bloomed ? { clipPath: 'none' } : { clipPath: iris }}
          onMouseLeave={() => hold(null)}
        >
          <motion.img
            src="/looks/apartment.jpg"
            alt={t(
              'Cutaway view of a furnished apartment: living room, bedroom, dining room, majlis, home office and terrace',
              'مقطع لشقة مؤثثة: غرفة المعيشة وغرفة النوم وغرفة الطعام والمجلس والمكتب المنزلي والجلسة الخارجية',
            )}
            className="block h-auto w-full"
            draggable={false}
            initial={{ scale: 1.06 }}
            animate={seen ? { scale: 1 } : undefined}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Highlight + hit regions. Percent coordinates, so they track the
              image at any width; physical (never mirrored) like the photo. */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <defs>
              <filter id="apartment-feather">
                <feGaussianBlur stdDeviation="0.9" />
              </filter>
              <mask id="apartment-mask">
                <rect x="0" y="0" width="100" height="100" fill="white" />
                {active && <polygon points={pointsOf(active)} fill="black" filter="url(#apartment-feather)" />}
              </mask>
            </defs>

            {/* Everything but the hovered room washes out. The veil is the band
                colour, not ink — the render's own background stays exactly the
                colour behind it and the plate never shows as a dimmed rectangle. */}
            <rect
              x="0" y="0" width="100" height="100"
              fill={APARTMENT_BG}
              mask="url(#apartment-mask)"
              className="transition-opacity duration-300"
              opacity={active ? 0.55 : 0}
            />

            {/* Real links, so the rooms are reachable by keyboard now that the
                list beside the plan is gone. */}
            {ROOMS.map((r) => (
              <a
                key={r.key}
                href={searchPath(1, { room: r.key })}
                aria-label={`${t(r.en, r.ar)} — ${t(`${formatSAR(r.count)} pieces`, `${formatSAR(r.count)} قطعة`)}`}
                onFocus={() => hold(r.key)}
                onBlur={() => hold(null)}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(searchPath(1, { room: r.key }));
                }}
              >
                <polygon
                  points={pointsOf(r.key)}
                  fill="transparent"
                  className="cursor-pointer outline-none"
                  onMouseEnter={() => hold(r.key)}
                />
              </a>
            ))}
          </svg>

          {/* Idle markers: without the list, these are what say "this plan is alive". */}
          {ROOMS.map((r) => {
            const c = centroidOf(r.key);
            return (
              <span
                key={r.key}
                aria-hidden
                className={`pointer-events-none absolute hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300 md:block ${
                  seen && !active ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ left: `${c.x}%`, top: `${c.y}%`, backgroundColor: OLIVE }}
              >
                <span className="absolute inset-0 animate-ping rounded-full motion-reduce:animate-none" style={{ backgroundColor: OLIVE, opacity: 0.5 }} />
              </span>
            );
          })}

          {/* label chip pinned to the hovered room */}
          {activeRoom && (
            <Link
              to={searchPath(1, { room: activeRoom.key })}
              className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 border bg-white/95 px-4 py-2.5 shadow-[0_10px_30px_rgba(23,21,18,0.18)] backdrop-blur-sm md:block"
              style={{
                left: `${centroidOf(activeRoom.key).x}%`,
                top: `${centroidOf(activeRoom.key).y}%`,
                borderColor: HAIR,
              }}
            >
              <span className={`block text-[13px] font-bold ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.14em]'}`}>
                {t(activeRoom.en, activeRoom.ar)}
              </span>
              <span className="mt-1 flex items-center gap-2 text-[11px]" style={{ color: '#5F5950' }}>
                {t(`${formatSAR(activeRoom.count)} pieces`, `${formatSAR(activeRoom.count)} قطعة`)}
                <ArrowRight size={11} strokeWidth={1.75} className={isAr ? 'rotate-180' : undefined} style={{ color: OLIVE }} />
              </span>
            </Link>
          )}
        </motion.div>

        {/* Touch has no hover and the hit regions are small on a phone, so the
            rooms also stand as chips there. */}
        <ul className="mt-8 flex flex-wrap justify-center gap-2.5 md:hidden" data-testid="room-chips">
          {ROOMS.map((r) => (
            <li key={r.key}>
              <Link
                to={searchPath(1, { room: r.key })}
                className="flex items-center gap-2 border bg-white/70 px-3.5 py-2.5 text-[12px] font-medium"
                style={{ borderColor: HAIR }}
              >
                {t(r.en, r.ar)}
                <span className="text-[10px] tabular-nums" style={{ color: '#5F5950' }}>{formatSAR(r.count)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Services — a numbered index that previews one photograph            */
/* ------------------------------------------------------------------ */

/**
 * Eight identical icon cells read as a template, so the services are set as an
 * index instead: the names carry the section in large type and a single
 * photograph answers "what does this look like" as you move down the list.
 * Desktop previews on hover/focus; touch has no hover, so each row carries its
 * own thumbnail there and the preview pane is desktop-only.
 */
export function ServicesIndex({ no }: { no: string }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [active, setActive] = useState(0);
  const current = SERVICES[active];

  return (
    <section data-testid="services" className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
      <div className={CONTAINER}>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={t(`Services — ${no}`, `الخدمات — ${no}`)} title={t('Our Services', 'خدماتنا')} />
            <ViewMore label={t('All Services', 'كل الخدمات')} />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-14">
          {/* the index */}
          <Reveal className="lg:col-span-7">
            <ul className="border-t" style={{ borderColor: HAIR }}>
              {SERVICES.map((sv, i) => {
                const on = i === active;
                return (
                  <li key={sv.en} className="border-b" style={{ borderColor: HAIR }}>
                    <Link
                                            to={`${lookBase(1)}/service/${serviceSlug(sv)}`}
                      data-testid={`service-row-${i}`}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className="group flex w-full items-center gap-4 py-5 text-start md:gap-6 md:py-6"
                    >
                      {/* touch has no hover — carry the image in the row instead */}
                      <img
                        src={sv.img}
                        alt=""
                        loading="lazy"
                        className="h-14 w-12 shrink-0 object-cover lg:hidden"
                      />
                      <span
                        className={`shrink-0 text-[11px] ${isAr ? 'tracking-normal' : 'tracking-[0.2em]'}`}
                        style={{ color: on ? OLIVE : '#B9B2A6' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`min-w-0 flex-1 font-extrabold leading-tight transition-colors duration-300 ${
                          isAr ? "font-['Alexandria',sans-serif] text-xl tracking-normal md:text-2xl" : 'text-2xl md:text-[28px]'
                        }`}
                        style={{ color: on ? OLIVE : INK }}
                      >
                        {t(sv.en, sv.ar)}
                      </span>
                      <ArrowRight
                        size={16}
                        strokeWidth={1.5}
                        className={`shrink-0 transition-transform duration-300 ${
                          isAr ? 'rotate-180 group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'
                        }`}
                        style={{ color: on ? OLIVE : '#B9B2A6' }}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* the preview — desktop only, follows the list down the page */}
          <Reveal className="hidden lg:col-span-5 lg:block" delay={0.1}>
            <div className="sticky top-28">
              <ServicePreview index={active} />
              <p
                className={`mt-4 text-[11px] uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.26em]'}`}
                style={{ color: OLIVE }}
              >
                {t(current.en, current.ar)}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * The services preview. The new image dissolves in over the one it replaces,
 * so there is never an empty frame between them.
 */
function ServicePreview({ index }: { index: number }) {
  const { t } = useLook();
  const [shown, setShown] = useState({ index, prev: index });
  if (shown.index !== index) {
    // keep the outgoing image underneath while the new one dissolves in
    setShown({ index, prev: shown.index });
  }

  // load every image up front so a dissolve never starts on a frame still loading
  useEffect(() => {
    SERVICES.forEach((sv) => {
      const im = new Image();
      im.src = sv.img;
    });
  }, []);

  const cur = SERVICES[shown.index];
  const under = SERVICES[shown.prev];

  return (
    <div
      data-testid="service-preview"
      data-index={shown.index}
      className="relative aspect-[4/5] overflow-hidden"
      style={{ backgroundColor: TILE }}
    >
      <img key={`under-${under.img}`} src={under.img} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <motion.img
        key={cur.img}
        src={cur.img}
        alt={t(cur.en, cur.ar)}
        initial={shown.prev !== shown.index ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
