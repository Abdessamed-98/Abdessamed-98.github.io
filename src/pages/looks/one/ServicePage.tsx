/**
 * Look 1 — service categories and services.
 *
 * The same shape as the mega menu: the eight headings are categories, and the
 * items under each are the services. A category page lists its services; a
 * service page is where a service is requested. URLs follow the shape:
 * /services/:category and /services/:category/:service. The old
 * /service/:slug links land on the category.
 */
import { useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES, SERVICES_MENU, lookBase, type Bi, type LookService } from '../lookShared';
import { Breadcrumb, HAIR, INK, MUTED, OLIVE, TILE, primaryBtnCls, useLook } from './ui';
import { useShell } from './shellContext';
import { ServiceProviders } from './InfoPages';
import { Lightbox } from './kit';
import { SERVICE_GALLERY, type WorkShot } from './data';

/* ------------------------------------------------------------------ */
/* Names and paths                                                     */
/* ------------------------------------------------------------------ */

const slugify = (en: string) => en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/** A category's slug (the eight in SERVICES). */
export const serviceSlug = (s: LookService) => slugify(s.en);
/** A service's slug, within its category. */
export const subSlug = (it: Bi) => slugify(it.en);
/** The services in a category — the items under its heading in the menu (SERVICES_MENU, same order). */
export const subServicesOf = (s: LookService): Bi[] => SERVICES_MENU[SERVICES.indexOf(s)]?.items ?? [];
export const categoryPath = (s: LookService) => `${lookBase(1)}/services/${serviceSlug(s)}`;
export const servicePath = (s: LookService, it: Bi) => `${categoryPath(s)}/${subSlug(it)}`;
/** kept for callers written before categories and services were split */
export const subServicePath = servicePath;

/* The client's own "خدمات ديار" artwork (public/categories/tiles, the same set as
   the home page's services row), one tile per category — used for categories only. */
const TILE_ART = (name: string) => `/categories/tiles/${name}.jpg`;
const CATEGORY_ART: Record<string, string> = {
  'Interior Design': 'تصميم داخلي',
  'Door Solutions': 'تركيب وصيانة',
  'Custom Furniture': 'نجارة مخصصة',
  'Painting & Wall Finishes': 'دهانات',
  'Flooring Solutions': 'استشارات تصميم',
  'Finishing & Decorative': 'تنجيد وتجديد',
  'Glass & Skylight Facades': 'تركيب الستائر',
  'Safety Equipment & Systems': 'إضاءة وكهرباء',
};
export const categoryArt = (s: LookService) => TILE_ART(CATEGORY_ART[s.en] ?? 'تركيب وصيانة');
/** each tile's own green, read off its edges, so the banner around it has no seam */
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
const categoryGround = (s: LookService) => CATEGORY_GROUND[s.en] ?? '#1F3D3A';

/** A category's banner: its tile standing at one end, the name at the other, on the tile's own green. */
function CategoryHero({ cat, count, crumbs }: { cat: LookService; count: number; crumbs: { label: string; to?: string }[] }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const feather = 'radial-gradient(closest-side, #000 72%, transparent 100%)';
  return (
    <div style={{ backgroundColor: categoryGround(cat) }} data-testid="category-hero">
      <div className="mx-auto grid max-w-[1400px] items-center gap-6 px-6 md:grid-cols-[minmax(0,1fr)_auto] md:px-10">
        <div className="pb-4 pt-10 md:py-14">
          <p className={`text-[11px] text-[#A7B894] ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]'}`}>{t('Service category', 'قسم خدمات')}</p>
          <h1
            className={`mt-3 font-extrabold text-white ${
              isAr ? "font-['Alexandria',sans-serif] text-3xl leading-[1.2] md:text-5xl" : "font-['Outfit',sans-serif] text-3xl uppercase leading-[1.05] tracking-tight md:text-5xl"
            }`}
          >
            {t(cat.en, cat.ar)}
          </h1>
          <p className="mt-3 text-[14px] text-white/70">{t(`${count} services`, `${count} خدمات`)}</p>
          <nav className="mt-6 flex flex-wrap items-center gap-2 text-[11px] text-white/55" aria-label={t('Breadcrumb', 'مسار التنقل')}>
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {c.to ? <Link to={c.to} className="transition-colors hover:text-white">{c.label}</Link> : <span className="text-white/85">{c.label}</span>}
              </span>
            ))}
          </nav>
        </div>
        <img
          src={categoryArt(cat)}
          alt=""
          className="mx-auto -mt-2 h-[180px] w-auto md:mt-0 md:h-[320px]"
          style={{ WebkitMaskImage: feather, maskImage: feather }}
        />
      </div>
    </div>
  );
}

