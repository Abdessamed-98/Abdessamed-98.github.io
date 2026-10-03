/**
 * Look 1 — the customer pages that sit off the main flow: every service in one
 * place, a provider's profile, the saved list as a page, help, and the page for
 * a link that leads nowhere.
 *
 * Each is assembled from the kit (page head, tabs, empty state, lightbox) so
 * they read as the same site as the shop.
 */
import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronDown, MessageSquare, Phone, Mail, Star, Briefcase, CalendarDays, Search, X } from 'lucide-react';
import { ALL_STORES, CATALOG, CATEGORIES, FOOTER_LINKS, SERVICES, SERVICES_MENU, STORE_LOCATIONS, formatSAR, lookBase, productPath, searchPath, type CategoryKey, type StoreKey } from '../lookShared';
import { Breadcrumb, HAIR, INK, MUTED, NIGHT, OLIVE, OLIVE_LT, RED, TILE, ProductCard, Stars, StoreMark, primaryBtnCls, tileImg, useLook, useSeen } from './ui';
import { useShell } from './shellContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useLookCart } from './cart';
import { CONTAINER, EmptyState, Lightbox, PageHead, ServiceOffers, Tabs, capsCls, displayCls } from './kit';
import { categoryArt, categoryPath, servicePath } from './ServicePage';
import { HELP_TOPICS, PROVIDERS, PROVIDER_SERVICES, SERVICE_GALLERY, type Provider } from './data';

const home = (t: (en: string, ar: string) => string) => ({ label: t('Home', 'الرئيسية'), to: lookBase(1) });

/* ------------------------------------------------------------------ */
/* Services index                                                      */
/* ------------------------------------------------------------------ */

