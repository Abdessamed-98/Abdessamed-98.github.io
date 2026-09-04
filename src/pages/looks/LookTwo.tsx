/**
 * Look 2 — "Dark Luxury"
 * The showroom at night: warm espresso black, brass-gold hairlines, candle-lit
 * imagery, serif display type. A five-star-hotel reading of the client's warm
 * minimal-luxury reference direction.
 *
 * Bilingual: Arabic (default, RTL, Amiri/Alexandria/Tajawal) ⇄ English (LTR,
 * Playfair/Marcellus/Outfit). The header ENG | عربي switch is live.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Camera, User, Heart, ShoppingBag, Star, ArrowRight,
  Instagram, Facebook, Linkedin, ChevronLeft, ChevronRight,
} from 'lucide-react';
import {
  IMG, HERO_SLIDES, NAV_ITEMS, CATEGORIES, SERVICES, PRODUCTS, STYLES,
  ROOM_HOTSPOTS, FOOTER_LINKS, FOOTER_QUICK, FOOTER_SUPPORT,
  SHOP_MENU, SERVICES_MENU, MENU_FEATURED,
  formatSAR, LookSwitcher,
} from './lookShared';
import type { Bi, Lang, LookSlide, MenuGroup, RoomHotspot } from './lookShared';

/* ------------------------------------------------------------------ */
/* Design tokens (class fragments — kept as literal strings so the     */
/* Tailwind scanner picks them up)                                     */
/* ------------------------------------------------------------------ */
const DISPLAY = "font-['Playfair_Display',serif]";
const CAPS = "font-['Marcellus',serif]";
/* Arabic counterparts: Amiri serif for display, Alexandria for labels.
   CRITICAL: Arabic text must never carry letterspacing — every AR label
   fragment below uses tracking-normal where the EN one tracks out. */
const AR_DISPLAY = "font-['Amiri',serif]";
const AR_LABEL = "font-['Alexandria',sans-serif]";

const GOLD_BTN_BASE =
  'inline-flex items-center justify-center gap-3 border border-[#C9A86A]/70 px-9 py-4 ' +
  'uppercase text-[#C9A86A] ' +
  'transition-all duration-300 hover:bg-[#C9A86A] hover:text-[#131009] cursor-pointer';
const goldBtn = (ar: boolean) =>
  ar
    ? `${GOLD_BTN_BASE} ${AR_LABEL} text-[13px] tracking-normal`
    : `${GOLD_BTN_BASE} ${CAPS} text-[11px] tracking-[0.3em]`;

const ROMAN = ['I', 'II', 'III'] as const;

const STYLE_PLACEMENT: readonly string[] = [
  'md:col-start-1 md:row-start-1',
  'md:col-start-1 md:row-start-2',
  'col-span-2 row-span-2 md:col-start-2 md:row-start-1',
  'md:col-start-4 md:row-start-1',
  'md:col-start-4 md:row-start-2',
];

