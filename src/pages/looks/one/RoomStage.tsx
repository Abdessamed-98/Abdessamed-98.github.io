/**
 * Look 1 — "Shop the Look" stage.
 *
 * The section arrives through its own title. The stage pins to the screen and a
 * plate the colour of the page covers it, with the title knocked out of that
 * plate — so at first the room is visible only inside the letters. Scrolling
 * opens the word out until its counters are wider than the screen and the plate
 * has nothing left to cover with; it fades on the last of the travel and the
 * room is simply there. The heading then settles in over it and the hotspots
 * arm once the room has landed.
 *
 * It is tied to scroll position throughout, so it plays backwards on the way up.
 *
 * Hotspots are percentages of the photo, so the photo and the hotspot layer
 * share one box with the photo's own 2:1 ratio that covers the stage
 * (container query units): points stay on their objects at any screen shape.
 *
 * Below md — and under reduced motion — none of this runs: the photo keeps a
 * 3:2 frame under a normal heading, because a pinned mask zoom on a phone costs
 * a screen of scrolling to say the same thing, and a portrait full-screen crop
 * would cut most of the points off anyway.
 *
 * Self-contained: reverting means restoring the old heading + image block in
 * LookOneHome and deleting this file.
 */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { SectionHeading, useLook } from './ui';

/** room-hotspots.jpg is 2400×1200. */
const RATIO = 2;

/** The photo's box: the smallest 2:1 rectangle that covers the stage. */
const COVER_BOX = {
  width: `max(100cqw, calc(100cqh * ${RATIO}))`,
  height: `max(100cqh, calc(100cqw / ${RATIO}))`,
};

/** The knockout plate's own square, in user units, and a rect big enough to
 *  stay covering it once `slice` has scaled it to the viewport. */
const VB = 1000;
const OVER = { x: -2000, y: -2000, width: 5000, height: 5000 };

function useWide() {
  const query = '(min-width: 768px)';
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setWide(m.matches);
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);
  return wide;
}

