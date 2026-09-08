/**
 * Look 3 — Search / listing page.
 * Museum entrance (centred breadcrumb, Playfair title, count, hairline search),
 * a sticky hairline-ruled facet sidebar (a slide-up sheet below `lg`), chips,
 * a hairline sort select and the look's product tiles.
 *
 * All state lives in the URL (parseSearch / serializeSearch); results come from
 * the shared filterCatalog so every look agrees on what a query returns.
 */
import { useEffect, useMemo, useState, type FormEvent, type Key } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import {
  CATEGORIES, ROOMS, STYLES, ALL_STORES, PRICE_BANDS, SORT_OPTIONS,
  parseSearch, serializeSearch, filterCatalog, lookBase, searchPath,
  type SearchQuery, type SortKey, type Lang,
  type CategoryKey, type RoomKey, type StyleKey, type StoreKey,
} from '../lookShared';
import {
  ALT, HAIR, INK, MUTED, BRONZE, CONTAINER, DRAWER_EASE,
  serif, headingLeading, eyebrowCls, capsCls, captionCls,
  useLook, HairButton, BronzeLink, ProductTile, Crumbs, type Crumb,
} from './ui';

type FacetId = 'category' | 'room' | 'style' | 'store' | 'price';
interface FacetOption { key: string; label: string; count: number }
interface Facet { id: FacetId; title: string; value: string; options: FacetOption[] }

type Translate = (en: string, ar: string) => string;

/* ------------------------------------------------------------------ */
/* Facets                                                              */
/* ------------------------------------------------------------------ */

