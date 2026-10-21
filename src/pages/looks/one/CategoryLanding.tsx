/**
 * Look 1 — a category's page, on both sides: its subcategories as cards, each
 * opening the catalogue filtered to it, and a way to the whole list.
 * /products/:category and /services/:category.
 */
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATALOG, CATEGORIES, PRODUCT_SUBS, SERVICES, lookBase, searchPath, type CategoryKey, type LookService, type SubCat } from '../lookShared';
import { Breadcrumb, HAIR, INK, MUTED, OLIVE, TILE, ViewMore, primaryBtnCls, tileImg, useLook } from './ui';
import { useShell } from './shellContext';
import { CONTAINER, displayCls } from './kit';
import { NotFoundPage } from './InfoPages';
import { SERVICE_CATALOG } from './servicesData';
import { categoryArt, categoryCatalogPath, servicePath, serviceSlug, subServicesOf } from './ServicePage';

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

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

const CATEGORY_GROUND: Record<string, string> = {
  'Interior Design': '#25433D',
  'Door Solutions': '#1F3F3A',
  'Custom Furniture': '#1D3532',
  'Painting & Wall Finishes': '#213F3A',
  'Flooring Solutions': '#1B3431',
  'Finishing & Decorative': '#182E2C',
  'Glass & Skylight Facades': '#172C2A',
  'Safety Equipment & Systems': '#192E2C',
};

const servicesLabel = (n: number, isAr: boolean) =>
  isAr ? `${n} ${n === 1 ? 'خدمة' : n === 2 ? 'خدمتان' : n <= 10 ? 'خدمات' : 'خدمة'}` : `${n} ${n === 1 ? 'service' : 'services'}`;

export function ServiceCategoryPage({ cat }: { cat: LookService }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { openService } = useShell();
  const inCat = SERVICE_CATALOG.filter((s) => s.category === cat.en);
  const subs = subServicesOf(cat);
  const feather = 'radial-gradient(closest-side, #000 72%, transparent 100%)';
  const crumbs = [home(t), { label: t('Services', 'الخدمات'), to: `${lookBase(1)}/services` }, { label: t(cat.en, cat.ar) }];

  return (
    <main className="pt-[72px]" data-testid="service-category-page">
      {/* the client's artwork at one end, the name at the other, on the tile's own green */}
      <div style={{ backgroundColor: CATEGORY_GROUND[cat.en] ?? '#1F3D3A' }} data-testid="category-hero">
        <div className={`${CONTAINER} grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_auto]`}>
          <div className="pb-4 pt-8 md:py-10">
            <nav className="flex flex-wrap items-center gap-2 text-[12.5px] text-white/55" aria-label={t('Breadcrumb', 'مسار التنقل')}>
              {crumbs.map((c, i) => (
                <span key={c.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {c.to ? <Link to={c.to} className="transition-colors hover:text-white">{c.label}</Link> : <span className="text-white/85">{c.label}</span>}
                </span>
              ))}
            </nav>
            <h1 className={`mt-4 font-extrabold text-white ${isAr ? "font-['Alexandria',sans-serif] text-3xl leading-[1.2] md:text-[44px]" : "font-['Outfit',sans-serif] text-3xl uppercase leading-[1.05] tracking-tight md:text-[44px]"}`}>
              {t(cat.en, cat.ar)}
            </h1>
            <p className="mt-3 text-[15px] text-white/70">{t(`${subs.length} subcategories · ${servicesLabel(inCat.length, false)}`, `${subs.length} أقسام فرعية · ${servicesLabel(inCat.length, true)}`)}</p>
            <Link to={categoryCatalogPath(cat)} className="mt-6 inline-flex items-center gap-2 border-b border-white/60 pb-1 text-[13px] font-medium text-white transition-colors hover:border-white" data-testid="category-all">
              {t(`All ${cat.en} services`, `كل خدمات ${cat.ar}`)}
              <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
            </Link>
          </div>
          <img src={categoryArt(cat)} alt="" className="mx-auto -mt-2 h-[160px] w-auto md:mt-0 md:h-[260px]" style={{ WebkitMaskImage: feather, maskImage: feather }} />
        </div>
      </div>

      <div className={`${CONTAINER} pb-16 pt-10 md:pt-14`}>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className={`text-[22px] font-extrabold md:text-[26px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`}>
            {t(`Services in ${cat.en}`, `خدمات ${cat.ar}`)} <span className="font-normal" style={{ color: MUTED }}>· {subs.length}</span>
          </h2>
          <button type="button" onClick={() => openService({ category: cat.en })} className="border-b pb-0.5 text-[14px] font-medium" style={{ borderColor: INK }} data-testid="category-ask">
            {t('Not sure which? Ask us', 'لست متأكداً أيها تحتاج؟ اسألنا')}
          </button>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="subcategory-cards">
          {subs.map((sub, i) => {
            const inside = inCat.filter((s) => s.sub === sub.key);
            return (
              <li key={sub.key} className="flex flex-col border bg-white" style={{ borderColor: HAIR }} data-testid="subcategory-card">
                <div className="px-5 pt-5">
                  <div className="flex items-start gap-4">
                    <span className="font-['Outfit',sans-serif] text-[12px] font-bold tabular-nums" style={{ color: OLIVE }} dir="ltr">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <Link to={servicePath(cat, sub)} className="block text-[17px] font-bold leading-snug transition-colors hover:text-[#5A6B4D]">
                        {t(sub.en, sub.ar)}
                      </Link>
                      <span className="mt-1 block text-[13px]" style={{ color: MUTED }}>{servicesLabel(inside.length, isAr)}</span>
                    </span>
                  </div>
                </div>
                <div className="mt-auto flex items-center gap-3 px-5 pb-5 pt-6">
                  <button
                    type="button"
                    data-testid="subcategory-request"
                    onClick={() => openService({ category: cat.en, sub: sub.key })}
                    className={`px-5 py-2.5 ${primaryBtnCls(isAr)}`}
                  >
                    {t('Request execution', 'طلب تنفيذ')}
                  </button>
                  <Link to={servicePath(cat, sub)} className="inline-flex items-center gap-1.5 px-3 py-2.5 text-[14px] font-medium transition-colors hover:text-[#5A6B4D]" style={{ color: MUTED }}>
                    {t('Details', 'التفاصيل')}
                    <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-14 border-t pt-8" style={{ borderColor: HAIR }}>
          <p className="text-[11px] uppercase" style={{ color: MUTED }}>{t('Other categories', 'أقسام أخرى')}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SERVICES.filter((c) => c.en !== cat.en).map((c) => (
              <Link key={c.en} to={`${lookBase(1)}/services/${serviceSlug(c)}`} className="border bg-white px-4 py-2 text-[13px] transition-colors hover:border-[#171512]" style={{ borderColor: HAIR, color: INK }}>
                {t(c.en, c.ar)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
