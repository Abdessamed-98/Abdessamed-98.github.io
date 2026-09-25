/**
 * Look 1 — the free design session, under "Shop the Look".
 *
 * Was a headline, a sentence and a list of six nouns. The section now shows
 * what a design session actually produces — a designer's board — and builds it
 * as you scroll in: the floor plan, the room, the sofa, the swatches, the decor
 * and the lamp each fly in from their own side and settle into place, and a
 * numbered note pins itself to each once it lands. The six notes are the six
 * things the session covers, so the list became the board's annotations
 * rather than a list next to it.
 *
 * The room is framed as a live video call — the "virtual consultation" the
 * service names — with a live pill and the visitor's picture-in-picture, so the
 * format of the service is shown instead of described.
 *
 * Scroll-linked, so the board comes apart again on the way back up. Under
 * reduced motion it is simply there. On a phone the board keeps its shape at
 * a smaller scale, the notes show their numbers only, and the six labels are
 * listed under it.
 *
 * One button, and it opens the site's own request sheet like every other
 * service call-to-action — the section itself takes no bookings.
 *
 * Self-contained: removing this file and its one line in LookOneHome restores
 * the previous panel.
 */
import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { House, User, Video } from 'lucide-react';
import { DESIGN_ASSIST_ITEMS, IMG } from '../lookShared';
import { HAIR, INK, OLIVE, TILE, Reveal, SectionHeading, primaryBtnCls, useLook } from './ui';
import { useShell } from './shellContext';

/** The board is laid out on a 1000 × 800 canvas; pieces are placed in its units. */
type Box = { x: number; y: number; w: number; h: number };
const at = (b: Box) => ({ left: `${b.x / 10}%`, top: `${b.y / 8}%`, width: `${b.w / 10}%`, height: `${b.h / 8}%` });

/** fabric and finish bands for the swatch strip, top to bottom */
const SWATCHES = [
  { c: '#5A6B4D', en: 'Olive velvet', ar: 'مخمل زيتي', light: true },
  { c: '#6B4F35', en: 'Walnut', ar: 'خشب الجوز', light: true },
  { c: '#E3DCCC', en: 'Linen', ar: 'كتان', light: false },
  { c: '#B8964F', en: 'Brass', ar: 'نحاس', light: false },
  { c: '#BDB6A8', en: 'Stone', ar: 'حجر', light: false },
];

const ease = (u: number) => 1 - (1 - Math.min(1, Math.max(0, u))) ** 3;

/** One pinned piece. Each arrives on its own beat, from its own side. */
function Piece({
  p, order, box, from, animate, tag, tagTop = false, label, className = '', children,
}: {
  p: MotionValue<number>;
  /** where it falls in the assembly */
  order: number;
  box: Box;
  /** where it flies in from, in px, and how tilted */
  from: { x: number; y: number; r: number };
  animate: boolean;
  /** index into DESIGN_ASSIST_ITEMS for its note */
  tag: number;
  tagTop?: boolean;
  /** a shorter note, for a piece too narrow to hold the item's full name */
  label?: { en: string; ar: string };
  className?: string;
  children: ReactNode;
}) {
  const { t } = useLook();
  const start = order * 0.09;
  const end = Math.min(0.92, start + 0.46);
  const u = useTransform(p, [start, end], [0, 1]);
  const x = useTransform(u, (v) => (1 - ease(v)) * from.x);
  const y = useTransform(u, (v) => (1 - ease(v)) * from.y);
  const rotate = useTransform(u, (v) => (1 - ease(v)) * from.r);
  const opacity = useTransform(u, [0, 0.3], [0, 1]);
  const noteOpacity = useTransform(p, [end - 0.04, end + 0.06], [0, 1]);
  const noteY = useTransform(p, [end - 0.04, end + 0.06], [6, 0]);
  const item = DESIGN_ASSIST_ITEMS[tag];

  return (
    <motion.div
      data-testid="ds-piece"
      className={`absolute overflow-hidden shadow-[0_12px_32px_rgba(23,21,18,0.12)] ${className}`}
      style={{ ...at(box), ...(animate ? { x, y, rotate, opacity } : {}) }}
    >
      {children}
      {/* the designer's note pinned to it — number always, words from md up */}
      <motion.span
        data-testid="ds-note"
        className={`absolute start-[4%] z-10 flex items-center gap-1.5 bg-white px-1.5 py-1 text-[10px] shadow-sm md:px-2 md:text-[11px] ${
          tagTop ? 'top-[5%]' : 'bottom-[5%]'
        }`}
        style={animate ? { opacity: noteOpacity, y: noteY } : undefined}
      >
        <span dir="ltr" className="font-['Outfit',sans-serif] font-bold" style={{ color: OLIVE }}>
          {String(tag + 1).padStart(2, '0')}
        </span>
        <span className="hidden whitespace-nowrap font-medium md:inline" style={{ color: INK }}>
          {label ? t(label.en, label.ar) : t(item.en, item.ar)}
        </span>
      </motion.span>
    </motion.div>
  );
}

