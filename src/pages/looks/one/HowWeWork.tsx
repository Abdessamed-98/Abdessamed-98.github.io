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
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IMG } from '../lookShared';
import { BG, INK, OLIVE, HAIR, TILE, useLook, Reveal, SectionHeading } from './ui';

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
  /* The spine runs between the first and last markers — not past them. Step
     heights change as bodies open and collapse, so the span is measured rather
     than assumed. */
  const column = useRef<HTMLDivElement>(null);
  const markers = useRef<(HTMLSpanElement | null)[]>([]);
  const [spine, setSpine] = useState({ top: 0, height: 0, fill: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const first = markers.current[0];
      const last = markers.current[STEPS.length - 1];
      const current = markers.current[active];
      if (!first || !last || !current) return;
      const centre = (el: HTMLSpanElement) => el.offsetTop + el.offsetHeight / 2;
      const top = centre(first);
      setSpine({ top, height: centre(last) - top, fill: centre(current) - top });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (column.current) ro.observe(column.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [active]);
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
          <div ref={column} className="relative lg:pb-[14vh]">
            {/* the hairline the run stands on, filled as far as the visitor has read */}
            <span
              aria-hidden
              className="absolute start-[19px] hidden w-px lg:block"
              style={{ backgroundColor: HAIR, top: spine.top, height: spine.height }}
            />
            <span
              aria-hidden
              className="absolute start-[19px] hidden w-px transition-[height] duration-700 ease-out motion-reduce:transition-none lg:block"
              style={{ backgroundColor: OLIVE, top: spine.top, height: spine.fill }}
            />

            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <div
                  key={s.title.en}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  data-step={i}
                  data-testid={`how-step-${i}`}
                  data-on={on}
                  className="flex flex-col justify-center py-10 lg:min-h-[62vh] lg:py-0"
                >
                  {/* touch: no sticky pane, so each step carries its own picture */}
                  <img
                    src={s.img}
                    alt=""
                    loading="lazy"
                    className="mb-7 aspect-[4/3] w-full object-cover lg:hidden"
                  />

                  <div className="flex gap-6">
                    {/* the marker sitting on the spine */}
                    <span
                      aria-hidden
                      ref={(el) => { markers.current[i] = el; }}
                      className={`relative z-10 hidden h-10 w-10 shrink-0 items-center justify-center border font-['Outfit',sans-serif] text-[12px] font-bold transition-colors duration-500 motion-reduce:transition-none lg:flex`}
                      style={{
                        backgroundColor: on ? OLIVE : BG,
                        borderColor: on ? OLIVE : HAIR,
                        color: on ? '#FFFFFF' : '#A3A3A3',
                      }}
                    >
                      {pad(i + 1)}
                    </span>

                    <div className="min-w-0">
                      <p className={`text-[11px] lg:hidden ${capsCls}`} style={{ color: OLIVE }}>
                        {t(`Step ${pad(i + 1)}`, `الخطوة ${pad(i + 1)}`)}
                      </p>
                      <h3
                        className={`mt-4 font-extrabold leading-[1.1] text-[#171512] transition-colors duration-500 motion-reduce:transition-none lg:mt-0 ${titleCls} ${
                          on ? '' : 'lg:text-[#C9C4BA]'
                        }`}
                      >
                        {t(s.title.en, s.title.ar)}
                      </h3>

                      {/* a rule that draws itself out under the step being read */}
                      <span
                        aria-hidden
                        className={`mt-5 block h-px w-[72px] transition-[width] duration-700 ease-out motion-reduce:transition-none ${
                          on ? 'lg:w-[72px]' : 'lg:w-0'
                        }`}
                        style={{ backgroundColor: OLIVE }}
                      />

                      {/* the body opens rather than merely brightening: the row
                          collapses to nothing and grows back, which is what makes
                          the column read as one thing at a time. `1fr`/`0fr` is
                          the only way to transition to a height nobody knows. */}
                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
                          on
                            ? 'grid-rows-[1fr] opacity-100'
                            // a phone has no sticky pane and no "current" step, so
                            // every step stays open there and only the desktop
                            // column collapses
                            : 'grid-rows-[1fr] opacity-100 lg:grid-rows-[0fr] lg:opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---- the picture (it holds still) ---- */}
          <div className="hidden lg:block">
            {/* Sized and offset so its centre lands on the middle of the screen —
                the same place the step that owns it is read. The old
                top-24/100vh-13rem box hung from the header instead, so the
                picture sat high of the words it belonged to. */}
            <div className="sticky top-[12svh] h-[76svh]" data-testid="how-media">
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

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
