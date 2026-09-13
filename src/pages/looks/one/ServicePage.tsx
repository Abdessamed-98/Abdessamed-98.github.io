/**
 * Look 1 — one service.
 *
 * Services are the half of the marketplace that cannot be put in a cart: they
 * start as a request. So the page sells the work, states what is included and
 * what it costs to start, and ends in one action — request it.
 */
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES, lookBase, type LookService } from '../lookShared';
import { Breadcrumb, HAIR, INK, OLIVE, TILE, primaryBtnCls, useLook } from './ui';
import { useShell } from './shellContext';

/** Services have no id of their own, so their English name becomes the slug. */
export const serviceSlug = (s: LookService) => s.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

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
                {t('Request this service', 'اطلب هذه الخدمة')}
              </p>
              <p className="mt-3 text-[13px] font-light leading-relaxed text-[#4A443C]">
                {t(
                  'Tell us about the space and we will come back within one business day with a visit time.',
                  'أخبرنا عن المساحة وسنعود إليك خلال يوم عمل واحد بموعد للزيارة.',
                )}
              </p>
              <button
                type="button"
                data-testid="request-service"
                onClick={() => openService(name)}
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
