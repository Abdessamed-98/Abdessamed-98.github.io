/**
 * Look 2 — search / listing page.
 * All state lives in the URL (parseSearch / serializeSearch); results come
 * from the shared filterCatalog so every look agrees on what a query returns.
 */
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, Key, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import {
  CATEGORIES, ROOMS, STYLES, ALL_STORES, PRICE_BANDS, SORT_OPTIONS,
  parseSearch, serializeSearch, filterCatalog, storeOf, lookBase, searchPath,
} from '../lookShared';
import type { Bi, Lang, SearchQuery, SortKey } from '../lookShared';
import {
  LOOK, DISPLAY, CAPS, AR_DISPLAY, AR_LABEL, FIELD,
  useLook, ProductCard, Crumbs, goldBtn, accentLast, eyebrowCls, metaCls,
} from './ui';

/* ------------------------------------------------------------------ */
/* Facets                                                              */
/* ------------------------------------------------------------------ */
type FacetKey = 'category' | 'room' | 'style' | 'store' | 'price';

interface Facet { key: FacetKey; title: Bi; options: { key: string; label: Bi }[] }

const FACETS: Facet[] = [
  { key: 'category', title: { en: 'Category', ar: 'التصنيف' }, options: CATEGORIES.map((c) => ({ key: c.key, label: { en: c.en, ar: c.ar } })) },
  { key: 'room', title: { en: 'Room', ar: 'الغرفة' }, options: ROOMS.map((r) => ({ key: r.key, label: { en: r.en, ar: r.ar } })) },
  { key: 'style', title: { en: 'Style', ar: 'الأسلوب' }, options: STYLES.map((s) => ({ key: s.key, label: { en: s.en, ar: s.ar } })) },
  { key: 'store', title: { en: 'Store', ar: 'المتجر' }, options: ALL_STORES.map((s) => ({ key: s.key, label: s.name })) },
  { key: 'price', title: { en: 'Price', ar: 'السعر' }, options: PRICE_BANDS.map((b) => ({ key: b.key, label: b.label })) },
];

/** Return `qy` with one facet replaced (typed per key, no casts through `any`). */
function setFacet(qy: SearchQuery, key: FacetKey, value: string): SearchQuery {
  const next: SearchQuery = { ...qy };
  switch (key) {
    case 'category': next.category = value as SearchQuery['category']; break;
    case 'room': next.room = value as SearchQuery['room']; break;
    case 'style': next.style = value as SearchQuery['style']; break;
    case 'store': next.store = value as SearchQuery['store']; break;
    case 'price': next.price = value; break;
  }
  return next;
}

const facetLabel = (key: FacetKey, value: string, lang: Lang) =>
  FACETS.find((f) => f.key === key)?.options.find((o) => o.key === value)?.label[lang] ?? value;

/* ------------------------------------------------------------------ */
/* Filter panel — rendered in the desktop sidebar and the mobile sheet */
/* ------------------------------------------------------------------ */
function FacetSection({ title, children }: { title: string; children: ReactNode; key?: Key }) {
  const { isAr } = useLook();
  return (
    <div className="border-t border-[#C9A86A]/20 pt-5 pb-6">
      <p className={`${isAr ? `${AR_LABEL} text-[12px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.3em]`} uppercase text-[#C9A86A] mb-3`}>
        {title}
      </p>
      {children}
    </div>
  );
}

function FacetOption({
  label, count, selected, onClick, testId,
}: { label: string; count: number; selected: boolean; onClick: () => void; testId?: string; key?: Key }) {
  const { isAr } = useLook();
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={selected}
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center justify-between gap-3 py-2 text-start transition-colors duration-300 ${
        selected ? 'text-[#C9A86A]' : 'text-[#EFE9DD]/70 hover:text-[#EFE9DD]'
      } ${count === 0 && !selected ? 'opacity-40' : ''}`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className={`h-3 w-3 shrink-0 border transition-colors duration-300 ${selected ? 'border-[#C9A86A] bg-[#C9A86A]' : 'border-[#C9A86A]/40'}`} />
        <span className={`${isAr ? 'tracking-normal' : ''} truncate text-[13px] font-light`}>{label}</span>
      </span>
      <span className={`${metaCls(isAr)} shrink-0 text-[#C9A86A]/60`}>{count}</span>
    </button>
  );
}

