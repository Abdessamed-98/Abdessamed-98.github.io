/**
 * Look 1 — Product detail page.
 *
 * Three columns, after the owner's brief: the gallery (thumbnails down the
 * outer edge, a room-tour video last, "view in your space" on the picture), the
 * buying column (price with VAT, colour, size, quantity, add to cart and buy
 * now), and a sidebar with the seller, four promises and the services that go
 * with the piece. Details sit in tabs under the first two columns; then similar
 * pieces from other stores and a "complete the look" set. Below xl the sidebar
 * becomes a row of three, and on a phone everything stacks, with a sticky buy
 * bar.
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useShell } from './shellContext';
import { useWishlist } from '../../../context/WishlistContext';
import {
  Heart, Share2, Minus, Plus, Check, ChevronLeft, ChevronRight, ArrowRight,
  Truck, Wrench, RefreshCw, ShieldCheck, ScanLine, Play, ShoppingCart, Star, MapPin,
} from 'lucide-react';
import {
  CATALOG, CATEGORIES, AVAILABILITY_LABEL, IMG, REVIEWS, STORE_LOCATIONS,
  formatSAR, storeOf, findProduct, relatedProducts, lookBase, searchPath, productPath,
  type CatalogProduct,
} from '../lookShared';
import {
  INK, OLIVE, HAIR, RED, TILE, RAIL_MD,
  useLook, ViewMore, Stars, ProductCard, Breadcrumb, primaryBtnCls, eyebrowCls, tileImg,
} from './ui';
import { Lightbox, Tabs } from './kit';
import { ShareSheet, TryAISheet } from './ProductSheets';
import { sizeOptions } from './sizes';

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

/** What the gallery can show: the photographs, then the room tour. */
type Media = { kind: 'img'; src: string } | { kind: 'video'; src: string; poster: string };
const ROOM_TOUR = { kind: 'video', src: '/looks/video/room-tour.mp4', poster: '/looks/video/room-tour-poster.jpg' } as const;

/** Services offered beside a piece of furniture, in the sidebar. */
const FIT_SERVICES = [
  { img: IMG.workshop, name: { en: 'Furniture assembly', ar: 'تركيب الأثاث' }, price: { en: 'From 150 SAR', ar: 'ابتداءً من 150 ر.س' } },
  { img: IMG.catHome, name: { en: 'Interior design', ar: 'تصميم داخلي' }, price: { en: 'Consultation 299 SAR', ar: 'جلسة استشارة 299 ر.س' } },
  { img: IMG.roomHotspots, name: { en: 'Wall painting', ar: 'دهان الجدران' }, price: { en: 'From 25 SAR/m²', ar: 'ابتداءً من 25 ر.س/م²' } },
  { img: IMG.catOffice, name: { en: 'Floor tiling', ar: 'تركيب بلاط' }, price: { en: 'From 90 SAR/m²', ar: 'ابتداءً من 90 ر.س/م²' } },
];

/** Pieces that finish a room around the one on the page. */
const LOOK_IDS = [10, 12, 14, 11];

type InfoTab = 'description' | 'specs' | 'reviews' | 'returns' | 'shipping';