export function ServicesIndex() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { openService } = useShell();
  const subCount = SERVICES_MENU.reduce((n, g) => n + g.items.length, 0);

  const jump = (i: number) => {
    const el = document.getElementById(`service-row-${i}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
  };

  return (
    <main className="pt-[72px]" data-testid="services-index">
      <div className={`${CONTAINER} pt-8`}>
        <Breadcrumb items={[home(t), { label: t('Services', 'الخدمات') }]} />
        <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className={displayCls(isAr, 'md')}>{t('Services', 'الخدمات')}</h1>
          <span className="text-[14.5px]" style={{ color: MUTED }}>
            {t(`${SERVICES.length} categories · ${subCount} services`, `${SERVICES.length} أقسام · ${subCount} خدمة`)}
          </span>
        </div>

        {/* the categories: a row of tiles, each taking you to its services below */}
        <ul className="scrollbar-hide -mx-6 mt-6 flex gap-3 overflow-x-auto px-6 md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-8 lg:overflow-visible lg:px-0" data-testid="service-categories">
          {SERVICES.map((sv, i) => (
            <li key={sv.en} className="w-[124px] shrink-0 lg:w-auto">
              <button type="button" onClick={() => jump(i)} className="group block w-full text-start" data-testid="service-category-tile">
                <span className="relative block aspect-square overflow-hidden" style={{ backgroundColor: '#1F3D3A' }}>
                  <img src={categoryArt(sv)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                  <span className="absolute bottom-2 start-2 flex h-7 w-7 items-center justify-center bg-white/90">
                    <sv.icon size={13} strokeWidth={1.6} className="text-[#5A6B4D]" />
                  </span>
                </span>
                <span className="mt-2 block text-[14px] font-bold leading-snug transition-colors group-hover:text-[#5A6B4D]">{t(sv.en, sv.ar)}</span>
                <span className="block text-[13px]" style={{ color: MUTED }}>{t(`${SERVICES_MENU[i]?.items.length ?? 0} services`, `${SERVICES_MENU[i]?.items.length ?? 0} خدمات`)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* one row per category: its title, then its services as cards */}
      <div className={`${CONTAINER} pb-16`}>
        {SERVICES.map((sv, i) => {
          const items = SERVICES_MENU[i]?.items ?? [];
          const shots = SERVICE_GALLERY[sv.en] ?? [];
          return (
            <section key={sv.en} id={`service-row-${i}`} className="border-t pt-9 mt-10" style={{ borderColor: HAIR }} data-testid="service-row">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className={`flex items-center gap-3 text-[22px] font-extrabold md:text-[26px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`}>
                  <sv.icon size={20} strokeWidth={1.5} className="shrink-0 text-[#5A6B4D]" />
                  {t(sv.en, sv.ar)}
                </h2>
                <Link to={categoryPath(sv)} data-testid="service-row-open" className="inline-flex items-center gap-2 border-b pb-1 text-[14px] font-medium transition-colors hover:text-[#5A6B4D]" style={{ borderColor: INK }}>
                  {t('View category', 'عرض القسم')}
                  <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                </Link>
              </div>
              <ul className="scrollbar-hide -mx-6 mt-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
                {items.map((it, k) => (
                  <li key={it.en} className="w-[62%] shrink-0 snap-start sm:w-[40%] md:w-[30%] lg:w-auto" data-testid="service-card">
                    <div className="group flex h-full flex-col border bg-white" style={{ borderColor: HAIR }}>
                      <Link to={servicePath(sv, it)} className="block aspect-[4/3] overflow-hidden" style={{ backgroundColor: TILE }}>
                        <img
                          src={shots[k % Math.max(1, shots.length)]?.img ?? sv.img}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col p-4">
                        <Link to={servicePath(sv, it)} data-testid="services-sub-link" className="text-[15.5px] font-bold leading-snug transition-colors hover:text-[#5A6B4D]">
                          {t(it.en, it.ar)}
                        </Link>
                        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                          <button
                            type="button"
                            data-testid="service-card-request"
                            onClick={() => openService(`${t(sv.en, sv.ar)} · ${t(it.en, it.ar)}`)}
                            className={`px-4 py-2 ${primaryBtnCls(isAr)}`}
                          >
                            {t('Request', 'اطلب الخدمة')}
                          </button>
                          <Link to={servicePath(sv, it)} aria-label={t('Details', 'التفاصيل')} className="flex h-8 w-8 items-center justify-center border transition-colors hover:bg-[#171512] hover:text-white" style={{ borderColor: '#C9C2B4' }}>
                            <ArrowRight size={13} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}

function ProviderCard({ p }: { p: Provider }) {
  const { t } = useLook();
  return (
    <Link
      to={`${lookBase(1)}/provider/${p.id}`}
      className="group flex h-full items-center gap-4 border p-4 transition-colors hover:border-[#171512]"
      style={{ borderColor: HAIR }}
      data-testid="provider-card"
    >
      <span dir="ltr" className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#171512] font-['Outfit',sans-serif] text-[14px] font-bold text-white transition-colors group-hover:bg-[#5A6B4D]">
        {p.initials}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-bold">{t(p.name.en, p.name.ar)}</span>
        <span className="mt-1 block truncate text-[13px] font-light" style={{ color: MUTED }}>
          {t(p.trade.en, p.trade.ar)} · {t(p.city.en, p.city.ar)}
        </span>
        <span className="mt-1.5 flex items-center gap-1 text-[13px] font-medium">
          <Star size={11} strokeWidth={1.5} className="fill-[#171512]" />
          <span className="font-['Outfit',sans-serif] tabular-nums">{p.rating.toFixed(1)}</span>
          <span style={{ color: MUTED }}>· {t(`${p.jobs} jobs`, `${p.jobs} مشروع`)}</span>
        </span>
      </span>
    </Link>
  );
}

/** For the service page: the partners who take that service. */
export function ServiceProviders({ serviceEn }: { serviceEn: string }) {
  const { lang, t } = useLook();
  const list = PROVIDERS.filter((p) => p.service === serviceEn);
  if (!list.length) return null;
  return (
    <section className="border-t py-12 md:py-16" style={{ borderColor: HAIR }} data-testid="service-providers">
      <p className={`text-[11px] ${capsCls(lang === 'ar')}`} style={{ color: MUTED }}>{t('Partners for this service', 'شركاء هذه الخدمة')}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <li key={p.id}>
            <ProviderCard p={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Provider profile                                                    */
/* ------------------------------------------------------------------ */

type ProviderTab = 'about' | 'services' | 'work' | 'reviews';

export function ProviderPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const { id = '' } = useParams();
  const { openService } = useShell();
  const [sp, setSp] = useSearchParams();
  const [shown, setShown] = useState<number | null>(null);
  const p = PROVIDERS.find((x) => x.id === id);
  if (!p) return <NotFoundPage />;

  const rawTab = sp.get('tab');
  const tab: ProviderTab = rawTab === 'services' || rawTab === 'work' || rawTab === 'reviews' ? rawTab : 'about';
  const offers = PROVIDER_SERVICES[p.id] ?? [];
  const service = SERVICES.find((s) => s.en === p.service);
  const serviceName = service ? t(service.en, service.ar) : '';

  return (
    <main className="pt-[72px]" data-testid="provider-page">
      <div className="relative min-h-[360px] w-full overflow-hidden md:h-[50vh]" style={{ backgroundColor: INK }}>
        <img src={p.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />
        <div className="relative flex h-full items-end">
          <div className={`${CONTAINER} w-full pb-10 pt-28 md:pb-14`}>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div className="min-w-0">
                <div className="flex items-center gap-4">
                  <span dir="ltr" aria-hidden className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/70 font-['Outfit',sans-serif] text-[16px] font-bold text-white">
                    {p.initials}
                  </span>
                  <p className={`text-[11.5px] text-white/85 ${caps}`}>{t('Service partner', 'شريك خدمات')}</p>
                </div>
                <h1 className={`mt-5 text-white ${displayCls(isAr, 'xl')}`}>{t(p.name.en, p.name.ar)}</h1>
                <p className="mt-4 text-[15px] font-light text-white/80">
                  {t(p.trade.en, p.trade.ar)} · {t(p.city.en, p.city.ar)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`${lookBase(1)}/chat?with=${p.id}`}
                  className={`inline-flex items-center gap-2 border border-white/60 px-7 py-4 text-[11.5px] font-medium text-white transition-colors hover:bg-white hover:text-[#171512] ${caps}`}
                >
                  <MessageSquare size={14} strokeWidth={1.5} />
                  {t('Message', 'مراسلة')}
                </Link>
                <button
                  type="button"
                  data-testid="provider-request"
                  onClick={() => openService(p.service)}
                  className={`px-8 py-4 ${primaryBtnCls(isAr)} !bg-white !text-[#171512] hover:!bg-[#5A6B4D] hover:!text-white`}
                >
                  {t('Request a Quote', 'اطلب عرض سعر')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b" style={{ borderColor: HAIR, backgroundColor: TILE }}>
        <ul className={`${CONTAINER} grid grid-cols-3 divide-x divide-[#E8E4DC]`}>
          {[
            { icon: Star, label: t('Rating', 'التقييم'), value: p.rating.toFixed(1) },
            { icon: Briefcase, label: t('Jobs done', 'مشاريع منجزة'), value: String(p.jobs) },
            { icon: CalendarDays, label: t('Years', 'سنوات الخبرة'), value: String(p.years) },
          ].map((s) => (
            <li key={s.label} className="flex flex-col items-center gap-2 py-6 sm:flex-row sm:justify-center sm:gap-4">
              <s.icon size={18} strokeWidth={1.4} style={{ color: OLIVE }} />
              <span className="text-center sm:text-start">
                <span className={`block text-[11px] ${caps}`} style={{ color: MUTED }}>{s.label}</span>
                <span className="mt-1 block font-['Outfit',sans-serif] text-[17px] font-bold tabular-nums">{s.value}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className={CONTAINER}>
        <div className="pt-8">
          <Tabs
            testId="provider-tabs"
            value={tab}
            onChange={(k) => setSp(k === 'about' ? {} : { tab: k }, { replace: true })}
            items={[
              { key: 'about', label: t('About', 'نبذة') },
              { key: 'services', label: t('Services', 'الخدمات'), count: offers.length },
              { key: 'work', label: t('Work', 'الأعمال'), count: p.portfolio.length },
              { key: 'reviews', label: t('Reviews', 'التقييمات'), count: p.reviews.length },
            ]}
          />
        </div>

        {tab === 'services' && (
          <ServiceOffers
            testId="provider-services"
            list={offers}
            intro={t(
              `What you can book ${p.name.en} for — every job quoted in writing and covered by the Diyar guarantee.`,
              `ما يمكنك حجز ${p.name.ar} له — كل عمل بعرض سعر مكتوب ويشمله ضمان ديار.`,
            )}
          />
        )}

        {tab === 'about' && (
          <section className="grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-16" data-testid="provider-about">
            <p className="text-[19px] font-light leading-relaxed md:text-[22px] lg:col-span-7">{t(p.bio.en, p.bio.ar)}</p>
            <dl className="border lg:col-span-5" style={{ borderColor: HAIR }}>
              {[
                { k: t('Service', 'الخدمة'), v: serviceName, to: service ? categoryPath(service) : undefined },
                { k: t('Based in', 'المقر'), v: t(p.city.en, p.city.ar) },
                { k: t('Covers', 'يغطي'), v: t('Within 60 km, visits in 3 days', 'حتى 60 كم، زيارة خلال 3 أيام') },
                { k: t('Verified by Diyar', 'موثّق من ديار'), v: t('License, insurance, references', 'الترخيص والتأمين والمراجع') },
              ].map((row, i) => (
                <div key={row.k} className={`flex items-baseline justify-between gap-6 px-5 py-4 ${i ? 'border-t' : ''}`} style={{ borderColor: HAIR }}>
                  <dt className={`text-[11px] ${caps}`} style={{ color: MUTED }}>{row.k}</dt>
                  <dd className="text-end text-[14.5px] font-bold">
                    {row.to ? <Link to={row.to} className="underline-offset-4 hover:text-[#5A6B4D] hover:underline">{row.v}</Link> : row.v}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {tab === 'work' && (
          <section className="py-12 md:py-16" data-testid="provider-work">
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {p.portfolio.map((img, i) => (
                <li key={img + i} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
                  <button type="button" onClick={() => setShown(i)} className="group block h-full w-full overflow-hidden" style={{ backgroundColor: TILE }} aria-label={t(`Open image ${i + 1}`, `فتح الصورة ${i + 1}`)}>
                    <img src={img} alt="" loading="lazy" className="aspect-square h-full w-full cursor-zoom-in object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </button>
                </li>
              ))}
            </ul>
            <Lightbox images={p.portfolio} index={shown ?? 0} onIndex={setShown} open={shown !== null} onClose={() => setShown(null)} />
          </section>
        )}

        {tab === 'reviews' && (
          <section className="py-12 md:py-16 lg:max-w-4xl" data-testid="provider-reviews">
            <ul>
              {p.reviews.map((r, i) => (
                <li key={r.name.en} className={`py-7 ${i ? 'border-t' : 'pt-0'}`} style={{ borderColor: HAIR }}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[15px] font-bold">{t(r.name.en, r.name.ar)}</span>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="mt-4 text-[15px] font-light leading-relaxed" style={{ color: '#4A443C' }}>{t(r.text.en, r.text.ar)}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="border-t py-12 md:py-14" style={{ borderColor: HAIR }}>
          <p className={`text-[11px] ${caps}`} style={{ color: MUTED }}>{t('Other partners', 'شركاء آخرون')}</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROVIDERS.filter((x) => x.id !== p.id).map((x) => (
              <li key={x.id}>
                <ProviderCard p={x} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Stores — every seller on the marketplace                            */
/* ------------------------------------------------------------------ */

export function StoresPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const [cat, setCat] = useState<CategoryKey | 'all'>('all');
  // a store sells in a category when it has a piece in it
  const sells = (key: StoreKey) => new Set(CATALOG.filter((p) => p.store === key).map((p) => p.category));
  const cats = CATEGORIES.filter((c) => ALL_STORES.some((s) => sells(s.key).has(c.key)));
  const list = ALL_STORES.filter((s) => cat === 'all' || sells(s.key).has(cat));
  const offerOf = (key: StoreKey) =>
    Math.max(0, ...CATALOG.filter((p) => p.store === key && p.oldPrice).map((p) => Math.round((1 - p.price / (p.oldPrice as number)) * 100)));

  return (
    <main className="pt-[72px]" data-testid="stores-page">
      <div className={`${CONTAINER} pt-8`}>
        <Breadcrumb items={[home(t), { label: t('Stores', 'المتاجر') }]} />
        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-baseline gap-4">
            <h1 className={displayCls(isAr, 'md')}>{t('Stores', 'المتاجر')}</h1>
            <span className="text-[15px]" style={{ color: MUTED }}>{t(`${ALL_STORES.length} stores on Diyar`, `${ALL_STORES.length} متاجر على ديار`)}</span>
          </div>
          <div className="scrollbar-hide -mx-6 flex gap-2 overflow-x-auto px-6 md:-mx-10 md:px-10 lg:mx-0 lg:px-0" role="radiogroup" aria-label={t('Filter by what they sell', 'تصفية حسب ما تبيعه')}>
            {[{ key: 'all' as const, label: t('All', 'الكل') }, ...cats.map((c) => ({ key: c.key, label: c[lang] }))].map((c) => {
              const on = cat === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  data-testid={`stores-filter-${c.key}`}
                  onClick={() => setCat(c.key)}
                  className={`shrink-0 border px-4 py-2.5 text-[14.5px] transition-colors ${on ? 'border-[#171512] bg-[#171512] font-bold text-white' : 'bg-white font-medium hover:border-[#171512]'}`}
                  style={on ? undefined : { borderColor: '#C9C2B4' }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`${CONTAINER} pb-16 pt-8`}>
        <ul className="grid gap-5 md:grid-cols-2">
          {list.map((s) => {
            const pieces = CATALOG.filter((p) => p.store === s.key).slice(0, 4);
            const branches = STORE_LOCATIONS.filter((l) => l.store === s.key).length;
            const off = offerOf(s.key);
            return (
              <li key={s.key} className="flex flex-col border bg-white" style={{ borderColor: HAIR }} data-testid="store-card">
                <Link to={`${lookBase(1)}/store/${s.key}`} className="group relative block aspect-[21/9] overflow-hidden" style={{ backgroundColor: TILE }}>
                  <img src={s.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                  {off > 0 && (
                    <span className="absolute end-4 top-4 rotate-[6deg] px-2.5 py-1 text-[12px] font-bold leading-none text-white" style={{ backgroundColor: RED }}>
                      {t('Offers', 'عروض')}
                    </span>
                  )}
                  <span className="absolute bottom-4 start-4 flex items-end gap-4">
                    <StoreMark store={s} className="h-16 w-16 text-[16px]" />
                    <span className="pb-1 text-white">
                      <span className={`block text-[22px] font-extrabold leading-tight ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`}>{s.name[lang]}</span>
                      <span className="mt-1 block text-[15px] font-light text-white/85">{s.specialty[lang]}</span>
                    </span>
                  </span>
                </Link>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 text-[15px]" style={{ color: '#4A443C' }}>
                  <span className="flex items-center gap-1.5 font-bold text-[#171512]">
                    <Star size={14} strokeWidth={1.5} className="fill-[#D9A441] text-[#D9A441]" />
                    {s.rating}
                  </span>
                  <span>{t(`${formatSAR(s.products)} products`, `${formatSAR(s.products)} منتج`)}</span>
                  <span>{branches ? t(`${branches} ${branches === 1 ? 'branch' : 'branches'} · Jeddah`, `${branches} ${branches === 1 ? 'فرع' : 'فروع'} · جدة`) : t('Online', 'أونلاين')}</span>
                </div>
                {pieces.length > 0 && (
                  <ul className="grid grid-cols-4 gap-2 border-t px-5 pt-4" style={{ borderColor: HAIR }}>
                    {pieces.map((p) => (
                      <li key={p.id}>
                        <Link to={productPath(1, p.id)} className="group block" title={p.name[lang]}>
                          <span className="block aspect-square overflow-hidden" style={{ backgroundColor: TILE }}>
                            <img src={tileImg(p.id, p.img)} alt="" loading="lazy" className={`h-full w-full ${p.id <= 9 ? 'object-contain p-2' : 'object-cover'} transition-transform duration-500 group-hover:scale-105`} />
                          </span>
                          <span className="mt-1.5 block truncate text-[14px]" style={{ color: MUTED }}>{formatSAR(p.price)} {t('SAR', 'ر.س')}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto flex items-center gap-3 px-5 py-4">
                  <Link to={`${lookBase(1)}/store/${s.key}`} className={`px-5 py-2.5 ${primaryBtnCls(isAr)}`}>{t('Visit store', 'زيارة المتجر')}</Link>
                  <Link to={searchPath(1, { store: s.key })} className={`px-3 py-2.5 text-[12.5px] font-medium ${caps}`} style={{ color: MUTED }}>{t('All pieces', 'كل القطع')}</Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Wishlist                                                            */
/* ------------------------------------------------------------------ */

export function WishlistPage() {
  const { lang, t } = useLook();
  const caps = capsCls(lang === 'ar');
  const wishlist = useWishlist();
  const { add } = useLookCart();
  const { toast, openCart } = useShell();
  const items = wishlist.ids.map((id) => CATALOG.find((p) => p.id === id)).filter((p): p is (typeof CATALOG)[number] => !!p);

  return (
    <main className="pt-[72px]" data-testid="wishlist-page">
      <PageHead
        crumbs={[home(t), { label: t('Saved', 'المحفوظات') }]}
        eyebrow={t('Your list', 'قائمتك')}
        title={t('Saved Pieces', 'القطع المحفوظة')}
        intro={items.length ? t(`${items.length} saved — they stay here until you move them.`, `${items.length} محفوظة — تبقى هنا حتى تنقلها.`) : undefined}
        aside={
          items.length > 0 ? (
            <div className="flex flex-wrap items-center gap-6">
              <button type="button" onClick={wishlist.clear} className={`text-[11.5px] font-medium hover:text-[#B03A2E] ${caps}`} style={{ color: MUTED }}>
                {t('Clear list', 'مسح القائمة')}
              </button>
              <button
                type="button"
                data-testid="wishlist-all-to-cart"
                onClick={() => {
                  items.forEach((p) => add(p.id));
                  wishlist.clear();
                  toast(t('Everything moved to your cart.', 'تم نقل كل القطع إلى السلة.'));
                  openCart();
                }}
                className={`px-8 py-4 ${primaryBtnCls(lang === 'ar')}`}
              >
                {t('Move all to cart', 'انقل الكل إلى السلة')}
              </button>
            </div>
          ) : undefined
        }
      />
      <div className={`${CONTAINER} py-12 md:py-16`}>
        {items.length ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4" data-testid="wishlist-grid">
            {items.map((p) => (
              <ProductCard key={p.id} p={p} testId="wishlist-card" />
            ))}
          </div>
        ) : (
          <EmptyState
            title={t('Nothing saved yet', 'لا توجد قطع محفوظة')}
            body={t('Tap the heart on any piece to keep it here.', 'اضغط على القلب في أي قطعة لتحفظها هنا.')}
            action={{ label: t('Browse the Shop', 'تصفّح المتجر'), to: searchPath(1) }}
          />
        )}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Help                                                                */
/* ------------------------------------------------------------------ */

export function HelpPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const { topic: raw } = useParams();
  const topic = HELP_TOPICS.find((h) => h.key === raw) ?? HELP_TOPICS[0];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="pt-[72px]" data-testid="help-page" data-topic={topic.key}>
      <PageHead
        crumbs={[home(t), { label: t('Help', 'المساعدة'), to: `${lookBase(1)}/help` }, { label: t(topic.title.en, topic.title.ar) }]}
        eyebrow={t('Customer Support', 'خدمة العملاء')}
        title={t(topic.title.en, topic.title.ar)}
      />
      <div className={`${CONTAINER} pt-8`}>
        <Tabs
          testId="help-tabs"
          value={topic.key}
          items={HELP_TOPICS.map((h) => ({ key: h.key, label: t(h.title.en, h.title.ar), to: `${lookBase(1)}/help/${h.key}` }))}
        />
      </div>
      <div className={`${CONTAINER} grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-16`}>
        <ul className="border-b lg:col-span-8" style={{ borderColor: HAIR }} key={topic.key}>
          {topic.items.map((it, i) => {
            const on = open === i;
            return (
              <li key={it.q.en} className="border-t" style={{ borderColor: HAIR }}>
                <button
                  type="button"
                  aria-expanded={on}
                  data-testid="help-q"
                  onClick={() => setOpen(on ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-start"
                >
                  <span className="text-[16px] font-bold md:text-[17px]">{t(it.q.en, it.q.ar)}</span>
                  <ChevronDown size={18} strokeWidth={1.25} className={`shrink-0 transition-transform duration-300 ${on ? 'rotate-180' : ''}`} />
                </button>
                <motion.div initial={false} animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="overflow-hidden">
                  <p className="pb-7 text-[15px] font-light leading-relaxed" style={{ color: '#4A443C' }}>{t(it.a.en, it.a.ar)}</p>
                </motion.div>
              </li>
            );
          })}
        </ul>
        <aside className="lg:col-span-4">
          <div className="p-7" style={{ backgroundColor: TILE }}>
            <p className={`text-[11px] ${caps}`} style={{ color: MUTED }}>{t('Still need help?', 'ما زلت تحتاج مساعدة؟')}</p>
            <p className="mt-3 text-[18px] font-bold leading-snug">{t('Talk to a person, not a form.', 'تحدّث مع شخص، لا مع نموذج.')}</p>
            <ul className="mt-6 grid gap-3">
              <li>
                <Link to={`${lookBase(1)}/chat`} className="flex items-center gap-3 border bg-white px-4 py-3.5 text-[14.5px] font-medium transition-colors hover:border-[#171512]" style={{ borderColor: HAIR }}>
                  <MessageSquare size={15} strokeWidth={1.5} style={{ color: OLIVE }} />
                  {t('Chat with support', 'محادثة الدعم')}
                </Link>
              </li>
              <li>
                <a href={`tel:${FOOTER_LINKS.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 border bg-white px-4 py-3.5 text-[14.5px] font-medium transition-colors hover:border-[#171512]" style={{ borderColor: HAIR }}>
                  <Phone size={15} strokeWidth={1.5} style={{ color: OLIVE }} />
                  <span dir="ltr">{FOOTER_LINKS.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${FOOTER_LINKS.email}`} className="flex items-center gap-3 border bg-white px-4 py-3.5 text-[14.5px] font-medium transition-colors hover:border-[#171512]" style={{ borderColor: HAIR }}>
                  <Mail size={15} strokeWidth={1.5} style={{ color: OLIVE }} />
                  <span dir="ltr">{FOOTER_LINKS.email}</span>
                </a>
              </li>
            </ul>
            <Link to={`${lookBase(1)}/account/orders`} className={`mt-6 inline-flex items-center gap-2 border-b pb-1 text-[11.5px] font-medium ${caps}`} style={{ borderColor: INK }}>
              {t('Track an order', 'تتبع طلباً')}
              <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* 404                                                                 */
/* ------------------------------------------------------------------ */

export function NotFoundPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(searchPath(1, q.trim() ? { q: q.trim() } : undefined));
  };
  return (
    <main className="pt-[72px]" data-testid="not-found">
      <div className={`${CONTAINER} flex min-h-[70vh] flex-col items-center justify-center py-20 text-center`}>
        <p className="font-['Outfit',sans-serif] text-[96px] font-extrabold leading-none tracking-tight md:text-[160px]" style={{ color: HAIR }} dir="ltr">
          404
        </p>
        <h1 className={`-mt-4 md:-mt-8 ${displayCls(isAr, 'lg')}`}>{t('This room is empty', 'هذه الغرفة فارغة')}</h1>
        <p className="mt-5 max-w-md text-[15px] font-light leading-relaxed" style={{ color: '#4A443C' }}>
          {t('The page moved or never existed. Search for what you came for, or start from one of these.', 'الصفحة انتقلت أو لم تكن موجودة. ابحث عما جئت من أجله، أو ابدأ من هنا.')}
        </p>
        <form onSubmit={submit} role="search" className="mt-9 flex h-12 w-full max-w-md items-center gap-3 border bg-white ps-4" style={{ borderColor: '#C9C2B4' }}>
          <Search size={16} strokeWidth={1.5} style={{ color: MUTED }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Search the shop', 'ابحث في المتجر')} aria-label={t('Search', 'بحث')} className="min-w-0 flex-1 bg-transparent text-[14.5px] outline-none" />
          <button type="submit" className={`h-12 px-6 ${primaryBtnCls(isAr)}`}>{t('Search', 'بحث')}</button>
        </form>
        <div className={`mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[11.5px] font-medium ${caps}`}>
          {[
            { to: lookBase(1), label: t('Home', 'الرئيسية') },
            { to: searchPath(1), label: t('Shop', 'المتجر') },
            { to: `${lookBase(1)}/services`, label: t('Services', 'الخدمات') },
            { to: `${lookBase(1)}/help`, label: t('Help', 'المساعدة') },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="border-b pb-1 transition-colors hover:text-[#5A6B4D]" style={{ borderColor: INK }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
