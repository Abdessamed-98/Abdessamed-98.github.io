/**
 * Look 1 — Search / listing page.
 * All state lives in the URL (`?q=&category=&room=&style=&store=&price=&sale=1&sort=`);
 * filtering and sorting are delegated to `filterCatalog` in lookShared so every
 * look agrees on the results.
 */
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import {
  CATEGORIES, ROOMS, STYLES, ALL_STORES, PRICE_BANDS, SORT_OPTIONS,
  parseSearch, serializeSearch, filterCatalog, lookBase, searchPath,
  type Lang, type SearchQuery, type SortKey,
} from '../lookShared';
import {
  BG, INK, OLIVE, HAIR, TILE,
  useLook, SectionHeading, ProductCard, Breadcrumb, primaryBtnCls, eyebrowCls,
} from './ui';

type FacetKey = 'category' | 'room' | 'style' | 'store' | 'price';

interface FacetOption { key: string; label: string }
interface Facet { key: FacetKey; label: string; options: FacetOption[] }

const buildFacets = (lang: Lang, t: (en: string, ar: string) => string): Facet[] => [
  { key: 'category', label: t('Category', 'التصنيف'), options: CATEGORIES.map((c) => ({ key: c.key, label: c[lang] })) },
  { key: 'room', label: t('Room', 'الغرفة'), options: ROOMS.map((r) => ({ key: r.key, label: r[lang] })) },
  { key: 'style', label: t('Style', 'الأسلوب'), options: STYLES.map((s) => ({ key: s.key, label: s[lang] })) },
  { key: 'store', label: t('Store', 'المتجر'), options: ALL_STORES.map((s) => ({ key: s.key, label: s.name[lang] })) },
  { key: 'price', label: t('Price', 'السعر'), options: PRICE_BANDS.map((b) => ({ key: b.key, label: b.label[lang] })) },
];

const productsLabel = (n: number, isAr: boolean) =>
  isAr ? `${n} ${n === 1 ? 'منتج' : n === 2 ? 'منتجان' : n <= 10 ? 'منتجات' : 'منتج'}` : `${n} ${n === 1 ? 'product' : 'products'}`;

