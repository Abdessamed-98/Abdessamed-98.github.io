/**
 * Look 1 — one service.
 *
 * Services are the half of the marketplace that cannot be put in a cart: they
 * start as a request. So the page sells the work, states what is included and
 * what it costs to start, and ends in one action — request it.
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES, SERVICES_MENU, lookBase, type Bi, type LookService } from '../lookShared';
import { Breadcrumb, HAIR, INK, OLIVE, TILE, primaryBtnCls, useLook } from './ui';
import { useShell } from './shellContext';
import { ServiceProviders } from './InfoPages';
import { Lightbox } from './kit';
import { SERVICE_GALLERY, type WorkShot } from './data';

/** Services have no id of their own, so their English name becomes the slug. */
export const serviceSlug = (s: LookService) => s.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* Sub-services are the items listed under each service in the menu (SERVICES_MENU,
   same order as SERVICES). They have no page of their own: a sub-service opens its
   service's page with it chosen (?sub=…), and the request carries both names. */
export const subSlug = (it: Bi) => it.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const subServicesOf = (s: LookService): Bi[] => SERVICES_MENU[SERVICES.indexOf(s)]?.items ?? [];
export const subServicePath = (s: LookService, it: Bi) => `${lookBase(1)}/service/${serviceSlug(s)}?sub=${subSlug(it)}`;

/** What every service includes — the promise is the same, the craft differs. */
const INCLUDED: { en: string; ar: string }[] = [
  { en: 'A site visit and measurements', ar: 'زيارة ميدانية وأخذ المقاسات' },
  { en: 'A written scope and a fixed quote', ar: 'نطاق عمل مكتوب وعرض سعر ثابت' },
  { en: 'Materials sourced through Diyar', ar: 'توريد المواد عبر ديار' },
  { en: 'Execution by a vetted crew', ar: 'تنفيذ على يد فريق معتمد' },
  { en: 'Clean handover and a warranty', ar: 'تسليم نظيف مع ضمان' },
];

const STEPS: { en: string; ar: string }[] = [
  { en: 'Tell us about the space', ar: 'احكِ لنا عن المساحة' },
  { en: 'We visit and quote', ar: 'نزور ونقدّم عرض السعر' },
  { en: 'The crew executes', ar: 'الفريق ينفّذ' },
  { en: 'You approve and we hand over', ar: 'تعتمد النتيجة ونسلّم' },
];

