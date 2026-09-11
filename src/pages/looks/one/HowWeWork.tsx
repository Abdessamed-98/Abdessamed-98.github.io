/**
 * Look 1 — "How We Work" (TRIAL).
 *
 * Sticky media + changing content: one photograph holds its place while the
 * four steps of a custom order scroll past it, and whichever step crosses the
 * middle of the viewport takes over the picture. It explains the service
 * business — visit, design, craft, install — rather than decorating it.
 *
 * Self-contained on purpose: removing this file and its one line in
 * LookOneHome restores the page exactly.
 */
import { useEffect, useRef, useState } from 'react';
import { IMG } from '../lookShared';
import { INK, OLIVE, HAIR, TILE, useLook, Reveal, SectionHeading } from './ui';

interface Step {
  img: string;
  title: { en: string; ar: string };
  body: { en: string; ar: string };
  fact: { en: string; ar: string };
}

const STEPS: Step[] = [
  {
    img: IMG.roomHotspots,
    title: { en: 'Visit & Measure', ar: 'الزيارة والقياس' },
    body: {
      en: 'A designer comes to you, measures the space and learns how you actually live in it.',
      ar: 'يزورك مصممنا ليقيس المساحة ويفهم كيف تعيش فيها فعلاً.',
    },
    fact: { en: 'Free home visit', ar: 'زيارة منزلية مجانية' },
  },
  {
    img: '/looks/apartment.jpg',
    title: { en: 'Design', ar: 'التصميم' },
    body: {
      en: 'You see the room in 3D — materials, colours and every piece placed — before anything is built.',
      ar: 'ترى غرفتك بتصميم ثلاثي الأبعاد — الخامات والألوان وكل قطعة في مكانها — قبل أي تصنيع.',
    },
    fact: { en: '3D before you commit', ar: 'تصميم ثلاثي الأبعاد قبل الالتزام' },
  },
  {
    img: IMG.workshop,
    title: { en: 'Craft', ar: 'التصنيع' },
    body: {
      en: 'Each piece is built to your measurements in our partner workshops, and signed by the maker.',
      ar: 'تُصنع كل قطعة على مقاساتك في ورشنا الشريكة، وتحمل توقيع صانعها.',
    },
    fact: { en: 'Made to order', ar: 'مصنوع حسب الطلب' },
  },
  {
    img: IMG.hero,
    title: { en: 'Deliver & Install', ar: 'التوصيل والتركيب' },
    body: {
      en: 'Our own crews deliver and install everything, then leave the room ready to live in.',
      ar: 'تتولى فرقنا التوصيل والتركيب بالكامل، وتسلّمك الغرفة جاهزة للعيش.',
    },
    fact: { en: '3–4 weeks · warranty on every piece', ar: '٣–٤ أسابيع · ضمان على كل قطعة' },
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

export function HowWeWork() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* The step crossing a thin band at the middle of the viewport owns the picture. */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: '-48% 0px -48% 0px', threshold: 0 },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const titleCls = isAr
    ? "font-['Alexandria',sans-serif] text-3xl tracking-normal md:text-4xl"
    : "font-['Outfit',sans-serif] text-3xl tracking-tight md:text-[40px]";
  const capsCls = isAr ? 'tracking-normal' : 'uppercase tracking-[0.26em]';

  return (
    <section data-testid="how-we-work" className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow={t('How We Work', 'كيف نعمل')}
            title={t('From Idea to Home', 'من الفكرة إلى بيتك')}
          />
          <p className="mt-6 max-w-lg text-[15px] font-light leading-relaxed text-neutral-600">
            {t(
              'Four steps between a room you imagine and a room you live in — one team from the first visit to the last screw.',
              'أربع خطوات بين غرفة تتخيلها وغرفة تعيش فيها — فريق واحد من أول زيارة حتى آخر برغي.',
            )}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-2 lg:gap-20">
          {/* ---- the steps (they scroll) ----
              The trailing padding keeps the sticky range open while the last step
              sits in the middle of the viewport; without it the picture starts
              leaving before step 4 is read. */}
          <div className="lg:pb-[14vh]">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <div
                  key={s.title.en}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  data-step={i}
                  data-testid={`how-step-${i}`}
                  className="flex flex-col justify-center py-10 lg:min-h-[62vh] lg:py-0"
                >
                  {/* touch: no sticky pane, so each step carries its own picture */}
                  <img
                    src={s.img}
                    alt=""
                    loading="lazy"
                    className="mb-7 aspect-[4/3] w-full object-cover lg:hidden"
                  />
                  <div className={`transition-opacity duration-500 ${on ? 'lg:opacity-100' : 'lg:opacity-35'}`}>
                    <p className={`text-[11px] ${capsCls}`} style={{ color: OLIVE }}>
                      {t(`Step ${pad(i + 1)}`, `الخطوة ${pad(i + 1)}`)}
                    </p>
                    <h3 className={`mt-4 font-extrabold leading-[1.1] ${titleCls}`} style={{ color: INK }}>
                      {t(s.title.en, s.title.ar)}
                    </h3>
                    <p className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-neutral-600">
                      {t(s.body.en, s.body.ar)}
                    </p>
                    <span
                      className={`mt-6 inline-block border px-3 py-1.5 text-[11px] ${capsCls}`}
                      style={{ borderColor: HAIR, color: INK }}
                    >
                      {t(s.fact.en, s.fact.ar)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---- the picture (it holds still) ---- */}
          <div className="hidden lg:block">
            <div className="sticky top-24 h-[calc(100vh-13rem)]" data-testid="how-media">
              <div className="relative h-full w-full overflow-hidden" style={{ backgroundColor: TILE }}>
                {STEPS.map((s, i) => (
                  <img
                    key={s.img}
                    src={s.img}
                    alt={i === active ? t(s.title.en, s.title.ar) : ''}
                    aria-hidden={i !== active}
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out motion-reduce:transition-none ${
                      i === active ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
                    }`}
                  />
                ))}

                {/* progress: 01 / 04 and a bar per step */}
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-white/90 px-5 py-4 backdrop-blur-sm">
                  <span className="text-[12px] font-bold" dir="ltr" style={{ color: INK }}>
                    {pad(active + 1)} <span className="text-neutral-400">/ {pad(STEPS.length)}</span>
                  </span>
                  <div className="flex flex-1 gap-1.5">
                    {STEPS.map((s, i) => (
                      <span
                        key={s.title.en}
                        className="h-[2px] flex-1 transition-colors duration-500"
                        style={{ backgroundColor: i <= active ? OLIVE : HAIR }}
                      />
                    ))}
                  </div>
                  <span className={`text-[11px] ${capsCls}`} style={{ color: OLIVE }}>
                    {t(STEPS[active].title.en, STEPS[active].title.ar)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
