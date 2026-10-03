/**
 * Look 1 — a store's own page.
 *
 * The marketplace argument: every product belongs to a seller, and the seller
 * has a face. The identity sits inside the cover, printed on the photograph the
 * way the service pages do it — ink type under a cover band left the name
 * stranded on an empty cream strip.
 *
 * Below the numbers the page splits — products, services, about, reviews —
 * with the tab in the URL (?tab=services) so each can be linked to. Products
 * open on the store's categories (the rooms its pieces are for), which filter
 * the collection in place.
 */
import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, MapPin, Star, Package, Truck, RefreshCw, ShieldCheck } from 'lucide-react';
import {
  ALL_STORES,
  CATALOG,
  STORE_LOCATIONS,
  formatSAR,
  lookBase,
  searchPath,
  storeOf,
  REVIEWS,
  ROOMS,
  type RoomKey,
  type StoreKey,
} from '../lookShared';
import { Breadcrumb, HAIR, INK, MUTED, OLIVE, ProductCard, TILE, primaryBtnCls, useLook, Stars, StoreMark } from './ui';
import { RatingInput, ServiceOffers, Tabs, TextArea } from './kit';
import { Sheet } from './Sheet';
import { useShell } from './shellContext';
import { STORE_SERVICES } from './data';
import { motion } from 'motion/react';

type StoreTab = 'products' | 'services' | 'about' | 'reviews';