const stop = (e: { preventDefault: () => void }) => e.preventDefault();

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
function Reveal({
  children, delay = 0, className = '',
}: { children: ReactNode; delay?: number; className?: string; key?: string | number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GoldLink({ ar = false, children }: { ar?: boolean; children: ReactNode }) {
  return (
    <a
      href="#"
      onClick={stop}
      className={`${ar ? `${AR_LABEL} text-[12px] tracking-normal` : `${CAPS} text-[11px] tracking-[0.3em]`} inline-flex items-center gap-2.5 uppercase text-[#C9A86A] border-b border-[#C9A86A]/40 pb-1.5 hover:border-[#C9A86A] transition-colors duration-300`}
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Mega-menu building blocks (desktop full-width panels)               */
/* ------------------------------------------------------------------ */
type MegaMenuId = 'shop' | 'services';

/** One category group column: gold small-caps title + subcategory links. */
function MegaGroup({ group, ar }: { group: MenuGroup; ar: boolean; key?: string | number }) {
  return (
    <div>
      <p className={`${ar ? `${AR_LABEL} text-[12px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.3em]`} uppercase text-[#C9A86A] mb-4`}>
        {ar ? group.title.ar : group.title.en}
      </p>
      <ul className="space-y-2">
        {group.items.map((item) => (
          <li key={item.en}>
            <a
              href="#"
              onClick={stop}
              className={`${ar ? "font-['Tajawal',sans-serif] tracking-normal" : ''} block text-[12.5px] font-light leading-relaxed text-[#EFE9DD]/60 hover:text-[#C9A86A] transition-colors duration-200`}
            >
              {ar ? item.ar : item.en}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Featured promo tile: image in an inset gold hairline frame + caption + CTA. */
function MegaFeatured({ tile, ar }: { tile: { img: string; title: Bi; cta: Bi }; ar: boolean; key?: string | number }) {
  return (
    <a href="#" onClick={stop} className="group block">
      <div className="border border-[#C9A86A]/30 p-1">
        <img
          src={tile.img}
          alt={ar ? tile.title.ar : tile.title.en}
          className="w-full aspect-[16/10] object-cover"
        />
      </div>
      <p className={`${ar ? `${AR_LABEL} text-[12px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.25em]`} uppercase text-[#EFE9DD] mt-4 mb-2`}>
        {ar ? tile.title.ar : tile.title.en}
      </p>
      <span className={`${ar ? `${AR_LABEL} text-[11px] tracking-normal` : `${CAPS} text-[9px] tracking-[0.25em]`} inline-flex items-center gap-2 uppercase text-[#C9A86A] border-b border-[#C9A86A]/40 pb-1 group-hover:border-[#C9A86A] transition-colors duration-300`}>
        {ar ? tile.cta.ar : tile.cta.en} <ArrowRight size={10} strokeWidth={1.5} className="rtl:rotate-180" />
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Shop the Look — shoppable room image                                */
/* ------------------------------------------------------------------ */

/** Motion preset shared by every product card (fade + 6px rise). */
const CARD_MOTION = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
  transition: { duration: 0.18, ease: 'easeOut' as const },
};

const CARD_SHELL =
  'bg-[#1C1610] border border-[#C9A86A]/25 shadow-[0_24px_60px_rgba(0,0,0,0.65)] p-4';

/** Card contents — thumbnail, category, name, price and the actions. */
function HotspotCardBody({ h, ar }: { h: RoomHotspot; ar: boolean }) {
  const label = ar ? h.name.ar : h.name.en;
  return (
    <>
      <div className="flex items-start gap-3.5">
        <span className="shrink-0 border border-[#C9A86A]/40 p-[3px]">
          <img src={h.thumb} alt={label} className="block w-[72px] h-[72px] object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <p className={`${ar ? `${AR_LABEL} text-[10px] tracking-normal` : `${CAPS} text-[9px] tracking-[0.25em]`} uppercase text-[#C9A86A] mb-1.5`}>
            {ar ? h.category.ar : h.category.en}
          </p>
          <h3 className={`${ar ? `${AR_DISPLAY} text-[16px] leading-[1.5]` : `${DISPLAY} text-[14px] leading-snug`} text-[#EFE9DD] line-clamp-2`}>
            {label}
          </h3>
          <p className="flex items-baseline gap-1.5 mt-2">
            <span className={`${DISPLAY} text-[18px] leading-none text-[#C9A86A]`}>{formatSAR(h.price)}</span>
            <span className={`${ar ? 'text-[11px] tracking-normal' : 'text-[10px] tracking-[0.2em]'} text-[#C9A86A]/70`}>
              {ar ? 'ر.س' : 'SAR'}
            </span>
          </p>
        </div>
      </div>

      <button
        type="button"
        className={`${ar ? `${AR_LABEL} text-[12px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.28em]`} mt-4 w-full border border-[#C9A86A]/60 py-2.5 uppercase text-[#C9A86A] hover:bg-[#C9A86A] hover:text-[#131009] transition-colors duration-300 cursor-pointer`}
      >
        {ar ? 'عرض المنتج' : 'VIEW PRODUCT'}
      </button>
      <button
        type="button"
        className={`${ar ? `${AR_LABEL} text-[11px] tracking-normal` : `${CAPS} text-[9px] tracking-[0.25em]`} mt-2.5 w-full uppercase text-[#EFE9DD]/55 hover:text-[#C9A86A] transition-colors duration-300 cursor-pointer`}
      >
        {ar ? 'أضف إلى السلة' : 'ADD TO CART'}
      </button>
    </>
  );
}

/** Physical (never mirrored) offsets that open the card away from the image edge. */
function cardOffset(h: RoomHotspot): CSSProperties {
  return {
    ...(h.align === 'left' ? { right: '26px' } : { left: '26px' }),
    ...(h.vAlign === 'top' ? { bottom: '8px' } : { top: '8px' }),
  };
}

function ShopTheLook({ ar }: { ar: boolean }) {
  const tt = (en: string, arText: string) => (ar ? arText : en);

  const [activeId, setActiveId] = useState<string | null>(null);
  /* Below md the anchored card would run off-screen, so it docks to the
     bottom of the image instead. Rendered once either way, never twice. */
  const [compact, setCompact] = useState(false);
  const timer = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);
  const open = useCallback((id: string) => {
    cancel();
    setActiveId(id);
  }, [cancel]);
  /* ~120ms grace so the cursor can travel from the dot into the card */
  const scheduleClose = useCallback(() => {
    cancel();
    timer.current = window.setTimeout(() => setActiveId(null), 120);
  }, [cancel]);
  const toggle = useCallback((id: string) => {
    cancel();
    setActiveId((cur) => (cur === id ? null : id));
  }, [cancel]);

  useEffect(() => cancel, [cancel]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activeSpot = ROOM_HOTSPOTS.find((h) => h.id === activeId) ?? null;

  return (
    <section data-testid="shop-the-look" className="py-24 md:py-32 border-t border-white/5">
      <Reveal className="max-w-[1400px] mx-auto px-6 md:px-10 mb-12 md:mb-16 text-center">
        <Heading ar={ar} eyebrow={tt('Shoppable Room', 'غرفة قابلة للتسوق')} center>
          {ar ? <>تسوق الغرفة</> : <>Shop the <em className="italic">Look</em></>}
        </Heading>
        <p className={`${ar ? `${AR_LABEL} tracking-normal` : ''} text-[#EFE9DD]/60 font-light leading-relaxed max-w-xl mx-auto mt-8`}>
          {tt(
            'Hover any point to explore the pieces in this space.',
            'مرّر المؤشر على أي نقطة لاستكشاف قطع هذه المساحة.',
          )}
        </p>
      </Reveal>

      {/* Full-bleed shoppable image — kept legible: light wash only */}
      <div
        className="relative w-full min-h-[75vh] overflow-hidden bg-[#1C1610]"
        onMouseLeave={scheduleClose}
      >
        <img
          src={IMG.roomHotspots}
          alt={tt('Shoppable Diyar room setting', 'غرفة ديار قابلة للتسوق')}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* subtle vignette so gold dots read, without hiding the products */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_90%_at_50%_45%,transparent_35%,rgba(19,16,9,0.55)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-24 pointer-events-none bg-gradient-to-b from-[#131009]/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none bg-gradient-to-t from-[#131009]/70 to-transparent" />

        {ROOM_HOTSPOTS.map((h) => {
          const isActive = activeId === h.id;
          return (
            <div key={h.id} className="absolute z-10 w-0 h-0" style={{ top: h.top, left: h.left }}>
              <button
                type="button"
                data-testid={`hotspot-${h.id}`}
                aria-label={ar ? h.name.ar : h.name.en}
                aria-expanded={isActive}
                onMouseEnter={() => open(h.id)}
                onMouseLeave={scheduleClose}
                onFocus={() => open(h.id)}
                onClick={() => toggle(h.id)}
                className="group absolute flex items-center justify-center w-10 h-10 cursor-pointer"
                style={{ top: 0, left: 0, transform: 'translate(-50%, -50%)' }}
              >
                <span className="relative block w-3.5 h-3.5">
                  <span
                    className="absolute inset-0 rounded-full bg-[#C9A86A]"
                    style={{ animation: 'lt-pulse 2.6s ease-out infinite' }}
                  />
                  <span
                    className={`relative block w-3.5 h-3.5 rounded-full bg-[#C9A86A] ring-1 ring-[#131009]/60 shadow-[0_0_14px_rgba(201,168,106,0.85)] transition-transform duration-300 ${
                      isActive ? 'scale-125' : 'group-hover:scale-125'
                    }`}
                  />
                </span>
              </button>

              {/* Desktop: card anchored to its dot, opening away from the edge */}
              <AnimatePresence>
                {isActive && !compact && (
                  <motion.div
                    key={`card-${h.id}`}
                    {...CARD_MOTION}
                    data-testid={`hotspot-card-${h.id}`}
                    onMouseEnter={cancel}
                    onMouseLeave={scheduleClose}
                    style={cardOffset(h)}
                    className={`absolute z-20 w-[260px] ${CARD_SHELL}`}
                  >
                    <HotspotCardBody h={h} ar={ar} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Mobile: one docked card, always inside the viewport */}
        <AnimatePresence>
          {activeSpot && compact && (
            <motion.div
              key={`card-compact-${activeSpot.id}`}
              {...CARD_MOTION}
              data-testid="hotspot-card-compact"
              className={`absolute z-20 bottom-4 left-1/2 -translate-x-1/2 w-[min(280px,calc(100%-2rem))] ${CARD_SHELL}`}
            >
              <HotspotCardBody h={activeSpot} ar={ar} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Heading({
  eyebrow, center = false, ar = false, children,
}: { eyebrow: string; center?: boolean; ar?: boolean; children: ReactNode }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <p className={`${ar ? `${AR_LABEL} text-[13px] tracking-normal` : `${CAPS} text-[11px] tracking-[0.4em]`} uppercase text-[#C9A86A] mb-5`}>{eyebrow}</p>
      <h2 className={`${ar ? `${AR_DISPLAY} leading-[1.35]` : `${DISPLAY} leading-[1.08]`} text-4xl md:text-6xl text-[#EFE9DD]`}>{children}</h2>
      {center && <span className="block w-16 h-px bg-[#C9A86A]/60 mx-auto mt-8" />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function LookTwo() {
  const [slide, setSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  /* Mega menus — one panel open at a time; short close delay lets the
     cursor travel from the trigger into the panel. */
  const [openMenu, setOpenMenu] = useState<MegaMenuId | null>(null);
  const closeTimer = useRef<number | null>(null);
  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openMega = (menu: MegaMenuId) => {
    cancelClose();
    setOpenMenu(menu);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 150);
  };
  const toggleMega = (menu: MegaMenuId) => {
    cancelClose();
    setOpenMenu((m) => (m === menu ? null : menu));
  };
  useEffect(() => cancelClose, []);

  /* Language — the site is primarily Arabic; Arabic is the default. */
  const [lang, setLang] = useState<Lang>(() =>
    typeof localStorage !== 'undefined' && localStorage.getItem('diyar-look-lang') === 'en' ? 'en' : 'ar',
  );
  const isAr = lang === 'ar';
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  const toggleLang = () => {
    const next: Lang = lang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('diyar-look-lang', next);
    setLang(next);
  };

  /* header: transparent over hero → solid chrome after ~60px of scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const id = window.setInterval(
      () => setSlide((s) => (s + 1) % HERO_SLIDES.length),
      6500,
    );
    return () => window.clearInterval(id);
  }, []);

  const fallback: LookSlide = { img: IMG.hero, ar: '', en: '', tag: '', tagAr: '' };
  const active: LookSlide = HERO_SLIDES[slide] ?? fallback;

  const prev = () => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => setSlide((s) => (s + 1) % HERO_SLIDES.length);

  /* Headline with a gold accent on the final word (italic in EN, plain in AR) */
  const words = (isAr ? active.ar : active.en).trim().split(' ');
  const accent = words[words.length - 1] ?? '';
  const headline = words.slice(0, -1).join(' ');

  /* header chrome: white over the hero, ivory on the solid bar; gold hovers.
     While a mega panel is open the header keeps its solid chrome even at top. */
  const solid = scrolled || openMenu !== null;
  const navLinkCls = `${isAr ? `${AR_LABEL} text-[13px] tracking-normal` : `${CAPS} text-[11px] tracking-[0.25em]`} block whitespace-nowrap py-2 uppercase transition-colors duration-300 hover:text-[#C9A86A] ${
    solid ? 'text-[#EFE9DD]/75' : 'text-white'
  }`;
  const headerIconCls = `cursor-pointer transition-colors duration-300 hover:text-[#C9A86A] ${
    solid ? 'text-[#EFE9DD]/75' : 'text-white'
  }`;

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-[#131009] text-[#EFE9DD] ${isAr ? "font-['Tajawal',sans-serif]" : "font-['Outfit',sans-serif]"} font-light antialiased overflow-x-clip selection:bg-[#C9A86A]/30`}
    >
      <style>{`
        @keyframes lt-pulse {
          0%   { transform: scale(1);   opacity: 0.85; }
          70%  { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }
      `}</style>

      {/* ============================== 1. HEADER ============================== */}
      {/* One line, fixed over the hero: transparent at top, espresso after scroll */}
      <header
        onMouseLeave={scheduleClose}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          solid ? 'bg-[#131009]/95 backdrop-blur-md border-white/10' : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex h-[72px] items-center gap-5 lg:gap-6 px-6 md:px-10">
          {/* Logo — page is dark, stays inverted in both states */}
          <a href="#" onClick={stop} className="shrink-0" aria-label="Diyar home">
            <img src="/logo_diyar.svg" alt="Diyar" className="h-8 invert" />
          </a>

          {/* Search */}
          <div
            className={`hidden md:flex items-center gap-3 rounded-full border h-9 w-44 xl:w-60 px-4 transition-colors duration-300 focus-within:border-[#C9A86A]/60 ${
              solid ? 'border-white/15' : 'border-white/40'
            }`}
          >
            <Search
              size={15}
              strokeWidth={1.25}
              className={`shrink-0 transition-colors duration-300 ${solid ? 'text-[#EFE9DD]/45' : 'text-white'}`}
            />
            <input
              type="text"
              placeholder={t('Search…', 'ابحث…')}
              className={`bg-transparent flex-1 min-w-0 text-[13px] font-light outline-none transition-colors duration-300 ${
                solid ? 'text-[#EFE9DD] placeholder:text-[#EFE9DD]/35' : 'text-white placeholder:text-white/70'
              }`}
            />
            <button
              aria-label={t('Search by photo', 'البحث بالصورة')}
              className={`shrink-0 cursor-pointer transition-colors duration-300 hover:text-[#C9A86A] ${
                solid ? 'text-[#C9A86A]/70' : 'text-white'
              }`}
            >
              <Camera size={16} strokeWidth={1.25} />
            </button>
          </div>

          {/* Nav — single line; Shop & Services open full-width mega panels */}
          <nav className="hidden lg:block ms-auto">
            <ul className="flex items-center gap-6 xl:gap-8">
              {NAV_ITEMS.map((item) => {
                const mega: MegaMenuId | null =
                  item.en === 'Shop' ? 'shop' : item.en === 'Services' ? 'services' : null;
                return (
                  <li key={item.en}>
                    {mega ? (
                      <a
                        href="#"
                        data-testid={`mega-${mega}-trigger`}
                        aria-haspopup="true"
                        aria-expanded={openMenu === mega}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleMega(mega);
                        }}
                        onMouseEnter={() => openMega(mega)}
                        onMouseLeave={scheduleClose}
                        className={navLinkCls}
                      >
                        {t(item.en, item.ar)}
                      </a>
                    ) : (
                      <a href="#" onClick={stop} className={navLinkCls}>
                        {t(item.en, item.ar)}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Language + account icons */}
          <div className="flex items-center gap-4 md:gap-5 shrink-0 ms-auto lg:ms-0">
            <button
              data-testid="lang-toggle"
              dir="ltr"
              onClick={toggleLang}
              aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
              className={`${CAPS} flex items-center gap-2 text-[11px] tracking-[0.2em] transition-colors duration-300 cursor-pointer ${
                solid ? 'text-[#EFE9DD]/45' : 'text-white/60'
              }`}
            >
              <span className={`transition-colors duration-300 ${!isAr ? 'text-[#C9A86A]' : 'hover:text-[#C9A86A]'}`}>ENG</span>
              <span className={solid ? 'text-[#C9A86A]/60' : 'text-white/60'}>|</span>
              <span className={`${AR_DISPLAY} text-[14px] leading-none tracking-normal transition-colors duration-300 ${isAr ? 'text-[#C9A86A]' : 'hover:text-[#C9A86A]'}`}>
                عربي
              </span>
            </button>
            <span className={`hidden sm:block h-4 w-px transition-colors duration-300 ${solid ? 'bg-white/10' : 'bg-white/30'}`} />
            <button aria-label="Account" className={headerIconCls}>
              <User size={19} strokeWidth={1.25} />
            </button>
            <button aria-label="Wishlist" className={headerIconCls}>
              <Heart size={19} strokeWidth={1.25} />
            </button>
            <button aria-label="Shopping bag" className={`relative ${headerIconCls}`}>
              <ShoppingBag size={19} strokeWidth={1.25} />
              <span className="absolute -top-1.5 -end-1.5 w-3.5 h-3.5 rounded-full bg-[#C9A86A] text-[#131009] text-[8px] font-medium flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </div>

        {/* Full-width mega panels — flush under the bar (no hover gap) */}
        <AnimatePresence>
          {openMenu === 'shop' && (
            <motion.div
              key="mega-shop"
              data-testid="mega-shop-panel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className="hidden lg:block absolute inset-x-0 top-full bg-[#161009] border-y border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
            >
              <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
                <div className="grid grid-cols-4 gap-x-10 gap-y-10">
                  {SHOP_MENU.map((g) => (
                    <MegaGroup key={g.title.en} group={g} ar={isAr} />
                  ))}
                  {/* Featured column — spans both rows beside the 3×2 groups */}
                  <div className="col-start-4 row-start-1 row-span-2 border-s border-white/10 ps-8 flex flex-col gap-8">
                    {MENU_FEATURED.shop.map((tile) => (
                      <MegaFeatured key={tile.title.en} tile={tile} ar={isAr} />
                    ))}
                  </div>
                </div>
                <div className="mt-10 pt-6 border-t border-white/10">
                  <GoldLink ar={isAr}>
                    {t('View All Categories', 'عرض كل التصنيفات')}{' '}
                    <ArrowRight size={11} strokeWidth={1.5} className="rtl:rotate-180" />
                  </GoldLink>
                </div>
              </div>
            </motion.div>
          )}

          {openMenu === 'services' && (
            <motion.div
              key="mega-services"
              data-testid="mega-services-panel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className="hidden lg:block absolute inset-x-0 top-full bg-[#161009] border-y border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
            >
              <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
                <div className="grid grid-cols-5 gap-x-8 gap-y-10">
                  {SERVICES_MENU.map((g) => (
                    <MegaGroup key={g.title.en} group={g} ar={isAr} />
                  ))}
                  {/* Featured column — spans both rows beside the 4×2 groups */}
                  <div className="col-start-5 row-start-1 row-span-2 border-s border-white/10 ps-8">
                    <MegaFeatured tile={MENU_FEATURED.services[0]} ar={isAr} />
                  </div>
                </div>
                <div className="mt-10 pt-6 border-t border-white/10">
                  <GoldLink ar={isAr}>
                    {t('Request a Consultation', 'اطلب استشارة')}{' '}
                    <ArrowRight size={11} strokeWidth={1.5} className="rtl:rotate-180" />
                  </GoldLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ============================ 2. HERO SLIDER ============================ */}
      <section className="relative h-[90vh] min-h-[620px] overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <motion.img
              src={active.img}
              alt=""
              initial={{ scale: 1.07 }}
              animate={{ scale: 1 }}
              transition={{ duration: 7, ease: 'linear' }}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Static overlays so the crossfade never flashes (side wash follows text side) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131009] via-[#131009]/25 to-[#131009]/40 pointer-events-none" />
        <div className={`absolute inset-0 ${isAr ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#131009]/70 via-transparent to-transparent pointer-events-none`} />

        {/* Copy */}
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col justify-end pb-32 md:pb-36">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-px bg-[#C9A86A]" />
                <span className={`${isAr ? `${AR_LABEL} text-[13px] tracking-normal` : `${CAPS} text-[11px] tracking-[0.4em]`} text-[#C9A86A]`}>
                  {isAr ? active.tagAr : active.tag}
                </span>
              </div>
              <h1 className={`${isAr ? `${AR_DISPLAY} leading-[1.3]` : `${DISPLAY} leading-[1.12]`} text-5xl md:text-7xl text-[#EFE9DD] mb-10`}>
                {headline}{headline && ' '}
                <em className={`text-[#C9A86A] ${isAr ? 'not-italic' : 'italic'}`}>{accent}</em>
              </h1>
              <button className={goldBtn(isAr)}>
                {t('EXPLORE', 'استكشف')} <ArrowRight size={14} strokeWidth={1.5} className="rtl:rotate-180" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Chevrons (physical prev/next — slider geometry, not reading order) */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-[#EFE9DD]/25 items-center justify-center text-[#EFE9DD]/70 hover:border-[#C9A86A] hover:text-[#C9A86A] transition-colors cursor-pointer"
        >
          <ChevronLeft size={20} strokeWidth={1} />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-[#EFE9DD]/25 items-center justify-center text-[#EFE9DD]/70 hover:border-[#C9A86A] hover:text-[#C9A86A] transition-colors cursor-pointer"
        >
          <ChevronRight size={20} strokeWidth={1} />
        </button>

        {/* Roman-numeral indicators (keep I→III visual order in both languages) */}
        <div dir="ltr" className="absolute bottom-9 left-1/2 -translate-x-1/2 z-20 flex items-end gap-8">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.en}
              onClick={() => setSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="group flex flex-col items-center gap-2.5 cursor-pointer"
            >
              <span className={`${CAPS} text-xs tracking-[0.2em] transition-colors duration-500 ${i === slide ? 'text-[#C9A86A]' : 'text-[#EFE9DD]/40 group-hover:text-[#EFE9DD]/70'}`}>
                {ROMAN[i] ?? String(i + 1)}
              </span>
              <span className={`h-px transition-all duration-500 ${i === slide ? 'w-10 bg-[#C9A86A]' : 'w-5 bg-[#EFE9DD]/25'}`} />
            </button>
          ))}
        </div>
      </section>

      {/* ======================= 3. FEATURED CATEGORIES ======================= */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal className="mb-14 md:mb-20">
            <Heading ar={isAr} eyebrow={t('The Showroom', 'صالة العرض')} center>
              {isAr
                ? <>أبرز <em className="not-italic text-[#C9A86A]">التصنيفات</em></>
                : <>Featured <em className="italic">Categories</em></>}
            </Heading>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.en} delay={(i % 3) * 0.06}>
                <a href="#" onClick={stop} className="group relative block aspect-[4/5] overflow-hidden bg-[#1C1610]">
                  <img
                    src={c.img}
                    alt={t(c.en, c.ar)}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131009]/95 via-[#131009]/25 to-transparent" />
                  <div className="absolute inset-3 border border-[#C9A86A]/30 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <h3 className={`${isAr ? `${AR_LABEL} text-sm md:text-lg tracking-normal` : `${CAPS} text-xs md:text-base tracking-[0.2em]`} uppercase text-[#EFE9DD] mb-4`}>
                      {t(c.en, c.ar)}
                    </h3>
                    <span className={`${isAr ? `${AR_LABEL} text-[12px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.3em]`} inline-flex items-center gap-2 text-[#C9A86A] border-b border-[#C9A86A]/40 pb-1 opacity-80 group-hover:opacity-100 group-hover:border-[#C9A86A] transition-all duration-300`}>
                      {t('VIEW MORE', 'عرض المزيد')} <ArrowRight size={11} strokeWidth={1.5} className="rtl:rotate-180" />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= 4. SERVICES ============================= */}
      <section className="py-24 md:py-32 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal className="mb-14 md:mb-20">
            <Heading ar={isAr} eyebrow={t('At Your Service', 'في خدمتك')} center>
              {isAr
                ? <>خدماتنا</>
                : <>Our <em className="italic">Services</em></>}
            </Heading>
          </Reveal>

          <div className="border-t border-l border-white/10">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((s, i) => (
                <Reveal key={s.en} delay={(i % 4) * 0.06} className="h-full">
                  <div className="group h-full flex flex-col items-center gap-5 px-5 py-10 md:py-14 border-r border-b border-white/10 text-center">
                    <span className="w-16 h-16 rounded-full border border-[#C9A86A]/35 flex items-center justify-center text-[#C9A86A] transition-all duration-500 group-hover:border-[#C9A86A] group-hover:bg-[#C9A86A]/5">
                      <s.icon size={26} strokeWidth={1} />
                    </span>
                    <span className={`${isAr ? `${AR_LABEL} text-[13px] md:text-sm tracking-normal` : `${CAPS} text-[11px] md:text-xs tracking-[0.2em]`} block uppercase text-[#EFE9DD]`}>
                      {t(s.en, s.ar)}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================== 5. NEW PRODUCTS ========================== */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-12 md:mb-16">
            <Heading ar={isAr} eyebrow={t('Just Arrived', 'وصل حديثاً')}>
              {isAr
                ? <>التشكيلة <em className="not-italic text-[#C9A86A]">الجديدة</em></>
                : <>The New <em className="italic">Collection</em></>}
            </Heading>
            <GoldLink ar={isAr}>
              {t('VIEW ALL', 'عرض الكل')} <ArrowRight size={12} strokeWidth={1.5} className="rtl:rotate-180" />
            </GoldLink>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {PRODUCTS.slice(0, 8).map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.06} className="h-full">
                <article className="group h-full flex flex-col bg-[#1C1610] p-3 border border-white/5 hover:border-[#C9A86A]/25 transition-colors duration-500">
                  {/* White-cutout imagery sits on a warm ivory tile */}
                  <div className="relative aspect-square overflow-hidden bg-[#F4EFE6]">
                    {p.sale && (
                      <span className={`${isAr ? `${AR_LABEL} text-[10px] tracking-normal` : `${CAPS} text-[9px] tracking-[0.25em]`} absolute top-3 start-3 z-10 bg-[#C9A86A] text-[#131009] px-2.5 py-1`}>
                        {t('SALE', 'تخفيض')}
                      </span>
                    )}
                    <img
                      src={p.img}
                      alt={isAr ? p.nameAr : p.nameEn}
                      className="w-full h-full object-contain mix-blend-multiply p-3 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-col flex-1 pt-4 px-1 pb-1">
                    <span className="text-[9px] tracking-[0.3em] text-[#EFE9DD]/50">{p.brand}</span>
                    <h3 className="text-sm text-[#EFE9DD] font-light leading-snug mt-1.5">{isAr ? p.nameAr : p.nameEn}</h3>

                    <div className="flex items-center justify-between mt-2.5">
                      <span className="flex gap-0.5">
                        {[0, 1, 2, 3, 4].map((n) => (
                          <Star
                            key={n}
                            size={12}
                            className={n < Math.round(p.rating) ? 'text-[#C9A86A] fill-[#C9A86A]' : 'text-[#C9A86A]/25 fill-[#C9A86A]/20'}
                          />
                        ))}
                      </span>
                      <a href="#" onClick={stop} className={`${isAr ? `${AR_LABEL} text-[10px] tracking-normal` : `${CAPS} text-[9px] tracking-[0.25em]`} uppercase text-[#C9A86A] hover:underline underline-offset-4`}>
                        {t('TRY WITH AI', 'جرب AI')}
                      </a>
                    </div>

                    <div className="flex items-baseline gap-2 mt-2.5">
                      <span className={`${DISPLAY} text-lg text-[#C9A86A]`}>{formatSAR(p.price)}</span>
                      <span className={`${isAr ? 'text-[11px] tracking-normal' : 'text-[10px] tracking-[0.2em]'} text-[#C9A86A]/70`}>
                        {t('SAR', 'ر.س')}
                      </span>
                      {p.oldPrice !== undefined && (
                        <span className={`${DISPLAY} text-xs line-through text-[#EFE9DD]/40`}>{formatSAR(p.oldPrice)}</span>
                      )}
                    </div>

                    <button className={`${isAr ? AR_LABEL : CAPS} mt-auto pt-3`}>
                      <span className={`w-full flex items-center justify-center gap-2 border border-[#C9A86A]/50 text-[#C9A86A] ${isAr ? 'text-[12px] tracking-normal' : 'text-[10px] tracking-[0.25em]'} py-2.5 hover:bg-[#C9A86A] hover:text-[#131009] transition-colors duration-300 cursor-pointer`}>
                        <ShoppingBag size={13} strokeWidth={1.25} /> {t('ADD TO CART', 'أضف إلى السلة')}
                      </span>
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============= 6. CUSTOM FURNITURE MANUFACTURING (split) ============= */}
      <section className="py-24 md:py-32 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <Reveal>
            <div className="border border-[#C9A86A]/30 p-3 md:p-4">
              <img
                src={IMG.workshop}
                alt={t('Diyar custom furniture workshop', 'ورشة ديار لتصنيع الأثاث حسب الطلب')}
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <p className={`${isAr ? `${AR_LABEL} text-[13px] tracking-normal` : `${CAPS} text-[11px] tracking-[0.4em]`} uppercase text-[#C9A86A] mb-5`}>
              {t('Made to Order', 'حسب الطلب')}
            </p>
            <h2 className={`${isAr ? `${AR_DISPLAY} leading-[1.35]` : `${DISPLAY} leading-[1.1]`} text-4xl md:text-5xl lg:text-6xl text-[#EFE9DD] mb-8`}>
              {isAr ? (
                <>
                  أثاث مخصص،
                  <br />
                  <span className="text-[#C9A86A]">صُنع لأجلك</span>
                </>
              ) : (
                <>
                  Custom Furniture,
                  <br />
                  <em className="italic text-[#C9A86A]">Made for You</em>
                </>
              )}
            </h2>
            <p className="text-[#EFE9DD]/60 font-light leading-relaxed max-w-md mb-10">
              {t(
                'We bring your vision to life through custom furniture crafted to perfectly fit your space, style, and lifestyle.',
                'نحوّل رؤيتك إلى واقع عبر أثاث مخصص يُصنع بعناية ليلائم مساحتك وذوقك وأسلوب حياتك.',
              )}
            </p>
            <GoldLink ar={isAr}>
              {t('VIEW MORE', 'عرض المزيد')} <ArrowRight size={12} strokeWidth={1.5} className="rtl:rotate-180" />
            </GoldLink>
          </Reveal>
        </div>
      </section>

      {/* ========================= 7. SHOP THE LOOK ========================= */}
      <ShopTheLook ar={isAr} />

      {/* ========================= 8. FIND YOUR STYLE ========================= */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal className="mb-14 md:mb-20">
            <Heading ar={isAr} eyebrow={t('Discover', 'اكتشف')} center>
              {isAr
                ? <>اكتشف <em className="not-italic text-[#C9A86A]">أسلوبك</em></>
                : <>Find Your <em className="italic">Style</em></>}
            </Heading>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[190px] md:auto-rows-[255px] gap-3 md:gap-5">
            {STYLES.map((st, i) => (
              <Reveal key={st.en} delay={i * 0.06} className={STYLE_PLACEMENT[i] ?? ''}>
                <a href="#" onClick={stop} className="group relative block w-full h-full overflow-hidden bg-[#1C1610]">
                  <img
                    src={st.img}
                    alt={t(st.en, st.ar)}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#131009]/25" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131009]/90 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                    <h3 className={`${isAr ? AR_DISPLAY : DISPLAY} text-2xl md:text-3xl text-[#EFE9DD]`}>{t(st.en, st.ar)}</h3>
                    <p className={`${isAr ? `${AR_LABEL} text-[11px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.3em]`} text-[#C9A86A]/80 mt-1.5`}>
                      {formatSAR(st.count)} {t('PRODUCTS', 'منتج')}
                    </p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ 9. B2B TEASER ============================ */}
      <section className="relative min-h-[75vh] flex items-end justify-center overflow-hidden">
        <img
          src={IMG.restaurant}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#131009]/60 via-[#131009]/15 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131009] via-[#131009]/55 to-transparent" />

        <Reveal className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-44 pb-24 md:pb-32">
          <p className={`${isAr ? `${AR_LABEL} text-[13px] tracking-normal` : `${CAPS} text-[11px] tracking-[0.4em]`} uppercase text-[#C9A86A] mb-5`}>
            {t('For Business', 'للشركات')}
          </p>
          <h2 className={`${isAr ? `${AR_DISPLAY} leading-[1.35]` : `${DISPLAY} leading-[1.08]`} text-4xl md:text-6xl text-[#EFE9DD] mb-6`}>
            {isAr ? (
              <>حلول <em className="not-italic text-[#C9A86A]">متكاملة</em> للشركات والمشاريع</>
            ) : (
              <>Turnkey <em className="italic">Project</em> Solutions</>
            )}
          </h2>
          <p className="text-[#EFE9DD]/65 font-light tracking-wide mb-10">
            {t(
              'Design, build & deliver — we manage every stage of your project.',
              'نصمّم وننفّذ ونسلّم — ندير كل مرحلة من مراحل مشروعك.',
            )}
          </p>
          <GoldLink ar={isAr}>
            {t('REQUEST A CONSULTATION', 'اطلب استشارة')} <ArrowRight size={12} strokeWidth={1.5} className="rtl:rotate-180" />
          </GoldLink>
        </Reveal>
      </section>

      {/* ============================== 10. FOOTER ============================== */}
      <footer className="bg-black/40 border-t border-[#C9A86A]/25">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-12 lg:gap-16">
            {/* Brand */}
            <div>
              <img src="/logo_diyar.svg" alt="Diyar" className="h-9 invert mb-6" />
              <p className="text-sm text-[#EFE9DD]/60 font-light leading-relaxed max-w-sm mb-8">
                {isAr ? FOOTER_LINKS.aboutAr : FOOTER_LINKS.about}
              </p>
              <div className="flex items-center gap-3">
                {[
                  { Icon: Instagram, label: 'Instagram' },
                  { Icon: Facebook, label: 'Facebook' },
                  { Icon: Linkedin, label: 'LinkedIn' },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    onClick={stop}
                    aria-label={label}
                    className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-[#EFE9DD]/70 hover:border-[#C9A86A] hover:text-[#C9A86A] transition-colors duration-300"
                  >
                    <Icon size={16} strokeWidth={1.25} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className={`${isAr ? `${AR_LABEL} text-[13px] tracking-normal` : `${CAPS} text-[11px] tracking-[0.3em]`} text-[#C9A86A] mb-6`}>
                {t('QUICK LINKS', 'روابط سريعة')}
              </h4>
              <ul className="space-y-3">
                {FOOTER_QUICK.map((l) => (
                  <li key={l.en}>
                    <a href="#" onClick={stop} className="text-sm font-light text-[#EFE9DD]/60 hover:text-[#C9A86A] transition-colors">
                      {t(l.en, l.ar)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className={`${isAr ? `${AR_LABEL} text-[13px] tracking-normal` : `${CAPS} text-[11px] tracking-[0.3em]`} text-[#C9A86A] mb-6`}>
                {t('CUSTOMER SUPPORT', 'خدمة العملاء')}
              </h4>
              <ul className="space-y-3">
                {FOOTER_SUPPORT.map((l) => (
                  <li key={l.en}>
                    <a href="#" onClick={stop} className="text-sm font-light text-[#EFE9DD]/60 hover:text-[#C9A86A] transition-colors">
                      {t(l.en, l.ar)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + subscribe */}
            <div>
              <h4 className={`${isAr ? `${AR_LABEL} text-[13px] tracking-normal` : `${CAPS} text-[11px] tracking-[0.3em]`} text-[#C9A86A] mb-6`}>
                {t('CONTACT', 'تواصل معنا')}
              </h4>
              <ul className="space-y-3 mb-10">
                <li className={`${DISPLAY} text-sm text-[#C9A86A] tracking-wide`}>
                  <span dir="ltr">{FOOTER_LINKS.phone}</span>
                </li>
                <li className="text-sm font-light text-[#C9A86A]">{FOOTER_LINKS.email}</li>
              </ul>
              <h4 className={`${isAr ? `${AR_LABEL} text-[13px] tracking-normal` : `${CAPS} text-[11px] tracking-[0.3em]`} text-[#C9A86A] mb-5`}>
                {t('SUBSCRIBE', 'النشرة البريدية')}
              </h4>
              <div className="flex items-center gap-3 border-b border-[#C9A86A]/40 pb-2.5 focus-within:border-[#C9A86A] transition-colors">
                <input
                  type="email"
                  placeholder={t('Your email address', 'بريدك الإلكتروني')}
                  className="bg-transparent flex-1 min-w-0 text-sm font-light outline-none text-[#EFE9DD] placeholder:text-[#EFE9DD]/30"
                />
                <button className={`${isAr ? `${AR_LABEL} text-[12px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.3em]`} text-[#C9A86A] hover:text-[#EFE9DD] transition-colors cursor-pointer shrink-0`}>
                  {t('SUBMIT', 'اشترك')}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/10 text-center">
            <p className={`${isAr ? `${AR_LABEL} text-[11px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.3em]`} text-[#EFE9DD]/40`}>
              {t('© 2026 DIYAR. ALL RIGHTS RESERVED.', 'جميع الحقوق محفوظة لديار © 2026')}
            </p>
          </div>
        </div>
      </footer>

      <LookSwitcher />
    </div>
  );
}