export default function ServicePage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { slug = '' } = useParams();
  const { openService } = useShell();
  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]';

  const service = SERVICES.find((s) => serviceSlug(s) === slug);
  const [sp, setSp] = useSearchParams();
  const subs = service ? subServicesOf(service) : [];
  const chosen = subs.find((it) => subSlug(it) === sp.get('sub'));
  const subsRef = useRef<HTMLDivElement>(null);
  // arriving from the menu with a sub-service: bring its list into view
  useEffect(() => {
    if (sp.get('sub') && subsRef.current) {
      const y = subsRef.current.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!service) {
    return (
      <main className="pt-[72px]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 text-center md:px-10">
          <p className={`text-[11px] text-neutral-400 ${caps}`}>{t('Not found', 'غير موجود')}</p>
          <p className="mt-3 text-[15px] font-light text-[#4A443C]">
            {t('That service is not offered yet.', 'هذه الخدمة غير متاحة حالياً.')}
          </p>
          <Link to={lookBase(1)} className={`mt-8 inline-block px-10 py-4 ${primaryBtnCls(isAr)}`}>
            {t('Back Home', 'العودة للرئيسية')}
          </Link>
        </div>
      </main>
    );
  }

  const name = t(service.en, service.ar);
  const others = SERVICES.filter((s) => s !== service).slice(0, 4);

  return (
    <main className="pt-[72px]">
      {/* hero */}
      <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden" style={{ backgroundColor: INK }}>
        <img src={service.img} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1400px] px-6 pb-10 md:px-10 md:pb-14">
            <p className={`text-[11px] text-white/80 ${caps}`}>{t('Diyar Services', 'خدمات ديار')}</p>
            <h1
              className={`mt-4 max-w-2xl font-extrabold text-white ${
                isAr
                  ? "font-['Alexandria',sans-serif] text-3xl leading-[1.2] tracking-normal md:text-5xl"
                  : "font-['Outfit',sans-serif] text-3xl uppercase leading-[1.05] tracking-tight md:text-5xl"
              }`}
            >
              {name}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 py-12 lg:grid-cols-12 lg:gap-16 lg:py-16">
          {/* the work */}
          <div className="lg:col-span-7">
            {subs.length > 0 && (
              <div ref={subsRef} className="mb-12" data-testid="sub-services">
                <h2
                  className={`font-bold ${
                    isAr ? "font-['Alexandria',sans-serif] text-[19px] tracking-normal" : "font-['Outfit',sans-serif] text-[15px] uppercase tracking-[0.18em]"
                  }`}
                >
                  {t(`${service.en}: choose what you need`, `${service.ar}: اختر ما تحتاجه`)}
                </h2>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2" role="radiogroup">
                  {subs.map((it, i) => {
                    const on = chosen === it;
                    return (
                      <li key={it.en}>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={on}
                          data-testid="sub-service"
                          onClick={() => setSp(on ? {} : { sub: subSlug(it) }, { replace: true })}
                          className={`flex w-full items-center gap-4 border px-4 py-3.5 text-start transition-colors ${
                            on ? 'border-[#171512] bg-[#171512] text-white' : 'bg-white hover:border-[#171512]'
                          }`}
                          style={on ? undefined : { borderColor: HAIR }}
                        >
                          <span className={`font-['Outfit',sans-serif] text-[11px] font-bold tabular-nums ${on ? 'text-white/60' : 'text-neutral-400'}`} dir="ltr">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="min-w-0 flex-1 text-[14px] font-bold">{t(it.en, it.ar)}</span>
                          {on && <Check size={16} strokeWidth={2} />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <p className="max-w-xl text-[17px] font-light leading-[1.8] text-[#3F3A33]">
              {t(
                `Our ${service.en.toLowerCase()} crews work the way a good contractor should: one scope, one quote, one team that finishes what it started — coordinated through Diyar, with the materials coming from the same marketplace you are browsing.`,
                `فرق ${service.ar} لدينا تعمل كما ينبغي لأي مقاول محترم: نطاق واحد، وعرض سعر واحد، وفريق واحد يُنهي ما بدأه — بتنسيق كامل عبر ديار، والمواد من المنصة نفسها التي تتصفّحها.`,
              )}
            </p>

            <h2
              className={`mt-12 font-bold ${
                isAr ? "font-['Alexandria',sans-serif] text-[19px] tracking-normal" : "font-['Outfit',sans-serif] text-[15px] uppercase tracking-[0.18em]"
              }`}
            >
              {t("What's included", 'ما الذي تشمله الخدمة')}
            </h2>
            {/* no rules between the lines: a checklist is already a list */}
            <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {INCLUDED.map((item) => (
                <li key={item.en} className="flex items-start gap-3.5">
                  <Check size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" style={{ color: OLIVE }} />
                  <span className="text-[14px] leading-relaxed">{t(item.en, item.ar)}</span>
                </li>
              ))}
            </ul>

            <h2
              className={`mt-12 font-bold ${
                isAr ? "font-['Alexandria',sans-serif] text-[19px] tracking-normal" : "font-['Outfit',sans-serif] text-[15px] uppercase tracking-[0.18em]"
              }`}
            >
              {t('How it works', 'كيف تسير الخدمة')}
            </h2>
            <ol className="mt-5 grid gap-5 sm:grid-cols-2">
              {STEPS.map((step, i) => (
                <li key={step.en} className="border-t pt-5" style={{ borderColor: '#171512' + '26' }}>
                  <span className="font-['Outfit',sans-serif] text-[12px] font-medium tracking-[0.2em] text-neutral-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-2.5 text-[15px] font-bold leading-snug">{t(step.en, step.ar)}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* request */}
          <aside className="lg:col-span-5">
            <div className="border p-7 lg:sticky lg:top-[96px]" style={{ borderColor: HAIR, backgroundColor: TILE }}>
              <p className={`text-[10px] text-[#5F5950] ${caps}`}>{t('Start here', 'ابدأ من هنا')}</p>
              <p
                className={`mt-3 font-extrabold ${
                  isAr ? "font-['Alexandria',sans-serif] text-[22px] leading-snug tracking-normal" : "font-['Outfit',sans-serif] text-[22px] uppercase leading-tight tracking-tight"
                }`}
              >
                {chosen ? t(chosen.en, chosen.ar) : t('Request this service', 'اطلب هذه الخدمة')}
              </p>
              {chosen && (
                <p className="mt-1.5 text-[12px] font-medium" style={{ color: OLIVE }} data-testid="request-chosen">
                  {name}
                </p>
              )}
              <p className="mt-3 text-[13px] font-light leading-relaxed text-[#4A443C]">
                {t(
                  'Tell us about the space and we will come back within one business day with a visit time.',
                  'أخبرنا عن المساحة وسنعود إليك خلال يوم عمل واحد بموعد للزيارة.',
                )}
              </p>
              <button
                type="button"
                data-testid="request-service"
                onClick={() => openService(chosen ? `${name} · ${t(chosen.en, chosen.ar)}` : name)}
                className={`mt-6 w-full py-4 ${primaryBtnCls(isAr)}`}
              >
                {t('Request a Visit', 'اطلب زيارة')}
              </button>
              <p className="mt-4 text-center text-[11px] font-light text-[#5F5950]">
                {t('Free consultation · No obligation', 'استشارة مجانية · دون التزام')}
              </p>
            </div>
          </aside>
        </div>

        <ServiceGallery shots={SERVICE_GALLERY[service.en] ?? []} />

        <ServiceProviders serviceEn={service.en} />

        {/* other services */}
        <section className="border-t py-12 md:py-16" style={{ borderColor: HAIR }}>
          <p className={`text-[10px] text-neutral-400 ${caps}`}>{t('Other services', 'خدمات أخرى')}</p>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <li key={s.en}>
                <Link
                  to={`${lookBase(1)}/service/${serviceSlug(s)}`}
                  className="group block border transition-colors hover:border-[#171512]"
                  style={{ borderColor: HAIR }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={s.img}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                  </div>
                  <span className="flex items-center justify-between gap-3 p-4">
                    <span className="text-[13px] font-bold">{t(s.en, s.ar)}</span>
                    <ArrowRight size={13} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} style={{ color: OLIVE }} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="pb-16">
          <Breadcrumb
            items={[
              { label: t('Home', 'الرئيسية'), to: lookBase(1) },
              { label: t('Services', 'الخدمات') },
              { label: name },
            ]}
          />
        </div>
      </div>
    </main>
  );
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
