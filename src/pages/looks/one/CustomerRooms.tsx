/**
 * Look 1 — "What They Say" (section 17).
 *
 * The section arrives through its own title. "ماذا يقولون" sits alone in the
 * middle of the dark band; then, one after another, the four customers' rooms
 * rise up from below and settle into their places over it, and the title makes
 * way for the ordinary heading at the top. The rooms come in as answers to the
 * question the title asks — which is the order the section wants to be read in.
 *
 * For furniture the proof is the room: the piece standing in someone's home is
 * the argument, and the quote is the caption under it. The photographs are the
 * look's own interiors standing in for customer photos; swapping in real ones
 * is a change of `room` here and nothing else.
 *
 * Self-contained: removing this file and its one line in LookOneHome restores
 * the previous card grid.
 */
import { motion, useTransform, type MotionValue } from 'motion/react';
import { IMG, REVIEWS, type LookReview } from '../lookShared';
import { CREAM, NIGHT, OLIVE_LT, Reveal, SectionHeading, Stars, useLook } from './ui';
import { settle, usePinned } from './stage';

/** The room each review is talking about, in REVIEWS order. */
const ROOMS_SHOWN = [
  { img: IMG.roomHotspots, of: { en: 'Majlis · Riyadh', ar: 'مجلس · الرياض' } },
  { img: IMG.hero, of: { en: 'Living room · Jeddah', ar: 'غرفة معيشة · جدة' } },
  { img: IMG.bedroom, of: { en: 'Bedroom · Dammam', ar: 'غرفة نوم · الدمام' } },
  { img: IMG.restaurant, of: { en: 'Café · Khobar', ar: 'مقهى · الخبر' } },
];

/** each room's rise starts this much later than the one before, in progress */
const STEP = 0.11;
/** and takes this long */
const RISE = 0.34;

function RoomCard({
  r, room, i, p, animate, open,
}: {
  r: LookReview;
  room: (typeof ROOMS_SHOWN)[number];
  i: number;
  p: MotionValue<number>;
  animate: boolean;
  open: boolean;
  key?: string;
}) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  // from below the stage to its own place, on its own beat
  const y = useTransform(p, (v) => `${(1 - settle((v - 0.06 - i * STEP) / RISE)) * 110}vh`);

  return (
    <motion.figure
      data-testid="customer-room"
      className="group/cr relative z-10 flex h-full flex-col sm:row-span-4 sm:grid sm:grid-rows-subgrid sm:gap-y-0"
      style={animate && !open ? { y } : undefined}
    >
      {/* the room — the part that actually persuades */}
      <div className="relative overflow-hidden">
        <img
          src={room.img}
          alt={t(room.of.en, room.of.ar)}
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/cr:scale-[1.04]"
        />
        <span
          className={`absolute bottom-3 start-3 bg-black/45 px-3 py-1.5 text-[10px] text-white backdrop-blur-sm ${
            isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]'
          }`}
        >
          {t(room.of.en, room.of.ar)}
        </span>
      </div>

      <div className="mt-6">
        <Stars light rating={r.rating} />
      </div>

      <blockquote className="mt-5 text-[14px] font-light leading-relaxed text-[#F6F3EC]/75">
        {t(r.text.en, r.text.ar)}
      </blockquote>

      <figcaption className="mt-6 border-t border-white/12 pt-5">
        <p className={`font-bold ${isAr ? 'text-[13px] tracking-normal' : 'text-[11.5px] uppercase tracking-[0.18em]'}`}>
          {t(r.name.en, r.name.ar)}
        </p>
        <p
          className={`mt-1.5 text-[10px] ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.24em]'}`}
          style={{ color: OLIVE_LT }}
        >
          {t(r.city.en, r.city.ar)}
        </p>
      </figcaption>
    </motion.figure>
  );
}

export function CustomerRooms({ no }: { no: string }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { track, p, animate, open, trackStyle, stageCls } = usePinned({ openAt: 0.62 });

  // the big title makes way once the first rooms have covered it
  const askOpacity = useTransform(p, [0.3, 0.5], [1, 0]);

  return (
    <section
      data-testid="reviews"
      className="overflow-x-clip"
      style={{ backgroundColor: NIGHT, color: CREAM }}
    >
      <div ref={track} style={trackStyle}>
        <div className={`relative flex flex-col justify-center py-20 md:py-28 ${stageCls}`}>
          {/* the question, asked alone before anything answers it */}
          {animate && !open && (
            <motion.div
              aria-hidden
              data-testid="reviews-ask"
              className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center px-6"
              style={{ opacity: askOpacity }}
            >
              <span
                className={`text-center font-extrabold uppercase ${
                  isAr
                    ? "font-['Alexandria',sans-serif] text-[72px] leading-[1.1] tracking-normal xl:text-[96px]"
                    : "font-['Outfit',sans-serif] text-[80px] leading-[0.95] tracking-tight xl:text-[112px]"
                }`}
                style={{ color: CREAM }}
              >
                {t('What They Say', 'ماذا يقولون')}
              </span>
            </motion.div>
          )}

          <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
            <div
              className={`relative z-10 ${animate ? 'transition-[opacity,transform] duration-700 ease-out' : ''} ${
                animate && !open ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
              }`}
            >
              {animate ? (
                <Heading no={no} />
              ) : (
                <Reveal>
                  <Heading no={no} />
                </Reveal>
              )}
            </div>

            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
              {REVIEWS.map((r, i) => (
                <RoomCard
                  key={r.name.en}
                  r={r}
                  room={ROOMS_SHOWN[i % ROOMS_SHOWN.length]}
                  i={i}
                  p={p}
                  animate={animate}
                  open={open}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Heading({ no }: { no: string }) {
  const { t } = useLook();
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
      <SectionHeading
        light
        eyebrow={t(`Customers — ${no}`, `عملاؤنا — ${no}`)}
        title={t('What They Say', 'ماذا يقولون')}
      />
      <p className="max-w-sm pb-2 text-[14px] font-light leading-relaxed text-[#F6F3EC]/55">
        {t(
          'Rooms our customers finished with Diyar — and what they said about them.',
          'غرف أنجزها عملاؤنا مع ديار — وما قالوه عنها.',
        )}
      </p>
    </div>
  );
}
