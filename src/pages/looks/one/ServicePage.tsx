/**
 * Look 1 — service routes and path helpers.
 *
 * Services have one level of categories and no subcategories: /services is the
 * catalogue, filtered by ?category=, and /services/:id is one service (one
 * provider's named offer). A category slug at /services/:id, and the older
 * /services/:category/:service and /service/:slug links, open the catalogue on
 * that category.
 */
import { Navigate, useParams } from 'react-router-dom';
import { SERVICES, lookBase, type Bi, type LookService } from '../lookShared';
import { serviceById } from './servicesData';
import { ServiceDetail } from './ServiceDetail';

const slugify = (en: string) => en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/** A category's slug. */
export const serviceSlug = (s: LookService) => slugify(s.en);
/** Category slugs from before the categories were redrawn, to their closest category now. */
const OLD_SLUGS: Record<string, string> = {
  'door-solutions': 'installation',
  'custom-furniture': 'custom-carpentry',
  'painting-wall-finishes': 'painting-wallpaper',
  'flooring-solutions': 'installation',
  'finishing-decorative': 'gypsum-ceilings',
  'glass-skylight-facades': 'installation',
  'safety-equipment-systems': 'security-cctv',
  // these became product categories; their services moved
  'furniture-assembly': 'installation',
  kitchens: 'custom-carpentry',
  'flooring-tiling': 'installation',
  'curtains-blinds': 'installation',
  'doors-windows-glass': 'installation',
};
/** A category by its slug (an old slug finds its successor). */
export const categoryBySlug = (slug: string) => SERVICES.find((s) => serviceSlug(s) === (OLD_SLUGS[slug] ?? slug));
/** A category's slug from its English name (what ServiceItem.category carries). */
export const categorySlugOf = (en: string) => slugify(en);
/** kept for callers that still pass a subcategory: services have none now */
export const subSlug = (it: Bi & { key?: string }) => it.key ?? slugify(it.en);

const base = () => `${lookBase(1)}/services`;
/** The catalogue, open on a category. */
export const categoryPath = (s: LookService) => `${base()}?category=${serviceSlug(s)}`;
export const categoryCatalogPath = categoryPath;
/** The catalogue on a category, from its English name. */
export const categoryPathOf = (categoryEn: string) => `${base()}?category=${categorySlugOf(categoryEn)}`;
/** kept for older callers: there are no subcategories, so this is the category */
export const servicePath = (s: LookService, _it?: unknown) => categoryPath(s);
/** One service's page. */
export const servicePathOf = (s: { id: string }) => `${base()}/${s.id}`;

/** /services/:id — a service; a category slug opens the catalogue on it. */
export default function ServiceRoute() {
  const { id = '' } = useParams();
  if (serviceById(id)) return <ServiceDetail id={id} />;
  const cat = categoryBySlug(id);
  if (cat) return <Navigate to={categoryPath(cat)} replace />;
  return <ServiceDetail id={id} />;
}

/** /services/:category/:service from before: the catalogue on that category. */
export function ServiceDetailPage() {
  const { category = '' } = useParams();
  const cat = categoryBySlug(category);
  return <Navigate to={cat ? categoryPath(cat) : base()} replace />;
}

/** /service/:slug from before the split: the catalogue on that category. */
export function LegacyServiceRedirect() {
  const { slug = '' } = useParams();
  const cat = categoryBySlug(slug);
  return <Navigate to={cat ? categoryPath(cat) : base()} replace />;
}
