/**
 * Look 1 — a store's own page.
 *
 * The marketplace argument: every product belongs to a seller, and the seller
 * has a face. The identity sits inside the cover, printed on the photograph the
 * way the service pages do it — ink type under a cover band left the name
 * stranded on an empty cream strip.
 */
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, MapPin, Star, Package } from 'lucide-react';
import {
  ALL_STORES,
  CATALOG,
  STORE_LOCATIONS,
  formatSAR,
  lookBase,
  searchPath,
  storeOf,
  type StoreKey,
} from '../lookShared';
import { Breadcrumb, HAIR, INK, MUTED, OLIVE, ProductCard, TILE, primaryBtnCls, useLook } from './ui';

export default function StorePage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { key = '' } = useParams();
  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]';

  const known = ALL_STORES.some((s) => s.key === key);
  const store = storeOf(key as StoreKey);
  const products = CATALOG.filter((p) => p.store === store.key);
  const branches = STORE_LOCATIONS.filter((l) => l.store === store.key);

  if (!known) {
    return (
      <main className="pt-[72px]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 text-center md:px-10">
          <p className={`text-[11px] ${caps}`} style={{ color: MUTED }}>{t('Not found', 'غير موجود')}</p>
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
                  <span
                    dir="ltr"
                    aria-hidden
                    className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/70 font-['Outfit',sans-serif] text-[16px] font-bold tracking-[0.06em] text-white"
                  >
                    {store.initials}
                  </span>
                  <p className={`text-[11px] text-white/85 ${caps}`}>{t('Marketplace store', 'متجر في المنصة')}</p>
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
        <ul className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:px-10" style={{ borderColor: HAIR }}>
          {stats.map((s) => (
            <li key={s.label} className="flex items-center gap-4 py-6 sm:justify-center">
              <s.icon size={18} strokeWidth={1.4} style={{ color: OLIVE }} />
              <span>
                <span className={`block text-[10px] ${caps}`} style={{ color: MUTED }}>{s.label}</span>
                <span className="mt-1 block font-['Outfit',sans-serif] text-[17px] font-bold tabular-nums" style={{ color: INK }}>
                  {s.value}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* branches */}
        {branches.length > 0 && (
          <section className="py-12 md:py-14">
            <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('Where to find them', 'أين تجدهم')}</p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((b) => (
                <li key={b.id} className="flex items-start gap-4 border p-5" style={{ borderColor: HAIR }}>
                  <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: OLIVE }} />
                  <span>
                    <span className="block text-[14px] font-bold">{t(b.district.en, b.district.ar)}</span>
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
        <section className="border-t py-12 md:py-16" style={{ borderColor: HAIR }}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('From this store', 'من هذا المتجر')}</p>
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
              className={`inline-flex items-center gap-2.5 border-b pb-1.5 text-[11px] font-medium transition-colors hover:text-[#5A6B4D] ${caps}`}
              style={{ borderColor: INK }}
            >
              {t('See All', 'عرض الكل')}
              <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="mt-10 text-[15px] font-light" style={{ color: '#4A443C' }}>
              {t('This store has no products listed yet.', 'لا توجد منتجات معروضة لهذا المتجر بعد.')}
            </p>
          ) : (
            <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} testId="store-product-card" />
              ))}
            </div>
          )}
        </section>

        {/* other stores */}
        <section className="border-t py-12 md:py-14" style={{ borderColor: HAIR }}>
          <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('Also on Diyar', 'أيضاً على ديار')}</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ALL_STORES.filter((s) => s.key !== store.key).map((s) => (
              <li key={s.key}>
                <Link
                  to={`${lookBase(1)}/store/${s.key}`}
                  className="group flex items-center gap-4 border p-4 transition-colors hover:border-[#171512]"
                  style={{ borderColor: HAIR }}
                >
                  <span
                    dir="ltr"
                    className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#171512] font-['Outfit',sans-serif] text-[12px] font-bold text-white transition-colors group-hover:bg-[#5A6B4D]"
                  >
                    {s.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-bold">{t(s.name.en, s.name.ar)}</span>
                    <span className="mt-1 block truncate text-[11px] font-light" style={{ color: MUTED }}>
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
              { label: t('Stores', 'المتاجر'), to: searchPath(1) },
              { label: t(store.name.en, store.name.ar) },
            ]}
          />
        </div>
      </div>
    </main>
  );
}