/** One hairline-ruled facet: single-select, the active value in bronze with a short dash. */
function FacetSection({
  facet, onPick, lang,
}: { facet: Facet; onPick: (id: FacetId, value: string) => void; lang: Lang; key?: Key }) {
  return (
    <div className="border-t py-6" style={{ borderColor: HAIR }}>
      <h3 className={eyebrowCls(lang)} style={{ color: INK }}>
        {facet.title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {facet.options.map((o) => {
          const active = o.key === facet.value;
          return (
            <li key={o.key}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onPick(facet.id, active ? '' : o.key)}
                className={`flex w-full cursor-pointer items-center justify-between gap-3 text-start text-[13px] font-light transition-colors duration-300 hover:text-[#8A6D4F] ${
                  o.count === 0 && !active ? 'opacity-45' : ''
                }`}
                style={{ color: active ? BRONZE : INK }}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="block h-px transition-all duration-300"
                    style={{ backgroundColor: BRONZE, width: active ? 12 : 0 }}
                  />
                  {o.label}
                </span>
                <span dir="ltr" className="text-[10px] tracking-[0.08em]" style={{ color: MUTED }}>
                  {o.count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** "On sale" — a hairline square that fills with ink. */
function SaleToggle({
  on, count, onToggle, lang, t,
}: { on: boolean; count: number; onToggle: () => void; lang: Lang; t: Translate }) {
  return (
    <div className="border-t py-6" style={{ borderColor: HAIR }}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        data-testid="sale-toggle"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-start"
      >
        <span className="flex items-center gap-3">
          <span
            aria-hidden
            className="block h-[13px] w-[13px] border transition-colors duration-300"
            style={{
              borderColor: on ? INK : 'rgba(42,36,28,0.4)',
              backgroundColor: on ? INK : 'transparent',
            }}
          />
          <span className={eyebrowCls(lang)} style={{ color: on ? BRONZE : INK }}>
            {t('On Sale', 'العروض')}
          </span>
        </span>
        <span dir="ltr" className="text-[10px] tracking-[0.08em]" style={{ color: MUTED }}>
          {count}
        </span>
      </button>
    </div>
  );
}

function FacetPanel({
  facets, onPick, sale, saleCount, onSale, lang, t,
}: {
  facets: Facet[];
  onPick: (id: FacetId, value: string) => void;
  sale: boolean;
  saleCount: number;
  onSale: () => void;
  lang: Lang;
  t: Translate;
}) {
  return (
    <div className="border-b" style={{ borderColor: HAIR }}>
      {facets.map((f) => (
        <FacetSection key={f.id} facet={f} onPick={onPick} lang={lang} />
      ))}
      <SaleToggle on={sale} count={saleCount} onToggle={onSale} lang={lang} t={t} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function SearchPage() {
  const { lang, t } = useLook();
  const [sp, setSp] = useSearchParams();
  const query = useMemo(() => parseSearch(sp), [sp]);
  const results = useMemo(() => filterCatalog(query, lang), [query, lang]);

  const update = (patch: Partial<SearchQuery>) => setSp(serializeSearch({ ...query, ...patch }));
  const countWith = (patch: Partial<SearchQuery>) => filterCatalog({ ...query, ...patch }, lang).length;

  /* The search field is a draft until Enter — typing must not rewrite the URL per keystroke. */
  const [draft, setDraft] = useState(query.q ?? '');
  useEffect(() => { setDraft(query.q ?? ''); }, [query.q]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    update({ q: draft.trim() });
  };

  /* Mobile filter sheet — locks the page, closes on Escape and on growing past `lg`. */
  const [sheetOpen, setSheetOpen] = useState(false);
  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSheetOpen(false); };
    const onResize = () => { if (window.innerWidth >= 1024) setSheetOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [sheetOpen]);

  const facets: Facet[] = [
    {
      id: 'category', title: t('Category', 'التصنيف'), value: query.category ?? '',
      options: CATEGORIES.map((c) => ({ key: c.key, label: c[lang], count: countWith({ category: c.key }) })),
    },
    {
      id: 'room', title: t('Room', 'الغرفة'), value: query.room ?? '',
      options: ROOMS.map((r) => ({ key: r.key, label: r[lang], count: countWith({ room: r.key }) })),
    },
    {
      id: 'style', title: t('Style', 'الأسلوب'), value: query.style ?? '',
      options: STYLES.map((s) => ({ key: s.key, label: s[lang], count: countWith({ style: s.key }) })),
    },
    {
      id: 'store', title: t('Store', 'المتجر'), value: query.store ?? '',
      options: ALL_STORES.map((s) => ({ key: s.key, label: s.name[lang], count: countWith({ store: s.key }) })),
    },
    {
      id: 'price', title: t('Price', 'السعر'), value: query.price ?? '',
      options: PRICE_BANDS.map((b) => ({ key: b.key, label: b.label[lang], count: countWith({ price: b.key }) })),
    },
  ];
  const pick = (id: FacetId, value: string) => {
    switch (id) {
      case 'category': update({ category: value as CategoryKey | '' }); break;
      case 'room': update({ room: value as RoomKey | '' }); break;
      case 'style': update({ style: value as StyleKey | '' }); break;
      case 'store': update({ store: value as StoreKey | '' }); break;
      case 'price': update({ price: value }); break;
    }
  };
  const saleCount = countWith({ sale: true });

  const category = CATEGORIES.find((c) => c.key === query.category);
  const room = ROOMS.find((r) => r.key === query.room);
  const style = STYLES.find((s) => s.key === query.style);
  const store = ALL_STORES.find((s) => s.key === query.store);
  const band = PRICE_BANDS.find((b) => b.key === query.price);

  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (query.q) chips.push({ key: 'q', label: lang === 'ar' ? `«${query.q}»` : `“${query.q}”`, clear: () => update({ q: '' }) });
  if (category) chips.push({ key: 'category', label: category[lang], clear: () => update({ category: '' }) });
  if (room) chips.push({ key: 'room', label: room[lang], clear: () => update({ room: '' }) });
  if (style) chips.push({ key: 'style', label: style[lang], clear: () => update({ style: '' }) });
  if (store) chips.push({ key: 'store', label: store.name[lang], clear: () => update({ store: '' }) });
  if (band) chips.push({ key: 'price', label: band.label[lang], clear: () => update({ price: '' }) });
  if (query.sale) chips.push({ key: 'sale', label: t('On Sale', 'العروض'), clear: () => update({ sale: false }) });
  const filterCount = chips.filter((c) => c.key !== 'q').length;
  const clearAll = () => setSp(serializeSearch({ sort: query.sort }));

  const title = query.q
    ? lang === 'ar' ? `نتائج البحث عن «${query.q}»` : `Results for “${query.q}”`
    : category?.[lang] ?? room?.[lang] ?? style?.[lang] ?? store?.name[lang] ?? t('Shop', 'المتجر');
  const countLabel =
    lang === 'ar'
      ? `${results.length} قطعة`
      : `${results.length} ${results.length === 1 ? 'piece' : 'pieces'}`;

  const narrowed = !!(query.q || category || room || style || store);
  const crumbs: Crumb[] = [
    { label: t('Home', 'الرئيسية'), to: lookBase(3) },
    { label: t('Shop', 'المتجر'), to: narrowed ? searchPath(3) : undefined },
  ];
  if (category) crumbs.push({ label: category[lang], to: query.q ? searchPath(3, { category: category.key }) : undefined });
  else if (room) crumbs.push({ label: room[lang] });
  else if (style) crumbs.push({ label: style[lang] });
  else if (store) crumbs.push({ label: store.name[lang] });
  if (query.q) crumbs.push({ label: t('Search', 'البحث') });

  const facetPanel = (
    <FacetPanel
      facets={facets}
      onPick={pick}
      sale={!!query.sale}
      saleCount={saleCount}
      onSale={() => update({ sale: !query.sale })}
      lang={lang}
      t={t}
    />
  );

  return (
    <div data-testid="search-page" className="pt-[72px]">
      {/* Museum entrance — centred, on the white band */}
      <section style={{ backgroundColor: ALT }}>
        <div className={`${CONTAINER} flex flex-col items-center py-16 text-center md:py-20`}>
          <span className="h-px w-10" style={{ backgroundColor: BRONZE }} />
          <Crumbs items={crumbs} lang={lang} className="mt-6" />
          <h1
            data-testid="search-title"
            className={`${serif(lang)} mt-5 max-w-3xl text-4xl md:text-5xl ${headingLeading(lang, 'leading-[1.12]')}`}
            style={{ color: INK }}
          >
            {title}
          </h1>
          <p data-testid="result-count" className={`mt-4 ${captionCls(lang)}`} style={{ color: MUTED }}>
            {countLabel}
          </p>

          <form
            role="search"
            onSubmit={submit}
            className="mt-10 flex h-12 w-full max-w-md items-center gap-3 border bg-white px-4"
            style={{ borderColor: HAIR }}
          >
            <Search size={15} strokeWidth={1.5} className="shrink-0" style={{ color: MUTED }} />
            <input
              data-testid="search-input"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t('Search the collection', 'ابحث في التشكيلة')}
              aria-label={t('Search the collection', 'ابحث في التشكيلة')}
              className={`w-full min-w-0 bg-transparent text-[13px] font-light outline-none placeholder:text-[#8B8378] ${
                lang === 'ar' ? 'tracking-normal' : 'tracking-[0.06em]'
              }`}
              style={{ color: INK }}
            />
            {draft && (
              <button
                type="button"
                aria-label={t('Clear search', 'مسح البحث')}
                onClick={() => { setDraft(''); update({ q: '' }); }}
                className="shrink-0 cursor-pointer transition-opacity duration-300 hover:opacity-60"
                style={{ color: MUTED }}
              >
                <X size={14} strokeWidth={1.25} />
              </button>
            )}
          </form>
        </div>
      </section>

      {/* Catalogue — sidebar and plates */}
      <section className={`${CONTAINER} pb-28 pt-12 md:pt-16`}>
        <div className="grid items-start gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block" data-testid="filter-sidebar">
            <div className="sticky top-[96px]">
              <p className={eyebrowCls(lang)} style={{ color: MUTED }}>
                {t('Refine', 'تصفية النتائج')}
              </p>
              <div className="mt-5">{facetPanel}</div>
            </div>
          </aside>

          <div>
            {/* Toolbar — filters (phone), count, sort */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5" style={{ borderColor: HAIR }}>
              <div className="flex items-center gap-5">
                <HairButton
                  lang={lang}
                  size="sm"
                  testId="filter-toggle"
                  className="lg:hidden"
                  onClick={() => setSheetOpen(true)}
                  label={
                    <span className="inline-flex items-center gap-2">
                      <SlidersHorizontal size={12} strokeWidth={1.25} />
                      {t('Filters', 'تصفية')}
                      {filterCount > 0 && (
                        <span dir="ltr" style={{ color: BRONZE }}>({filterCount})</span>
                      )}
                    </span>
                  }
                />
                <span className={`hidden sm:inline ${captionCls(lang)}`} style={{ color: MUTED }}>
                  {countLabel}
                </span>
              </div>

              <label className="inline-flex items-center gap-3">
                <span className={`hidden sm:inline ${captionCls(lang)}`} style={{ color: MUTED }}>
                  {t('Sort by', 'ترتيب حسب')}
                </span>
                <span className="relative inline-flex items-center">
                  <select
                    data-testid="sort-select"
                    value={query.sort ?? 'relevance'}
                    onChange={(e) => update({ sort: e.target.value as SortKey })}
                    className={`cursor-pointer appearance-none border bg-transparent py-2.5 pe-9 ps-4 outline-none ${capsCls(lang)}`}
                    style={{ borderColor: HAIR, color: INK }}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label[lang]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    strokeWidth={1.25}
                    className="pointer-events-none absolute end-3"
                    style={{ color: BRONZE }}
                  />
                </span>
              </label>
            </div>

            {/* Active filters */}
            {chips.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2" data-testid="active-filters">
                {chips.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={c.clear}
                    aria-label={`${t('Remove', 'إزالة')} ${c.label}`}
                    className={`inline-flex cursor-pointer items-center gap-2 border px-3 py-1.5 transition-colors duration-300 hover:border-[#8A6D4F] ${captionCls(lang)}`}
                    style={{ borderColor: HAIR, backgroundColor: ALT, color: INK }}
                  >
                    {c.label}
                    <X size={11} strokeWidth={1.25} style={{ color: BRONZE }} />
                  </button>
                ))}
                <BronzeLink
                  lang={lang}
                  className="ms-2"
                  testId="clear-filters"
                  onClick={clearAll}
                  label={t('Clear all', 'مسح الكل')}
                />
              </div>
            )}

            {/* Results */}
            <div data-testid="search-results" className="mt-10">
              {results.length === 0 ? (
                <div
                  data-testid="search-empty"
                  className="flex flex-col items-center border px-6 py-20 text-center"
                  style={{ borderColor: HAIR, backgroundColor: ALT }}
                >
                  <span className="h-px w-10" style={{ backgroundColor: BRONZE }} />
                  <p className={`mt-6 ${eyebrowCls(lang)}`} style={{ color: MUTED }}>
                    {t('Nothing on This Wall', 'لا شيء على هذا الجدار')}
                  </p>
                  <h2
                    className={`${serif(lang)} mt-4 text-3xl ${headingLeading(lang, 'leading-[1.15]')}`}
                    style={{ color: INK }}
                  >
                    {t('No Pieces Match Your Filters', 'لا توجد قطع مطابقة')}
                  </h2>
                  <p className="mt-3 max-w-sm text-[14px] font-light leading-relaxed" style={{ color: MUTED }}>
                    {t(
                      'Try a broader search, or clear the filters to see the whole collection.',
                      'جرّب بحثاً أوسع، أو امسح عوامل التصفية لعرض التشكيلة كاملة.',
                    )}
                  </p>
                  <div className="mt-8">
                    <HairButton lang={lang} onClick={clearAll} label={t('Clear Filters', 'مسح التصفية')} />
                  </div>
                </div>
              ) : (
                <motion.div
                  key={`${sp.toString()}|${lang}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4 xl:gap-x-8"
                >
                  {results.map((p) => (
                    <ProductTile key={p.id} p={p} lang={lang} testId="result-card" />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter sheet — below `lg` the sidebar slides up from the foot of the page */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            key="sheet-scrim"
            aria-hidden
            onClick={() => setSheetOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: DRAWER_EASE }}
            className="fixed inset-0 z-[60] bg-[#1B1712]/45 lg:hidden"
          />
        )}
        {sheetOpen && (
          <motion.div
            key="sheet-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t('Filters', 'تصفية')}
            data-testid="filter-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: DRAWER_EASE }}
            className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[86vh] flex-col border-t lg:hidden"
            style={{ backgroundColor: ALT, borderColor: HAIR, color: INK }}
          >
            <div className="flex shrink-0 items-center justify-between border-b px-6 py-4" style={{ borderColor: HAIR }}>
              <span className={eyebrowCls(lang)} style={{ color: INK }}>
                {t('Filters', 'تصفية')}
              </span>
              <button
                type="button"
                data-testid="filter-sheet-close"
                aria-label={t('Close filters', 'إغلاق التصفية')}
                onClick={() => setSheetOpen(false)}
                className="-me-2 cursor-pointer p-2 transition-opacity duration-300 hover:opacity-60"
              >
                <X size={18} strokeWidth={1.25} />
              </button>
            </div>
            <div className="scrollbar-hide flex-1 overflow-y-auto overscroll-contain px-6 pt-2">
              {facetPanel}
            </div>
            <div className="flex shrink-0 items-center gap-4 border-t px-6 py-4" style={{ borderColor: HAIR }}>
              <HairButton
                lang={lang}
                tone="fill"
                size="block"
                className="flex-1"
                onClick={() => setSheetOpen(false)}
                label={`${t('Show', 'عرض')} ${countLabel}`}
              />
              {chips.length > 0 && (
                <BronzeLink lang={lang} onClick={clearAll} label={t('Clear all', 'مسح الكل')} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
