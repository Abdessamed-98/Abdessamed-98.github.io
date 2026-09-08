/**
 * Look 1 — Product detail page.
 * Gallery | info (store, title, rating, price, availability, options, buy
 * actions, delivery block, design-assistance strip), details accordion,
 * "sold by" store card, related products, and a sticky buy bar on phones.
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, Share2, Minus, Plus, Check, ChevronDown, ChevronLeft, ChevronRight,
  Truck, Wrench, RefreshCw, Sparkles,
} from 'lucide-react';
import {
  CATEGORIES, AVAILABILITY_LABEL, formatSAR, storeOf, findProduct, relatedProducts,
  lookBase, searchPath,
  type CatalogProduct,
} from '../lookShared';
import {
  INK, OLIVE, HAIR, RED, TILE,
  useLook, Reveal, SectionHeading, ViewMore, Stars, ProductCard, Breadcrumb, primaryBtnCls, eyebrowCls,
} from './ui';

const AVAILABILITY_COLOR = { in_stock: OLIVE, low_stock: RED, made_to_order: '#8A8478' } as const;

/* ------------------------------------------------------------------ */
/* Route component                                                     */
/* ------------------------------------------------------------------ */
export function LookOneProduct() {
  const { id } = useParams();
  const p = findProduct(id);
  if (!p) return <NotFound />;
  /* keyed by id so gallery / colour / qty reset when navigating between products */
  return <ProductView key={p.id} p={p} />;
}