export default function StorePage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { key = '' } = useParams();
  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]';

  const known = ALL_STORES.some((s) => s.key === key);
  const store = storeOf(key as StoreKey);
  const products = CATALOG.filter((p) => p.store === store.key);
  const branches = STORE_LOCATIONS.filter((l) => l.store === store.key);
  const [sp, setSp] = useSearchParams();
  const rawTab = sp.get('tab');
  const tab: StoreTab = rawTab === 'services' || rawTab === 'about' || rawTab === 'reviews' ? rawTab : 'products';
  const setTab = (k: StoreTab) => setSp(k === 'products' ? {} : { tab: k }, { replace: true });

  /* categories: the rooms this store's pieces are for, with real counts */
  const [room, setRoom] = useState<RoomKey | 'all'>('all');
  const cats = ROOMS.map((r) => ({ ...r, n: products.filter((p) => p.room === r.key).length })).filter((r) => r.n > 0);
  const shown = room === 'all' ? products : products.filter((p) => p.room === room);
  const services = STORE_SERVICES[store.key] ?? [];

  if (!known) {
    return (
      <main className="pt-[72px]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 text-center md:px-10">
          <p className={`text-[11.5px] ${caps}`} style={{ color: MUTED }}>{t('Not found', 'غير موجود')}</p>
          <p className="mt-3 text-[15px] font-light" style={{ color: '#4A443C' }}>
            {t('That store is not in the marketplace.', 'هذا المتجر غير موجود في المنصة.')}
          </p>
          <Link to={searchPath(1)} className={`mt-8 inline-block px-10 py-4 ${primaryBtnCls(isAr)}`}>
            {t('Browse the Catalogue', 'تصفّح الكتالوج')}
          </Link>
        </div>
      </main>
    );
  }

  const stats = [
    { icon: Package, label: t('Products', 'المنتجات'), value: formatSAR(store.products) },
    { icon: Star, label: t('Rating', 'التقييم'), value: String(store.rating) },
    {
      icon: MapPin,
      label: t('Branches', 'الفروع'),
      value: branches.length ? `${branches.length} · ${t('Jeddah', 'جدة')}` : t('Online', 'أونلاين'),
    },
  ];

  return (
    <main className="pt-[72px]">
      {/* cover carries the identity */}
      <div className="relative min-h-[360px] w-full overflow-hidden md:h-[54vh]" style={{ backgroundColor: INK }}>
        <img src={store.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />

        <div className="relative flex h-full items-end">
          <div className="mx-auto w-full max-w-[1400px] px-6 pb-10 pt-28 md:px-10 md:pb-14">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div className="min-w-0">
                <div className="flex items-center gap-4">
                  {store.mark ? (
                    <StoreMark store={store} className="h-16 w-16 md:h-[72px] md:w-[72px]" />
                  ) : (
                    <span
                      dir="ltr"
                      aria-hidden
                      className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/70 font-['Outfit',sans-serif] text-[16px] font-bold tracking-[0.06em] text-white"
                    >
                      {store.initials}
                    </span>
                  )}
                  <p className={`text-[11.5px] text-white/85 ${caps}`}>{t('Marketplace store', 'متجر في المنصة')}</p>
                </div>

                <h1
                  className={`mt-5 font-extrabold text-white ${
                    isAr
                      ? "font-['Alexandria',sans-serif] text-3xl leading-[1.15] tracking-normal md:text-5xl"
                      : "font-['Outfit',sans-serif] text-3xl uppercase leading-[1.02] tracking-tight md:text-5xl"
                  }`}
                >
                  {t(store.name.en, store.name.ar)}
                </h1>
                <p className="mt-4 max-w-lg text-[15px] font-light leading-relaxed text-white/80">
                  {t(store.specialty.en, store.specialty.ar)}
                </p>
              </div>

              <Link to={searchPath(1, { store: store.key })} className={`shrink-0 px-9 py-4 ${primaryBtnCls(isAr)} !bg-white !text-[#171512] hover:!bg-[#5A6B4D] hover:!text-white`}>
                {t('Shop the Store', 'تسوّق المتجر')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* the numbers, as a band rather than a sentence */}
      <div className="border-b" style={{ borderColor: HAIR, backgroundColor: TILE }}>
        <ul className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-[#E8E4DC] px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:px-10" style={{ borderColor: HAIR }}>
          {stats.map((s) => (
            <li key={s.label} className="flex items-center gap-4 py-6 sm:justify-center">
              <s.icon size={18} strokeWidth={1.4} style={{ color: OLIVE }} />
              <span>
                <span className={`block text-[11px] ${caps}`} style={{ color: MUTED }}>{s.label}</span>
                <span className="mt-1 block font-['Outfit',sans-serif] text-[17px] font-bold tabular-nums" style={{ color: INK }}>
                  {s.value}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="pt-8">
          <Tabs
            testId="store-tabs"
            value={tab}
            onChange={setTab}
            items={[
              { key: 'products', label: t('Products', 'المنتجات'), count: products.length },
              { key: 'services', label: t('Services', 'الخدمات'), count: services.length },
              { key: 'about', label: t('About', 'عن المتجر') },
              { key: 'reviews', label: t('Reviews', 'التقييمات'), count: REVIEWS.length },
            ]}
          />
        </div>

        {tab === 'about' && <About storeName={t(store.name.en, store.name.ar)} specialty={t(store.specialty.en, store.specialty.ar)} />}
        {tab === 'reviews' && <StoreReviews rating={store.rating} />}
        {tab === 'services' && <StoreServices storeName={t(store.name.en, store.name.ar)} list={services} />}

        {/* branches */}
        {tab === 'about' && branches.length > 0 && (
          <section className="border-t py-12 md:py-14" style={{ borderColor: HAIR }}>
            <p className={`text-[11px] ${caps}`} style={{ color: MUTED }}>{t('Where to find them', 'أين تجدهم')}</p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((b) => (
                <li key={b.id} className="flex items-start gap-4 border p-5" style={{ borderColor: HAIR }}>
                  <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: OLIVE }} />
                  <span>
                    <span className="block text-[15px] font-bold">{t(b.district.en, b.district.ar)}</span>
                    <span className="mt-1.5 block text-[12px] font-light tabular-nums" style={{ color: MUTED }} dir="ltr">
                      {String(b.opens).padStart(2, '0')}:00 – {String(b.closes % 24).padStart(2, '0')}:00
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* catalogue */}
        {tab === 'products' && (
        <section className="py-12 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={`text-[11px] ${caps}`} style={{ color: MUTED }}>{t('From this store', 'من هذا المتجر')}</p>
              <h2
                className={`mt-2.5 font-extrabold ${
                  isAr ? "font-['Alexandria',sans-serif] text-2xl tracking-normal md:text-3xl" : "font-['Outfit',sans-serif] text-2xl uppercase tracking-tight md:text-3xl"
                }`}
              >
                {t('The Collection', 'التشكيلة')}
              </h2>
            </div>
            <Link
              to={searchPath(1, { store: store.key })}
              className={`inline-flex items-center gap-2.5 border-b pb-1.5 text-[11.5px] font-medium transition-colors hover:text-[#5A6B4D] ${caps}`}
              style={{ borderColor: INK }}
            >
              {t('See All', 'عرض الكل')}
              <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
            </Link>
          </div>

          {cats.length > 0 && (
            <div className="mt-8" data-testid="store-categories">
              <ul className="scrollbar-hide -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:px-0">
                {[{ key: 'all' as const, en: 'Everything', ar: 'الكل', n: products.length }, ...cats].map((c) => {
                  const on = room === c.key;
                  return (
                    <li key={c.key} className="shrink-0">
                      <button
                        type="button"
                        aria-pressed={on}
                        data-testid={`store-cat-${c.key}`}
                        onClick={() => setRoom(c.key)}
                        className={`flex items-center gap-2.5 border px-4 py-2.5 text-[14px] transition-colors ${
                          on ? 'border-[#171512] bg-[#171512] font-bold text-white' : 'bg-white font-medium hover:border-[#171512]'
                        }`}
                        style={on ? undefined : { borderColor: '#C9C2B4' }}
                      >
                        {t(c.en, c.ar)}
                        <span className={`font-['Outfit',sans-serif] text-[11px] tabular-nums ${on ? 'text-white/70' : ''}`} style={on ? undefined : { color: MUTED }}>
                          {c.n}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {products.length === 0 ? (
            <p className="mt-10 text-[15px] font-light" style={{ color: '#4A443C' }}>
              {t('This store has no products listed yet.', 'لا توجد منتجات معروضة لهذا المتجر بعد.')}
            </p>
          ) : (
            <motion.div
              key={room}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-4"
            >
              {shown.map((p) => (
                <ProductCard key={p.id} p={p} testId="store-product-card" />
              ))}
            </motion.div>
          )}
        </section>
        )}

        {/* other stores */}
        <section className="border-t py-12 md:py-14" style={{ borderColor: HAIR }}>
          <p className={`text-[11px] ${caps}`} style={{ color: MUTED }}>{t('Also on Diyar', 'أيضاً على ديار')}</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ALL_STORES.filter((s) => s.key !== store.key).map((s) => (
              <li key={s.key}>
                <Link
                  to={`${lookBase(1)}/store/${s.key}`}
                  className="group flex items-center gap-4 border p-4 transition-colors hover:border-[#171512]"
                  style={{ borderColor: HAIR }}
                >
                  <StoreMark store={s} className={`h-11 w-11 text-[14px] ${s.mark ? 'border border-[#E8E4DC]' : ''}`} />
                  <span className="min-w-0">
                    <span className="block truncate text-[14.5px] font-bold">{t(s.name.en, s.name.ar)}</span>
                    <span className="mt-1 block truncate text-[13px] font-light" style={{ color: MUTED }}>
                      {t(s.specialty.en, s.specialty.ar)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="pb-16">
          <Breadcrumb
            items={[
              { label: t('Home', 'الرئيسية'), to: lookBase(1) },
              { label: t('Stores', 'المتاجر'), to: `${lookBase(1)}/stores` },
              { label: t(store.name.en, store.name.ar) },
            ]}
          />
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */
function About({ storeName, specialty }: { storeName: string; specialty: string }) {
  const { lang, t } = useLook();
  const caps = lang === 'ar' ? 'tracking-normal' : 'uppercase tracking-[0.2em]';
  const policies = [
    { icon: Truck, title: t('Delivery', 'التوصيل'), body: t('Kingdom-wide in 2–5 days; free over 3,000 SAR.', 'لكل المملكة خلال 2–5 أيام؛ مجاني فوق 3,000 ر.س.') },
    { icon: RefreshCw, title: t('Returns', 'الاسترجاع'), body: t('Fourteen days, in original condition.', 'أربعة عشر يوماً، بالحالة الأصلية.') },
    { icon: ShieldCheck, title: t('Warranty', 'الضمان'), body: t('Two years on frames and mechanisms.', 'سنتان على الهياكل والآليات.') },
  ];
  return (
    <section className="grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-16" data-testid="store-about">
      <div className="lg:col-span-7">
        <p className={`text-[11px] ${caps}`} style={{ color: MUTED }}>{t('The store', 'عن المتجر')}</p>
        <p className="mt-5 text-[19px] font-light leading-relaxed md:text-[22px]" style={{ color: INK }}>
          {t(
            `${storeName} has sold on Diyar since 2019 — ${specialty.toLowerCase()}, made and finished in the Kingdom, delivered and installed by Diyar crews.`,
            `يبيع ${storeName} على ديار منذ 2019 — ${specialty}، تُصنع وتُشطَّب في المملكة، وتوصلها وتركبها فرق ديار.`,
          )}
        </p>
        <p className="mt-5 text-[15px] font-light leading-relaxed" style={{ color: '#4A443C' }}>
          {t(
            'Every piece is checked at our warehouse before it leaves, and every order is covered by the Diyar guarantee — whoever the seller is.',
            'تُفحص كل قطعة في مستودعنا قبل خروجها، وكل طلب مشمول بضمان ديار — أياً كان البائع.',
          )}
        </p>
      </div>
      <ul className="border lg:col-span-5" style={{ borderColor: HAIR }}>
        {policies.map((pl, i) => (
          <li key={pl.title} className={`flex items-start gap-4 p-5 ${i ? 'border-t' : ''}`} style={{ borderColor: HAIR }}>
            <pl.icon size={18} strokeWidth={1.4} className="mt-0.5 shrink-0" style={{ color: OLIVE }} />
            <span>
              <span className="block text-[15px] font-bold">{pl.title}</span>
              <span className="mt-1 block text-[14.5px] font-light" style={{ color: '#4A443C' }}>{pl.body}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */
function StoreReviews({ rating }: { rating: number }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]';
  const { user, openAuth, toast } = useShell();
  const [writing, setWriting] = useState(false);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState('');
  const total = 128;
  const split = [78, 16, 4, 1, 1];

  return (
    <section className="grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-16" data-testid="store-reviews">
      <div className="lg:col-span-4">
        <p className="font-['Outfit',sans-serif] text-[64px] font-bold leading-none tabular-nums">{rating.toFixed(1)}</p>
        <div className="mt-3"><Stars rating={Math.round(rating)} /></div>
        <p className="mt-2 text-[14px]" style={{ color: MUTED }}>{t(`${total} reviews`, `${total} تقييماً`)}</p>
        <ul className="mt-8 grid gap-2.5">
          {split.map((pct, i) => (
            <li key={i} className="flex items-center gap-3 text-[13px]" style={{ color: MUTED }}>
              <span className="w-3 font-['Outfit',sans-serif] tabular-nums">{5 - i}</span>
              <span className="h-1.5 flex-1" style={{ backgroundColor: HAIR }}>
                <span className="block h-full" style={{ width: `${pct}%`, backgroundColor: OLIVE }} />
              </span>
              <span className="w-8 text-end font-['Outfit',sans-serif] tabular-nums">{pct}%</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          data-testid="store-review-write"
          onClick={() => (user ? setWriting(true) : openAuth())}
          className={`mt-8 w-full py-4 ${primaryBtnCls(isAr)}`}
        >
          {t('Review this store', 'قيّم هذا المتجر')}
        </button>
      </div>
      <ul className="lg:col-span-8">
        {REVIEWS.map((r, i) => (
          <li key={r.name.en} className={`py-7 ${i ? 'border-t' : 'pt-0'}`} style={{ borderColor: HAIR }}>
            <div className="flex items-center justify-between gap-4">
              <span>
                <span className="block text-[15px] font-bold">{t(r.name.en, r.name.ar)}</span>
                <span className={`mt-1 block text-[11px] ${caps}`} style={{ color: MUTED }}>{t(r.city.en, r.city.ar)}</span>
              </span>
              <Stars rating={r.rating} />
            </div>
            <p className="mt-4 text-[15px] font-light leading-relaxed" style={{ color: '#4A443C' }}>{t(r.text.en, r.text.ar)}</p>
          </li>
        ))}
      </ul>

      <Sheet open={writing} onClose={() => setWriting(false)} side="center" testId="store-review-sheet" eyebrow={t('Store review', 'تقييم المتجر')} title={t('How was it?', 'كيف كانت التجربة؟')}>
        <form
          className="grid gap-6 px-6 py-6"
          onSubmit={(e) => {
            e.preventDefault();
            setWriting(false);
            setText('');
            toast(t('Thanks — your review is in.', 'شكراً — تم إرسال تقييمك.'));
          }}
        >
          <RatingInput value={stars} onChange={setStars} />
          <TextArea id="store-review-text" label={t('Your review', 'تقييمك')} value={text} onChange={setText} />
          <button type="submit" className={`w-full py-4 ${primaryBtnCls(isAr)}`}>{t('Send Review', 'إرسال التقييم')}</button>
        </form>
      </Sheet>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */
function StoreServices({ storeName, list }: { storeName: string; list: (typeof STORE_SERVICES)[StoreKey] }) {
  const { t } = useLook();
  return (
    <ServiceOffers
      testId="store-services"
      list={list}
      intro={t(
        `Beyond the pieces: what ${storeName} does for you, carried out by Diyar-vetted crews and covered by the Diyar guarantee.`,
        `أكثر من القطع: ما يقدّمه ${storeName} لك، تنفّذه فرق معتمدة من ديار ويشمله ضمان ديار.`,
      )}
    />
  );
}
