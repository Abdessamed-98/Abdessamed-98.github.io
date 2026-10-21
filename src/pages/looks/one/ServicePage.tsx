/**
 * Look 1 — service routes and path helpers.
 *
 * Services browse exactly like products: /services is the catalogue, filtered
 * by ?category=&sub=, and /services/:id is one service (one provider's named
 * offer). The old /services/:category and /services/:category/:service pages
 * are kept only as redirects into the catalogue.
 */
import { Navigate, useParams } from 'react-router-dom';
import { SERVICES, SERVICE_SUBS, lookBase, type Bi, type LookService } from '../lookShared';
import { serviceById } from './servicesData';
import { ServiceDetail } from './ServiceDetail';
import { ServiceCategoryPage } from './CategoryLanding';

const slugify = (en: string) => en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/** A category's slug (the eight in SERVICES). */
export const serviceSlug = (s: LookService) => slugify(s.en);
/** A category by its slug. */
export const categoryBySlug = (slug: string) => SERVICES.find((s) => serviceSlug(s) === slug);
/** A category's slug from its English name (what ServiceItem.category carries). */
export const categorySlugOf = (en: string) => slugify(en);
/** A subcategory's key. */
export const subSlug = (it: Bi & { key?: string }) => it.key ?? slugify(it.en);
/** The subcategories of a category. */
export const subServicesOf = (s: LookService) => SERVICE_SUBS[s.en] ?? [];

const base = () => `${lookBase(1)}/services`;
/** The category's page: its subcategories as cards. */
export const categoryPath = (s: LookService) => `${base()}/${serviceSlug(s)}`;
/** The catalogue, open on a category. */
export const categoryCatalogPath = (s: LookService) => `${base()}?category=${serviceSlug(s)}`;
/** The catalogue, open on a subcategory. */
export const servicePath = (s: LookService, it: Bi & { key?: string }) => `${base()}?category=${serviceSlug(s)}&sub=${subSlug(it)}`;
export const subPath = (categoryEn: string, subKey: string) => `${base()}?category=${categorySlugOf(categoryEn)}&sub=${subKey}`;
/** One service's page. */
export const servicePathOf = (s: { id: string }) => `${base()}/${s.id}`;
/** kept for callers written before categories and services were split */
export const subServicePath = servicePath;

/* The client's own "خدمات ديار" artwork (public/categories/tiles), one tile per category. */
const TILE_ART = (name: string) => `/categories/tiles/${name}.jpg`;
const CATEGORY_ART: Record<string, string> = {
  'Interior Design': 'تصميم داخلي',
  'Door Solutions': 'نجارة مخصصة',
  'Custom Furniture': 'تنجيد وتجديد',
  'Painting & Wall Finishes': 'دهانات',
  'Flooring Solutions': 'تركيب وصيانة',
  'Finishing & Decorative': 'ديكورات',
  'Glass & Skylight Facades': 'تركيب الستائر',
  'Safety Equipment & Systems': 'إضاءة وكهرباء',
};
export const categoryArt = (s: LookService) => TILE_ART(CATEGORY_ART[s.en] ?? 'تركيب وصيانة');

/** /services/:id — a service, or a category's page when the id is a category slug. */
export default function ServiceRoute() {
  const { id = '' } = useParams();
  if (serviceById(id)) return <ServiceDetail id={id} />;
  const cat = categoryBySlug(id);
  if (cat) return <ServiceCategoryPage cat={cat} />;
  return <ServiceDetail id={id} />;
}

/** /services/:category/:service from before the catalogue: into the catalogue, on that subcategory. */
export function ServiceDetailPage() {
  const { category = '', service = '' } = useParams();
  const cat = categoryBySlug(category);
  if (!cat) return <Navigate to={base()} replace />;
  const sub = subServicesOf(cat).find((x) => x.key === service || slugify(x.en) === service);
  return <Navigate to={sub ? servicePath(cat, sub) : categoryPath(cat)} replace />;
}

/** /service/:slug from before the split: to the category, or to the subcategory if ?sub= named one. */
export function LegacyServiceRedirect() {
  const { slug = '' } = useParams();
  const sub = new URLSearchParams(window.location.search).get('sub') ?? '';
  const cat = categoryBySlug(slug);
  if (!cat) return <Navigate to={base()} replace />;
  const it = subServicesOf(cat).find((x) => x.key === sub || slugify(x.en) === sub);
  return <Navigate to={it ? servicePath(cat, it) : categoryPath(cat)} replace />;
}