/** What every service includes — the promise is the same, the craft differs. */
const INCLUDED: Bi[] = [
  { en: 'A site visit and measurements', ar: 'زيارة ميدانية وأخذ المقاسات' },
  { en: 'A written scope and a fixed quote', ar: 'نطاق عمل مكتوب وعرض سعر ثابت' },
  { en: 'Materials sourced through Diyar', ar: 'توريد المواد عبر ديار' },
  { en: 'Execution by a vetted crew', ar: 'تنفيذ على يد فريق معتمد' },
  { en: 'Clean handover and a warranty', ar: 'تسليم نظيف مع ضمان' },
];

const STEPS: Bi[] = [
  { en: 'Tell us about the space', ar: 'احكِ لنا عن المساحة' },
  { en: 'We visit and quote', ar: 'نزور ونقدّم عرض السعر' },
  { en: 'The crew executes', ar: 'الفريق ينفّذ' },
  { en: 'You approve and we hand over', ar: 'تعتمد النتيجة ونسلّم' },
];

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

function NotOffered() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  return (
    <main className="pt-[72px]" data-testid="service-not-found">
      <div className="mx-auto max-w-[1400px] px-6 py-24 text-center md:px-10">
        <p className="text-[15px] font-light text-[#4A443C]">{t('That service is not offered yet.', 'هذه الخدمة غير متاحة حالياً.')}</p>
        <Link to={`${lookBase(1)}/services`} className={`mt-8 inline-block px-10 py-4 ${primaryBtnCls(isAr)}`}>
          {t('All services', 'كل الخدمات')}
        </Link>
      </div>
    </main>
  );
}

/** The photographed band a category or a service opens with. */
function Hero({ img, eyebrow, title, crumbs }: { img: string; eyebrow: string; title: string; crumbs: { label: string; to?: string }[] }) {
  const { lang } = useLook();
  const isAr = lang === 'ar';
  return (
    <>
      <div className="relative h-[38vh] min-h-[280px] w-full overflow-hidden" style={{ backgroundColor: INK }}>
        <img src={img} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1400px] px-6 pb-9 md:px-10 md:pb-12">
            <p className={`text-[11px] text-white/80 ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]'}`}>{eyebrow}</p>
            <h1
              className={`mt-3 max-w-3xl font-extrabold text-white ${
                isAr
                  ? "font-['Alexandria',sans-serif] text-3xl leading-[1.2] tracking-normal md:text-5xl"
                  : "font-['Outfit',sans-serif] text-3xl uppercase leading-[1.05] tracking-tight md:text-5xl"
              }`}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1400px] px-6 pt-6 md:px-10">
        <Breadcrumb items={crumbs} />
      </div>
    </>
  );
}

const h2Cls = (isAr: boolean) =>
  `font-bold ${isAr ? "font-['Alexandria',sans-serif] text-[19px] tracking-normal" : "font-['Outfit',sans-serif] text-[15px] uppercase tracking-[0.18em]"}`;