function ProductView({ p }: { p: CatalogProduct; key?: string | number }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const store = storeOf(p.store);
  const category = CATEGORIES.find((c) => c.key === p.category);
  const branch = STORE_LOCATIONS.find((l) => l.store === p.store);

  const [active, setActive] = useState(0);
  const [color, setColor] = useState(0);
  const sizes = sizeOptions(p);
  const [seats, setSeats] = useState<number | undefined>(sizes[0]?.seats);
  const size = sizes.find((s) => s.seats === seats);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const shell = useShell();
  const wishlist = useWishlist();
  const [tab, setTab] = useState<InfoTab>('description');
  const [zoom, setZoom] = useState(false);
  // ?ai=1 (from a product card's "Try with AI") opens the sheet on arrival
  const [aiOpen, setAiOpen] = useState(() => new URLSearchParams(window.location.search).get('ai') === '1');
  const [shareOpen, setShareOpen] = useState(false);
  const addedTimer = useRef<number | null>(null);

  const price = size?.price ?? p.price;
  const oldPrice = size ? size.oldPrice : p.oldPrice;

  const addToCart = () => {
    shell.addToCart(p.id, t(p.name.en, p.name.ar), { colorKey: p.colors[color]?.name.en, seats: size && size.seats !== sizes[0].seats ? size.seats : undefined, qty });
    setAdded(true);
    if (addedTimer.current !== null) window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => setAdded(false), 1800);
  };
  const buyNow = () => {
    addToCart();
    navigate(`${lookBase(1)}/checkout`);
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

  const savePct = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;
  const name = p.name[lang];
  const gallery = p.gallery.length ? p.gallery : [p.img];
  const media: Media[] = [...gallery.map((src) => ({ kind: 'img' as const, src })), ROOM_TOUR];
  const current = media[active];
  const prevImg = () => setActive((i) => (i - 1 + media.length) % media.length);
  const nextImg = () => setActive((i) => (i + 1) % media.length);

  // from other stores first: on a marketplace the useful comparison is the same piece elsewhere
  const similar = [
    ...CATALOG.filter((x) => x.id !== p.id && x.store !== p.store && x.category === p.category),
    ...relatedProducts(p, 8).filter((x) => x.store !== p.store),
  ]
    .filter((x, i, a) => a.indexOf(x) === i)
    .slice(0, 4);
  const lookItems = LOOK_IDS.filter((id) => id !== p.id)
    .map((id) => CATALOG.find((x) => x.id === id))
    .filter((x): x is CatalogProduct => !!x)
    .slice(0, 4);

  const crumbs = [
    { label: t('Home', 'الرئيسية'), to: lookBase(1) },
    { label: t('Shop', 'المتجر'), to: searchPath(1) },
    ...(category ? [{ label: category[lang], to: searchPath(1, { category: category.key }) }] : []),
    { label: name },
  ];

  const labelCls = eyebrowCls(isAr, 'text-[10px] text-neutral-400');
  const fieldLabel = `text-[12.5px] font-bold ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.14em] text-[11px]'}`;
  const card = 'border bg-white';

  return (
    <div data-testid="product-page" className="pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-6 pt-8 md:px-10 md:pt-10">
        <Breadcrumb items={crumbs} />
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Gallery | Info | Sidebar — the owner's three-column brief     */}
      {/* ---------------------------------------------------------- */}
      <div className="mx-auto max-w-[1400px] px-6 pt-8 pb-16 md:px-10 md:pt-10 md:pb-20">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)_minmax(0,3.5fr)] xl:gap-9">
          {/* ---- gallery: thumbnails down the outer edge, the video last ---- */}
          <div className="lg:col-span-7 xl:col-span-1" data-testid="product-gallery">
            <div className="flex flex-col-reverse gap-3 lg:flex-row">
              <div className="scrollbar-hide flex gap-3 overflow-x-auto lg:w-[84px] lg:shrink-0 lg:flex-col lg:overflow-visible" role="tablist" aria-label={t('Product media', 'صور المنتج')}>
                {media.map((m, i) => (
                  <button
                    key={`${m.src}-${i}`}
                    type="button"
                    role="tab"
                    data-testid={m.kind === 'video' ? 'gallery-video-thumb' : 'gallery-thumb'}
                    aria-selected={i === active}
                    aria-label={m.kind === 'video' ? t('Room tour video', 'فيديو جولة في الغرفة') : t(`Image ${i + 1}`, `الصورة ${i + 1}`)}
                    onClick={() => setActive(i)}
                    className={`relative aspect-square w-[72px] shrink-0 overflow-hidden border transition-colors lg:w-full ${
                      i === active ? 'border-[#171512]' : 'border-[#E8E4DC] hover:border-[#171512]/40'
                    }`}
                    style={{ backgroundColor: TILE }}
                  >
                    <img
                      src={m.kind === 'video' ? m.poster : i === 0 ? tileImg(p.id, m.src) : m.src}
                      alt=""
                      className={`h-full w-full ${m.kind === 'img' && i === 0 ? 'object-contain p-2' : 'object-cover'}`}
                    />
                    {m.kind === 'video' && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <span className="flex h-8 w-8 items-center justify-center bg-white/95 text-[#171512]">
                          <Play size={13} strokeWidth={2} className="fill-[#171512]" />
                        </span>
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="relative aspect-[4/5] min-w-0 flex-1 overflow-hidden" style={{ backgroundColor: TILE }} data-testid="gallery-main">
                <AnimatePresence initial={false}>
                  {current.kind === 'video' ? (
                    <motion.video
                      key="video"
                      data-testid="gallery-video"
                      src={current.src}
                      poster={current.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <motion.img
                      key={current.src}
                      src={active === 0 ? tileImg(p.id, current.src) : current.src}
                      alt={`${name} — ${active + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className={`absolute inset-0 h-full w-full ${active === 0 ? 'object-contain p-8 md:p-12' : 'object-cover'}`}
                    />
                  )}
                </AnimatePresence>
                {current.kind === 'img' && (
                  <button
                    type="button"
                    data-testid="gallery-zoom"
                    onClick={() => setZoom(true)}
                    aria-label={t('View full screen', 'عرض بملء الشاشة')}
                    className="absolute inset-0 z-[5] cursor-zoom-in"
                  />
                )}

                {/* badges */}
                <div className="absolute start-5 top-5 z-10 flex flex-col gap-1.5">
                  {oldPrice && (
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

                {/* view it in your own room — the AI try-on, on the picture itself */}
                <button
                  type="button"
                  data-testid="try-with-ai"
                  onClick={() => setAiOpen(true)}
                  className={`absolute bottom-4 start-4 z-10 inline-flex items-center gap-2.5 bg-[#171512]/85 px-4 py-3 text-[12px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-[#171512] ${
                    isAr ? 'tracking-normal' : 'uppercase tracking-[0.14em] text-[11px]'
                  }`}
                >
                  <ScanLine size={15} strokeWidth={1.5} />
                  {t('View in your space', 'عرض في مساحتك')}
                </button>

                {/* arrows */}
                <div className="absolute bottom-4 end-4 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevImg}
                    aria-label={t('Previous', 'السابق')}
                    className="flex h-10 w-10 items-center justify-center border border-[#171512]/20 bg-white/80 text-[#171512] backdrop-blur-sm transition-colors hover:bg-[#171512] hover:text-white"
                  >
                    <ChevronLeft size={16} strokeWidth={1.25} className={isAr ? 'rotate-180' : undefined} />
                  </button>
                  <button
                    type="button"
                    onClick={nextImg}
                    aria-label={t('Next', 'التالي')}
                    className="flex h-10 w-10 items-center justify-center border border-[#171512]/20 bg-white/80 text-[#171512] backdrop-blur-sm transition-colors hover:bg-[#171512] hover:text-white"
                  >
                    <ChevronRight size={16} strokeWidth={1.25} className={isAr ? 'rotate-180' : undefined} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ---- info ---- */}
          <div className="lg:col-span-5 xl:col-span-1">
            <Link
              to={`${lookBase(1)}/store/${store.key}`}
              data-testid="product-store-link"
              className={`${eyebrowCls(isAr, 'text-[10px]')} underline-offset-4 hover:underline`}
              style={{ color: OLIVE }}
            >
              {store.name[lang]}
            </Link>
            <h1
              data-testid="product-title"
              className={`mt-3 text-2xl font-extrabold md:text-[30px] ${
                isAr ? "font-['Alexandria',sans-serif] leading-[1.3] tracking-normal" : "font-['Outfit',sans-serif] uppercase leading-[1.08] tracking-tight"
              }`}
            >
              {name}
            </h1>
            <p className="mt-3 line-clamp-3 text-[14px] font-light leading-relaxed text-neutral-600">{p.description[lang]}</p>

            <button type="button" onClick={() => setTab('reviews')} className="mt-4 flex flex-wrap items-center gap-2.5" data-testid="product-rating">
              <Stars rating={p.rating} />
              <span className="text-[12.5px] font-bold">{p.rating}</span>
              <span className="text-[12px] text-neutral-500 underline-offset-4 hover:underline">
                ({isAr ? `${p.reviews} تقييم` : `${p.reviews} reviews`})
              </span>
            </button>

            {/* price */}
            <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1" data-testid="product-price">
              <span className="font-['Outfit',sans-serif] text-[30px] font-bold leading-none tabular-nums">{formatSAR(price)}</span>
              <span className={`text-[12px] font-medium text-neutral-500 ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.1em]'}`}>
                {t('SAR', 'ر.س')}
              </span>
              {oldPrice && (
                <>
                  <span className="text-[14px] text-neutral-400 line-through">{formatSAR(oldPrice)}</span>
                  <span className={`text-[10px] font-semibold uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.22em]'}`} style={{ color: RED }}>
                    {t(`Save ${savePct}%`, `وفّر ${savePct}%`)}
                  </span>
                </>
              )}
            </div>
            <p className="mt-2 text-[12px] text-neutral-500" data-testid="vat-note">
              {t('Price includes VAT', 'السعر شامل ضريبة القيمة المضافة')}
            </p>

            {/* availability */}
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1" data-testid="product-availability">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2" style={{ backgroundColor: AVAILABILITY_COLOR[p.availability] }} aria-hidden />
                <span className={`text-[11px] font-semibold ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]'}`}>
                  {AVAILABILITY_LABEL[p.availability][lang]}
                </span>
              </span>
              <span className="text-[12.5px] text-neutral-500">{p.leadTime[lang]}</span>
            </div>

            {/* colour */}
            <div className="mt-7 border-t pt-6" style={{ borderColor: HAIR }}>
              <p className={fieldLabel}>
                {t('Colour', 'اللون')}: <span className="font-normal text-neutral-600" data-testid="selected-color">{p.colors[color]?.name[lang]}</span>
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

            {/* size — sofas only */}
            {sizes.length > 0 && (
              <div className="mt-6" data-testid="size-options">
                <p className={fieldLabel}>{t('Size', 'المقاس')}:</p>
                <div className="mt-3 flex flex-wrap gap-2" role="radiogroup">
                  {sizes.map((s) => {
                    const on = s.seats === seats;
                    return (
                      <button
                        key={s.seats}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        data-testid={`size-${s.seats}`}
                        onClick={() => setSeats(s.seats)}
                        className={`border px-4 py-2.5 text-[12.5px] transition-colors ${
                          on ? 'border-[#171512] bg-[#171512] font-bold text-white' : 'bg-white font-medium hover:border-[#171512]'
                        }`}
                        style={on ? undefined : { borderColor: '#C9C2B4' }}
                      >
                        {s.label[lang]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* quantity */}
            <div className="mt-6 inline-flex h-11 items-stretch border" style={{ borderColor: '#C9C2B4' }} data-testid="qty-stepper">
              <button
                type="button"
                onClick={() => setQty((q) => clampQty(q - 1))}
                disabled={qty <= 1}
                aria-label={t('Decrease quantity', 'تقليل الكمية')}
                className="flex w-11 items-center justify-center transition-colors hover:bg-[#F6F3EC] disabled:opacity-30 disabled:hover:bg-transparent"
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
                className="w-12 bg-transparent text-center text-[14px] font-semibold focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => setQty((q) => clampQty(q + 1))}
                disabled={qty >= 10}
                aria-label={t('Increase quantity', 'زيادة الكمية')}
                className="flex w-11 items-center justify-center transition-colors hover:bg-[#F6F3EC] disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Plus size={14} strokeWidth={1.5} />
              </button>
            </div>

            {/* buy */}
            <button
              ref={buyRef}
              type="button"
              data-testid="add-to-cart"
              onClick={addToCart}
              aria-live="polite"
              className={`mt-5 inline-flex h-12 w-full items-center justify-center gap-2.5 px-6 ${primaryBtnCls(isAr)} ${added ? '!bg-[#5A6B4D]' : ''}`}
            >
              {added ? <Check size={15} strokeWidth={2} /> : <ShoppingCart size={15} strokeWidth={1.5} />}
              {added ? t('Added', 'أُضيف') : t('Add to Cart', 'أضف إلى السلة')}
            </button>
            <button
              type="button"
              data-testid="buy-now"
              onClick={buyNow}
              className={`mt-3 inline-flex h-12 w-full items-center justify-center border text-[12px] font-medium transition-colors hover:bg-[#171512] hover:text-white ${
                isAr ? 'tracking-normal' : 'uppercase tracking-[0.24em] text-[11px]'
              }`}
              style={{ borderColor: INK }}
            >
              {t('Buy Now', 'اشترِ الآن')}
            </button>

            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3 text-[12.5px]">
              <button
                type="button"
                data-testid="wishlist-toggle"
                onClick={() => wishlist.toggle(p.id)}
                aria-pressed={wishlist.has(p.id)}
                className={`inline-flex items-center gap-2 transition-colors hover:text-[#171512] ${wishlist.has(p.id) ? 'text-[#B03A2E]' : 'text-neutral-600'}`}
              >
                <Heart size={16} strokeWidth={1.5} className={wishlist.has(p.id) ? 'fill-[#B03A2E]' : 'fill-transparent'} />
                {wishlist.has(p.id) ? t('Saved', 'في المفضلة') : t('Add to wishlist', 'أضف للمفضلة')}
              </button>
              <button
                type="button"
                data-testid="share-open"
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-2 text-neutral-600 transition-colors hover:text-[#171512]"
              >
                <Share2 size={16} strokeWidth={1.5} />
                {t('Share', 'مشاركة')}
              </button>
            </div>
          </div>

          {/* ---- sidebar: the seller, the promises, the services ---- */}
          <aside className="grid gap-5 lg:col-span-12 lg:grid-cols-3 xl:col-span-1 xl:row-span-2 xl:grid-cols-1 xl:content-start" data-testid="product-sidebar">
            {/* sold by */}
            <div className={`${card} p-5`} style={{ borderColor: HAIR }} data-testid="sold-by">
              <p className="text-[12.5px] font-bold">{t('Sold by', 'يُباع بواسطة')}</p>
              <div className="mt-4 flex items-center gap-4">
                <span dir="ltr" className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#171512] font-['Outfit',sans-serif] text-[14px] font-bold text-white" aria-hidden>
                  {store.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[14.5px] font-bold">{store.name[lang]}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-neutral-500">
                    <Star size={12} strokeWidth={1.5} className="fill-[#D9A441] text-[#D9A441]" />
                    <span className="font-bold text-[#171512]">{store.rating}</span>
                    ({isAr ? `${formatSAR(store.products)} منتج` : `${formatSAR(store.products)} products`})
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-neutral-500">
                    <MapPin size={12} strokeWidth={1.5} />
                    {branch ? `${branch.district[lang]} · ${t('Jeddah', 'جدة')}` : t('Online store', 'متجر إلكتروني')}
                  </p>
                </div>
              </div>
              <Link
                to={`${lookBase(1)}/store/${store.key}`}
                className="mt-5 flex h-11 items-center justify-center gap-2 border text-[12px] font-medium transition-colors hover:bg-[#171512] hover:text-white"
                style={{ borderColor: INK }}
              >
                {t('Visit store', 'زيارة المتجر')}
                <ArrowRight size={13} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
              </Link>
            </div>

            {/* the promises, as a 2×2 */}
            <ul className={`${card} grid grid-cols-2`} style={{ borderColor: HAIR }} data-testid="delivery-block">
              {[
                { icon: Wrench, title: t('Installation', 'خدمة التركيب'), sub: t('On request', 'متاحة عند الطلب') },
                { icon: Truck, title: t('Free delivery', 'توصيل مجاني'), sub: t('In 1–3 days', 'من 1 - 3 أيام') },
                { icon: ShieldCheck, title: t('2-year warranty', 'ضمان سنتين'), sub: t('From the store', 'من المتجر') },
                { icon: RefreshCw, title: t('Easy returns', 'إرجاع سهل'), sub: t('Within 14 days', 'خلال 14 يوم') },
              ].map((row, i) => (
                <li
                  key={row.title}
                  className={`flex flex-col items-center px-3 py-5 text-center ${i % 2 === 0 ? 'border-e' : ''} ${i < 2 ? 'border-b' : ''}`}
                  style={{ borderColor: HAIR }}
                >
                  <row.icon size={22} strokeWidth={1.3} style={{ color: INK }} />
                  <p className="mt-3 text-[12.5px] font-bold">{row.title}</p>
                  <p className="mt-1 text-[11px] text-neutral-500">{row.sub}</p>
                </li>
              ))}
            </ul>

            {/* services that fit this product */}
            <div className={`${card} p-5`} style={{ borderColor: HAIR }} data-testid="fit-services">
              <p className={`text-[17px] font-extrabold ${isAr ? "font-['Alexandria',sans-serif]" : ''}`}>{t('Services for this piece', 'خدمات تناسب هذا المنتج')}</p>
              <p className="mt-1.5 text-[12px] text-neutral-500">{t('Finish the room with our vetted crews', 'أضف لمساتك الأخيرة مع خدماتنا الموثوقة')}</p>
              <ul className="mt-4 divide-y divide-[#E8E4DC]">
                {FIT_SERVICES.map((sv) => (
                  <li key={sv.name.en}>
                    <button
                      type="button"
                      data-testid="fit-service"
                      onClick={() => shell.openService(t(sv.name.en, sv.name.ar))}
                      className="group flex w-full items-center gap-3.5 py-3 text-start"
                    >
                      <img src={sv.img} alt="" loading="lazy" className="h-14 w-14 shrink-0 object-cover" style={{ backgroundColor: TILE }} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-bold">{t(sv.name.en, sv.name.ar)}</span>
                        <span className="mt-0.5 block truncate text-[11.5px] text-neutral-500">{t(sv.price.en, sv.price.ar)}</span>
                      </span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center border transition-colors group-hover:bg-[#171512] group-hover:text-white" style={{ borderColor: '#C9C2B4' }}>
                        <ArrowRight size={13} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ---- details as tabs, under the gallery and the info ---- */}
          <section className="lg:col-span-12 xl:col-span-2" data-testid="product-details">
            <Tabs
              testId="product-tabs"
              value={tab}
              onChange={setTab}
              items={[
                { key: 'description', label: t('Description', 'الوصف') },
                { key: 'specs', label: t('Specifications', 'المواصفات') },
                { key: 'reviews', label: t('Reviews', 'المراجعات'), count: p.reviews },
                { key: 'returns', label: t('Returns', 'سياسة الإرجاع') },
                { key: 'shipping', label: t('Shipping & installation', 'الشحن والتركيب') },
              ]}
            />
            <div className="py-7" data-testid={`product-tab-${tab}`}>
              {tab === 'description' && (
                <p className="max-w-3xl text-[15px] font-light leading-[1.9] text-neutral-700">{p.description[lang]}</p>
              )}
              {tab === 'specs' && (
                <dl className="grid max-w-3xl border sm:grid-cols-2" style={{ borderColor: HAIR }}>
                  {[
                    [t('Dimensions', 'الأبعاد'), p.dimensions[lang]],
                    [t('Materials', 'الخامات'), p.materials[lang]],
                    [t('Care', 'العناية'), p.care[lang]],
                    [t('Size', 'المقاس'), size ? size.label[lang] : '—'],
                    [t('Colour', 'اللون'), p.colors[color]?.name[lang] ?? '—'],
                    ['SKU', p.sku],
                  ].map(([k, v]) => (
                    <div key={k} className="border-b p-4 sm:odd:border-e" style={{ borderColor: HAIR }}>
                      <dt className={labelCls}>{k}</dt>
                      <dd className="mt-1.5 text-[13.5px] leading-relaxed" dir={k === 'SKU' ? 'ltr' : undefined}>{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {tab === 'reviews' && (
                <div className="grid gap-8 md:grid-cols-[200px_minmax(0,1fr)]">
                  <div>
                    <p className="font-['Outfit',sans-serif] text-[52px] font-bold leading-none">{p.rating}</p>
                    <div className="mt-2"><Stars rating={Math.round(p.rating)} /></div>
                    <p className="mt-2 text-[12px] text-neutral-500">{isAr ? `${p.reviews} تقييم` : `${p.reviews} reviews`}</p>
                  </div>
                  <ul>
                    {REVIEWS.slice(0, 3).map((r, i) => (
                      <li key={r.name.en} className={`py-5 ${i ? 'border-t' : 'pt-0'}`} style={{ borderColor: HAIR }}>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[13.5px] font-bold">{r.name[lang]} <span className="font-normal text-neutral-500">· {r.city[lang]}</span></span>
                          <Stars rating={r.rating} />
                        </div>
                        <p className="mt-2.5 text-[14px] font-light leading-relaxed text-neutral-700">{r.text[lang]}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tab === 'returns' && (
                <div className="max-w-3xl space-y-3 text-[14.5px] font-light leading-relaxed text-neutral-700">
                  <p>{t('Return within 14 days of delivery, in original condition, for a full refund.', 'يمكنك الإرجاع خلال 14 يوماً من التوصيل، بحالته الأصلية، واسترداد كامل المبلغ.')}</p>
                  <p>{t('Made-to-order sizes and fabrics are returnable only if they arrive faulty.', 'المقاسات والأقمشة المصنوعة حسب الطلب لا تُرجع إلا في حال وصولها بعيب.')}</p>
                  <Link to={`${lookBase(1)}/help/returns`} className="inline-block border-b pb-0.5 text-[12.5px] font-medium" style={{ borderColor: INK }}>
                    {t('Read the full policy', 'اقرأ السياسة كاملة')}
                  </Link>
                </div>
              )}
              {tab === 'shipping' && (
                <div className="max-w-3xl space-y-3 text-[14.5px] font-light leading-relaxed text-neutral-700">
                  <p>{p.leadTime[lang]} — {t('delivered anywhere in the Kingdom; free over 3,000 SAR.', 'التوصيل لكل مناطق المملكة، ومجاني فوق 3,000 ر.س.')}</p>
                  <p>{t('Our crews carry it in, assemble it and take the packaging away.', 'فرقنا تُدخل القطعة وتجمّعها وتأخذ مواد التغليف معها.')}</p>
                  <Link to={`${lookBase(1)}/help/shipping`} className="inline-block border-b pb-0.5 text-[12.5px] font-medium" style={{ borderColor: INK }}>
                    {t('Delivery details', 'تفاصيل التوصيل')}
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Similar pieces from other stores                             */}
      {/* ---------------------------------------------------------- */}
      {similar.length > 0 && (
        <section className="border-t py-16 md:py-20" style={{ borderColor: HAIR }} data-testid="related-products">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className={`text-2xl font-extrabold md:text-[28px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`}>
                  {t('Similar pieces from other stores', 'منتجات مشابهة من متاجر أخرى')}
                </h2>
                <p className="mt-2 text-[13.5px] font-light text-neutral-600">
                  {t('Compare the same look across the marketplace', 'اكتشف تصاميم مشابهة تناسب ذوقك من متاجر مختلفة')}
                </p>
              </div>
              <ViewMore label={t('View more', 'عرض المزيد')} to={searchPath(1, category ? { category: category.key } : undefined)} />
            </div>
            <div className={`mt-10 ${RAIL_MD} gap-5 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-12 lg:grid-cols-4`}>
              {similar.map((r) => (
                <div key={r.id} className="w-[68vw] shrink-0 snap-start md:w-auto">
                  <ProductCard p={r} testId="related-card" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------- */}
      {/* Complete the look                                            */}
      {/* ---------------------------------------------------------- */}
      {lookItems.length > 0 && (
        <section className="pb-20 md:pb-24" data-testid="complete-the-look">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <div className="grid overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)_minmax(0,1.3fr)]" style={{ backgroundColor: TILE }}>
              <div className="flex flex-col justify-center p-7 md:p-10">
                <p className={`text-[26px] font-extrabold leading-tight md:text-[30px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`}>
                  {t('Complete the look', 'أكمل إطلالة مساحتك')}
                </p>
                <p className="mt-3 text-[13px] font-light leading-relaxed text-neutral-600">
                  {t(`A curated set chosen to sit with ${p.name.en}`, `مجموعة مختارة بعناية لتنسجم مع ${p.name.ar}`)}
                </p>
                <button
                  type="button"
                  data-testid="shop-the-set"
                  onClick={() => {
                    lookItems.forEach((x) => shell.addToCart(x.id, t(x.name.en, x.name.ar)));
                    shell.toast(t('The set is in your cart.', 'تمت إضافة المجموعة إلى السلة.'));
                    shell.openCart();
                  }}
                  className={`mt-7 inline-flex items-center gap-2.5 self-start px-7 py-3.5 ${primaryBtnCls(isAr)}`}
                >
                  {t('Shop the set', 'تسوق المجموعة')}
                  <ArrowRight size={13} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                </button>
              </div>
              <ul className="grid grid-cols-2 gap-3 px-7 pb-7 sm:grid-cols-4 lg:px-0 lg:py-8">
                {lookItems.map((x) => (
                  <li key={x.id}>
                    <Link to={productPath(1, x.id)} className="group block bg-white p-2.5" data-testid="look-item">
                      <div className="aspect-square overflow-hidden">
                        <img src={tileImg(x.id, x.img)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <p className="mt-2.5 truncate text-[12.5px] font-bold">{x.name[lang]}</p>
                      <p className="mt-0.5 font-['Outfit',sans-serif] text-[12px] font-medium tabular-nums">
                        {formatSAR(x.price)} <span className="text-neutral-500">{t('SAR', 'ر.س')}</span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="relative hidden min-h-[260px] lg:block">
                <img src={gallery[1] ?? IMG.catHome} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              </div>
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
              {formatSAR(price)}{' '}
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

      <Lightbox
        images={gallery}
        index={Math.min(active, gallery.length - 1)}
        onIndex={setActive}
        open={zoom}
        onClose={() => setZoom(false)}
        caption={(i) => `${name} — ${i + 1} / ${gallery.length}`}
      />
      <TryAISheet open={aiOpen} onClose={() => setAiOpen(false)} p={p} />
      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} title={name} />
    </div>
  );
}
