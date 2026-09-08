/**
 * Look 3 — Product detail page.
 * Gallery plate with museum caption and thumbnail plates | store, Playfair
 * title, bronze stars, price, options, ink-filled Add to Cart, delivery box;
 * then the dark design-assistance band, a hairline details accordion beside
 * the "Sold by" card, and related pieces in the look's tile grid.
 */
import { useState, type Key, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, Share2, Sparkles, Truck, Wrench, ShieldCheck, Plus, Minus,
} from 'lucide-react';
import {
  CATEGORIES, AVAILABILITY_LABEL, findProduct, relatedProducts, storeOf,
  formatSAR, lookBase, searchPath,
  type CatalogProduct, type Lang, type LookStore,
} from '../lookShared';
import {
  ALT, HAIR, INK, MUTED, BRONZE, DARK, CREAM, GOLDISH, CONTAINER, PLAYFAIR, DRAWER_EASE,
  serif, headingLeading, eyebrowCls, capsCls, captionCls, pad2, isCutout,
  useLook, useFlash, Reveal, SectionHeader, HairButton, BronzeLink, Stars, ProductTile, Crumbs,
} from './ui';

type Translate = (en: string, ar: string) => string;

const clampQty = (n: number) => Math.min(10, Math.max(1, Math.round(n) || 1));

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

