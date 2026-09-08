/**
 * Look 1 — "Editorial Light": the homepage sections carried over from the
 * original site (Look 4) so the page mirrors its structure section for
 * section — quick categories, promo mosaic, trending, featured deals with a
 * countdown, the two campaign banners, suggestions, brands and the newsletter.
 * Same language as the rest of the look: warm canvas, sharp corners, hairlines,
 * olive accents, red only for sale, black rectangle buttons.
 */
import { useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ChevronLeft, ChevronRight, Eye, Heart, Bookmark, Check,
} from 'lucide-react';
import {
  QUICK_CATEGORIES, PROMO_PANELS, TRENDING, FEATURED_DEALS, SUGGESTED_IDS, BRANDS, NEWSLETTER,
  msUntilMidnight, findProduct, storeOf, searchPath, productPath, formatSAR,
  type Campaign, type CatalogProduct, type TrendingItem, type QuickCategory,
} from '../lookShared';
import {
  INK, OLIVE, HAIR, RED, TILE, OLIVE_LT, CREAM,
  useLook, Reveal, SectionHeading, ViewMore, Stars, ProductCard, primaryBtnCls, eyebrowCls,
} from './ui';

/* ------------------------------------------------------------------ */
/* Small local helpers                                                 */
/* ------------------------------------------------------------------ */

const CONTAINER = 'mx-auto max-w-[1400px] px-6 md:px-10';

/** Display face for titles outside SectionHeading — Outfit in EN, Alexandria in AR (never letterspaced). */
const titleFont = (isAr: boolean) =>
  isAr
    ? "font-['Alexandria',sans-serif] leading-[1.15] tracking-normal"
    : "font-['Outfit',sans-serif] leading-[0.98] tracking-tight";

/** Scroll helpers for the snap rails: `next` always moves towards the content end, in both directions. */
function useRail() {
  const { lang } = useLook();
  const ref = useRef<HTMLDivElement>(null);
  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const sign = lang === 'ar' ? -dir : dir;
    el.scrollBy({ left: sign * Math.round(el.clientWidth * 0.7), behavior: 'smooth' });
  };
  return { ref, prev: () => go(-1), next: () => go(1) };
}

/** Prev / next hairline squares — desktop only, the rails swipe on touch. */
function RailArrows({ onPrev, onNext, className = '' }: { onPrev: () => void; onNext: () => void; className?: string }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const btn =
    'flex h-9 w-9 items-center justify-center border transition-colors duration-300 hover:border-[#171512] hover:bg-[#171512] hover:text-white';
  return (
    <div className={`hidden items-center gap-2 md:flex ${className}`}>
      <button type="button" onClick={onPrev} aria-label={t('Previous', 'السابق')} className={btn} style={{ borderColor: HAIR }}>
        <ChevronLeft size={16} strokeWidth={1.25} className={isAr ? 'rotate-180' : ''} />
      </button>
      <button type="button" onClick={onNext} aria-label={t('Next', 'التالي')} className={btn} style={{ borderColor: HAIR }}>
        <ChevronRight size={16} strokeWidth={1.25} className={isAr ? 'rotate-180' : ''} />
      </button>
    </div>
  );
}