function NotFound() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  return (
    <div data-testid="product-not-found" className="pt-[72px]">
      <div className="mx-auto flex min-h-[60vh] max-w-[1400px] flex-col items-center justify-center px-6 py-24 text-center md:px-10">
        <p className={eyebrowCls(isAr, 'text-[11px]')} style={{ color: OLIVE }}>
          {t('Error 404', 'خطأ 404')}
        </p>
        <h1
          className={`mt-4 text-3xl font-extrabold uppercase md:text-5xl ${
            isAr ? "font-['Alexandria',sans-serif] leading-snug tracking-normal" : "font-['Outfit',sans-serif] leading-tight tracking-tight"
          }`}
        >
          {t('Product not found', 'المنتج غير موجود')}
        </h1>
        <p className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-neutral-600">
          {t(
            'This piece may have sold out or moved. The rest of the catalogue is still here.',
            'ربما نفدت هذه القطعة أو تغيّر رابطها. بقية الكتالوج لا تزال هنا.',
          )}
        </p>
        <Link to={searchPath(1)} className={`mt-9 inline-block px-10 py-4 ${primaryBtnCls(isAr)}`}>
          {t('Browse the shop', 'تصفح المتجر')}
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The page                                                            */
/* ------------------------------------------------------------------ */
function ProductView({ p }: { p: CatalogProduct; key?: string | number }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const store = storeOf(p.store);
  const category = CATEGORIES.find((c) => c.key === p.category);
  const related = relatedProducts(p);

  const [active, setActive] = useState(0);
  const [color, setColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>('description');
  const addedTimer = useRef<number | null>(null);

  const addToCart = () => {
    setAdded(true);
    if (addedTimer.current !== null) window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => setAdded(false), 1800);
  };
  useEffect(() => () => {
    if (addedTimer.current !== null) window.clearTimeout(addedTimer.current);
  }, []);

  const clampQty = (n: number) => Math.min(10, Math.max(1, Number.isFinite(n) ? n : 1));

  /* sticky buy bar (phones): appears once the main Add-to-Cart button scrolls out of view */
  const buyRef = useRef<HTMLButtonElement>(null);
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const el = buyRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const savePct = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const name = p.name[lang];
  const gallery = p.gallery.length ? p.gallery : [p.img];
  const prevImg = () => setActive((i) => (i - 1 + gallery.length) % gallery.length);
  const nextImg = () => setActive((i) => (i + 1) % gallery.length);

  const panels = [
    { key: 'description', label: t('Description', 'الوصف'), body: p.description[lang] },
    { key: 'dimensions', label: t('Dimensions', 'الأبعاد'), body: p.dimensions[lang] },
    { key: 'materials', label: t('Materials', 'الخامات'), body: p.materials[lang] },
    { key: 'care', label: t('Care', 'العناية'), body: p.care[lang] },
  ];

  const crumbs = [
    { label: t('Home', 'الرئيسية'), to: lookBase(1) },
    { label: t('Shop', 'المتجر'), to: searchPath(1) },
    ...(category ? [{ label: category[lang], to: searchPath(1, { category: category.key }) }] : []),
    { label: name },
  ];

  const iconBtn = 'flex h-12 w-12 shrink-0 items-center justify-center border transition-colors hover:border-[#171512]';
  const labelCls = eyebrowCls(isAr, 'text-[10px] text-neutral-400');

  return (
    <div data-testid="product-page" className="pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-6 pt-8 md:px-10 md:pt-10">
        <Breadcrumb items={crumbs} />
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Gallery | Info                                              */}
      {/* ---------------------------------------------------------- */}
      <div className="mx-auto max-w-[1400px] px-6 pt-8 pb-16 md:px-10 md:pt-10 md:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {/* gallery */}
          <div className="lg:col-span-7">
            <div
              className="relative aspect-square overflow-hidden lg:aspect-[5/4] xl:aspect-square"
              style={{ backgroundColor: TILE }}
              data-testid="gallery-main"
            >
              <AnimatePresence initial={false}>
                <motion.img
                  key={gallery[active]}
                  src={gallery[active]}
                  alt={`${name} — ${active + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className={`absolute inset-0 h-full w-full ${
                    active === 0 ? 'object-contain p-8 md:p-14' : 'object-cover'
                  }`}
                />
              </AnimatePresence>

              {/* badges */}
              <div className="absolute start-5 top-5 z-10 flex flex-col gap-1.5">
                {p.oldPrice && (
                  <span className={`text-[10px] font-semibold uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`} style={{ color: RED }}>
                    {t('Sale', 'تخفيض')}
                  </span>
                )}
                {p.isNew && (
                  <span className={`text-[10px] font-semibold uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`} style={{ color: OLIVE }}>
                    {t('New', 'جديد')}
                  </span>
                )}
              </div>

              {/* arrows */}
              {gallery.length > 1 && (
                <div className="absolute bottom-4 end-4 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevImg}
                    aria-label={t('Previous image', 'الصورة السابقة')}
                    className="flex h-10 w-10 items-center justify-center border border-[#171512]/20 bg-white/80 text-[#171512] backdrop-blur-sm transition-colors hover:bg-[#171512] hover:text-white"
                  >
                    <ChevronLeft size={16} strokeWidth={1.25} className={isAr ? 'rotate-180' : undefined} />
                  </button>
                  <button
                    type="button"
                    onClick={nextImg}
                    aria-label={t('Next image', 'الصورة التالية')}
                    className="flex h-10 w-10 items-center justify-center border border-[#171512]/20 bg-white/80 text-[#171512] backdrop-blur-sm transition-colors hover:bg-[#171512] hover:text-white"
                  >
                    <ChevronRight size={16} strokeWidth={1.25} className={isAr ? 'rotate-180' : undefined} />
                  </button>
                </div>
              )}
            </div>

            {/* thumbnails */}
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-6" role="tablist" aria-label={t('Product images', 'صور المنتج')}>
                {gallery.map((g, i) => (
                  <button
                    key={`${g}-${i}`}
                    type="button"
                    role="tab"
                    data-testid="gallery-thumb"
                    aria-selected={i === active}
                    aria-label={t(`Image ${i + 1}`, `الصورة ${i + 1}`)}
                    onClick={() => setActive(i)}
                    className={`aspect-square overflow-hidden border transition-colors ${
                      i === active ? 'border-[#171512]' : 'border-transparent hover:border-[#171512]/40'
                    }`}
                    style={{ backgroundColor: TILE }}
                  >
                    <img src={g} alt="" className={`h-full w-full ${i === 0 ? 'object-contain p-2' : 'object-cover'}`} />
                  </button>
                ))}
              </div>
            )}

            {/* details accordion — under the gallery on desktop */}
            <div className="mt-12 hidden lg:block">
              <Details panels={panels} open={openPanel} onToggle={(k) => setOpenPanel((c) => (c === k ? null : k))} isAr={isAr} />
            </div>
          </div>

          {/* info */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[96px]">
              <Link
                to={searchPath(1, { store: store.key })}
                data-testid="product-store-link"
                className={`${eyebrowCls(isAr, 'text-[10px]')} underline-offset-4 hover:underline`}
                style={{ color: OLIVE }}
              >
                {store.name[lang]}
              </Link>
              <h1
                data-testid="product-title"
                className={`mt-3 text-2xl font-extrabold uppercase md:text-[32px] ${
                  isAr ? "font-['Alexandria',sans-serif] leading-[1.3] tracking-normal" : "font-['Outfit',sans-serif] leading-[1.08] tracking-tight"
                }`}
              >
                {name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Stars rating={p.rating} />
                <span className="text-[12px] font-medium">{p.rating}</span>
                <span className="text-[12px] text-neutral-500">
                  ({isAr ? `${p.reviews} تقييم` : `${p.reviews} reviews`})
                </span>
              </div>

              {/* price */}
              <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1" data-testid="product-price">
                <span className="text-[28px] font-bold leading-none">{formatSAR(p.price)}</span>
                <span className={`text-[11px] uppercase text-neutral-500 ${isAr ? 'tracking-normal' : 'tracking-[0.1em]'}`}>
                  {t('SAR', 'ر.س')}
                </span>
                {p.oldPrice && (
                  <>
                    <span className="text-[14px] text-neutral-400 line-through">{formatSAR(p.oldPrice)}</span>
                    <span className={`text-[10px] font-semibold uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.22em]'}`} style={{ color: RED }}>
                      {t(`Save ${savePct}%`, `وفّر ${savePct}%`)}
                    </span>
                  </>
                )}
              </div>
              <p className={`mt-2 text-[11px] text-neutral-400 ${isAr ? 'tracking-normal' : 'tracking-[0.06em]'}`}>
                {t('Incl. VAT', 'شامل الضريبة')} · <span className="uppercase">SKU</span> <span dir="ltr">{p.sku}</span>
              </p>

              {/* availability */}
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1" data-testid="product-availability">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2" style={{ backgroundColor: AVAILABILITY_COLOR[p.availability] }} aria-hidden />
                  <span className={`text-[11px] font-semibold uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.2em]'}`}>
                    {AVAILABILITY_LABEL[p.availability][lang]}
                  </span>
                </span>
                <span className="text-[12.5px] text-neutral-500">{p.leadTime[lang]}</span>
              </div>

              <p className="mt-6 text-[14.5px] font-light leading-relaxed text-neutral-600">{p.description[lang]}</p>

              {/* colour */}
              <div className="mt-8 border-t pt-7" style={{ borderColor: HAIR }}>
                <p className={labelCls}>
                  {t('Colour', 'اللون')} — <span className="text-[#171512]" data-testid="selected-color">{p.colors[color]?.name[lang]}</span>
                </p>
                <div className="mt-3.5 flex flex-wrap gap-3">
                  {p.colors.map((c, i) => (
                    <button
                      key={c.name.en}
                      type="button"
                      data-testid="color-swatch"
                      aria-label={c.name[lang]}
                      aria-pressed={i === color}
                      title={c.name[lang]}
                      onClick={() => setColor(i)}
                      className={`h-8 w-8 border border-[#171512]/10 transition-all ${
                        i === color ? 'ring-1 ring-[#171512] ring-offset-2 ring-offset-[#FDFCF9]' : 'hover:ring-1 hover:ring-[#171512]/40 hover:ring-offset-2 hover:ring-offset-[#FDFCF9]'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* quantity + add to cart */}
              <div className="mt-7 flex items-stretch gap-3">
                <div className="inline-flex h-12 shrink-0 items-stretch border" style={{ borderColor: INK }} data-testid="qty-stepper">
                  <button
                    type="button"
                    onClick={() => setQty((q) => clampQty(q - 1))}
                    disabled={qty <= 1}
                    aria-label={t('Decrease quantity', 'تقليل الكمية')}
                    className="flex w-11 items-center justify-center transition-colors hover:bg-[#171512] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#171512]"
                  >
                    <Minus size={14} strokeWidth={1.5} />
                  </button>
                  <input
                    data-testid="qty-input"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={10}
                    value={qty}
                    onChange={(e) => setQty(clampQty(Number(e.target.value)))}
                    aria-label={t('Quantity', 'الكمية')}
                    className="w-12 border-x bg-transparent text-center text-[14px] font-semibold focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    style={{ borderColor: INK }}
                  />
                  <button
                    type="button"
                    onClick={() => setQty((q) => clampQty(q + 1))}
                    disabled={qty >= 10}
                    aria-label={t('Increase quantity', 'زيادة الكمية')}
                    className="flex w-11 items-center justify-center transition-colors hover:bg-[#171512] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#171512]"
                  >
                    <Plus size={14} strokeWidth={1.5} />
                  </button>
                </div>
                <button
                  ref={buyRef}
                  type="button"
                  data-testid="add-to-cart"
                  onClick={addToCart}
                  aria-live="polite"
                  className={`inline-flex h-12 flex-1 items-center justify-center gap-2 px-6 ${primaryBtnCls(isAr)} ${added ? '!bg-[#5A6B4D]' : ''}`}
                >
                  {added && <Check size={14} strokeWidth={2} />}
                  {added ? t('Added', 'أُضيف') : t('Add to Cart', 'أضف إلى السلة')}
                </button>
              </div>

              <div className="mt-3 flex items-stretch gap-3">
                <button
                  type="button"
                  data-testid="try-with-ai"
                  className={`inline-flex h-12 flex-1 items-center justify-center gap-2.5 border px-6 text-[11px] font-semibold uppercase transition-colors duration-300 hover:text-white ${
                    isAr ? 'tracking-normal' : 'tracking-[0.24em]'
                  }`}
                  style={{ borderColor: RED, color: RED }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = RED; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Sparkles size={14} strokeWidth={1.5} />
                  {t('Try with AI', 'جرب AI')}
                </button>
                <button
                  type="button"
                  data-testid="wishlist-toggle"
                  onClick={() => setWished((w) => !w)}
                  aria-pressed={wished}
                  aria-label={t('Add to wishlist', 'أضف إلى المفضلة')}
                  className={`${iconBtn} ${wished ? 'text-[#B03A2E]' : ''}`}
                  style={{ borderColor: wished ? RED : HAIR }}
                >
                  <Heart size={18} strokeWidth={1.25} className={wished ? 'fill-[#B03A2E]' : 'fill-transparent'} />
                </button>
                <button type="button" aria-label={t('Share', 'مشاركة')} className={iconBtn} style={{ borderColor: HAIR }}>
                  <Share2 size={18} strokeWidth={1.25} />
                </button>
              </div>

              {/* delivery & installation */}
              <ul className="mt-8 divide-y border" style={{ borderColor: HAIR }} data-testid="delivery-block">
                {[
                  { icon: Truck, title: p.leadTime[lang], sub: t('Kingdom-wide delivery', 'توصيل لكل مناطق المملكة') },
                  { icon: Wrench, title: t('Professional installation by Diyar crews', 'تركيب احترافي بفرق ديار'), sub: t('Assembly included with delivery', 'التجميع مشمول مع التوصيل') },
                  { icon: RefreshCw, title: t('14-day returns · Frame warranty', 'إرجاع خلال 14 يوماً · ضمان الهيكل'), sub: t('Secure payment — Mada, Apple Pay, split payments', 'دفع آمن — مدى وأبل باي والتقسيط') },
                ].map((row) => (
                  <li key={row.title} className="flex items-start gap-4 px-5 py-4" style={{ borderColor: HAIR }}>
                    <row.icon size={18} strokeWidth={1.25} className="mt-0.5 shrink-0" style={{ color: OLIVE }} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium leading-snug">{row.title}</p>
                      <p className="mt-1 text-[12px] font-light leading-relaxed text-neutral-500">{row.sub}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* design assistance */}
              <div
                className="mt-4 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6"
                style={{ backgroundColor: TILE }}
                data-testid="design-assist-cta"
              >
                <div className="min-w-0">
                  <p className={eyebrowCls(isAr, 'text-[10px]')} style={{ color: OLIVE }}>
                    {t('Design Studio', 'استوديو التصميم')}
                  </p>
                  <p className="mt-1.5 text-[13.5px] font-medium leading-snug">
                    {t('Not sure it fits? Book a free design session', 'غير متأكد من المقاس؟ احجز جلسة تصميم مجانية')}
                  </p>
                </div>
                <button type="button" className={`shrink-0 px-6 py-3 ${primaryBtnCls(isAr)}`}>
                  {t('Book Now', 'احجز الآن')}
                </button>
              </div>

              {/* sold by */}
              <div className="mt-8 border bg-white p-6" style={{ borderColor: HAIR }} data-testid="sold-by">
                <p className={labelCls}>{t('Sold by', 'يُباع بواسطة')}</p>
                <div className="mt-4 flex items-start gap-5">
                  <span
                    dir="ltr"
                    className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#171512] font-['Outfit',sans-serif] text-[15px] font-bold tracking-[0.06em] text-white"
                    aria-hidden="true"
                  >
                    {store.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className={`font-bold uppercase ${isAr ? 'text-[15px] tracking-normal' : 'text-[13px] tracking-[0.18em]'}`}>
                      {store.name[lang]}
                    </h2>
                    <p className="mt-1 text-[13px] font-light leading-relaxed text-neutral-600">{store.specialty[lang]}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Stars rating={store.rating} />
                      <span className="text-[12px] font-medium text-neutral-500">{store.rating}</span>
                      <span className={labelCls}>
                        {isAr ? `${formatSAR(store.products)} منتج` : `${formatSAR(store.products)} products`}
                      </span>
                    </div>
                    <div className="mt-5">
                      <ViewMore label={t('Visit store', 'زيارة المتجر')} to={searchPath(1, { store: store.key })} />
                    </div>
                  </div>
                </div>
              </div>

              {/* details accordion — inline on phones/tablets */}
              <div className="mt-10 lg:hidden">
                <Details panels={panels} open={openPanel} onToggle={(k) => setOpenPanel((c) => (c === k ? null : k))} isAr={isAr} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Related                                                     */}
      {/* ---------------------------------------------------------- */}
      {related.length > 0 && (
        <section className="border-t py-20 md:py-28" style={{ borderColor: HAIR }} data-testid="related-products">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionHeading
                  size="sm"
                  eyebrow={t('Related', 'مقترحات')}
                  title={t('You may also like', 'قد يعجبك أيضاً')}
                />
                <div className="pb-2">
                  <ViewMore
                    label={category ? t(`All ${category.en}`, `كل ${category.ar}`) : t('View All', 'عرض الكل')}
                    to={searchPath(1, category ? { category: category.key } : undefined)}
                  />
                </div>
              </div>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-14 md:mt-16 md:gap-x-6 lg:grid-cols-4">
              {related.map((r, i) => (
                <Reveal key={r.id} delay={(i % 4) * 0.05}>
                  <ProductCard p={r} testId="related-card" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------- */}
      {/* Sticky buy bar — phones only                                */}
      {/* ---------------------------------------------------------- */}
      <div
        data-testid="mobile-buy-bar"
        aria-hidden={!showBar}
        className={`fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md transition-transform duration-300 md:hidden ${
          showBar ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ backgroundColor: 'rgba(253,252,249,0.96)', borderColor: HAIR }}
      >
        <div className="flex items-center gap-4 px-6 py-3">
          <div className="min-w-0">
            <p className={`truncate ${labelCls}`}>{store.name[lang]}</p>
            <p className="mt-0.5 text-[15px] font-bold leading-none">
              {formatSAR(p.price)}{' '}
              <span className={`text-[10px] font-normal uppercase text-neutral-500 ${isAr ? 'tracking-normal' : 'tracking-[0.1em]'}`}>
                {t('SAR', 'ر.س')}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={addToCart}
            tabIndex={showBar ? 0 : -1}
            className={`ms-auto inline-flex h-11 items-center justify-center gap-2 px-6 ${primaryBtnCls(isAr)} ${added ? '!bg-[#5A6B4D]' : ''}`}
          >
            {added && <Check size={14} strokeWidth={2} />}
            {added ? t('Added', 'أُضيف') : t('Add to Cart', 'أضف إلى السلة')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Details accordion                                                   */
/* ------------------------------------------------------------------ */
function Details({
  panels,
  open,
  onToggle,
  isAr,
}: {
  panels: { key: string; label: string; body: string }[];
  open: string | null;
  onToggle: (key: string) => void;
  isAr: boolean;
}) {
  return (
    <div className="border-t" style={{ borderColor: HAIR }} data-testid="product-details">
      {panels.map((pn) => {
        const isOpen = open === pn.key;
        return (
          <div key={pn.key} className="border-b" style={{ borderColor: HAIR }}>
            <button
              type="button"
              onClick={() => onToggle(pn.key)}
              aria-expanded={isOpen}
              data-testid={`details-${pn.key}`}
              className="flex w-full items-center justify-between gap-4 py-5 text-start transition-colors hover:text-[#5A6B4D]"
            >
              <span className={`text-[11px] font-bold uppercase ${isAr ? "font-['Alexandria',sans-serif] tracking-normal" : 'tracking-[0.2em]'}`}>
                {pn.label}
              </span>
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                style={{ color: OLIVE }}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.26, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-[14px] font-light leading-relaxed text-neutral-600">{pn.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
