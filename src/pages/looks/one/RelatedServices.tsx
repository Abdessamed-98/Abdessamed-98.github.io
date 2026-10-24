/**
 * The services that go with a product, by its category (client note: «في تفاصيل
 * المنتج اظهار خدمات ذات صلة»). A sofa suggests made-to-measure furniture and a
 * design visit; a rug suggests flooring; a basin suggests tiling and glass.
 * Each suggestion is a real service from the catalogue, shown as a service card.
 */
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { lookBase, type CategoryKey } from '../lookShared';
import { HAIR, INK, MUTED, useLook } from './ui';
import { SERVICE_CATALOG, type ServiceItem } from './servicesData';
import { ServiceCard } from './ServiceCard';

/** service categories per product category, in the order they are shown */
const BY_CATEGORY: Record<CategoryKey, string[]> = {
  home: ['Furniture Assembly', 'Custom Carpentry', 'Upholstery', 'Interior Design'],
  office: ['Furniture Assembly', 'Interior Design', 'Doors, Windows & Glass', 'Electrical & Lighting'],
  lighting: ['Electrical & Lighting', 'Gypsum & Ceilings', 'Interior Design', 'Painting & Wallpaper'],
  rugs: ['Cleaning', 'Flooring & Tiling', 'Interior Design', 'Upholstery'],
  bath: ['Plumbing', 'Flooring & Tiling', 'Doors, Windows & Glass', 'Insulation'],
  decor: ['Painting & Wallpaper', 'Curtains & Blinds', 'Furniture Assembly', 'Interior Design'],
};

/** The service category that installs a product of this category (the product page's «تركيب»). */
export const INSTALL_CATEGORY: Record<CategoryKey, string> = {
  home: 'Furniture Assembly',
  office: 'Furniture Assembly',
  lighting: 'Electrical & Lighting',
  rugs: 'Furniture Assembly',
  bath: 'Plumbing',
  decor: 'Furniture Assembly',
};

/** The best-rated service in each suggested category. */
export function relatedServicesFor(category: CategoryKey): ServiceItem[] {
  return (BY_CATEGORY[category] ?? []).flatMap((c) => {
    const best = SERVICE_CATALOG.filter((s) => s.category === c).sort((a, b) => Number(!!b.popular) - Number(!!a.popular) || b.rating - a.rating)[0];
    return best ? [best] : [];
  });
}

/** The full-width section on the product page. */
export function RelatedServicesSection({ category }: { category: CategoryKey }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
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
        <Link to={`${lookBase(1)}/services`} className="inline-flex items-center gap-2 border-b pb-1 text-[14px] font-medium transition-colors hover:text-[#5A6B4D]" style={{ borderColor: INK }}>
          {t('All services', 'كل الخدمات')}
          <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {list.map((s) => (
          <ServiceCard key={s.id} s={s} testId="related-service" />
        ))}
      </div>
    </section>
  );
}
