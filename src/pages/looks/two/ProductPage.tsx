/**
 * Look 2 — product detail page.
 * Gallery in a gold hairline frame | info column (store, title, price, options,
 * delivery panel, design-assistance strip), then details tabs + "Sold by",
 * then related products. Unknown ids get a calm not-found state.
 */
import { useEffect, useRef, useState, type Key } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, Share2, Minus, Plus, ShoppingBag, Check, Truck, Wrench, RotateCcw,
  Sparkles, ArrowRight,
} from 'lucide-react';
import {
  CATEGORIES, AVAILABILITY_LABEL, findProduct, relatedProducts, storeOf,
  formatSAR, lookBase, searchPath,
} from '../lookShared';
import type { Availability, Bi, CatalogProduct } from '../lookShared';
import {
  LOOK, DISPLAY, CAPS, AR_DISPLAY, AR_LABEL, FIELD,
  useLook, ProductCard, Crumbs, Stars, GoldLink, Heading, Reveal,
  goldBtn, eyebrowCls, metaCls, useFlash, isCutout,
} from './ui';

type TabKey = 'description' | 'dimensions' | 'materials' | 'care';

const TABS: { key: TabKey; label: Bi }[] = [
  { key: 'description', label: { en: 'Description', ar: 'الوصف' } },
  { key: 'dimensions', label: { en: 'Dimensions', ar: 'الأبعاد' } },
  { key: 'materials', label: { en: 'Materials', ar: 'الخامات' } },
  { key: 'care', label: { en: 'Care', ar: 'العناية' } },
];

const AVAIL_CLS: Record<Availability, string> = {
  in_stock: 'border-[#C9A86A]/60 text-[#C9A86A]',
  low_stock: 'border-[#C9A86A]/60 bg-[#C9A86A]/10 text-[#C9A86A]',
  made_to_order: 'border-[#EFE9DD]/30 text-[#EFE9DD]/75',
};

const clampQty = (n: number) => Math.min(10, Math.max(1, Math.round(n) || 1));

/* ------------------------------------------------------------------ */
/* Route component                                                     */
/* ------------------------------------------------------------------ */
export default function ProductPage() {
  const { id } = useParams();
  const p = findProduct(id);
  if (!p) return <NotFound />;
  /* Keyed so gallery / colour / qty reset when moving product → product */
  return <ProductView key={p.id} p={p} />;
}

