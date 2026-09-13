/**
 * Look 1 — "Custom Furniture Manufacturing" (section 05).
 *
 * A section that explains the service, nothing more: the workshop, what the
 * service is, and what happens after you ask for it. No picker — choosing a
 * piece and a fabric is work for the request form and the workshop's own
 * dashboard, not for a paragraph on the home page.
 *
 * Diyar does not build any of this; the partner workshops do. So the copy puts
 * the making with them and keeps Diyar where it actually sits — carrying the
 * request over and the quote back. The three facts underneath are the ones a
 * visitor actually weighs before asking: who builds it, how fast an answer
 * comes, and how long the build takes.
 *
 * The four steps of an order live in "How We Work" further down the page, so
 * they are deliberately not repeated here.
 *
 * Self-contained: removing this file and its one line in LookOneHome restores
 * the previous split panel.
 */
import { IMG } from '../lookShared';
import { HAIR, OLIVE, Reveal, SectionHeading, ViewMore, primaryBtnCls, useLook } from './ui';

/** What a visitor weighs before asking for a quote. */
const FACTS = [
  {
    k: { en: 'Who builds it', ar: 'من ينفّذها' },
    v: { en: "Diyar's partner workshops", ar: 'ورش ديار الشريكة' },
  },
  {
    k: { en: 'You hear back', ar: 'يصلك الرد' },
    v: { en: 'Within 48 hours', ar: 'خلال 48 ساعة' },
  },
  {
    k: { en: 'Build time', ar: 'مدة التنفيذ' },
    v: { en: 'Usually 3–4 weeks', ar: 'عادةً 3–4 أسابيع' },
  },
];

export function MadeToOrder({ no }: { no: string }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';

  return (
    <section data-testid="custom-furniture" className="border-t" style={{ borderColor: HAIR }}>
      <div className="grid lg:grid-cols-2">
        {/* the workshop on the end side, so the split reads differently from the
            image-led beats around it */}
        <Reveal className="overflow-hidden lg:order-2">
          <img
            src={IMG.workshop}
            alt={t('A partner workshop building to order', 'ورشة شريكة تنفّذ الأثاث حسب الطلب')}
            className="aspect-[4/3] h-full w-full object-cover lg:aspect-auto lg:min-h-[620px]"
          />
        </Reveal>

        <div className="flex items-center bg-white lg:order-1">
          <Reveal className="w-full px-6 py-16 md:px-16 lg:px-20 lg:py-24 xl:px-24" delay={0.1}>
            <SectionHeading
              eyebrow={t(`Craftsmanship — ${no}`, `الحرفية — ${no}`)}
              title={t('Custom Furniture Manufacturing', 'تنفيذ الأثاث حسب الطلب')}
            />

            <p className="mt-7 max-w-md text-[15px] font-light leading-relaxed text-neutral-600">
              {t(
                "Anything in the catalogue can be built to your own measurements, materials and finish. Tell Diyar what you need and the request goes to the partner workshops that make it — they come back with a quote and a build time, and Diyar delivers and installs it.",
                'أي قطعة في المتجر يمكن تنفيذها بمقاساتك وخاماتك والتشطيب الذي تريده. أخبر ديار بما تحتاجه، ويصل طلبك إلى الورش الشريكة التي تنفّذه — يردّون عليك بعرض سعر ومدة تنفيذ، وتتولى ديار التوصيل والتركيب.',
              )}
            </p>

            <dl className="mt-10 max-w-md">
              {FACTS.map((f) => (
                <div
                  key={f.k.en}
                  className="flex items-baseline justify-between gap-6 border-t py-4 last:border-b"
                  style={{ borderColor: HAIR }}
                >
                  <dt
                    className={`shrink-0 text-[10px] text-neutral-400 ${
                      isAr ? "font-['Tajawal',sans-serif] tracking-normal" : 'uppercase tracking-[0.26em]'
                    }`}
                  >
                    {t(f.k.en, f.k.ar)}
                  </dt>
                  <dd className="text-end text-[13.5px] font-medium" style={{ color: OLIVE }}>
                    {t(f.v.en, f.v.ar)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-8">
              <button type="button" className={`${primaryBtnCls(isAr)} px-10 py-4`}>
                {t('Request a Quote', 'اطلب عرض سعر')}
              </button>
              <ViewMore label={t('See the partner workshops', 'تعرّف على الورش الشريكة')} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
