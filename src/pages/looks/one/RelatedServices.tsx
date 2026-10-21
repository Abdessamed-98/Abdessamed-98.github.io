/**
 * The services that go with a product, by its category (client note: «في تفاصيل
 * المنتج اظهار خدمات ذات صلة»). A sofa suggests made-to-measure furniture and a
 * design visit; a rug suggests flooring; a basin suggests tiling and glass.
 */
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SERVICES, SERVICES_MENU, type Bi, type CategoryKey, type LookService } from '../lookShared';
import { HAIR, MUTED, TILE, ViewMore, primaryBtnCls, useLook } from './ui';
import { useShell } from './shellContext';
import { SERVICE_GALLERY, providersFor } from './data';
import { categoryPath, servicePath } from './ServicePage';

/** [service category (English), menu item (English)] per product category */
const BY_CATEGORY: Record<CategoryKey, [string, string][]> = {
  home: [['Custom Furniture', 'Residential Furniture'], ['Interior Design', 'Residential Design'], ['Custom Furniture', 'Built-In Furniture'], ['Interior Design', 'Design Consultation']],
  office: [['Interior Design', 'Commercial Design'], ['Interior Design', 'Space Planning'], ['Custom Furniture', 'Built-In Furniture'], ['Glass & Skylight Facades', 'Glass Partitions']],
  lighting: [['Interior Design', 'Design Consultation'], ['Finishing & Decorative', 'Architectural Details'], ['Finishing & Decorative', 'Decorative Finishes'], ['Painting & Wall Finishes', 'Interior Painting']],
  rugs: [['Flooring Solutions', 'Carpet Flooring'], ['Flooring Solutions', 'Wooden Flooring'], ['Interior Design', 'Design Consultation'], ['Interior Design', 'Residential Design']],
  bath: [['Flooring Solutions', 'Porcelain Flooring'], ['Flooring Solutions', 'Marble Flooring'], ['Glass & Skylight Facades', 'Glass Partitions'], ['Painting & Wall Finishes', 'Interior Painting']],
  decor: [['Painting & Wall Finishes', 'Wallpaper Installation'], ['Painting & Wall Finishes', 'Wall Panels'], ['Interior Design', 'Design Consultation'], ['Finishing & Decorative', 'Decorative Finishes']],
};

export interface RelatedService { cat: LookService; item: Bi; img: string }

export function relatedServicesFor(category: CategoryKey): RelatedService[] {
  return (BY_CATEGORY[category] ?? []).flatMap(([catEn, itemEn]) => {
    const i = SERVICES.findIndex((s) => s.en === catEn);
    const item = SERVICES_MENU[i]?.items.find((x) => x.en === itemEn);
    if (i < 0 || !item) return [];
    const k = SERVICES_MENU[i].items.indexOf(item);
    const shots = SERVICE_GALLERY[catEn] ?? [];
    return [{ cat: SERVICES[i], item, img: shots[k % Math.max(1, shots.length)]?.img ?? SERVICES[i].img }];
  });
}

/** The full-width section on the product page. */
export function RelatedServicesSection({ category }: { category: CategoryKey }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { openService } = useShell();
  const list = relatedServicesFor(category);
  if (!list.length) return null;
  return (
    <section className="border-t py-12 md:py-16" style={{ borderColor: HAIR }} data-testid="related-services">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase" style={{ color: MUTED }}>{t('From Diyar partners', 'من شركاء ديار')}</p>
          <h2 className={`mt-2 text-[22px] font-extrabold md:text-[26px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`}>
            {t('Services for this product', 'خدمات ذات صلة بهذا المنتج')}
          </h2>
        </div>
        <ViewMore label={t('All services', 'كل الخدمات')} to="/look/1/services" />
      </div>
      <ul className="scrollbar-hide -mx-6 mt-7 flex snap-x gap-4 overflow-x-auto px-6 md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
        {list.map(({ cat, item, img }) => {
          const pros = providersFor(cat.en, item.en);
          return (
            <li key={`${cat.en}/${item.en}`} className="w-[70%] shrink-0 snap-start sm:w-[44%] md:w-[31%] lg:w-auto" data-testid="related-service">
              <div className="group flex h-full flex-col border bg-white" style={{ borderColor: HAIR }}>
                <Link to={servicePath(cat, item)} className="block aspect-[4/3] overflow-hidden" style={{ backgroundColor: TILE }}>
                  <img src={img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <Link to={categoryPath(cat)} className="text-[12px] font-medium" style={{ color: MUTED }}>{t(cat.en, cat.ar)}</Link>
                  <Link to={servicePath(cat, item)} className="mt-1 text-[15.5px] font-bold leading-snug transition-colors hover:text-[#5A6B4D]">{t(item.en, item.ar)}</Link>
                  {pros.length > 0 && (
                    <span className="mt-1.5 text-[13px]" style={{ color: MUTED }}>
                      {t(`${pros.length} ${pros.length === 1 ? 'provider' : 'providers'}`, `${pros.length} ${pros.length === 1 ? 'مقدم خدمة' : 'مقدمي خدمة'}`)}
                    </span>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <button type="button" data-testid="related-service-request" onClick={() => openService(`${t(cat.en, cat.ar)} · ${t(item.en, item.ar)}`)} className={`px-4 py-2 ${primaryBtnCls(isAr)}`}>
                      {t('Request', 'اطلب الخدمة')}
                    </button>
                    <Link to={servicePath(cat, item)} aria-label={t('Details', 'التفاصيل')} className="flex h-8 w-8 items-center justify-center border transition-colors hover:bg-[#171512] hover:text-white" style={{ borderColor: '#C9C2B4' }}>
                      <ArrowRight size={13} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