/** Main plate crossfades between images; thumbnails below are small museum plates. */
function Gallery({ p, lang, t }: { p: CatalogProduct; lang: Lang; t: Translate }) {
  const [active, setActive] = useState(0);
  const name = p.name[lang];
  const onSale = !!p.oldPrice;

  return (
    <div>
      <div
        data-testid="gallery-main"
        className="relative aspect-square overflow-hidden border bg-white"
        style={{ borderColor: HAIR }}
      >
        {p.gallery.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt={i === active ? name : ''}
            aria-hidden={i !== active}
            initial={false}
            animate={{ opacity: i === active ? 1 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className={`absolute inset-0 h-full w-full ${isCutout(src) ? 'object-contain p-8 md:p-12' : 'object-cover'}`}
            style={{ pointerEvents: i === active ? 'auto' : 'none' }}
          />
        ))}
        {(onSale || p.isNew) && (
          <div
            className={`pointer-events-none absolute start-4 top-4 z-10 flex flex-col gap-1 ${captionCls(lang)}`}
            style={{ color: BRONZE }}
          >
            {onSale && <span>{t('Sale', 'تخفيض')}</span>}
            {p.isNew && <span>{t('New', 'جديد')}</span>}
          </div>
        )}
      </div>

      {/* Museum caption — plate number and what the plate shows */}
      <div className="mt-3 flex items-center justify-between">
        <span dir="ltr" className={`${PLAYFAIR} text-[12px] tracking-[0.2em]`} style={{ color: INK }}>
          {pad2(active + 1)} <span style={{ color: MUTED }}>/ {pad2(p.gallery.length)}</span>
        </span>
        <span className={captionCls(lang)} style={{ color: MUTED }}>
          {isCutout(p.gallery[active]) ? t('Studio plate', 'لقطة استوديو') : t('In the room', 'في المكان')}
        </span>
      </div>

      <div className="scrollbar-hide mt-4 flex gap-3 overflow-x-auto">
        {p.gallery.map((src, i) => (
          <button
            key={src}
            type="button"
            data-testid="gallery-thumb"
            aria-label={`${t('Image', 'صورة')} ${i + 1}`}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className="h-20 w-20 shrink-0 cursor-pointer overflow-hidden border bg-white transition-colors duration-300"
            style={{ borderColor: i === active ? INK : HAIR }}
          >
            <img
              src={src}
              alt=""
              className={`h-full w-full ${isCutout(src) ? 'object-contain p-2' : 'object-cover'}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Details accordion                                                   */
/* ------------------------------------------------------------------ */

function Accordion({ items, lang }: { items: { title: string; body: string }[]; lang: Lang }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t" style={{ borderColor: HAIR }} data-testid="product-details">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.title} className="border-b" style={{ borderColor: HAIR }}>
            <button
              type="button"
              data-testid="detail-toggle"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full cursor-pointer items-center gap-6 py-6 text-start"
            >
              <span
                aria-hidden
                dir="ltr"
                className={`${PLAYFAIR} w-10 shrink-0 select-none text-2xl leading-none text-[#2A241C]/20`}
              >
                {pad2(i + 1)}
              </span>
              <span
                className={`${serif(lang)} flex-1 text-xl ${headingLeading(lang, 'leading-snug')}`}
                style={{ color: INK }}
              >
                {it.title}
              </span>
              <Plus
                size={15}
                strokeWidth={1}
                className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                style={{ color: BRONZE }}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: DRAWER_EASE }}
                  className="overflow-hidden"
                >
                  <p
                    className={`pb-7 ps-16 text-[14.5px] font-light leading-relaxed ${lang === 'ar' ? 'tracking-normal' : ''}`}
                    style={{ color: MUTED }}
                  >
                    {it.body}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sold by                                                             */
/* ------------------------------------------------------------------ */

function SoldBy({ store, lang, t }: { store: LookStore; lang: Lang; t: Translate }) {
  return (
    <div className="border p-8 md:p-10" style={{ borderColor: HAIR, backgroundColor: ALT }} data-testid="sold-by">
      <p className={eyebrowCls(lang)} style={{ color: MUTED }}>
        {t('Sold By', 'يُباع بواسطة')}
      </p>
      <div className="mt-6 flex items-start gap-5">
        <span
          dir="ltr"
          aria-hidden
          className={`${PLAYFAIR} flex h-12 w-12 shrink-0 items-center justify-center border text-[15px] tracking-[0.12em]`}
          style={{ borderColor: HAIR, color: BRONZE }}
        >
          {store.initials}
        </span>
        <div className="min-w-0">
          <h3 className={`${serif(lang)} text-2xl ${headingLeading(lang, 'leading-snug')}`} style={{ color: INK }}>
            {store.name[lang]}
          </h3>
          <p className={`mt-1 text-[13px] font-light ${lang === 'ar' ? 'tracking-normal' : ''}`} style={{ color: MUTED }}>
            {store.specialty[lang]}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Stars rating={store.rating} />
            <span dir="ltr" className="text-[11px] tracking-[0.08em]" style={{ color: MUTED }}>
              {store.rating.toFixed(1)}
            </span>
          </div>
          <p className={`mt-2 ${captionCls(lang)}`} style={{ color: MUTED }}>
            {lang === 'ar' ? `${formatSAR(store.products)} منتج` : `${formatSAR(store.products)} products`}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <BronzeLink
          lang={lang}
          testId="visit-store"
          to={searchPath(3, { store: store.key })}
          label={t('Visit Store', 'زيارة المتجر')}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Delivery & installation                                             */
/* ------------------------------------------------------------------ */

function DeliveryLine({ icon, children }: { icon: ReactNode; children: ReactNode; key?: Key }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <span className="shrink-0" style={{ color: BRONZE }}>{icon}</span>
      <span className="text-[13px] font-light leading-relaxed" style={{ color: INK }}>{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function ProductView({ p, lang, t }: { p: CatalogProduct; lang: Lang; t: Translate; key?: Key }) {
  const store = storeOf(p.store);
  const category = CATEGORIES.find((c) => c.key === p.category);

  const [color, setColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);
  const [added, flashAdded] = useFlash();
  const [copied, flashCopied] = useFlash(2000);

  const savePct = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const availabilityDot = { in_stock: INK, low_stock: BRONZE, made_to_order: MUTED }[p.availability];

  const share = () => {
    const url = window.location.href;
    const nav = navigator as Navigator & { share?: (d: { title: string; url: string }) => Promise<void> };
    if (typeof nav.share === 'function') {
      nav.share({ title: p.name[lang], url }).catch(() => undefined);
      return;
    }
    navigator.clipboard?.writeText(url).then(flashCopied).catch(() => undefined);
  };

  const details = [
    { title: t('Description', 'الوصف'), body: p.description[lang] },
    { title: t('Dimensions', 'الأبعاد'), body: p.dimensions[lang] },
    { title: t('Materials', 'الخامات'), body: p.materials[lang] },
    { title: t('Care', 'العناية'), body: p.care[lang] },
  ];

  return (
    <div data-testid="product-page" className="pt-[72px]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`${CONTAINER} pt-10 md:pt-12`}
      >
        <Crumbs
          lang={lang}
          align="start"
          items={[
            { label: t('Home', 'الرئيسية'), to: lookBase(3) },
            { label: t('Shop', 'المتجر'), to: searchPath(3) },
            ...(category ? [{ label: category[lang], to: searchPath(3, { category: category.key }) }] : []),
            { label: p.name[lang] },
          ]}
        />

        <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <Gallery p={p} lang={lang} t={t} />

          {/* Info */}
          <div className="flex flex-col">
            <Link
              to={searchPath(3, { store: p.store })}
              data-testid="product-store"
              className={`self-start transition-colors duration-300 hover:text-[#8A6D4F] ${captionCls(lang)}`}
              style={{ color: MUTED }}
            >
              {store.name[lang]}
            </Link>
            <h1
              data-testid="product-title"
              className={`${serif(lang)} mt-3 text-3xl md:text-[2.5rem] ${headingLeading(lang, 'leading-[1.15]')}`}
              style={{ color: INK }}
            >
              {p.name[lang]}
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <Stars rating={p.rating} />
              <span
                className={`text-[12px] font-light ${lang === 'ar' ? 'tracking-normal' : 'tracking-[0.04em]'}`}
                style={{ color: MUTED }}
              >
                ({p.reviews} {t(p.reviews === 1 ? 'review' : 'reviews', 'تقييم')})
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span data-testid="product-price" className={`${PLAYFAIR} text-3xl md:text-[2.1rem]`} style={{ color: INK }}>
                {formatSAR(p.price)}
              </span>
              <span
                className={lang === 'ar' ? 'text-[12px] tracking-normal' : 'text-[11px] tracking-[0.15em]'}
                style={{ color: MUTED }}
              >
                {t('SAR', 'ر.س')}
              </span>
              {p.oldPrice && (
                <>
                  <span className="text-sm line-through" style={{ color: MUTED }}>
                    {formatSAR(p.oldPrice)}
                  </span>
                  <span className={captionCls(lang)} style={{ color: BRONZE }}>
                    {lang === 'ar' ? `وفّر ${savePct}%` : `Save ${savePct}%`}
                  </span>
                </>
              )}
            </div>
            <p className={`mt-2 ${captionCls(lang)}`} style={{ color: MUTED }}>
              {t('SKU', 'رمز المنتج')} <span dir="ltr">{p.sku}</span>
            </p>

            <div
              className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] font-light"
              data-testid="availability"
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: availabilityDot }} />
              <span style={{ color: INK }}>{AVAILABILITY_LABEL[p.availability][lang]}</span>
              <span style={{ color: MUTED }}>· {p.leadTime[lang]}</span>
            </div>

            <p
              className={`mt-6 text-[15px] font-light leading-relaxed ${lang === 'ar' ? 'tracking-normal' : ''}`}
              style={{ color: MUTED }}
            >
              {p.description[lang]}
            </p>

            {/* Colour */}
            <div className="mt-8 border-t pt-7" style={{ borderColor: HAIR }}>
              <p className={eyebrowCls(lang)} style={{ color: INK }}>
                {t('Colour', 'اللون')}
                <span style={{ color: MUTED }}> — {p.colors[color]?.name[lang]}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {p.colors.map((c, i) => (
                  <button
                    key={c.name.en}
                    type="button"
                    data-testid="color-swatch"
                    aria-label={c.name[lang]}
                    aria-pressed={i === color}
                    title={c.name[lang]}
                    onClick={() => setColor(i)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center border transition-colors duration-300"
                    style={{ borderColor: i === color ? BRONZE : HAIR }}
                  >
                    <span
                      className="block h-6 w-6"
                      style={{ backgroundColor: c.hex, boxShadow: 'inset 0 0 0 1px rgba(42,36,28,0.08)' }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="mt-7">
              <p className={eyebrowCls(lang)} style={{ color: INK }}>
                {t('Quantity', 'الكمية')}
              </p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <div
                  dir="ltr"
                  className="flex h-[50px] shrink-0 items-center self-start border sm:self-auto"
                  style={{ borderColor: 'rgba(42,36,28,0.4)', color: INK }}
                >
                  <button
                    type="button"
                    aria-label={t('Decrease quantity', 'تقليل الكمية')}
                    onClick={() => setQty((q) => clampQty(q - 1))}
                    className="flex h-full w-11 cursor-pointer items-center justify-center transition-opacity duration-300 hover:opacity-60 disabled:opacity-30"
                    disabled={qty <= 1}
                  >
                    <Minus size={13} strokeWidth={1.25} />
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
                    className={`${PLAYFAIR} h-full w-12 bg-transparent text-center text-[15px] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  />
                  <button
                    type="button"
                    aria-label={t('Increase quantity', 'زيادة الكمية')}
                    onClick={() => setQty((q) => clampQty(q + 1))}
                    className="flex h-full w-11 cursor-pointer items-center justify-center transition-opacity duration-300 hover:opacity-60 disabled:opacity-30"
                    disabled={qty >= 10}
                  >
                    <Plus size={13} strokeWidth={1.25} />
                  </button>
                </div>
                <HairButton
                  lang={lang}
                  tone="fill"
                  size="block"
                  testId="add-to-cart"
                  className="flex-1"
                  onClick={flashAdded}
                  label={added ? t('Added', 'أُضيف') : t('Add to Cart', 'أضف إلى السلة')}
                />
              </div>

              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  data-testid="try-with-ai"
                  className={`inline-flex h-[50px] flex-1 cursor-pointer items-center justify-center gap-2 border border-[#8A6D4F]/50 text-[#8A6D4F] transition-colors duration-300 hover:border-[#8A6D4F] hover:bg-[#8A6D4F] hover:text-[#EFE9DD] ${capsCls(lang)}`}
                >
                  <Sparkles size={13} strokeWidth={1.25} />
                  {t('Try with AI', 'جرب AI')}
                </button>
                <button
                  type="button"
                  data-testid="wishlist"
                  aria-label={t('Add to wishlist', 'أضف إلى المفضلة')}
                  aria-pressed={saved}
                  onClick={() => setSaved((s) => !s)}
                  className="flex h-[50px] w-[50px] shrink-0 cursor-pointer items-center justify-center border transition-colors duration-300 hover:border-[#2A241C]"
                  style={{ borderColor: saved ? BRONZE : HAIR, color: INK }}
                >
                  <Heart size={16} strokeWidth={1.25} className={saved ? 'fill-[#8A6D4F] text-[#8A6D4F]' : ''} />
                </button>
                <button
                  type="button"
                  data-testid="share"
                  aria-label={t('Share', 'مشاركة')}
                  onClick={share}
                  className="flex h-[50px] w-[50px] shrink-0 cursor-pointer items-center justify-center border transition-colors duration-300 hover:border-[#2A241C]"
                  style={{ borderColor: HAIR, color: INK }}
                >
                  <Share2 size={16} strokeWidth={1.25} />
                </button>
              </div>
              <div className="h-5">
                <AnimatePresence>
                  {copied && (
                    <motion.p
                      key="copied"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`mt-2 ${captionCls(lang)}`}
                      style={{ color: BRONZE }}
                    >
                      {t('Link copied', 'تم نسخ الرابط')}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Delivery & installation */}
            <div className="mt-6 divide-y border" style={{ borderColor: HAIR }} data-testid="delivery-info">
              {[
                { icon: <Truck size={18} strokeWidth={1} />, text: p.leadTime[lang] },
                {
                  icon: <Wrench size={18} strokeWidth={1} />,
                  text: t('Professional installation by Diyar crews', 'تركيب احترافي بفرق ديار'),
                },
                {
                  icon: <ShieldCheck size={18} strokeWidth={1} />,
                  text: t('14-day returns · Frame warranty', 'إرجاع خلال 14 يوماً · ضمان الهيكل'),
                },
              ].map((l) => (
                <DeliveryLine key={l.text} icon={l.icon}>{l.text}</DeliveryLine>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Design assistance — the dark band */}
      <section className="mt-20 py-16 md:mt-24" style={{ backgroundColor: DARK }} data-testid="design-cta">
        <Reveal className={`${CONTAINER} flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-start`}>
          <div className="flex flex-col items-center md:items-start">
            <span className="h-px w-10" style={{ backgroundColor: GOLDISH }} />
            <p className={`mt-5 text-[#EFE9DD]/50 ${eyebrowCls(lang)}`}>
              {t('Design Assistance', 'مساعدة التصميم')}
            </p>
            <h2
              className={`${serif(lang)} mt-3 max-w-xl text-2xl md:text-3xl ${headingLeading(lang, 'leading-[1.2]')}`}
              style={{ color: CREAM }}
            >
              {t('Not sure it fits? Book a free design session', 'غير متأكد من المقاس؟ احجز جلسة تصميم مجانية')}
            </h2>
          </div>
          <HairButton lang={lang} tone="cream" className="shrink-0" label={t('Book a Session', 'احجز جلسة')} />
        </Reveal>
      </section>

      {/* Details + Sold by */}
      <section className={`${CONTAINER} py-20 md:py-24`}>
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <Reveal>
            <p className={eyebrowCls(lang)} style={{ color: MUTED }}>
              {t('Details', 'التفاصيل')}
            </p>
            <div className="mt-5">
              <Accordion items={details} lang={lang} />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <SoldBy store={store} lang={lang} t={t} />
          </Reveal>
        </div>
      </section>

      {/* Related */}
      <section className="py-28" style={{ backgroundColor: ALT }} data-testid="related-products">
        <div className={CONTAINER}>
          <SectionHeader lang={lang} eyebrow={t('Related Pieces', 'قطع ذات صلة')}>
            {lang === 'ar' ? <>قد يعجبك <em>أيضاً</em></> : <>You May Also <em>Like</em></>}
          </SectionHeader>
          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 md:mt-20 md:grid-cols-4 md:gap-x-8">
            {relatedProducts(p).map((r, i) => (
              <Reveal key={r.id} delay={(i % 4) * 0.06}>
                <ProductTile p={r} lang={lang} testId="related-card" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function NotFound({ lang, t }: { lang: Lang; t: Translate }) {
  return (
    <div data-testid="product-page" className="pt-[72px]">
      <div
        data-testid="product-not-found"
        className={`${CONTAINER} flex min-h-[60vh] flex-col items-center justify-center py-28 text-center`}
      >
        <span className="h-px w-10" style={{ backgroundColor: BRONZE }} />
        <p className={`mt-6 ${eyebrowCls(lang)}`} style={{ color: MUTED }}>
          {t('Catalogue', 'الفهرس')}
        </p>
        <h1
          className={`${serif(lang)} mt-5 text-4xl md:text-5xl ${headingLeading(lang, 'leading-[1.12]')}`}
          style={{ color: INK }}
        >
          {t('Product Not Found', 'المنتج غير موجود')}
        </h1>
        <p className="mt-4 max-w-sm text-[15px] font-light leading-relaxed" style={{ color: MUTED }}>
          {t('This piece may have been sold or moved to another wall.', 'ربما بيعت هذه القطعة أو نُقلت إلى جدار آخر.')}
        </p>
        <div className="mt-10">
          <HairButton lang={lang} to={searchPath(3)} label={t('Browse the Shop', 'تصفح المتجر')} />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { lang, t } = useLook();
  const { id } = useParams();
  const p = findProduct(id);
  if (!p) return <NotFound lang={lang} t={t} />;
  /* Keyed by id so options, gallery and confirmations reset between products. */
  return <ProductView key={p.id} p={p} lang={lang} t={t} />;
}