function NotFound() {
  const { isAr, t } = useLook();
  return (
    <div data-testid="product-not-found" className="max-w-[1400px] mx-auto px-6 md:px-10 pt-8 md:pt-12 pb-24 md:pb-40">
      <Crumbs items={[{ label: t('Home', 'الرئيسية'), to: lookBase(LOOK) }, { label: t('Shop', 'المتجر'), to: searchPath(LOOK) }]} />
      <div className="py-20 text-center md:py-32">
        <p className={eyebrowCls(isAr)}>404</p>
        <h1 className={`${isAr ? `${AR_DISPLAY} leading-[1.35]` : `${DISPLAY} leading-[1.1]`} mt-5 text-4xl text-[#EFE9DD] md:text-6xl`}>
          {isAr
            ? <>المنتج <span className="text-[#C9A86A]">غير موجود</span></>
            : <>Product <em className="italic text-[#C9A86A]">not found</em></>}
        </h1>
        <p className={`${isAr ? 'tracking-normal' : ''} mx-auto mt-6 max-w-md font-light leading-relaxed text-[#EFE9DD]/55`}>
          {t(
            'This piece may have sold out or moved. The rest of the collection is still here.',
            'ربما نفدت هذه القطعة أو انتقلت. بقية التشكيلة ما زالت هنا.',
          )}
        </p>
        <Link to={searchPath(LOOK)} className={`${goldBtn(isAr)} mt-10`}>
          {t('Browse the shop', 'تصفح المتجر')} <ArrowRight size={14} strokeWidth={1.5} className="rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Product view                                                        */
/* ------------------------------------------------------------------ */
function ProductView({ p }: { p: CatalogProduct; key?: Key }) {
  const { lang, isAr, t } = useLook();
  const store = storeOf(p.store);
  const category = CATEGORIES.find((c) => c.key === p.category);
  const related = relatedProducts(p);

  const [img, setImg] = useState(0);
  const [color, setColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [added, flashAdded] = useFlash();
  const [tab, setTab] = useState<TabKey>('description');

  /* Sticky mobile bar shows once the main Add-to-Cart has scrolled off the top */
  const ctaRef = useRef<HTMLDivElement>(null);
  const [barVisible, setBarVisible] = useState(false);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => {
      if (e) setBarVisible(!e.isIntersecting && e.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const activeSrc = p.gallery[img] ?? p.img;
  const activeColor = p.colors[color] ?? p.colors[0];
  const saving = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  const tagCls = `${isAr ? `${AR_LABEL} text-[10px] tracking-normal` : `${CAPS} text-[9px] tracking-[0.25em]`} px-2.5 py-1 uppercase`;
  const btnBase = `${isAr ? `${AR_LABEL} text-[13px] tracking-normal` : `${CAPS} text-[11px] tracking-[0.3em]`} inline-flex cursor-pointer items-center justify-center gap-3 border px-6 uppercase transition-all duration-300`;
  const primaryCls = `${btnBase} ${added ? 'border-[#C9A86A] bg-[#C9A86A] text-[#131009]' : 'border-[#C9A86A] text-[#C9A86A] hover:bg-[#C9A86A] hover:text-[#131009]'}`;
  const secondaryCls = `${btnBase} border-[#C9A86A]/45 text-[#C9A86A] hover:border-[#C9A86A] hover:text-[#EFE9DD]`;
  const iconBtnCls = 'flex h-[54px] w-[54px] shrink-0 cursor-pointer items-center justify-center border border-white/15 text-[#EFE9DD]/70 transition-colors duration-300 hover:border-[#C9A86A]/60 hover:text-[#C9A86A]';

  const addToCartLabel = added
    ? <><Check size={15} strokeWidth={1.5} /> {t('ADDED', 'أُضيف')}</>
    : <><ShoppingBag size={15} strokeWidth={1.25} /> {t('ADD TO CART', 'أضف إلى السلة')}</>;

  const perks: { Icon: typeof Truck; text: string }[] = [
    { Icon: Truck, text: p.leadTime[lang] },
    { Icon: Wrench, text: t('Professional installation by Diyar crews', 'تركيب احترافي بفرق ديار') },
    { Icon: RotateCcw, text: t('14-day returns · Frame warranty', 'إرجاع خلال 14 يوماً · ضمان الهيكل') },
  ];

  return (
    <div data-testid="product-page" className="max-w-[1400px] mx-auto px-6 md:px-10 pt-8 md:pt-12 pb-24 md:pb-32">
      <Crumbs
        items={[
          { label: t('Home', 'الرئيسية'), to: lookBase(LOOK) },
          { label: t('Shop', 'المتجر'), to: searchPath(LOOK) },
          ...(category ? [{ label: category[lang], to: searchPath(LOOK, { category: p.category }) }] : []),
          { label: p.name[lang] },
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mt-8 grid items-start gap-10 md:mt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 xl:gap-20"
      >
        {/* ============================ GALLERY ============================ */}
        <div className="lg:sticky lg:top-[96px]">
          <div className="border border-[#C9A86A]/30 p-1">
            <div
              data-testid="gallery-main"
              className={`relative aspect-square overflow-hidden transition-colors duration-500 ${isCutout(activeSrc) ? 'bg-[#F4EFE6]' : 'bg-[#1C1610]'}`}
            >
              {/* Every image is mounted; only the active one is opaque → a true crossfade */}
              {p.gallery.map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={i === img ? p.name[lang] : ''}
                  aria-hidden={i !== img}
                  className={`absolute inset-0 h-full w-full transition-opacity duration-500 ease-out ${i === img ? 'opacity-100' : 'opacity-0'} ${
                    isCutout(src) ? 'object-contain mix-blend-multiply p-8 md:p-12' : 'object-cover'
                  }`}
                />
              ))}
              <div className="pointer-events-none absolute top-4 start-4 z-10 flex flex-col items-start gap-1.5">
                {p.oldPrice !== undefined && <span className={`${tagCls} bg-[#C9A86A] text-[#131009]`}>{t('SALE', 'تخفيض')}</span>}
                {p.isNew && <span className={`${tagCls} border border-[#C9A86A]/60 bg-[#131009] text-[#C9A86A]`}>{t('NEW', 'جديد')}</span>}
              </div>
            </div>
          </div>

          <div className="scrollbar-hide mt-3 flex gap-3 overflow-x-auto">
            {p.gallery.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                data-testid="gallery-thumb"
                aria-label={`${t('Image', 'صورة')} ${i + 1}`}
                aria-pressed={i === img}
                onClick={() => setImg(i)}
                className={`shrink-0 cursor-pointer border p-[3px] transition-colors duration-300 ${
                  i === img ? 'border-[#C9A86A]' : 'border-white/15 hover:border-[#C9A86A]/50'
                }`}
              >
                <span className={`block h-[72px] w-[72px] overflow-hidden md:h-20 md:w-20 ${isCutout(src) ? 'bg-[#F4EFE6]' : 'bg-[#1C1610]'}`}>
                  <img src={src} alt="" className={`h-full w-full ${isCutout(src) ? 'object-contain mix-blend-multiply p-1.5' : 'object-cover'}`} />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ============================== INFO ============================== */}
        <div className="min-w-0">
          <Link
            to={searchPath(LOOK, { store: p.store })}
            data-testid="product-store"
            className={`${isAr ? `${AR_LABEL} text-[12px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.3em]`} inline-block uppercase text-[#C9A86A] border-b border-transparent transition-colors duration-300 hover:border-[#C9A86A]/60`}
          >
            {store.name[lang]}
          </Link>
          <h1
            data-testid="product-title"
            className={`${isAr ? `${AR_DISPLAY} leading-[1.35]` : `${DISPLAY} leading-[1.1]`} mt-4 text-3xl text-[#EFE9DD] md:text-5xl`}
          >
            {p.name[lang]}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Stars rating={p.rating} size={14} />
            <span className={`${metaCls(isAr)} text-[#EFE9DD]/50`}>
              {isAr ? `(${p.reviews} تقييم)` : `(${p.reviews} ${p.reviews === 1 ? 'review' : 'reviews'})`}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <span data-testid="product-price" className={`${DISPLAY} text-3xl text-[#C9A86A] md:text-4xl`}>{formatSAR(p.price)}</span>
            <span className={`${isAr ? 'text-[13px] tracking-normal' : 'text-[12px] tracking-[0.2em]'} text-[#C9A86A]/70`}>{t('SAR', 'ر.س')}</span>
            {p.oldPrice !== undefined && (
              <>
                <span className={`${DISPLAY} text-lg line-through text-[#EFE9DD]/40`}>{formatSAR(p.oldPrice)}</span>
                <span className={`${tagCls} bg-[#C9A86A] text-[#131009]`}>{isAr ? `وفّر ${saving}%` : `Save ${saving}%`}</span>
              </>
            )}
          </div>
          <p className={`${metaCls(isAr)} mt-3 uppercase text-[#EFE9DD]/40`}>
            {t('SKU', 'رمز المنتج')} · <span dir="ltr">{p.sku}</span>
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              data-testid="availability"
              className={`${isAr ? `${AR_LABEL} text-[11px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.25em]`} inline-flex items-center gap-2 border px-3 py-1.5 uppercase ${AVAIL_CLS[p.availability]}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {AVAILABILITY_LABEL[p.availability][lang]}
            </span>
            <span className={`${isAr ? 'tracking-normal' : ''} text-[13px] font-light text-[#EFE9DD]/60`}>{p.leadTime[lang]}</span>
          </div>

          <p className={`${isAr ? 'tracking-normal' : ''} mt-7 text-[15px] font-light leading-relaxed text-[#EFE9DD]/65`}>
            {p.description[lang]}
          </p>

          {/* Options */}
          <div className="mt-8 border-t border-[#C9A86A]/20 pt-8">
            <p className={`${metaCls(isAr)} uppercase text-[#EFE9DD]/50`}>
              {t('Colour', 'اللون')}
              <span data-testid="color-name" className="ms-2 text-[#C9A86A]">{activeColor?.name[lang]}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {p.colors.map((c, i) => (
                <button
                  key={c.hex}
                  type="button"
                  data-testid="color-swatch"
                  title={c.name[lang]}
                  aria-label={c.name[lang]}
                  aria-pressed={i === color}
                  onClick={() => setColor(i)}
                  style={{ backgroundColor: c.hex }}
                  className={`h-9 w-9 cursor-pointer rounded-full border border-white/10 ring-offset-2 ring-offset-[#131009] transition-all duration-300 ${
                    i === color ? 'ring-1 ring-[#C9A86A] scale-105' : 'hover:ring-1 hover:ring-[#C9A86A]/50'
                  }`}
                />
              ))}
            </div>

            <div ref={ctaRef} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className={`${FIELD} flex h-[54px] shrink-0 items-center self-start sm:self-auto`}>
                <button
                  type="button"
                  aria-label={t('Decrease quantity', 'إنقاص الكمية')}
                  disabled={qty <= 1}
                  onClick={() => setQty((q) => clampQty(q - 1))}
                  className="flex h-full w-12 cursor-pointer items-center justify-center text-[#C9A86A] transition-colors duration-300 hover:bg-[#C9A86A]/10 disabled:cursor-default disabled:opacity-30"
                >
                  <Minus size={14} strokeWidth={1.5} />
                </button>
                <input
                  data-testid="qty-input"
                  type="number"
                  min={1}
                  max={10}
                  value={qty}
                  onChange={(e) => setQty(clampQty(Number(e.target.value)))}
                  aria-label={t('Quantity', 'الكمية')}
                  className={`${DISPLAY} w-12 bg-transparent text-center text-lg text-[#EFE9DD] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                />
                <button
                  type="button"
                  aria-label={t('Increase quantity', 'زيادة الكمية')}
                  disabled={qty >= 10}
                  onClick={() => setQty((q) => clampQty(q + 1))}
                  className="flex h-full w-12 cursor-pointer items-center justify-center text-[#C9A86A] transition-colors duration-300 hover:bg-[#C9A86A]/10 disabled:cursor-default disabled:opacity-30"
                >
                  <Plus size={14} strokeWidth={1.5} />
                </button>
              </div>
              <button data-testid="add-to-cart" type="button" onClick={flashAdded} className={`${primaryCls} h-[54px] flex-1`}>
                {addToCartLabel}
              </button>
            </div>

            <div className="mt-3 flex gap-3">
              <button type="button" className={`${secondaryCls} h-[54px] flex-1`}>
                <Sparkles size={15} strokeWidth={1.25} /> {t('TRY WITH AI', 'جرب AI')}
              </button>
              <button
                type="button"
                aria-pressed={wished}
                aria-label={t('Add to wishlist', 'أضف إلى المفضلة')}
                onClick={() => setWished((w) => !w)}
                className={iconBtnCls}
              >
                <Heart size={18} strokeWidth={1.25} className={wished ? 'fill-[#C9A86A] text-[#C9A86A]' : ''} />
              </button>
              <button type="button" aria-label={t('Share', 'مشاركة')} className={iconBtnCls}>
                <Share2 size={18} strokeWidth={1.25} />
              </button>
            </div>
          </div>

          {/* Delivery & installation */}
          <div data-testid="delivery-panel" className="mt-8 divide-y divide-white/10 border border-[#C9A86A]/25 bg-[#1C1610] p-6 md:p-7">
            {perks.map((row) => (
              <div key={row.text} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C9A86A]/35 text-[#C9A86A]">
                  <row.Icon size={16} strokeWidth={1} />
                </span>
                <span className={`${isAr ? 'tracking-normal' : ''} text-[14px] font-light text-[#EFE9DD]/80`}>{row.text}</span>
              </div>
            ))}
          </div>

          {/* Design assistance */}
          <div className="relative mt-4 flex flex-col justify-between gap-5 overflow-hidden border border-[#C9A86A]/25 p-6 sm:flex-row sm:items-center md:p-7">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_0%_50%,rgba(201,168,106,0.12),transparent_70%)] rtl:bg-[radial-gradient(80%_120%_at_100%_50%,rgba(201,168,106,0.12),transparent_70%)]" />
            <div className="relative flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C9A86A]/35 text-[#C9A86A]">
                <Sparkles size={16} strokeWidth={1} />
              </span>
              <div>
                <p className={`${isAr ? `${AR_DISPLAY} text-xl leading-[1.5]` : `${DISPLAY} text-lg`} text-[#EFE9DD]`}>
                  {t('Not sure it fits?', 'غير متأكد من المقاس؟')}
                </p>
                <p className={`${isAr ? 'tracking-normal' : ''} mt-1 text-[13px] font-light text-[#EFE9DD]/55`}>
                  {t('Book a free design session with a Diyar designer.', 'احجز جلسة تصميم مجانية مع مصمم من ديار.')}
                </p>
              </div>
            </div>
            <button type="button" className={`${goldBtn(isAr)} relative shrink-0 self-start sm:self-auto`}>
              {t('Book a session', 'احجز جلسة')} <ArrowRight size={14} strokeWidth={1.5} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ======================= DETAILS + SOLD BY ======================= */}
      <div className="mt-16 grid gap-10 border-t border-white/5 pt-14 md:mt-24 md:pt-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <div className="min-w-0">
          <div role="tablist" aria-label={t('Product details', 'تفاصيل المنتج')} className="scrollbar-hide flex gap-6 overflow-x-auto border-b border-white/10 md:gap-10">
            {TABS.map((tb) => {
              const active = tab === tb.key;
              return (
                <button
                  key={tb.key}
                  role="tab"
                  type="button"
                  data-testid={`tab-${tb.key}`}
                  aria-selected={active}
                  onClick={() => setTab(tb.key)}
                  className={`${isAr ? `${AR_LABEL} text-[13px] tracking-normal` : `${CAPS} text-[11px] tracking-[0.3em]`} relative shrink-0 cursor-pointer pb-4 uppercase transition-colors duration-300 ${
                    active ? 'text-[#C9A86A]' : 'text-[#EFE9DD]/50 hover:text-[#EFE9DD]'
                  }`}
                >
                  {tb.label[lang]}
                  {active && <motion.span layoutId="look2-tab-underline" className="absolute inset-x-0 -bottom-px h-px bg-[#C9A86A]" />}
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              role="tabpanel"
              data-testid="tab-panel"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pt-7"
            >
              <p className={`${isAr ? `${AR_DISPLAY} text-[18px] leading-[1.9]` : `${DISPLAY} text-[16px] leading-[1.8]`} max-w-2xl text-[#EFE9DD]/80`}>
                {p[tab][lang]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <aside data-testid="sold-by" className="border border-[#C9A86A]/20 bg-[#1C1610] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.45)] md:p-8">
          <p className={eyebrowCls(isAr)}>{t('Sold by', 'يبيعه')}</p>
          <div className="mt-6 flex items-center gap-5">
            <span
              dir="ltr"
              className={`${CAPS} flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#C9A86A]/50 text-[15px] tracking-[0.15em] text-[#C9A86A]`}
            >
              {store.initials}
            </span>
            <div className="min-w-0">
              <h3 className={`${isAr ? `${AR_DISPLAY} text-2xl leading-[1.5]` : `${DISPLAY} text-xl`} text-[#EFE9DD]`}>{store.name[lang]}</h3>
              <p className={`${isAr ? 'tracking-normal' : ''} mt-1 text-[13px] font-light text-[#EFE9DD]/55`}>{store.specialty[lang]}</p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
            <span className="flex items-center gap-2">
              <Stars rating={store.rating} size={13} />
              <span className={`${metaCls(isAr)} text-[#C9A86A]/80`}>{store.rating.toFixed(1)}</span>
            </span>
            <span className={`${metaCls(isAr)} uppercase text-[#C9A86A]/80`}>
              {formatSAR(store.products)} {t('PRODUCTS', 'منتج')}
            </span>
          </div>
          <div className="mt-7">
            <GoldLink ar={isAr} to={searchPath(LOOK, { store: p.store })}>
              {t('VISIT STORE', 'زيارة المتجر')} <ArrowRight size={11} strokeWidth={1.5} className="rtl:rotate-180" />
            </GoldLink>
          </div>
        </aside>
      </div>

      {/* ============================ RELATED ============================ */}
      {related.length > 0 && (
        <section data-testid="related" className="mt-20 border-t border-white/5 pt-16 md:mt-28 md:pt-20">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
            <Heading ar={isAr} eyebrow={t('Complete the Room', 'أكمل الغرفة')}>
              {isAr
                ? <>قد يعجبك <em className="not-italic text-[#C9A86A]">أيضاً</em></>
                : <>You May Also <em className="italic">Like</em></>}
            </Heading>
            <GoldLink ar={isAr} to={searchPath(LOOK, { category: p.category })}>
              {t('VIEW ALL', 'عرض الكل')} <ArrowRight size={12} strokeWidth={1.5} className="rtl:rotate-180" />
            </GoldLink>
          </Reveal>
          <div data-testid="related-products" className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
            {related.map((r, i) => (
              <Reveal key={r.id} delay={(i % 4) * 0.06} className="h-full">
                <ProductCard p={r} testId="related-card" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ===================== STICKY BAR (mobile) ===================== */}
      <AnimatePresence>
        {barVisible && (
          <motion.div
            key="sticky-bar"
            data-testid="sticky-bar"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-x-0 bottom-0 z-[55] flex items-center justify-between gap-4 border-t border-[#C9A86A]/25 bg-[#131009]/95 px-5 py-3 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md lg:hidden"
          >
            <div className="min-w-0">
              <p className={`${isAr ? 'tracking-normal' : ''} truncate text-[12px] font-light text-[#EFE9DD]/60`}>{p.name[lang]}</p>
              <p className="flex items-baseline gap-1.5">
                <span className={`${DISPLAY} text-xl text-[#C9A86A]`}>{formatSAR(p.price)}</span>
                <span className={`${isAr ? 'text-[11px] tracking-normal' : 'text-[10px] tracking-[0.2em]'} text-[#C9A86A]/70`}>{t('SAR', 'ر.س')}</span>
              </p>
            </div>
            <button type="button" onClick={flashAdded} className={`${primaryCls} h-11 shrink-0 px-5`}>
              {addToCartLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