function Filters({ query, onChange }: { query: SearchQuery; onChange: (next: SearchQuery) => void }) {
  const { lang, t } = useLook();
  const countFor = (next: SearchQuery) => filterCatalog(next, lang).length;
  return (
    <div>
      {FACETS.map((f) => (
        <FacetSection key={f.key} title={f.title[lang]}>
          <div className="-my-1">
            {f.options.map((o) => {
              const selected = query[f.key] === o.key;
              return (
                <FacetOption
                  key={o.key}
                  testId={`facet-${f.key}-${o.key}`}
                  label={o.label[lang]}
                  count={countFor(setFacet(query, f.key, o.key))}
                  selected={selected}
                  onClick={() => onChange(setFacet(query, f.key, selected ? '' : o.key))}
                />
              );
            })}
          </div>
        </FacetSection>
      ))}
      <FacetSection title={t('Offers', 'العروض')}>
        <div className="-my-1">
          <FacetOption
            testId="facet-sale"
            label={t('On sale only', 'المخفضة فقط')}
            count={countFor({ ...query, sale: true })}
            selected={!!query.sale}
            onClick={() => onChange({ ...query, sale: !query.sale })}
          />
        </div>
      </FacetSection>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function SearchPage() {
  const { lang, isAr, t } = useLook();
  const [sp, setSp] = useSearchParams();
  const query = useMemo(() => parseSearch(sp), [sp]);
  const results = useMemo(() => filterCatalog(query, lang), [query, lang]);

  const apply = (next: SearchQuery) => setSp(serializeSearch(next));
  const clearAll = () => apply({ sort: query.sort });

  /* The page's own search field: prefilled from the URL, submits on Enter. */
  const [draft, setDraft] = useState(query.q ?? '');
  useEffect(() => { setDraft(query.q ?? ''); }, [query.q]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    apply({ ...query, q: draft.trim() });
  };

  /* Mobile filter sheet (below lg). */
  const [sheet, setSheet] = useState(false);
  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSheet(false); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [sheet]);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => { if (mq.matches) setSheet(false); };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* Title: the query, else the narrowest scope, else the whole shop. */
  const category = CATEGORIES.find((c) => c.key === query.category);
  const scope =
    category?.[lang]
    ?? ROOMS.find((r) => r.key === query.room)?.[lang]
    ?? STYLES.find((s) => s.key === query.style)?.[lang]
    ?? (query.store ? storeOf(query.store).name[lang] : undefined)
    ?? t('The Shop', 'المتجر');
  const title = query.q
    ? (isAr
      ? <>نتائج البحث عن <span className="text-[#C9A86A]">«{query.q}»</span></>
      : <>Results for <em className="italic text-[#C9A86A]">“{query.q}”</em></>)
    : accentLast(scope, isAr);

  /* Active-filter chips. */
  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (query.q) chips.push({ key: 'q', label: isAr ? `«${query.q}»` : `“${query.q}”`, remove: () => apply({ ...query, q: '' }) });
  FACETS.forEach((f) => {
    const v = query[f.key];
    if (v) chips.push({ key: f.key, label: facetLabel(f.key, v, lang), remove: () => apply(setFacet(query, f.key, '')) });
  });
  if (query.sale) chips.push({ key: 'sale', label: t('On sale', 'مخفض'), remove: () => apply({ ...query, sale: false }) });

  const n = results.length;
  const countLabel = isAr ? `${n} منتج` : `${n} ${n === 1 ? 'product' : 'products'}`;
  const chipCls = `${isAr ? `${AR_LABEL} text-[11px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.2em]`} inline-flex cursor-pointer items-center gap-2 uppercase transition-colors duration-300`;

  return (
    <div data-testid="search-page" className="max-w-[1400px] mx-auto px-6 md:px-10 pt-8 md:pt-12 pb-24 md:pb-32">
      <Crumbs
        items={[
          { label: t('Home', 'الرئيسية'), to: lookBase(LOOK) },
          { label: t('Shop', 'المتجر'), to: searchPath(LOOK) },
          ...(category ? [{ label: category[lang] }] : []),
        ]}
      />

      {/* Title row + the page's search field */}
      <div className="mt-8 md:mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className={`${isAr ? `${AR_DISPLAY} leading-[1.35]` : `${DISPLAY} leading-[1.08]`} text-4xl md:text-6xl text-[#EFE9DD] break-words`}>
            {title}
          </h1>
          <p data-testid="result-count" className={`${metaCls(isAr)} uppercase text-[#C9A86A]/80 mt-4`}>
            {countLabel}
          </p>
        </div>
        <form
          role="search"
          onSubmit={submit}
          className="flex w-full items-center gap-3 border-b border-[#C9A86A]/40 pb-2.5 transition-colors duration-300 focus-within:border-[#C9A86A] lg:w-[380px] lg:shrink-0"
        >
          <Search size={16} strokeWidth={1.25} className="shrink-0 text-[#C9A86A]/70" />
          <input
            data-testid="search-input"
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('Search the marketplace…', 'ابحث في المتجر…')}
            aria-label={t('Search', 'بحث')}
            className="min-w-0 flex-1 bg-transparent text-[15px] font-light text-[#EFE9DD] outline-none placeholder:text-[#EFE9DD]/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {draft && (
            <button
              type="button"
              aria-label={t('Clear search', 'مسح البحث')}
              onClick={() => { setDraft(''); apply({ ...query, q: '' }); }}
              className="shrink-0 cursor-pointer text-[#EFE9DD]/40 transition-colors duration-300 hover:text-[#C9A86A]"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          )}
          <button type="submit" className={`${metaCls(isAr)} shrink-0 cursor-pointer uppercase text-[#C9A86A] transition-colors duration-300 hover:text-[#EFE9DD]`}>
            {t('SEARCH', 'بحث')}
          </button>
        </form>
      </div>

      <div className="mt-8 h-px bg-[#C9A86A]/20" />

      <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12 xl:gap-16">
        {/* Desktop sidebar */}
        <aside
          data-testid="filter-sidebar"
          className="hidden lg:block sticky top-[88px] self-start max-h-[calc(100vh-104px)] overflow-y-auto scrollbar-hide pt-6 pb-10"
        >
          <p className={`${eyebrowCls(isAr)} mb-5`}>{t('Refine', 'تصفية')}</p>
          <Filters query={query} onChange={apply} />
        </aside>

        <section className="min-w-0">
          {/* Toolbar: filters (mobile) · sort */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 py-5">
            <button
              type="button"
              data-testid="filter-toggle"
              onClick={() => setSheet(true)}
              className={`${isAr ? `${AR_LABEL} text-[12px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.25em]`} flex cursor-pointer items-center gap-2.5 border border-white/15 px-4 h-10 uppercase text-[#EFE9DD]/85 transition-colors duration-300 hover:border-[#C9A86A]/60 hover:text-[#C9A86A] lg:hidden`}
            >
              <SlidersHorizontal size={14} strokeWidth={1.25} className="text-[#C9A86A]" />
              {t('Filters', 'تصفية')}
              {chips.length > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C9A86A] px-1 text-[9px] font-medium text-[#131009]">
                  {chips.length}
                </span>
              )}
            </button>
            <span className={`${metaCls(isAr)} hidden uppercase text-[#EFE9DD]/45 lg:inline`}>{countLabel}</span>

            <label className="flex items-center gap-3">
              <span className={`${metaCls(isAr)} hidden uppercase text-[#EFE9DD]/45 sm:inline`}>{t('SORT BY', 'ترتيب حسب')}</span>
              <span className="relative">
                <select
                  data-testid="sort-select"
                  value={query.sort ?? 'relevance'}
                  onChange={(e) => apply({ ...query, sort: e.target.value as SortKey })}
                  className={`${FIELD} ${isAr ? `${AR_LABEL} text-[12px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.2em]`} h-10 cursor-pointer appearance-none uppercase ps-4 pe-9 focus:ring-1 focus:ring-[#C9A86A]/60 [&>option]:bg-[#1C1610] [&>option]:text-[#EFE9DD]`}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>{o.label[lang]}</option>
                  ))}
                </select>
                <ChevronDown size={13} strokeWidth={1.5} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[#C9A86A]/70" />
              </span>
            </label>
          </div>

          {/* Active filters */}
          {chips.length > 0 && (
            <div data-testid="active-filters" className="mt-5 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={c.remove}
                  className={`${chipCls} border border-[#C9A86A]/40 px-3 py-1.5 text-[#EFE9DD]/85 hover:border-[#C9A86A] hover:text-[#C9A86A]`}
                >
                  {c.label} <X size={11} strokeWidth={1.5} />
                </button>
              ))}
              <button
                type="button"
                data-testid="clear-filters"
                onClick={clearAll}
                className={`${chipCls} ms-1 py-1.5 text-[#C9A86A] underline-offset-4 hover:underline`}
              >
                {t('Clear all', 'مسح الكل')}
              </button>
            </div>
          )}

          {/* Results — a plain fade on each change, no scroll-triggered replays */}
          {n > 0 ? (
            <motion.div
              key={sp.toString()}
              data-testid="search-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4"
            >
              {results.map((p) => (
                <ProductCard key={p.id} p={p} testId="result-card" />
              ))}
            </motion.div>
          ) : (
            <div data-testid="search-empty" className="mt-6 border border-[#C9A86A]/20 bg-[#1C1610] px-6 py-20 text-center md:py-28">
              <p className={eyebrowCls(isAr)}>{t('No results', 'لا توجد نتائج')}</p>
              <h2 className={`${isAr ? `${AR_DISPLAY} leading-[1.4]` : `${DISPLAY} leading-[1.1]`} mt-5 text-3xl text-[#EFE9DD] md:text-4xl`}>
                {isAr
                  ? <>لم نجد ما يطابق <span className="text-[#C9A86A]">بحثك</span></>
                  : <>Nothing matches <em className="italic text-[#C9A86A]">this search</em></>}
              </h2>
              <p className={`${isAr ? 'tracking-normal' : ''} mx-auto mt-4 max-w-md font-light leading-relaxed text-[#EFE9DD]/55`}>
                {t('Try a different word, or loosen a filter or two.', 'جرّب كلمة أخرى، أو خفف بعض عوامل التصفية.')}
              </p>
              <button type="button" data-testid="clear-filters-empty" onClick={clearAll} className={`${goldBtn(isAr)} mt-10`}>
                {t('Clear filters', 'مسح الفلاتر')}
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div
              key="sheet-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={() => setSheet(false)}
              aria-hidden
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-[2px] lg:hidden"
            />
            <motion.div
              key="sheet-panel"
              data-testid="filter-sheet"
              role="dialog"
              aria-modal="true"
              aria-label={t('Filters', 'تصفية')}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.36, ease: 'easeOut' }}
              className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[88dvh] flex-col border-t border-[#C9A86A]/30 bg-[#131009] shadow-[0_-30px_80px_rgba(0,0,0,0.75)] lg:hidden"
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-5">
                <span className={eyebrowCls(isAr)}>{t('Filters', 'تصفية')}</span>
                <button
                  type="button"
                  onClick={() => setSheet(false)}
                  aria-label={t('Close filters', 'إغلاق التصفية')}
                  className="-me-2 cursor-pointer p-2 text-[#EFE9DD]/70 transition-colors duration-300 hover:text-[#C9A86A]"
                >
                  <X size={20} strokeWidth={1.25} />
                </button>
              </div>
              <div className="scrollbar-hide flex-1 overflow-y-auto overscroll-contain px-5 pt-2">
                <Filters query={query} onChange={apply} />
              </div>
              {/* Extra bottom padding keeps the footer clear of the floating LookSwitcher pill */}
              <div className="flex shrink-0 items-center gap-4 border-t border-[#C9A86A]/25 bg-[#1C1610] px-5 pt-4 pb-20">
                <button type="button" onClick={clearAll} className={`${chipCls} shrink-0 text-[#C9A86A] underline-offset-4 hover:underline`}>
                  {t('Clear all', 'مسح الكل')}
                </button>
                <button type="button" onClick={() => setSheet(false)} className={`${goldBtn(isAr)} flex-1`}>
                  {isAr ? `عرض ${n} منتج` : `Show ${n} ${n === 1 ? 'product' : 'products'}`}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
