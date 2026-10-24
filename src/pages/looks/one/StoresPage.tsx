/**
 * Look 1 — the stores (/look/1/stores), browsed like the products and the
 * services: a compact head, a sidebar of filters, a toolbar with the count and
 * the sort, then the stores. State lives in the URL:
 * ?category=&rating=&kind=&offers=1&sort=
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, SlidersHorizontal, Star, X } from 'lucide-react';
import { ALL_STORES, CATALOG, CATEGORIES, STORE_LOCATIONS, formatSAR, lookBase, productPath, searchPath, type LookStore, type StoreKey } from '../lookShared';
import { BG, Breadcrumb, HAIR, INK, MUTED, OLIVE, RED, StoreMark, TILE, eyebrowCls, primaryBtnCls, tileImg, useLook } from './ui';

type Sort = 'rating' | 'products' | 'name';
interface StoreQuery { category: string; rating: string; kind: string; offers: boolean; sort: Sort }

const parse = (sp: URLSearchParams): StoreQuery => ({
  category: sp.get('category') ?? '',
  rating: sp.get('rating') ?? '',
  kind: sp.get('kind') ?? '',
  offers: sp.get('offers') === '1',
  sort: (sp.get('sort') as Sort | null) ?? 'rating',
});
const serialize = (q: StoreQuery) => {
  const sp = new URLSearchParams();
  if (q.category) sp.set('category', q.category);
  if (q.rating) sp.set('rating', q.rating);
  if (q.kind) sp.set('kind', q.kind);
  if (q.offers) sp.set('offers', '1');
  if (q.sort !== 'rating') sp.set('sort', q.sort);
  return sp;
};

/* what each store is, worked out once from the catalogue */
const sellsIn = (key: StoreKey) => new Set(CATALOG.filter((p) => p.store === key).map((p) => p.category));
const branchesOf = (key: StoreKey) => STORE_LOCATIONS.filter((l) => l.store === key).length;
const offerOf = (key: StoreKey) =>
  Math.max(0, ...CATALOG.filter((p) => p.store === key && p.oldPrice).map((p) => Math.round((1 - p.price / (p.oldPrice as number)) * 100)));

function filterStores(q: StoreQuery): LookStore[] {
  const out = ALL_STORES.filter((s) => {
    if (q.category && !sellsIn(s.key).has(q.category as never)) return false;
    if (q.rating && s.rating < Number(q.rating)) return false;
    if (q.kind === 'showroom' && branchesOf(s.key) === 0) return false;
    if (q.kind === 'online' && branchesOf(s.key) > 0) return false;
    if (q.offers && offerOf(s.key) === 0) return false;
    return true;
  });
  if (q.sort === 'products') return [...out].sort((a, b) => b.products - a.products);
  if (q.sort === 'name') return [...out].sort((a, b) => a.name.ar.localeCompare(b.name.ar, 'ar'));
  return [...out].sort((a, b) => b.rating - a.rating);
}

const storesLabel = (n: number, isAr: boolean) => (isAr ? `${n} ${n === 1 ? 'متجر' : n === 2 ? 'متجران' : n <= 10 ? 'متاجر' : 'متجر'}` : `${n} ${n === 1 ? 'store' : 'stores'}`);