/** The other categories, as a closing row. */
function OtherCategories({ current }: { current: LookService }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  return (
    <section className="border-t py-12 md:py-16" style={{ borderColor: HAIR }}>
      <p className={`text-[10px] text-neutral-400 ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]'}`}>{t('Other categories', 'أقسام أخرى')}</p>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.filter((s) => s !== current).slice(0, 4).map((s) => (
          <li key={s.en}>
            <Link to={categoryPath(s)} className="group block border transition-colors hover:border-[#171512]" style={{ borderColor: HAIR }}>
              <div className="aspect-[4/3] overflow-hidden" style={{ backgroundColor: categoryGround(s) }}>
                <img src={categoryArt(s)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
              </div>
              <span className="flex items-center justify-between gap-3 p-4">
                <span className="text-[13px] font-bold">{t(s.en, s.ar)}</span>
                <span className="text-[11px]" style={{ color: MUTED }}>{t(`${subServicesOf(s).length} services`, `${subServicesOf(s).length} خدمات`)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* A category: its services                                            */
/* ------------------------------------------------------------------ */

export default function CategoryPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { category = '' } = useParams();
  const { openService } = useShell();
  const cat = SERVICES.find((s) => serviceSlug(s) === category);
  if (!cat) return <NotOffered />;
  const name = t(cat.en, cat.ar);
  const items = subServicesOf(cat);

  return (
    <main className="pt-[72px]" data-testid="category-page">
      <CategoryHero
        cat={cat}
        count={items.length}
        crumbs={[{ label: t('Home', 'الرئيسية'), to: lookBase(1) }, { label: t('Services', 'الخدمات'), to: `${lookBase(1)}/services` }, { label: name }]}
      />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* the services — the reason the page exists */}
        <section className="py-10 md:py-14" data-testid="category-services">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className={h2Cls(isAr)}>{t(`Services in ${cat.en}`, `خدمات ${cat.ar}`)} <span className="font-normal" style={{ color: MUTED }}>· {items.length}</span></h2>
            <button type="button" onClick={() => openService(name)} className="border-b pb-0.5 text-[12.5px] font-medium" style={{ borderColor: INK }}>
              {t('Not sure which? Ask us', 'لست متأكداً أيها تحتاج؟ اسألنا')}
            </button>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => (
              <li key={it.en} className="flex flex-col border bg-white" style={{ borderColor: HAIR }} data-testid="category-service">
                <div className="px-5 pt-5">
                <div className="flex items-start gap-4">
                  <span className="font-['Outfit',sans-serif] text-[12px] font-bold tabular-nums" style={{ color: OLIVE }} dir="ltr">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Link to={servicePath(cat, it)} className="min-w-0 flex-1 text-[17px] font-bold leading-snug transition-colors hover:text-[#5A6B4D]">
                    {t(it.en, it.ar)}
                  </Link>
                </div>
                </div>
                <div className="mt-auto flex items-center gap-3 px-5 pb-5 pt-6">
                  <button
                    type="button"
                    data-testid="category-service-request"
                    onClick={() => openService(`${name} · ${t(it.en, it.ar)}`)}
                    className={`px-5 py-2.5 ${primaryBtnCls(isAr)}`}
                  >
                    {t('Request', 'اطلب الخدمة')}
                  </button>
                  <Link to={servicePath(cat, it)} className="inline-flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium transition-colors hover:text-[#5A6B4D]" style={{ color: MUTED }}>
                    {t('Details', 'التفاصيل')}
                    <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <OtherCategories current={cat} />
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* A service: where it is requested                                    */
/* ------------------------------------------------------------------ */

export function ServiceDetailPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]';
  const { category = '', service = '' } = useParams();
  const { openService } = useShell();
  const cat = SERVICES.find((s) => serviceSlug(s) === category);
  const items = cat ? subServicesOf(cat) : [];
  const it = items.find((x) => subSlug(x) === service);
  if (!cat || !it) return <NotOffered />;
  const catName = t(cat.en, cat.ar);
  const name = t(it.en, it.ar);
  const siblings = items.filter((x) => x !== it);

  return (
    <main className="pt-[72px]" data-testid="service-page">
      <Hero
        img={cat.img}
        eyebrow={catName}
        title={name}
        crumbs={[
          { label: t('Home', 'الرئيسية'), to: lookBase(1) },
          { label: t('Services', 'الخدمات'), to: `${lookBase(1)}/services` },
          { label: catName, to: categoryPath(cat) },
          { label: name },
        ]}
      />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 py-10 lg:grid-cols-12 lg:gap-16 lg:py-14">
          <div className="lg:col-span-7">
            <h2 className={h2Cls(isAr)}>{t("What's included", 'ما الذي تشمله الخدمة')}</h2>
            <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {INCLUDED.map((x) => (
                <li key={x.en} className="flex items-start gap-3.5">
                  <Check size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" style={{ color: OLIVE }} />
                  <span className="text-[14px] leading-relaxed">{t(x.en, x.ar)}</span>
                </li>
              ))}
            </ul>

            <h2 className={`mt-12 ${h2Cls(isAr)}`}>{t('How it works', 'كيف تسير الخدمة')}</h2>
            <ol className="mt-5 grid gap-5 sm:grid-cols-2">
              {STEPS.map((step, i) => (
                <li key={step.en} className="border-t pt-5" style={{ borderColor: '#17151226' }}>
                  <span className="font-['Outfit',sans-serif] text-[12px] font-medium tracking-[0.2em] text-neutral-400">{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-2.5 text-[15px] font-bold leading-snug">{t(step.en, step.ar)}</p>
                </li>
              ))}
            </ol>

            {siblings.length > 0 && (
              <>
                <h2 className={`mt-12 ${h2Cls(isAr)}`}>{t(`More in ${cat.en}`, `خدمات أخرى في ${cat.ar}`)}</h2>
                <ul className="mt-5 flex flex-wrap gap-2" data-testid="sibling-services">
                  {siblings.map((x) => (
                    <li key={x.en}>
                      <Link
                        to={servicePath(cat, x)}
                        className="inline-block border bg-white px-3.5 py-2 text-[13px] font-medium transition-colors hover:border-[#171512] hover:bg-[#171512] hover:text-white"
                        style={{ borderColor: HAIR }}
                      >
                        {t(x.en, x.ar)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* request */}
          <aside className="lg:col-span-5">
            <div className="border p-7 lg:sticky lg:top-[96px]" style={{ borderColor: HAIR, backgroundColor: TILE }}>
              <p className={`text-[10px] text-[#5F5950] ${caps}`}>{t('Start here', 'ابدأ من هنا')}</p>
              <p className={`mt-3 font-extrabold ${isAr ? "font-['Alexandria',sans-serif] text-[22px] leading-snug" : "font-['Outfit',sans-serif] text-[22px] uppercase leading-tight tracking-tight"}`}>
                {name}
              </p>
              <p className="mt-1.5 text-[12px] font-medium" style={{ color: OLIVE }}>{catName}</p>
              <p className="mt-4 text-[13px] font-light leading-relaxed text-[#4A443C]">
                {t('Tell us about the space and we will come back within one business day with a visit time.', 'أخبرنا عن المساحة وسنعود إليك خلال يوم عمل واحد بموعد للزيارة.')}
              </p>
              <button
                type="button"
                data-testid="request-service"
                onClick={() => openService(`${catName} · ${name}`)}
                className={`mt-6 w-full py-4 ${primaryBtnCls(isAr)}`}
              >
                {t('Request a Visit', 'اطلب زيارة')}
              </button>
              <p className="mt-4 text-center text-[11px] font-light text-[#5F5950]">{t('Free consultation · No obligation', 'استشارة مجانية · دون التزام')}</p>
            </div>
          </aside>
        </div>

        <ServiceGallery shots={SERVICE_GALLERY[cat.en] ?? []} />
        <ServiceProviders serviceEn={cat.en} />
        <OtherCategories current={cat} />
      </div>
    </main>
  );
}

/** /service/:slug from before the split: to the category, or to the service if ?sub= named one. */
export function LegacyServiceRedirect() {
  const { slug = '' } = useParams();
  const [sp] = useSearchParams();
  const cat = SERVICES.find((s) => serviceSlug(s) === slug);
  if (!cat) return <Navigate to={`${lookBase(1)}/services`} replace />;
  const it = subServicesOf(cat).find((x) => subSlug(x) === sp.get('sub'));
  return <Navigate to={it ? servicePath(cat, it) : categoryPath(cat)} replace />;
}

/* ------------------------------------------------------------------ */
/* Recent work                                                         */
/* ------------------------------------------------------------------ */

/** One large frame and four small ones; a phone swipes through them. Any frame opens the viewer. */
function ServiceGallery({ shots }: { shots: WorkShot[] }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]';
  const [shown, setShown] = useState<number | null>(null);
  if (!shots.length) return null;
  const tiles = shots.slice(0, 5);

  return (
    <section className="border-t py-12 md:py-16" style={{ borderColor: HAIR }} data-testid="service-gallery">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={`text-[10px] text-[#5F5950] ${caps}`}>{t('Recent work', 'من أعمالنا')}</p>
          <h2
            className={`mt-2.5 font-extrabold ${
              isAr ? "font-['Alexandria',sans-serif] text-2xl tracking-normal md:text-3xl" : "font-['Outfit',sans-serif] text-2xl uppercase tracking-tight md:text-3xl"
            }`}
          >
            {t('Finished by our crews', 'نفّذتها فرقنا')}
          </h2>
        </div>
        <button
          type="button"
          data-testid="service-gallery-all"
          onClick={() => setShown(0)}
          className={`inline-flex items-center gap-2.5 border-b pb-1.5 text-[11px] font-medium transition-colors hover:text-[#5A6B4D] ${caps}`}
          style={{ borderColor: INK }}
        >
          {t(`View all · ${shots.length}`, `عرض الكل · ${shots.length}`)}
          <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
        </button>
      </div>

      <ul className="scrollbar-hide -mx-6 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 px-6 md:mx-0 md:grid md:h-[520px] md:grid-cols-4 md:grid-rows-2 md:gap-4 md:overflow-visible md:px-0">
        {tiles.map((sh, i) => (
          <li key={sh.img + i} className={`w-[82%] shrink-0 snap-start md:w-auto ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
            <button
              type="button"
              data-testid="service-gallery-tile"
              onClick={() => setShown(i)}
              className="group relative block aspect-[4/3] h-full w-full cursor-zoom-in overflow-hidden text-start md:aspect-auto"
              style={{ backgroundColor: TILE }}
            >
              <img src={sh.img} alt={t(sh.title.en, sh.title.ar)} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-3.5 pt-12 text-[12.5px] font-medium text-white md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100">
                {t(sh.title.en, sh.title.ar)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        images={shots.map((sh) => sh.img)}
        index={shown ?? 0}
        onIndex={setShown}
        open={shown !== null}
        onClose={() => setShown(null)}
        caption={(i) => t(shots[i].title.en, shots[i].title.ar)}
      />
    </section>
  );
}