export function DesignStudio() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { openService } = useShell();
  const reduce = useReducedMotion();
  const animate = !reduce;

  const board = useRef<HTMLDivElement>(null);
  /* Starts only once about two thirds of the board is on screen, and is
     finished just as the whole of it is — clear of the sticky header — so the
     build happens in view, not while the board is still coming up from the
     bottom edge (which is how it first shipped: 'start 95%' → 'center 55%'). */
  const { scrollYProgress: p } = useScroll({ target: board, offset: ['start 55%', 'center 42%'] });

  return (
    <div data-testid="design-studio" className="overflow-x-clip border-t" style={{ borderColor: HAIR, backgroundColor: TILE }}>
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ---- the offer ---- */}
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow={t('Design Studio', 'استوديو التصميم')}
              title={t('Get Free Design Assistance', 'احصل على مساعدة التصميم مجاناً')}
            />
            <p className="mt-7 max-w-md text-[15px] font-light leading-relaxed text-neutral-600">
              {t(
                'Our designers help you plan, style and furnish every room — at no cost. You leave with a board like this one: the plan, the pieces, the palette and the light, all chosen for your space.',
                'مصممونا يساعدونك في تخطيط كل غرفة وتنسيقها وتأثيثها — دون أي تكلفة. وتخرج بلوحة مثل هذه: المخطط والقطع والألوان والإضاءة، مختارة كلها لمساحتك.',
              )}
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {[
                { icon: Video, label: t('By video call', 'عن بُعد بالفيديو') },
                { icon: House, label: t('Or at your home', 'أو في منزلك') },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 text-[13px] font-medium" style={{ color: INK }}>
                  <Icon size={17} strokeWidth={1.4} style={{ color: OLIVE }} />
                  {label}
                </span>
              ))}
              <span
                className={`inline-flex items-center px-2.5 py-1 text-[10px] font-medium text-white ${
                  isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]'
                }`}
                style={{ backgroundColor: OLIVE }}
              >
                {t('Free', 'مجانية بالكامل')}
              </span>
            </div>

            <button
              type="button"
              data-testid="ds-book"
              onClick={() => openService(t('Interior Design', 'التصميم الداخلي'))}
              className={`mt-10 px-10 py-4 ${primaryBtnCls(isAr)}`}
            >
              {t('Book a Free Session', 'احجز جلسة مجانية')}
            </button>
          </Reveal>

          {/* ---- the board, assembling itself ---- */}
          <div className="lg:col-span-7">
            <div ref={board} data-testid="ds-board" className="relative aspect-[5/4] w-full">
              {/* 02 — the floor plan */}
              <Piece p={p} order={0} box={{ x: 400, y: 0, w: 600, h: 400 }} from={{ x: 90, y: -60, r: 3 }} animate={animate} tag={1}>
                <img src="/looks/apartment.jpg" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </Piece>

              {/* 06 — the room, as a live call with the designer */}
              <Piece p={p} order={1} box={{ x: 0, y: 0, w: 380, h: 470 }} from={{ x: -90, y: 40, r: -4 }} animate={animate} tag={5}>
                <img src={IMG.catHome} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                <span className="absolute start-[5%] top-[4%] z-10 flex items-center gap-1.5 bg-black/45 px-2 py-1 text-[9px] text-white backdrop-blur-sm md:text-[10px]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E5484D] opacity-75 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#E5484D]" />
                  </span>
                  {t('Live · with your designer', 'مباشر · مع مصممك')}
                </span>
                {/* the visitor's own picture-in-picture */}
                <span className="absolute bottom-[4%] end-[5%] z-10 flex aspect-[3/4] w-[24%] flex-col items-center justify-center gap-1 border border-white/30 bg-[#171512]/80 backdrop-blur-sm">
                  <User size={16} strokeWidth={1.3} className="text-white/70" />
                  <span className="hidden text-[9px] text-white/60 md:block">{t('You', 'أنت')}</span>
                </span>
              </Piece>

              {/* 01 — the sofa */}
              <Piece p={p} order={2} box={{ x: 400, y: 420, w: 400, h: 380 }} from={{ x: 0, y: 110, r: -2 }} animate={animate} tag={0} className="bg-white">
                <img src="/looks/cutout/p01.webp" alt="" loading="lazy" decoding="async" className="h-full w-full object-contain p-[10%] pb-[22%]" />
              </Piece>

              {/* 03 — the palette, as fabric and finish bands */}
              <Piece
                p={p}
                order={3}
                box={{ x: 0, y: 490, w: 180, h: 310 }}
                from={{ x: -70, y: 90, r: 4 }}
                animate={animate}
                tag={2}
                tagTop
                label={{ en: 'Colours & materials', ar: 'الألوان والخامات' }}
                className="bg-white"
              >
                {/* the note sits in a white head, like a paint card, not over a colour */}
                <div className="flex h-full w-full flex-col pt-[17%]">
                  {SWATCHES.map((s) => (
                    <span key={s.c} className="flex flex-1 items-end px-[8%] pb-[4%]" style={{ backgroundColor: s.c }}>
                      <span className={`hidden text-[9px] md:inline ${s.light ? 'text-white/80' : 'text-[#171512]/60'}`}>
                        {t(s.en, s.ar)}
                      </span>
                    </span>
                  ))}
                </div>
              </Piece>

              {/* 04 — the decor */}
              <Piece p={p} order={4} box={{ x: 200, y: 490, w: 180, h: 310 }} from={{ x: -20, y: 120, r: -3 }} animate={animate} tag={3}>
                <img src="/looks/shop/vases.jpg" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </Piece>

              {/* 05 — the light */}
              <Piece p={p} order={5} box={{ x: 820, y: 420, w: 180, h: 380 }} from={{ x: 100, y: 60, r: 5 }} animate={animate} tag={4}>
                <img src="/looks/shop/lamp.jpg" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </Piece>
            </div>

            {/* a phone shows the notes' numbers on the board; the words live here */}
            <ol className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5 md:hidden">
              {DESIGN_ASSIST_ITEMS.map((it, i) => (
                <li key={it.en} className="flex items-baseline gap-2 text-[12.5px]" style={{ color: INK }}>
                  <span dir="ltr" className="font-['Outfit',sans-serif] text-[11px] font-bold" style={{ color: OLIVE }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {t(it.en, it.ar)}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