function Facets({ query, update }: { query: StoreQuery; update: (patch: Partial<StoreQuery>) => void }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const groups: { key: 'category' | 'rating' | 'kind'; label: string; options: { key: string; label: string }[] }[] = [
    { key: 'category', label: t('What they sell', 'ما يبيعه'), options: CATEGORIES.map((c) => ({ key: c.key, label: c[lang] })) },
    { key: 'rating', label: t('Rating', 'التقييم'), options: [{ key: '4.8', label: t('4.8 and above', '4.8 فأكثر') }, { key: '4.5', label: t('4.5 and above', '4.5 فأكثر') }] },
    { key: 'kind', label: t('Store type', 'نوع المتجر'), options: [{ key: 'showroom', label: t('With a showroom', 'لديه معرض') }, { key: 'online', label: t('Online only', 'إلكتروني فقط') }] },
  ];
  const offers = filterStores({ ...query, offers: true }).length;
  return (
    <div>
      {groups.map((g) => (
        <fieldset key={g.key} className="border-t py-6" style={{ borderColor: HAIR }} data-testid={`store-facet-${g.key}`}>
          <legend className="sr-only">{g.label}</legend>
          <p className={eyebrowCls(isAr, 'text-[11px] text-[#171512] font-semibold')}>{g.label}</p>
          <ul className="mt-4 space-y-2.5">
            {g.options.map((o) => {
              const active = query[g.key] === o.key;
              const n = filterStores({ ...query, [g.key]: o.key }).length;
              const empty = n === 0 && !active;
              return (
                <li key={o.key}>
                  <button
                    type="button"
                    onClick={() => update({ [g.key]: active ? '' : o.key } as Partial<StoreQuery>)}
                    aria-pressed={active}
                    disabled={empty}
                    data-testid={`store-facet-${g.key}-${o.key}`}
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
      ))}
      {/* stores with something on sale */}
      <div className="border-y py-6" style={{ borderColor: HAIR }}>
        <button type="button" role="switch" aria-checked={query.offers} data-testid="store-facet-offers" onClick={() => update({ offers: !query.offers })} className="flex w-full items-center justify-between gap-3 text-start">
          <span className="flex items-center gap-3">
            <span className={eyebrowCls(isAr, 'text-[11px] text-[#171512] font-semibold')}>{t('Has offers', 'لديه عروض')}</span>
            <span className="text-[13px] text-[#5F5950]">{offers}</span>
          </span>
          <span aria-hidden className={`relative h-[18px] w-8 shrink-0 border transition-colors ${query.offers ? 'border-[#171512] bg-[#171512]' : 'border-[#171512]/40 bg-transparent'}`}>
            <span className={`absolute top-[2px] h-[12px] w-[12px] transition-all ${query.offers ? 'start-[16px] bg-white' : 'start-[2px] bg-[#171512]/40'}`} />
          </span>
        </button>
      </div>
    </div>
  );
}

function StoreCard({ s }: { s: LookStore; key?: string | number }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const pieces = CATALOG.filter((p) => p.store === s.key).slice(0, 4);
  const branches = branchesOf(s.key);
  const off = offerOf(s.key);
  return (
    <li className="flex flex-col border bg-white" style={{ borderColor: HAIR }} data-testid="store-card">
      <Link to={`${lookBase(1)}/store/${s.key}`} className="group relative flex items-center gap-4 px-5 pt-5">
        <StoreMark store={s} className={`h-16 w-16 text-[16px] ${s.mark ? 'border border-[#E8E4DC]' : ''}`} />
        <span className="min-w-0 flex-1">
          <span className={`block truncate text-[20px] font-extrabold leading-tight transition-colors group-hover:text-[#5A6B4D] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`}>{s.name[lang]}</span>
          <span className="mt-1 block truncate text-[14px] font-light" style={{ color: '#4A443C' }}>{s.specialty[lang]}</span>
        </span>
        {off > 0 && (
          <span className="shrink-0 rotate-[6deg] px-2.5 py-1 text-[12px] font-bold leading-none text-white" style={{ backgroundColor: RED }}>
            {t('Offers', 'عروض')}
          </span>
        )}
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
        <Link to={searchPath(1, { store: s.key })} className="px-3 py-2.5 text-[13px] font-medium" style={{ color: MUTED }}>{t('All pieces', 'كل القطع')}</Link>
      </div>
    </li>
  );
}

export function StoresPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [sp, setSp] = useSearchParams();
  const query = useMemo(() => parse(sp), [sp]);
  const list = useMemo(() => filterStores(query), [query]);
  const update = useCallback((patch: Partial<StoreQuery>) => setSp(serialize({ ...query, ...patch })), [query, setSp]);
  const clearAll = useCallback(() => setSp(serialize({ category: '', rating: '', kind: '', offers: false, sort: query.sort })), [query.sort, setSp]);

  const chips: { key: string; label: string; clear: () => void }[] = [];
  const cat = CATEGORIES.find((c) => c.key === query.category);
  if (cat) chips.push({ key: 'category', label: cat[lang], clear: () => update({ category: '' }) });
  if (query.rating) chips.push({ key: 'rating', label: t(`${query.rating}+`, `${query.rating} فأكثر`), clear: () => update({ rating: '' }) });
  if (query.kind) chips.push({ key: 'kind', label: query.kind === 'showroom' ? t('With a showroom', 'لديه معرض') : t('Online only', 'إلكتروني فقط'), clear: () => update({ kind: '' }) });
  if (query.offers) chips.push({ key: 'offers', label: t('Has offers', 'لديه عروض'), clear: () => update({ offers: false }) });

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

  const labelCls = eyebrowCls(isAr, 'text-[11px] text-[#5F5950]');

  return (
    <main className="pt-[72px]" data-testid="stores-page">
      <div className="mx-auto max-w-[1400px] px-6 pb-5 pt-6 md:px-10 md:pt-8" data-testid="catalog-head">
        <Breadcrumb items={[{ label: t('Home', 'الرئيسية'), to: lookBase(1) }, { label: t('Stores', 'المتاجر') }]} />
        <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className={`text-[26px] font-bold leading-tight text-[#171512] md:text-[30px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif]"}`}>{t('Stores', 'المتاجر')}</h1>
          <span className={labelCls}>{t(`${ALL_STORES.length} stores on Diyar`, `${ALL_STORES.length} متاجر على ديار`)}</span>
        </div>
      </div>

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
                <Facets query={query} update={update} />
              </div>
            </aside>

            <section className="py-6 lg:py-8" aria-label={t('Stores', 'المتاجر')}>
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
                  <p className={`hidden sm:block ${labelCls}`} data-testid="result-count">{storesLabel(list.length, isAr)}</p>
                </div>
                <label className="flex items-center gap-3">
                  <span className={`hidden sm:inline ${labelCls}`}>{t('Sort by', 'ترتيب حسب')}</span>
                  <span className="relative">
                    <select
                      data-testid="sort-select"
                      value={query.sort}
                      onChange={(e) => update({ sort: e.target.value as Sort })}
                      className={`h-11 appearance-none border bg-white ps-4 pe-10 text-[11.5px] uppercase text-[#171512] transition-colors hover:border-[#171512] focus:border-[#171512] focus:outline-none ${isAr ? 'tracking-normal' : 'tracking-[0.16em]'}`}
                      style={{ borderColor: HAIR }}
                    >
                      <option value="rating">{t('Top rated', 'الأعلى تقييماً')}</option>
                      <option value="products">{t('Most products', 'الأكثر منتجات')}</option>
                      <option value="name">{t('Name', 'الاسم')}</option>
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

              {list.length > 0 ? (
                <ul className="mt-8 grid gap-5 xl:grid-cols-2" data-testid="store-results">
                  {list.map((s) => (
                    <StoreCard key={s.key} s={s} />
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-start py-16" data-testid="no-results">
                  <p className="text-[15px]" style={{ color: MUTED }}>{t('No store matches these filters.', 'لا يوجد متجر يطابق هذه الفلاتر.')}</p>
                  <button type="button" onClick={clearAll} className={`mt-6 px-8 py-3.5 ${primaryBtnCls(isAr)}`}>{t('Clear filters', 'مسح الفلاتر')}</button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

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
                <Facets query={query} update={update} />
              </div>
              <div className="flex shrink-0 items-center gap-4 border-t px-6 py-4 pb-20" style={{ borderColor: HAIR }}>
                <button type="button" onClick={clearAll} className={`shrink-0 text-[11px] uppercase text-[#5F5950] underline-offset-4 hover:text-[#171512] hover:underline ${isAr ? 'tracking-normal' : 'tracking-[0.2em]'}`}>{t('Clear all', 'مسح الكل')}</button>
                <button type="button" onClick={closeSheet} className={`flex-1 py-4 ${primaryBtnCls(isAr)}`}>{t(`Show ${storesLabel(list.length, false)}`, `عرض ${storesLabel(list.length, true)}`)}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
