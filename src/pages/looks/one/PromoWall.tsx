/**
 * Look 1 — the offers wall (section 04).
 *
 * The mosaic gave all five offers the same treatment: a photograph, a scrim and
 * a headline shouted over it. Five equal shouts read as none, and the one offer
 * that actually expires was no louder than a standing service.
 *
 * So the wall has a lead now. The first panel — the one with a deadline — runs
 * large with the clock on it, and the rest go quiet: the same photographs, but
 * the words sit under them on the page rather than over them in white. Only the
 * lead panel carries type on an image, which is what makes it read as the lead.
 *
 * Self-contained: removing this file and its one line in LookOneHome restores
 * the previous mosaic, which is still exported from HomeSections.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PROMO_PANELS, msUntilMidnight, searchPath, type PromoPanel } from '../lookShared';
import { HAIR, OLIVE, useLook, useSeen } from './ui';

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Hours, minutes and seconds left today — the lead offer's deadline. */
function Clock() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [ms, setMs] = useState(msUntilMidnight);

  useEffect(() => {
    const id = window.setInterval(() => setMs(msUntilMidnight()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const left = Math.max(0, ms);
  const parts = [
    { v: Math.floor(left / 3.6e6), l: { en: 'hrs', ar: 'ساعة' } },
    { v: Math.floor(left / 6e4) % 60, l: { en: 'min', ar: 'دقيقة' } },
    { v: Math.floor(left / 1000) % 60, l: { en: 'sec', ar: 'ثانية' } },
  ];

  return (
    <div className="flex items-end gap-5">
      {parts.map((p) => (
        <div key={p.l.en} className="text-center">
          <span dir="ltr" className="block font-['Outfit',sans-serif] text-2xl font-extrabold leading-none text-white md:text-3xl">
            {pad2(p.v)}
          </span>
          <span
            className={`mt-1.5 block text-[9px] text-white/60 ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]'}`}
          >
            {t(p.l.en, p.l.ar)}
          </span>
        </div>
      ))}
    </div>
  );
}

/** A quiet offer: the picture, then the words underneath it on the canvas. */
function QuietPanel({ p, tall = false }: { p: PromoPanel; tall?: boolean; key?: string }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const title = isAr ? p.title.ar : p.title.en;
  const href = p.query ? searchPath(1, p.query) : undefined;

  const inner = (
    <>
      <div className="overflow-hidden">
        <img
          src={p.img}
          alt={title}
          loading="lazy"
          decoding="async"
          className={`w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/qp:scale-[1.05] ${
            tall ? 'aspect-[4/3]' : 'aspect-[16/10]'
          }`}
        />
      </div>
      <p
        className={`mt-5 text-[10px] ${isAr ? "font-['Tajawal',sans-serif] tracking-normal" : 'uppercase tracking-[0.3em]'}`}
        style={{ color: OLIVE }}
      >
        {isAr ? p.eyebrow.ar : p.eyebrow.en}
      </p>
      <h3
        className={`mt-2.5 text-[18px] font-extrabold uppercase md:text-[20px] ${
          isAr
            ? "font-['Alexandria',sans-serif] leading-snug tracking-normal"
            : "font-['Outfit',sans-serif] leading-tight tracking-tight"
        }`}
      >
        {title}
      </h3>
      <span
        className={`mt-4 inline-flex items-center gap-2.5 border-b pb-1.5 text-[11px] transition-colors ${
          isAr ? 'tracking-normal' : 'uppercase tracking-[0.26em]'
        } border-[#171512]/25 group-hover/qp:border-[#171512]`}
      >
        {isAr ? p.cta.ar : p.cta.en}
        <ArrowRight
          size={12}
          strokeWidth={1.5}
          className={`transition-transform duration-300 ${
            isAr ? 'rotate-180 group-hover/qp:-translate-x-1' : 'group-hover/qp:translate-x-1'
          }`}
        />
      </span>
    </>
  );

  const cls = 'group/qp block';
  return href ? <Link to={href} className={cls}>{inner}</Link> : <a href="#" className={cls}>{inner}</a>;
}

export function PromoWall() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [lead, ...rest] = PROMO_PANELS;
  const leadTitle = isAr ? lead.title.ar : lead.title.en;
  const leadHref = lead.query ? searchPath(1, lead.query) : undefined;

  const leadInner = (
    <>
      <img
        src={lead.img}
        alt={leadTitle}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover/lead:scale-[1.04]"
      />
      {/* no overlay: the banner was shot with its right side left empty, so the
          copy sits there rather than on a wash over the whole picture. Pinned
          right physically — the empty half is on the right in both languages. */}
      <div className="absolute bottom-0 right-0 w-full max-w-[620px] p-7 text-right text-white md:p-12">
        <p className={`text-[10px] text-white/80 ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.3em]'}`}>
          {isAr ? lead.eyebrow.ar : lead.eyebrow.en}
        </p>
        <h3
          className={`mt-4 ms-auto max-w-xl text-3xl font-extrabold uppercase md:text-5xl ${
            isAr
              ? "font-['Alexandria',sans-serif] leading-[1.15] tracking-normal"
              : "font-['Outfit',sans-serif] leading-[0.98] tracking-tight"
          }`}
        >
          {leadTitle}
        </h3>

        <div className="mt-8 flex flex-wrap items-end justify-end gap-x-10 gap-y-6">
          <div>
            <p className={`mb-3 text-[9px] text-white/55 ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.24em]'}`}>
              {t('Ends tonight', 'ينتهي الليلة')}
            </p>
            <Clock />
          </div>
          <span
            className={`inline-block bg-white px-9 py-3.5 text-[11px] font-medium text-[#171512] transition-colors duration-300 group-hover/lead:bg-[#5A6B4D] group-hover/lead:text-white ${
              isAr ? 'tracking-normal' : 'uppercase tracking-[0.28em]'
            }`}
          >
            {isAr ? lead.cta.ar : lead.cta.en}
          </span>
        </div>
      </div>
    </>
  );

  const wall = useSeen<HTMLElement>(0.2);

  // shorter than it was (420/560): the wall is five pictures deep, and the
  // page has two other full-screen moments either side of it
  const leadCls = 'group/lead relative block h-full min-h-[340px] w-full overflow-hidden md:min-h-[440px]';

  return (
    <section
      ref={wall.ref}
      data-testid="promo-mosaic"
      data-seen={wall.seen}
      className="border-t py-14 md:py-16"
      style={{ borderColor: HAIR }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* one gap value everywhere: the same 16px between columns and rows */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* the one offer with a clock on it */}
          <Tile seen={wall.seen} order={0} className="lg:col-span-8">
            {leadHref ? (
              <Link to={leadHref} className={leadCls} data-testid="promo-lead">{leadInner}</Link>
            ) : (
              <a href="#" className={leadCls} data-testid="promo-lead">{leadInner}</a>
            )}
          </Tile>

          {/* the standing service, kept quiet beside it */}
          <Tile seen={wall.seen} order={1} className="lg:col-span-4">
            <QuietPanel p={rest[0]} tall />
          </Tile>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {rest.slice(1).map((p, i) => (
            <Tile key={p.title.en} seen={wall.seen} order={2 + i}>
              <QuietPanel p={p} />
            </Tile>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * One tile of the wall: it wipes up into place, in order, as the wall arrives.
 * The whole tile is clipped rather than faded, so the picture arrives as a
 * shape instead of a ghost — the same move the category band and the room plan
 * use, which is what makes the three read as one page.
 */
function Tile({
  seen,
  order,
  className = '',
  children,
}: {
  seen: boolean;
  order: number;
  className?: string;
  children: ReactNode;
  key?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)', y: 18 }}
      animate={seen ? { clipPath: 'inset(0% 0% 0% 0%)', y: 0 } : undefined}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: order * 0.11 }}
    >
      {children}
    </motion.div>
  );
}
