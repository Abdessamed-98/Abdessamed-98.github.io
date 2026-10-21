/**
 * Look 1 — the services catalogue (/look/1/services): the products catalogue's
 * twin. Same compact head with category and subcategory pills, same sidebar of
 * facets, same toolbar, same grid — with service cards in it.
 * State lives in the URL: ?category=&sub=&provider=&city=&sort=
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { SERVICES, lookBase, type Lang } from '../lookShared';
import { BG, HAIR, INK, OLIVE, Breadcrumb, eyebrowCls, primaryBtnCls, useLook } from './ui';
import { PROVIDERS } from './data';
import { SERVICE_CITIES, filterServices, type ServiceQuery, type ServiceSortKey } from './servicesData';
import { ServiceCard } from './ServiceCard';
import { categoryBySlug, categorySlugOf, serviceSlug, subServicesOf } from './ServicePage';

type FacetKey = 'category' | 'sub' | 'provider' | 'city';
interface Facet { key: FacetKey; label: string; options: { key: string; label: string }[] }

const SORTS: { key: ServiceSortKey; label: { en: string; ar: string } }[] = [
  { key: 'relevance', label: { en: 'Most booked', ar: 'الأكثر طلباً' } },
  { key: 'rating', label: { en: 'Top rated', ar: 'الأعلى تقييماً' } },
  { key: 'price_asc', label: { en: 'Price: low to high', ar: 'السعر: من الأقل' } },
  { key: 'price_desc', label: { en: 'Price: high to low', ar: 'السعر: من الأعلى' } },
  { key: 'newest', label: { en: 'Newest', ar: 'الأحدث' } },
];

const servicesLabel = (n: number, isAr: boolean) =>
  isAr ? `${n} ${n === 1 ? 'خدمة' : n === 2 ? 'خدمتان' : n <= 10 ? 'خدمات' : 'خدمة'}` : `${n} ${n === 1 ? 'service' : 'services'}`;

const parse = (sp: URLSearchParams): ServiceQuery => ({
  q: sp.get('q') ?? '',
  category: sp.get('category') ?? '',
  sub: sp.get('sub') ?? '',
  provider: sp.get('provider') ?? '',
  city: sp.get('city') ?? '',
  sort: (sp.get('sort') as ServiceSortKey | null) ?? 'relevance',
});
const serialize = (qy: ServiceQuery) => {
  const sp = new URLSearchParams();
  if (qy.q) sp.set('q', qy.q);
  if (qy.category) sp.set('category', qy.category);
  if (qy.sub) sp.set('sub', qy.sub);
  if (qy.provider) sp.set('provider', qy.provider);
  if (qy.city) sp.set('city', qy.city);
  if (qy.sort && qy.sort !== 'relevance') sp.set('sort', qy.sort);
  return sp;
};
const count = (qy: ServiceQuery) => filterServices(qy, categorySlugOf).length;

function Facets({ facets, query, lang, update }: { facets: Facet[]; query: ServiceQuery; lang: Lang; update: (patch: Partial<ServiceQuery>) => void }) {
  const isAr = lang === 'ar';
  return (
    <div>
      {facets.map((f) => {
        const value = query[f.key] ?? '';
        return (
          <fieldset key={f.key} className="border-t py-6" style={{ borderColor: HAIR }} data-testid={`sfacet-${f.key}`}>
            <legend className="sr-only">{f.label}</legend>
            <p className={eyebrowCls(isAr, 'text-[11px] text-[#171512] font-semibold')}>{f.label}</p>
            <ul className="mt-4 space-y-2.5">
              {f.options.map((o) => {
                const active = value === o.key;
                // a category change drops the subcategory, which belongs to the old one
                const patch: Partial<ServiceQuery> = f.key === 'category' ? { category: active ? '' : o.key, sub: '' } : ({ [f.key]: active ? '' : o.key } as Partial<ServiceQuery>);
                const n = count({ ...query, ...(f.key === 'category' ? { category: o.key, sub: '' } : { [f.key]: o.key }) });
                const empty = n === 0 && !active;
                return (
                  <li key={o.key}>
                    <button
                      type="button"
                      onClick={() => update(patch)}
                      aria-pressed={active}
                      disabled={empty}
                      data-testid={`sfacet-${f.key}-${o.key}`}
                      className={`group flex w-full items-center justify-between gap-3 text-start text-[14.5px] transition-colors ${
                        empty ? 'cursor-default text-[#A9A196]' : active ? 'font-semibold text-[#171512]' : 'text-[#3F3A33] hover:text-[#171512]'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span aria-hidden className={`h-3 w-3 shrink-0 border transition-colors ${active ? 'border-[#171512] bg-[#171512]' : empty ? 'border-[#171512]/15' : 'border-[#171512]/40 group-hover:border-[#171512]'}`} />
                        <span className="truncate">{o.label}</span>
                      </span>
                      <span className={`shrink-0 text-[13px] ${empty ? 'text-[#A9A196]' : 'text-[#5F5950]'}`}>{n}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        );
      })}
      <div className="border-t" style={{ borderColor: HAIR }} />
    </div>
  );
}

export function ServicesCatalog() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [sp, setSp] = useSearchParams();
  const query = useMemo(() => parse(sp), [sp]);
  const results = useMemo(() => filterServices(query, categorySlugOf), [query]);
  const cat = query.category ? categoryBySlug(query.category) : undefined;
  const subs = cat ? subServicesOf(cat) : [];
  const sub = subs.find((x) => x.key === query.sub);

  const facets: Facet[] = useMemo(() => {
    const list: Facet[] = [{ key: 'category', label: t('Category', 'التصنيف'), options: SERVICES.map((s) => ({ key: serviceSlug(s), label: t(s.en, s.ar) })) }];
    if (cat) list.push({ key: 'sub', label: t('Subcategory', 'التصنيف الفرعي'), options: subs.map((x) => ({ key: x.key, label: t(x.en, x.ar) })) });
    list.push({ key: 'provider', label: t('Provider', 'مقدم الخدمة'), options: PROVIDERS.filter((p) => !cat || p.service === cat.en).map((p) => ({ key: p.id, label: t(p.name.en, p.name.ar) })) });
    list.push({ key: 'city', label: t('City', 'المدينة'), options: SERVICE_CITIES.map((c) => ({ key: c.en, label: t(c.en, c.ar) })) });
    return list;
  }, [cat, subs, t]);

  const update = useCallback((patch: Partial<ServiceQuery>) => setSp(serialize({ ...query, ...patch })), [query, setSp]);
  const clearAll = useCallback(() => setSp(serialize({ sort: query.sort })), [query.sort, setSp]);

  /* mobile filter sheet */
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeSheet();
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => e.matches && closeSheet();
    if (mq.matches) closeSheet();
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [sheetOpen, closeSheet]);

  const title = sub ? t(sub.en, sub.ar) : cat ? t(cat.en, cat.ar) : t('Services', 'الخدمات');
  const crumbs = [
    { label: t('Home', 'الرئيسية'), to: lookBase(1) },
    { label: t('Services', 'الخدمات'), to: `${lookBase(1)}/services` },
    ...(cat ? [{ label: t(cat.en, cat.ar), ...(sub ? { to: `${lookBase(1)}/services?category=${query.category}` } : {}) }] : []),
    ...(sub ? [{ label: t(sub.en, sub.ar) }] : []),
  ];
  const chips: { key: string; label: string; clear: () => void }[] = [];
  for (const f of facets) {
    const v = query[f.key];
    if (!v) continue;
    const o = f.options.find((x) => x.key === v);
    chips.push({ key: f.key, label: o?.label ?? v, clear: () => update(f.key === 'category' ? { category: '', sub: '' } : ({ [f.key]: '' } as Partial<ServiceQuery>)) });
  }
  const labelCls = eyebrowCls(isAr, 'text-[11px] text-[#5F5950]');
  const pill = (on: boolean) =>
    `h-10 shrink-0 whitespace-nowrap border px-4 text-[14px] transition-colors ${on ? 'border-[#171512] bg-[#171512] font-bold text-white' : 'bg-white text-[#171512] hover:border-[#171512]'}`;

  return (
    <div data-testid="services-catalog" className="pt-[72px]">
      {/* ---- head: breadcrumb, title, the categories, then the subcategories ---- */}
      <div className="mx-auto max-w-[1400px] px-6 pb-5 pt-6 md:px-10 md:pt-8" data-testid="catalog-head">
        <Breadcrumb items={crumbs} />
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <h1 className={`shrink-0 text-[26px] font-bold leading-tight text-[#171512] md:text-[30px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif]"}`}>{title}</h1>
          <div className="scrollbar-hide -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:px-0 lg:justify-end" data-testid="catalog-categories">
            {[{ key: '', label: t('All', 'الكل') }, ...SERVICES.map((s) => ({ key: serviceSlug(s), label: t(s.en, s.ar) }))].map((c) => {
              const on = (query.category ?? '') === c.key;
              return (
                <button key={c.key || 'all'} type="button" onClick={() => update({ category: c.key, sub: '' })} aria-pressed={on} className={pill(on)} style={on ? undefined : { borderColor: HAIR }}>
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
        {cat && subs.length > 0 && (
          <div className="scrollbar-hide -mx-6 mt-3 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:px-0 lg:justify-end" data-testid="catalog-subcategories">
            {[{ key: '', label: t(`All ${cat.en}`, `كل ${cat.ar}`) }, ...subs.map((x) => ({ key: x.key, label: t(x.en, x.ar) }))].map((x) => {
              const on = (query.sub ?? '') === x.key;
              return (
                <button key={x.key || 'all'} type="button" onClick={() => update({ sub: x.key })} aria-pressed={on} className={`${pill(on)} !h-9 !text-[13.5px]`} style={on ? undefined : { borderColor: HAIR, color: '#4A443C' }}>
                  {x.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ---- sidebar + results ---- */}
      <div className="border-t" style={{ borderColor: HAIR }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[264px_minmax(0,1fr)] xl:gap-16">
            <aside className="hidden lg:block" data-testid="filter-sidebar">
              <div className="scrollbar-hide sticky top-[72px] max-h-[calc(100vh-72px)] overflow-y-auto pt-8 pb-16">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className={eyebrowCls(isAr, 'text-[11.5px] text-[#171512] font-bold')}>{t('Filters', 'تصفية')}</p>
                  {chips.length > 0 && (
                    <button type="button" onClick={clearAll} className={`text-[11px] uppercase text-[#5F5950] underline-offset-4 hover:text-[#171512] hover:underline ${isAr ? 'tracking-normal' : 'tracking-[0.2em]'}`}>
                      {t('Clear all', 'مسح الكل')}
                    </button>
                  )}
                </div>
                <Facets facets={facets} query={query} lang={lang} update={update} />
              </div>
            </aside>

            <section className="py-6 lg:py-8" aria-label={t('Services', 'الخدمات')}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    data-testid="filter-toggle"
                    onClick={() => setSheetOpen(true)}
                    className={`inline-flex h-11 items-center gap-2.5 border px-4 text-[11.5px] uppercase transition-colors hover:border-[#171512] lg:hidden ${isAr ? 'tracking-normal' : 'tracking-[0.2em]'}`}
                    style={{ borderColor: HAIR }}
                  >
                    <SlidersHorizontal size={15} strokeWidth={1.5} />
                    {t('Filters', 'تصفية')}
                    {chips.length > 0 && <span className="flex h-4 min-w-4 items-center justify-center px-1 text-[9px] font-semibold text-white" style={{ backgroundColor: OLIVE }}>{chips.length}</span>}
                  </button>
                  <p className={`hidden sm:block ${labelCls}`} data-testid="result-count">{servicesLabel(results.length, isAr)}</p>
                </div>
                <label className="flex items-center gap-3">
                  <span className={`hidden sm:inline ${labelCls}`}>{t('Sort by', 'ترتيب حسب')}</span>
                  <span className="relative">
                    <select
                      data-testid="sort-select"
                      value={query.sort ?? 'relevance'}
                      onChange={(e) => update({ sort: e.target.value as ServiceSortKey })}
                      className={`h-11 appearance-none border bg-white ps-4 pe-10 text-[11.5px] uppercase text-[#171512] transition-colors hover:border-[#171512] focus:border-[#171512] focus:outline-none ${isAr ? 'tracking-normal' : 'tracking-[0.16em]'}`}
                      style={{ borderColor: HAIR }}
                    >
                      {SORTS.map((o) => (
                        <option key={o.key} value={o.key}>{t(o.label.en, o.label.ar)}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} strokeWidth={1.5} className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2" style={{ color: OLIVE }} />
                  </span>
                </label>
              </div>

              {chips.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-2" data-testid="active-filters">
                  {chips.map((c) => (
                    <button key={c.key} type="button" onClick={c.clear} className="inline-flex h-8 items-center gap-2 border bg-white px-3 text-[14px] transition-colors hover:border-[#171512]" style={{ borderColor: HAIR }}>
                      {c.label}
                      <X size={12} strokeWidth={1.5} className="text-[#5F5950]" />
                    </button>
                  ))}
                  <button type="button" onClick={clearAll} className={`ms-1 text-[11px] uppercase text-[#5F5950] underline-offset-4 transition-colors hover:text-[#171512] hover:underline ${isAr ? 'tracking-normal' : 'tracking-[0.2em]'}`}>
                    {t('Clear all', 'مسح الكل')}
                  </button>
                </div>
              )}

              {results.length > 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: 'easeOut' }} data-testid="service-results" className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
                  {results.map((s) => (
                    <ServiceCard key={s.id} s={s} testId="service-card" />
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-start py-16 lg:py-24" data-testid="no-results">
                  <p className={eyebrowCls(isAr, 'text-[11px]')} style={{ color: OLIVE }}>{t('No results', 'لا توجد نتائج')}</p>
                  <h2 className={`mt-4 text-2xl font-extrabold uppercase md:text-3xl ${isAr ? "font-['Alexandria',sans-serif] leading-snug tracking-normal" : "font-['Outfit',sans-serif] leading-tight tracking-tight"}`}>
                    {t('No service matches yet', 'لا توجد خدمة تطابق اختيارك')}
                  </h2>
                  <p className="mt-4 max-w-sm text-[15px] font-light leading-relaxed text-[#3F3A33]">{t('Loosen the filters, or ask us and we will find a partner.', 'خفف الفلاتر، أو اسألنا وسنجد لك شريكاً.')}</p>
                  <button type="button" onClick={clearAll} className={`mt-8 px-10 py-4 ${primaryBtnCls(isAr)}`}>{t('Clear filters', 'مسح الفلاتر')}</button>
                </div>
              )}

              {results.length > 0 && (
                <div className="mt-16 border-t pt-8" style={{ borderColor: HAIR }}>
                  <p className={labelCls}>{t('Browse by category', 'تصفح حسب التصنيف')}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SERVICES.map((s) => {
                      const on = query.category === serviceSlug(s);
                      return (
                        <Link key={s.en} to={`${lookBase(1)}/services?category=${serviceSlug(s)}`} className={`border px-4 py-2 text-[11.5px] uppercase transition-colors hover:border-[#171512] ${on ? 'border-[#171512] bg-[#171512] text-white' : 'bg-white'} ${isAr ? 'tracking-normal' : 'tracking-[0.16em]'}`} style={on ? undefined : { borderColor: HAIR }}>
                          {t(s.en, s.ar)}
                        </Link>
                      );
                    })}
                    <Link to={`${lookBase(1)}/providers`} className={`border px-4 py-2 text-[11.5px] uppercase transition-colors hover:border-[#171512] ${isAr ? 'tracking-normal' : 'tracking-[0.16em]'}`} style={{ borderColor: HAIR, color: OLIVE }}>
                      {t('Service providers', 'مقدمو الخدمات')}
                    </Link>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* ---- mobile filter sheet ---- */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div key="backdrop" aria-hidden onClick={closeSheet} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-[60] bg-[#171512]/50 lg:hidden" />
            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              data-testid="filter-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[88vh] flex-col shadow-[0_-20px_60px_rgba(23,21,18,0.25)] lg:hidden"
              style={{ backgroundColor: BG, color: INK }}
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b px-6 py-4" style={{ borderColor: HAIR }}>
                <p className={`text-[13px] font-bold uppercase ${isAr ? "font-['Alexandria',sans-serif] tracking-normal" : "font-['Outfit',sans-serif] tracking-[0.18em]"}`}>{t('Filters', 'تصفية')}</p>
                <button type="button" onClick={closeSheet} aria-label={t('Close filters', 'إغلاق التصفية')} className="-me-1 p-1 transition-colors hover:text-[#5A6B4D]">
                  <X size={22} strokeWidth={1.25} />
                </button>
              </div>
              <div className="scrollbar-hide flex-1 overflow-y-auto overscroll-contain px-6">
                <Facets facets={facets} query={query} lang={lang} update={update} />
              </div>
              <div className="flex shrink-0 items-center gap-4 border-t px-6 py-4 pb-20" style={{ borderColor: HAIR }}>
                <button type="button" onClick={clearAll} className={`shrink-0 text-[11px] uppercase text-[#5F5950] underline-offset-4 hover:text-[#171512] hover:underline ${isAr ? 'tracking-normal' : 'tracking-[0.2em]'}`}>{t('Clear all', 'مسح الكل')}</button>
                <button type="button" onClick={closeSheet} className={`flex-1 py-4 ${primaryBtnCls(isAr)}`}>{t(`Show ${servicesLabel(results.length, false)}`, `عرض ${servicesLabel(results.length, true)}`)}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