export function RoomStage({
  eyebrow,
  title,
  img,
  alt,
  children,
}: {
  eyebrow: string;
  title: string;
  img: string;
  alt: string;
  /** the hotspots, positioned in % of the photo */
  children: ReactNode;
}) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const track = useRef<HTMLDivElement>(null);
  const wide = useWide();
  const reduce = useReducedMotion();
  const animate = wide && !reduce;
  const maskId = useId().replace(/:/g, '');

  /* 0 = the stage has just pinned, 1 = it is about to unpin. It has to be
     "end end", not "end start": the sticky child stops holding when the track's
     bottom reaches the bottom of the screen, so "end start" would spend the last
     half of its range measuring travel that happens after the stage has already
     scrolled away, and nothing timed to it would ever be seen. */
  const { scrollYProgress: p } = useScroll({ target: track, offset: ['start start', 'end end'] });

  /* Slow while the word is still a word, then away — the flat middle of the
     zoom, where one letter is big enough to fill the screen on its own, is the
     part worth spending the least time in. */
  const wordScale = useTransform(p, [0, 0.24, 0.4, 0.56], [1, 2.2, 7, 34]);
  // and the plate is already going by the time it gets there
  const plateOpacity = useTransform(p, [0, 0.32, 0.56], [1, 1, 0]);
  const imgScale = useTransform(p, [0, 0.6], [1.14, 1]);

  /* The reveal is a one-way switch rather than more scroll-driven transforms.
     Past this point the plate comes out of the tree entirely — a full-screen SVG
     mask is not something to leave compositing for the rest of the page — and
     the room's own furniture fades in on plain CSS, which cannot be left holding
     a stale value the way a transform past its last keyframe can. */
  const [open, setOpen] = useState(!animate);
  useMotionValueEvent(p, 'change', (v) => {
    if (animate) setOpen(v > 0.58);
  });
  useEffect(() => {
    setOpen(!animate || p.get() > 0.58);
  }, [animate, p]);
  // hotspots only take the pointer once the room has landed
  const live = open;

  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.12em]';

  /* The runway exists only to give the mask something to open across, so it is
     not charged to anyone who will not see it: without the animation the stage
     is just a full-screen room and the extra screen of scrolling would be dead
     travel. */
  return (
    <div ref={track} data-testid="room-stage" className={`relative ${animate ? 'md:h-[230svh]' : ''}`}>
      <div className={`md:h-[100svh] md:min-h-[640px] md:overflow-hidden ${animate ? 'md:sticky md:top-0' : ''}`}>
        {/* title: over the photo from md, a normal heading above it on phones */}
        <div
          className={`pointer-events-none relative z-20 mx-auto max-w-[1400px] px-6 pb-10 pt-20 md:absolute md:inset-x-0 md:top-0 md:px-10 md:pb-0 md:pt-[112px] ${
            animate ? 'transition-[opacity,transform] duration-700 ease-out' : ''
          } ${animate && !open ? 'translate-y-7 opacity-0' : 'translate-y-0 opacity-100'}`}
        >
          <SectionHeading eyebrow={eyebrow} title={title} />
        </div>

        <div className="relative aspect-[3/2] w-full overflow-x-clip [container-type:size] md:absolute md:inset-0 md:aspect-auto md:overflow-hidden">
          <div className="absolute inset-0 md:overflow-hidden">
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ ...COVER_BOX, ...(animate ? { scale: imgScale } : {}) }}
            >
              <img src={img} alt={alt} className="h-full w-full object-cover" />
            </motion.div>

            {/* a light floor shade so the white dots read, and a cream fade at the top
                that carries the title and lets the room rise out of the page */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[40%] bg-gradient-to-b from-[#FDFCF9]/85 via-[#FDFCF9]/35 to-transparent md:block" />

            <motion.div
              data-testid="room-spots"
              data-live={live}
              className={`absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 ${live ? '' : 'pointer-events-none'} ${
                animate ? `transition-opacity duration-700 ease-out ${open ? 'opacity-100' : 'opacity-0'}` : ''
              }`}
              style={{ ...COVER_BOX, ...(animate ? { scale: imgScale } : {}) }}
            >
              {children}
            </motion.div>
          </div>

          {/* The title, cut out of the page. The room shows through the letters
              until they are bigger than the screen. */}
          {animate && !open && (
            <motion.div
              aria-hidden
              data-testid="room-mask"
              className="pointer-events-none absolute inset-0 z-30"
              style={{ opacity: plateOpacity }}
            >
              <svg className="h-full w-full" viewBox={`0 0 ${VB} ${VB}`} preserveAspectRatio="xMidYMid slice">
                <defs>
                  <mask id={maskId} maskUnits="userSpaceOnUse" {...OVER}>
                    <rect {...OVER} fill="#fff" />
                    <motion.g style={{ scale: wordScale, transformBox: 'view-box', transformOrigin: '50% 50%' }}>
                      <text
                        x={VB / 2}
                        y={VB / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#000"
                        style={{
                          fontFamily: isAr ? "'Alexandria', sans-serif" : "'Outfit', sans-serif",
                          fontWeight: 800,
                          fontSize: isAr ? 116 : 132,
                          letterSpacing: isAr ? 0 : '-0.03em',
                        }}
                      >
                        {isAr ? title : title.toUpperCase()}
                      </text>
                    </motion.g>
                  </mask>
                </defs>
                <rect {...OVER} fill="#FDFCF9" mask={`url(#${maskId})`} />
              </svg>
            </motion.div>
          )}

          <p
            className={`pointer-events-none absolute bottom-8 start-10 z-20 hidden border border-[#E8E4DC] bg-[#FDFCF9]/90 px-3.5 py-2 text-[11px] text-neutral-600 backdrop-blur-sm md:block ${caps} ${
              animate ? `transition-opacity duration-700 ease-out ${open ? 'opacity-100' : 'opacity-0'}` : ''
            }`}
          >
            {t('Hover any point to explore the products in this space', 'مرّر المؤشر على أي نقطة لاستكشاف منتجات هذه المساحة')}
          </p>
        </div>
      </div>

      <p className="px-6 pt-4 text-[13px] font-light text-neutral-500 md:hidden">
        {t('Tap any point to explore the products in this space.', 'اضغط على أي نقطة لاستكشاف منتجات هذه المساحة.')}
      </p>
    </div>
  );
}
