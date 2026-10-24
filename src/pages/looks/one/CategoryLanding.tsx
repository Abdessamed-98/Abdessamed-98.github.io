/**
 * Look 1 — a product category's page: its subcategories as cards, each
 * opening the catalogue filtered to it, and a way to the whole list.
 * /products/:category. (Services have no subcategories: their categories open the catalogue.)
 */
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATALOG, CATEGORIES, PRODUCT_SUBS, lookBase, searchPath, type CategoryKey, type SubCat } from '../lookShared';
import { Breadcrumb, HAIR, MUTED, TILE, ViewMore, tileImg, useLook } from './ui';
import { CONTAINER, displayCls } from './kit';
import { NotFoundPage } from './InfoPages';

const home = (t: (en: string, ar: string) => string) => ({ label: t('Home', 'الرئيسية'), to: lookBase(1) });

/** One subcategory card: a picture from inside it (or the category's), its name and how many it holds. */
function SubCard({ to, img, contain, name, count, testId }: { to: string; img: string; contain?: boolean; name: string; count: string; testId: string }) {
  const { lang } = useLook();
  const isAr = lang === 'ar';
  return (
    <Link to={to} className="group block" data-testid={testId}>
      <span className="block aspect-[4/3] overflow-hidden" style={{ backgroundColor: TILE }}>
        <img src={img} alt="" loading="lazy" className={`h-full w-full transition-transform duration-700 ease-out group-hover:scale-105 ${contain ? 'object-contain p-6' : 'object-cover'}`} />
      </span>
      <span className="mt-3 flex items-center justify-between gap-3">
        <span className={`min-w-0 truncate text-[15px] font-bold decoration-[#5A6B4D] underline-offset-4 group-hover:underline ${isAr ? "font-['Alexandria',sans-serif]" : ''}`}>{name}</span>
        <ArrowRight size={13} strokeWidth={1.5} className={`shrink-0 transition-transform duration-300 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
      </span>
      <span className="mt-0.5 block text-[13px]" style={{ color: MUTED }}>{count}</span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

const productsLabel = (n: number, isAr: boolean) =>
  isAr ? `${n} ${n === 1 ? 'منتج' : n === 2 ? 'منتجان' : n <= 10 ? 'منتجات' : 'منتج'}` : `${n} ${n === 1 ? 'product' : 'products'}`;

export function ProductCategoryPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { category = '' } = useParams();
  const cat = CATEGORIES.find((c) => c.key === category);
  if (!cat) return <NotFoundPage />;
  const key = cat.key as CategoryKey;
  const inCat = CATALOG.filter((p) => p.category === key);
  const subs: SubCat[] = PRODUCT_SUBS[key];
  const allTo = `${lookBase(1)}/products?category=${key}`;

  return (
    <main className="pt-[72px]" data-testid="product-category-page">
      <div className={`${CONTAINER} pt-8`}>
        <Breadcrumb items={[home(t), { label: t('Products', 'المنتجات'), to: `${lookBase(1)}/products` }, { label: cat[lang] }]} />
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h1 className={displayCls(isAr, 'md')}>{cat[lang]}</h1>
            <span className="text-[14.5px]" style={{ color: MUTED }}>{t(`${subs.length} subcategories · ${productsLabel(inCat.length, false)}`, `${subs.length} أقسام فرعية · ${productsLabel(inCat.length, true)}`)}</span>
          </div>
          <ViewMore label={t(`All ${cat.en}`, `كل ${cat.ar}`)} to={allTo} />
        </div>
      </div>

      <div className={`${CONTAINER} pb-16 pt-8`}>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4" data-testid="subcategory-cards">
          {subs.map((sub) => {
            const inside = inCat.filter((p) => p.sub === sub.key);
            const first = inside[0];
            return (
              <li key={sub.key}>
                <SubCard
                  to={searchPath(1, { category: key, sub: sub.key })}
                  img={first ? tileImg(first.id, first.img) : cat.img}
                  contain={!!first && first.id <= 9}
                  name={sub[lang]}
                  count={productsLabel(inside.length, isAr)}
                  testId="subcategory-card"
                />
              </li>
            );
          })}
        </ul>
        <div className="mt-14 border-t pt-8" style={{ borderColor: HAIR }}>
          <p className="text-[11px] uppercase" style={{ color: MUTED }}>{t('Other categories', 'أقسام أخرى')}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.filter((c) => c.key !== key).map((c) => (
              <Link key={c.key} to={`${lookBase(1)}/products/${c.key}`} className="border bg-white px-4 py-2 text-[13px] transition-colors hover:border-[#171512]" style={{ borderColor: HAIR }}>
                {c[lang]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