/* ------------------------------------------------------------------ */
/* Facet list — shared by the desktop sidebar and the mobile sheet     */
/* ------------------------------------------------------------------ */
function Facets({
  facets,
  query,
  lang,
  update,
}: {
  facets: Facet[];
  query: SearchQuery;
  lang: Lang;
  update: (patch: Partial<SearchQuery>) => void;
}) {
  const isAr = lang === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);
  const saleCount = filterCatalog({ ...query, sale: true }, lang).length;

  return (
    <div>
      {facets.map((f) => {
        const value = query[f.key] ?? '';
        return (
          <fieldset key={f.key} className="border-t py-6" style={{ borderColor: HAIR }} data-testid={`facet-${f.key}`}>
            <legend className="sr-only">{f.label}</legend>
            <p className={eyebrowCls(isAr, 'text-[10px] text-[#171512] font-semibold')}>{f.label}</p>
            <ul className="mt-4 space-y-2.5">
              {f.options.map((o) => {
                const active = value === o.key;
                const n = filterCatalog({ ...query, [f.key]: o.key }, lang).length;
                const empty = n === 0 && !active;
                return (
                  <li key={o.key}>
                    <button
                      type="button"
                      onClick={() => update({ [f.key]: active ? '' : o.key } as Partial<SearchQuery>)}
                      aria-pressed={active}
                      disabled={empty}
                      data-testid={`facet-${f.key}-${o.key}`}
                      className={`group flex w-full items-center justify-between gap-3 text-start text-[13px] transition-colors ${
                        empty ? 'cursor-default text-neutral-300' : active ? 'font-semibold text-[#171512]' : 'text-neutral-600 hover:text-[#171512]'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          aria-hidden
                          className={`h-3 w-3 shrink-0 border transition-colors ${
                            active
                              ? 'border-[#171512] bg-[#171512]'
                              : empty
                                ? 'border-[#171512]/15'
                                : 'border-[#171512]/40 group-hover:border-[#171512]'
                          }`}
                        />
                        <span className="truncate">{o.label}</span>
                      </span>
                      <span className={`shrink-0 text-[11px] ${empty ? 'text-neutral-300' : 'text-neutral-400'}`}>{n}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        );
      })}

      {/* on sale toggle */}
      <div className="border-y py-6" style={{ borderColor: HAIR }}>
        <button
          type="button"
          role="switch"
          aria-checked={!!query.sale}
          data-testid="facet-sale"
          onClick={() => update({ sale: !query.sale })}
          className="flex w-full items-center justify-between gap-3 text-start"
        >
          <span className="flex items-center gap-3">
            <span className={eyebrowCls(isAr, 'text-[10px] text-[#171512] font-semibold')}>{t('On sale', 'عروض التخفيض')}</span>
            <span className="text-[11px] text-neutral-400">{saleCount}</span>
          </span>
          <span
            aria-hidden
            className={`relative h-[18px] w-8 shrink-0 border transition-colors ${
              query.sale ? 'border-[#171512] bg-[#171512]' : 'border-[#171512]/40 bg-transparent'
            }`}
          >
            <span
              className={`absolute top-[2px] h-[12px] w-[12px] transition-all ${
                query.sale ? 'start-[16px] bg-white' : 'start-[2px] bg-[#171512]/40'
              }`}
            />
          </span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export function LookOneSearch() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [sp, setSp] = useSearchParams();

  const query = useMemo(() => parseSearch(sp), [sp]);
  const results = useMemo(() => filterCatalog(query, lang), [query, lang]);
  const facets = useMemo(() => buildFacets(lang, t), [lang, t]);

  const update = useCallback(
    (patch: Partial<SearchQuery>) => setSp(serializeSearch({ ...query, ...patch })),
    [query, setSp],
  );
  const clearAll = useCallback(() => setSp(serializeSearch({ sort: query.sort })), [query.sort, setSp]);

  /* search box mirrors the URL, submits on Enter */
  const [qInput, setQInput] = useState(query.q ?? '');
  useEffect(() => setQInput(query.q ?? ''), [query.q]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    update({ q: qInput.trim() });
  };

  /* mobile filter sheet */
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSheet();
    };
    const mq = window.matchMedia('(min-width: 1024px)');
    if (mq.matches) closeSheet();
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) closeSheet();
    };
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [sheetOpen, closeSheet]);

  /* names behind the active facets — for the title, the breadcrumb and the chips */
  const catName = CATEGORIES.find((c) => c.key === query.category)?.[lang];
  const roomName = ROOMS.find((r) => r.key === query.room)?.[lang];
  const styleName = STYLES.find((s) => s.key === query.style)?.[lang];
  const storeName = ALL_STORES.find((s) => s.key === query.store)?.name[lang];

  const title = query.q
    ? t(`Results for “${query.q}”`, `نتائج البحث عن «${query.q}»`)
    : catName ?? roomName ?? styleName ?? storeName ?? t('Shop', 'المتجر');

  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (query.q) chips.push({ key: 'q', label: `“${query.q}”`, clear: () => update({ q: '' }) });
  for (const f of facets) {
    const v = query[f.key];
    if (!v) continue;
    const o = f.options.find((x) => x.key === v);
    chips.push({ key: f.key, label: o?.label ?? String(v), clear: () => update({ [f.key]: '' } as Partial<SearchQuery>) });
  }
  if (query.sale) chips.push({ key: 'sale', label: t('On sale', 'عروض التخفيض'), clear: () => update({ sale: false }) });

  const crumbs = [
    { label: t('Home', 'الرئيسية'), to: lookBase(1) },
    { label: t('Shop', 'المتجر'), to: searchPath(1) },
    ...(catName ? [{ label: catName }] : []),
  ];

  const labelCls = eyebrowCls(isAr, 'text-[10px] text-neutral-400');

  return (
    <div data-testid="search-page" className="pt-[72px]">
      {/* ---------------------------------------------------------- */}
      {/* Title band                                                  */}
      {/* ---------------------------------------------------------- */}
      <div className="mx-auto max-w-[1400px] px-6 pt-8 pb-8 md:px-10 md:pt-12 md:pb-12">
        <Breadcrumb items={crumbs} />
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="min-w-0">
            <SectionHeading
              as="h1"
              size="sm"
              eyebrow={t('Catalogue', 'الكتالوج')}
              title={title}
            />
            <p className={`mt-4 ${labelCls}`} data-testid="result-count" aria-live="polite">
              {productsLabel(results.length, isAr)}
            </p>
          </div>

          <form role="search" onSubmit={submit} className="w-full lg:max-w-md">
            <label className="sr-only" htmlFor="look1-search">
              {t('Search products', 'ابحث عن المنتجات')}
            </label>
            <div className="flex h-12 items-center gap-3 border bg-white px-4 transition-colors focus-within:border-[#171512]" style={{ borderColor: HAIR }}>
              <Search size={16} strokeWidth={1.5} className="shrink-0 text-neutral-400" />
              <input
                id="look1-search"
                data-testid="search-input"
                type="search"
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder={t('Search sofas, lighting, stores…', 'ابحث عن أرائك، إنارات، متاجر…')}
                className="w-full min-w-0 bg-transparent text-[13px] text-[#171512] placeholder:text-neutral-400 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {qInput && (
                <button
                  type="button"
                  aria-label={t('Clear search', 'مسح البحث')}
                  onClick={() => {
                    setQInput('');
                    if (query.q) update({ q: '' });
                  }}
                  className="shrink-0 text-neutral-400 transition-colors hover:text-[#171512]"
                >
                  <X size={15} strokeWidth={1.5} />
                </button>
              )}
              <button
                type="submit"
                className={`-me-4 h-12 shrink-0 px-5 ${primaryBtnCls(isAr)}`}
              >
                {t('Search', 'بحث')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Sidebar + results                                           */}
      {/* ---------------------------------------------------------- */}
      <div className="border-t" style={{ borderColor: HAIR }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[264px_minmax(0,1fr)] xl:gap-16">
            {/* desktop sidebar */}
            <aside className="hidden lg:block" data-testid="filter-sidebar">
              <div className="scrollbar-hide sticky top-[72px] max-h-[calc(100vh-72px)] overflow-y-auto pt-8 pb-16">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className={eyebrowCls(isAr, 'text-[11px] text-[#171512] font-bold')}>{t('Filters', 'تصفية')}</p>
                  {chips.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className={`text-[10px] uppercase text-neutral-500 underline-offset-4 hover:text-[#171512] hover:underline ${isAr ? 'tracking-normal' : 'tracking-[0.2em]'}`}
                    >
                      {t('Clear all', 'مسح الكل')}
                    </button>
                  )}
                </div>
                <Facets facets={facets} query={query} lang={lang} update={update} />
              </div>
            </aside>

            {/* results column */}
            <section className="py-6 lg:py-8" aria-label={t('Search results', 'نتائج البحث')}>
              {/* toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    data-testid="filter-toggle"
                    onClick={() => setSheetOpen(true)}
                    aria-haspopup="dialog"
                    aria-expanded={sheetOpen}
                    className={`inline-flex h-11 items-center gap-2.5 border px-4 text-[11px] uppercase transition-colors hover:border-[#171512] lg:hidden ${
                      isAr ? 'tracking-normal' : 'tracking-[0.2em]'
                    }`}
                    style={{ borderColor: HAIR }}
                  >
                    <SlidersHorizontal size={15} strokeWidth={1.5} />
                    {t('Filters', 'تصفية')}
                    {chips.length > 0 && (
                      <span
                        className="flex h-4 min-w-4 items-center justify-center px-1 text-[9px] font-semibold text-white"
                        style={{ backgroundColor: OLIVE }}
                      >
                        {chips.length}
                      </span>
                    )}
                  </button>
                  <p className={`hidden sm:block ${labelCls}`}>{productsLabel(results.length, isAr)}</p>
                </div>

                <label className="flex items-center gap-3">
                  <span className={`hidden sm:inline ${labelCls}`}>{t('Sort by', 'ترتيب حسب')}</span>
                  <span className="relative">
                    <select
                      data-testid="sort-select"
                      value={query.sort ?? 'relevance'}
                      onChange={(e) => update({ sort: e.target.value as SortKey })}
                      className={`h-11 appearance-none border bg-white ps-4 pe-10 text-[11px] uppercase text-[#171512] transition-colors hover:border-[#171512] focus:border-[#171512] focus:outline-none ${
                        isAr ? 'tracking-normal' : 'tracking-[0.16em]'
                      }`}
                      style={{ borderColor: HAIR }}
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.key} value={o.key}>
                          {o.label[lang]}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: OLIVE }}
                    />
                  </span>
                </label>
              </div>

              {/* active filter chips */}
              {chips.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-2" data-testid="active-filters">
                  {chips.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={c.clear}
                      data-testid={`chip-${c.key}`}
                      aria-label={t(`Remove ${c.label}`, `إزالة ${c.label}`)}
                      className="inline-flex h-8 items-center gap-2 border bg-white px-3 text-[12px] transition-colors hover:border-[#171512]"
                      style={{ borderColor: HAIR }}
                    >
                      {c.label}
                      <X size={12} strokeWidth={1.5} className="text-neutral-400" />
                    </button>
                  ))}
                  <button
                    type="button"
                    data-testid="clear-filters"
                    onClick={clearAll}
                    className={`ms-1 text-[10px] uppercase text-neutral-500 underline-offset-4 transition-colors hover:text-[#171512] hover:underline ${
                      isAr ? 'tracking-normal' : 'tracking-[0.2em]'
                    }`}
                  >
                    {t('Clear all', 'مسح الكل')}
                  </button>
                </div>
              )}

              {/* grid */}
              {results.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  data-testid="search-results"
                  className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4"
                >
                  {results.map((p) => (
                    <ProductCard key={p.id} p={p} testId="result-card" />
                  ))}
                </motion.div>
              ) : (
                <div
                  data-testid="search-empty"
                  className="mt-8 flex flex-col items-center justify-center border px-6 py-24 text-center"
                  style={{ borderColor: HAIR, backgroundColor: TILE }}
                >
                  <p className={eyebrowCls(isAr, 'text-[10px]')} style={{ color: OLIVE }}>
                    {t('No results', 'لا توجد نتائج')}
                  </p>
                  <h2
                    className={`mt-4 text-2xl font-extrabold uppercase md:text-3xl ${
                      isAr ? "font-['Alexandria',sans-serif] leading-snug tracking-normal" : "font-['Outfit',sans-serif] leading-tight tracking-tight"
                    }`}
                  >
                    {t('Nothing matches yet', 'لم نجد ما يطابق بحثك')}
                  </h2>
                  <p className="mt-4 max-w-sm text-[14px] font-light leading-relaxed text-neutral-600">
                    {t(
                      'Try a different word, or loosen the filters to see more of the catalogue.',
                      'جرّب كلمة أخرى، أو خفف الفلاتر لترى المزيد من الكتالوج.',
                    )}
                  </p>
                  <button
                    type="button"
                    data-testid="empty-clear-filters"
                    onClick={clearAll}
                    className={`mt-8 px-10 py-4 ${primaryBtnCls(isAr)}`}
                  >
                    {t('Clear filters', 'مسح الفلاتر')}
                  </button>
                </div>
              )}

              {/* quiet tail — browse-by shortcuts under the grid */}
              {results.length > 0 && (
                <div className="mt-16 border-t pt-8" style={{ borderColor: HAIR }}>
                  <p className={labelCls}>{t('Browse by category', 'تصفح حسب التصنيف')}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <Link
                        key={c.key}
                        to={searchPath(1, { category: c.key })}
                        className={`border px-4 py-2 text-[11px] uppercase transition-colors hover:border-[#171512] ${
                          query.category === c.key ? 'border-[#171512] bg-[#171512] text-white' : 'bg-white'
                        } ${isAr ? 'tracking-normal' : 'tracking-[0.16em]'}`}
                        style={query.category === c.key ? undefined : { borderColor: HAIR }}
                      >
                        {c[lang]}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Mobile filter sheet                                         */}
      {/* ---------------------------------------------------------- */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              key="sheet-backdrop"
              aria-hidden
              onClick={closeSheet}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-0 z-[60] bg-[#171512]/50 lg:hidden"
            />
            <motion.div
              key="sheet-panel"
              role="dialog"
              aria-modal="true"
              aria-label={t('Filters', 'تصفية')}
              data-testid="filter-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[88vh] flex-col shadow-[0_-20px_60px_rgba(23,21,18,0.25)] lg:hidden"
              style={{ backgroundColor: BG, color: INK }}
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b px-6 py-4" style={{ borderColor: HAIR }}>
                <p
                  className={`text-[13px] font-bold uppercase ${
                    isAr ? "font-['Alexandria',sans-serif] tracking-normal" : "font-['Outfit',sans-serif] tracking-[0.18em]"
                  }`}
                >
                  {t('Filters', 'تصفية')}
                </p>
                <button
                  type="button"
                  data-testid="filter-sheet-close"
                  onClick={closeSheet}
                  aria-label={t('Close filters', 'إغلاق التصفية')}
                  className="-me-1 p-1 transition-colors hover:text-[#5A6B4D]"
                >
                  <X size={22} strokeWidth={1.25} />
                </button>
              </div>
              <div className="scrollbar-hide flex-1 overflow-y-auto overscroll-contain px-6">
                <Facets facets={facets} query={query} lang={lang} update={update} />
              </div>
              <div className="flex shrink-0 items-center gap-4 border-t px-6 py-4 pb-20" style={{ borderColor: HAIR }}>
                <button
                  type="button"
                  onClick={clearAll}
                  className={`shrink-0 text-[10px] uppercase text-neutral-500 underline-offset-4 hover:text-[#171512] hover:underline ${
                    isAr ? 'tracking-normal' : 'tracking-[0.2em]'
                  }`}
                >
                  {t('Clear all', 'مسح الكل')}
                </button>
                <button
                  type="button"
                  data-testid="filter-sheet-apply"
                  onClick={closeSheet}
                  className={`flex-1 py-4 ${primaryBtnCls(isAr)}`}
                >
                  {t(`Show ${productsLabel(results.length, false)}`, `عرض ${productsLabel(results.length, true)}`)}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