/** The look's bleed rail: scrolls edge to edge on phones, snaps per card. */
function Rail({ railRef, children, className = '' }: { railRef: RefObject<HTMLDivElement | null>; children: ReactNode; className?: string }) {
  return (
    <div
      ref={railRef}
      className={`scrollbar-hide -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 md:-mx-10 md:gap-6 md:px-10 ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Quick categories — the original's icon strip under the hero      */
/* ------------------------------------------------------------------ */

function QuickItem({ c }: { c: QuickCategory; key?: string | number }) {
  const { lang } = useLook();
  const label = lang === 'ar' ? c.ar : c.en;
  const inner = (
    <>
      <span
        className="flex h-[72px] w-[72px] items-center justify-center rounded-full border transition-colors duration-300 group-hover/qc:border-[#5A6B4D]"
        style={{ borderColor: HAIR, backgroundColor: TILE }}
      >
        <img src={c.icon} alt="" loading="lazy" className="h-full w-full object-contain p-3" />
      </span>
      <span className="mt-2.5 line-clamp-2 text-[11px] leading-snug text-[#171512]/80 transition-colors group-hover/qc:text-[#171512]">
        {label}
      </span>
    </>
  );
  const cls = 'group/qc flex w-[84px] shrink-0 snap-start flex-col items-center text-center';
  return c.kind === 'shop' ? (
    <Link to={searchPath(1, { category: c.category, room: c.room })} className={cls} aria-label={label}>
      {inner}
    </Link>
  ) : (
    <button type="button" className={cls} aria-label={label}>
      {inner}
    </button>
  );
}

export function QuickCategories() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const rail = useRail();
  const shop = QUICK_CATEGORIES.filter((c) => c.kind === 'shop');
  const services = QUICK_CATEGORIES.filter((c) => c.kind === 'service');
  const groupLabel = eyebrowCls(isAr, 'text-[10px] text-neutral-400');

  return (
    <section data-testid="quick-categories" className="border-b py-8 md:py-10" style={{ borderColor: HAIR }}>
      <div className={`${CONTAINER} relative`}>
        <RailArrows onPrev={rail.prev} onNext={rail.next} className="absolute -top-2 end-6 z-10 md:end-10" />
        <Rail railRef={rail.ref}>
          {/* shop run */}
          <div className="shrink-0">
            <p className={groupLabel}>{t('Browse Categories', 'تصفّح الأقسام')}</p>
            <div className="mt-5 flex gap-2 md:gap-3">
              {shop.map((c) => (
                <QuickItem key={c.en} c={c} />
              ))}
            </div>
          </div>
          {/* services run */}
          <div className="shrink-0 border-s ps-5 md:ps-6" style={{ borderColor: HAIR }}>
            <p className={groupLabel}>{t('Diyar Services', 'خدمات ديار')}</p>
            <div className="mt-5 flex gap-2 md:gap-3">
              {services.map((c) => (
                <QuickItem key={c.en} c={c} />
              ))}
            </div>
          </div>
        </Rail>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Promo mosaic — five offer panels on a 6-column grid              */
/* ------------------------------------------------------------------ */

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
  const rail = useRail();
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
            <Reveal key={p.id} delay={i * 0.05} className="w-[68vw] shrink-0 snap-start sm:w-[300px] lg:w-[312px]">
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
  const rail = useRail();
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
            <Reveal key={p.id} delay={i * 0.05} className="w-[68vw] shrink-0 snap-start sm:w-[300px] lg:w-[312px]">
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
      <div
        className={`absolute inset-0 ${
          dark
            ? 'bg-gradient-to-t from-black/80 via-black/50 to-black/25'
            : 'bg-gradient-to-r from-[#FDFCF9]/95 via-[#FDFCF9]/80 to-[#FDFCF9]/35 rtl:bg-gradient-to-l'
        }`}
      />
      <div className={`${CONTAINER} relative w-full py-20 md:py-28`}>
        <Reveal>
          <p
            className={`text-[11px] uppercase ${isAr ? "font-['Tajawal',sans-serif] tracking-normal" : 'tracking-[0.32em]'}`}
            style={{ color: dark ? OLIVE_LT : OLIVE }}
          >
            {isAr ? c.eyebrow.ar : c.eyebrow.en}
          </p>
          <h2
            className={`mt-4 max-w-2xl text-4xl font-extrabold uppercase md:text-5xl lg:text-6xl ${titleFont(isAr)}`}
            style={{ color: dark ? CREAM : INK }}
          >
            {title}
          </h2>
          <p
            className={`mt-6 max-w-xl text-[15px] font-light leading-relaxed ${dark ? 'text-[#F6F3EC]/75' : 'text-neutral-600'}`}
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
        <div className="scrollbar-hide -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 md:-mx-10 md:gap-6 md:px-10 lg:mx-0 lg:overflow-visible lg:px-0">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05} className="w-[68vw] shrink-0 snap-start sm:w-[300px] lg:w-auto lg:flex-1 lg:shrink">
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
