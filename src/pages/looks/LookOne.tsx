/**
 * Look 1 — "Editorial Light"
 * Warm minimal luxury e-commerce direction (Zara Home / RH aesthetic).
 * Near-white warm canvas, huge bold uppercase section titles with tiny
 * letterspaced eyebrows, editorial photography, hairline dividers,
 * restrained motion. Bilingual: Arabic (default, RTL) + English.
 */
import {
  createContext, useContext, useEffect, useRef, useState,
  type CSSProperties, type ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Camera, User, Heart, ShoppingBag, Star, ArrowRight,
  Instagram, Facebook, Linkedin, ChevronLeft, ChevronRight,
} from 'lucide-react';
import {
  IMG, HERO_SLIDES, NAV_ITEMS, CATEGORIES, SERVICES, PRODUCTS, STYLES,
  DESIGN_ASSIST_ITEMS, FOOTER_LINKS, FOOTER_QUICK, FOOTER_SUPPORT, formatSAR, LookSwitcher,
  SHOP_MENU, SERVICES_MENU, MENU_FEATURED, ROOM_HOTSPOTS,
  ROOMS, AI_STUDIO, WHY_DIYAR, STORES, LOYALTY, REVIEWS, BLOG_POSTS, PARTNER, APP_PROMO,
  type Lang, type MenuGroup, type Bi, type RoomHotspot, type LookProduct,
} from './lookShared';

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */
const BG = '#FDFCF9';      // near-white warm canvas
const INK = '#171512';     // text
const OLIVE = '#5A6B4D';   // accent
const HAIR = '#E8E4DC';    // hairlines
const RED = '#B03A2E';     // sale / AI link
const TILE = '#F6F3EC';    // product image tile
const OLIVE_LT = '#A7B894'; // olive lifted for the dark bands
const CREAM = '#F6F3EC';   // type colour on the dark bands
const NIGHT = '#14120F';   // dark band ground (same as the footer)

/* ------------------------------------------------------------------ */
/* Language context                                                    */
/* ------------------------------------------------------------------ */
const LangContext = createContext<Lang>('ar');
const useLang = () => useContext(LangContext);

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

/** Restrained scroll-reveal wrapper. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Tiny letterspaced eyebrow over a huge bold uppercase title.
 * `light` lifts both tones so the same component works on the dark bands.
 */
function SectionHeading({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  const isAr = useLang() === 'ar';
  return (
    <div>
      <p
        className={`mb-4 text-[11px] uppercase ${
          isAr ? "font-['Tajawal',sans-serif] tracking-normal" : 'tracking-[0.32em]'
        }`}
        style={{ color: light ? OLIVE_LT : OLIVE }}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-extrabold uppercase text-4xl md:text-5xl lg:text-6xl ${
          isAr
            ? "font-['Alexandria',sans-serif] leading-[1.15] tracking-normal"
            : "font-['Outfit',sans-serif] leading-[0.95] tracking-tight"
        }`}
        style={{ color: light ? CREAM : INK }}
      >
        {title}
      </h2>
    </div>
  );
}

/** Tiny letterspaced uppercase "VIEW MORE →" link with hairline underline. */
function ViewMore({ label, light = false }: { label?: string; light?: boolean }) {
  const isAr = useLang() === 'ar';
  const text = label ?? (isAr ? 'عرض المزيد' : 'View More');
  return (
    <a
      href="#"
      className={`group/vm inline-flex items-center gap-2.5 pb-1.5 border-b text-[11px] uppercase transition-colors ${
        isAr ? 'tracking-normal' : 'tracking-[0.28em]'
      } ${
        light
          ? 'text-white border-white/50 hover:border-white'
          : 'text-[#171512] border-[#171512]/25 hover:border-[#171512]'
      }`}
    >
      {text}
      <ArrowRight
        size={12}
        strokeWidth={1.5}
        className={`transition-transform duration-300 ${
          isAr ? 'rotate-180 group-hover/vm:-translate-x-1' : 'group-hover/vm:translate-x-1'
        }`}
      />
    </a>
  );
}

/** Rating stars, size 12, filled per rating. `light` inverts them for the dark bands. */
function Stars({ rating, light = false }: { rating: number; light?: boolean }) {
  return (
    <div className="flex items-center gap-[3px]" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const on = i < Math.round(rating);
        return (
          <Star
            key={i}
            size={12}
            strokeWidth={1}
            className={
              on
                ? light
                  ? 'fill-[#F6F3EC] text-[#F6F3EC]'
                  : 'fill-[#171512] text-[#171512]'
                : light
                  ? 'fill-transparent text-white/30'
                  : 'fill-transparent text-[#D9D3C7]'
            }
          />
        );
      })}
    </div>
  );
}

/**
 * The page's product card — image tile, brand, name, stars, price, actions.
 * Shared by "New Products" (full) and "Best Sellers" (`rank` shows 01–04 and
 * drops the add-to-cart button so the rail stays compact).
 */
function ProductCard({ p, rank }: { p: LookProduct; rank?: number }) {
  const isAr = useLang() === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);

  return (
    <div className="group flex h-full flex-col">
      {/* image tile */}
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: TILE }}>
        {p.sale && (
          <span
            className={`absolute start-4 top-4 z-10 text-[10px] font-semibold uppercase ${
              isAr ? 'tracking-normal' : 'tracking-[0.28em]'
            }`}
            style={{ color: RED }}
          >
            {t('Sale', 'تخفيض')}
          </span>
        )}
        {rank !== undefined && (
          <span
            className="absolute end-4 top-2 z-10 font-['Outfit',sans-serif] text-[42px] font-extrabold leading-none text-[#171512]/15"
            aria-hidden="true"
          >
            {String(rank).padStart(2, '0')}
          </span>
        )}
        <img
          src={p.img}
          alt={isAr ? p.nameAr : p.nameEn}
          className="h-full w-full object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* info */}
      <p className={`mt-5 text-[10px] uppercase text-neutral-400 ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`}>
        {isAr && p.brand === 'DIYAR HOME' ? 'ديار هوم' : p.brand}
      </p>
      <h3 className="mt-1.5 truncate text-sm font-medium" title={isAr ? p.nameAr : p.nameEn}>
        {isAr ? p.nameAr : p.nameEn}
      </h3>
      <div className="mt-2">
        <Stars rating={p.rating} />
      </div>

      {/* price row */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2 overflow-hidden">
          <span className="text-[15px] font-bold">{formatSAR(p.price)}</span>
          <span className={`text-[10px] uppercase text-neutral-500 ${isAr ? 'tracking-normal' : 'tracking-[0.1em]'}`}>
            {t('SAR', 'ر.س')}
          </span>
          {p.oldPrice && <span className="text-xs text-neutral-400 line-through">{formatSAR(p.oldPrice)}</span>}
        </div>
        <a
          href="#"
          className={`shrink-0 text-[10px] font-semibold uppercase leading-none underline-offset-4 hover:underline ${
            isAr ? 'tracking-normal' : 'tracking-[0.24em]'
          }`}
          style={{ color: RED }}
        >
          {t('Try with AI', 'جرب AI')}
        </a>
      </div>

      {/* add to cart — full card only; the rail stays quiet */}
      {rank === undefined && (
        <button
          type="button"
          className={`mt-5 w-full border border-[#171512] py-3.5 text-[10px] font-medium uppercase transition-colors duration-300 hover:bg-[#171512] hover:text-white ${
            isAr ? 'tracking-normal' : 'tracking-[0.28em]'
          }`}
        >
          {t('Add to Cart', 'أضف إلى السلة')}
        </button>
      )}
    </div>
  );
}

/**
 * Shop-the-look hotspot: a pulsing dot pinned to a real object in the room photo
 * that opens a small product card on hover / tap.
 * Dot AND card use PHYSICAL offsets (inline top/left/right/bottom) so they keep
 * tracking the photo in RTL — only the card's text follows the language.
 */
function ShopHotspot({
  h,
  open,
  delay = 0,
  onOpen,
  onScheduleClose,
  onToggle,
}: {
  h: RoomHotspot;
  open: boolean;
  delay?: number;
  onOpen: () => void;
  onScheduleClose: () => void;
  onToggle: () => void;
  key?: string | number;
}) {
  const isAr = useLang() === 'ar';
  const name = isAr ? h.name.ar : h.name.en;

  /* open the card away from the nearest image edge — physical, never mirrored */
  const cardPos: CSSProperties = {
    ...(h.align === 'left' ? { right: '-6px' } : { left: '-6px' }),
    ...(h.vAlign === 'top' ? { bottom: 'calc(100% + 14px)' } : { top: 'calc(100% + 14px)' }),
  };

  return (
    <div
      className="absolute z-10"
      style={{ top: h.top, left: h.left }}
      onMouseEnter={onOpen}
      onMouseLeave={onScheduleClose}
    >
      <div className="relative h-3.5 w-3.5">
        {/* slow pulsing halo */}
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full bg-white/60"
          animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay }}
        />
        {/* the control itself */}
        <button
          type="button"
          data-testid={`hotspot-${h.id}`}
          aria-label={name}
          aria-expanded={open}
          onClick={onToggle}
          onFocus={onOpen}
          className={`absolute inset-0 rounded-full border border-[#5A6B4D] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.18),0_2px_10px_rgba(0,0,0,0.25)] transition-transform duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
            open ? 'scale-[1.35]' : 'hover:scale-[1.35]'
          }`}
        />

        {/* product card */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              style={{ ...cardPos, borderColor: HAIR }}
              className={`absolute z-20 w-[212px] cursor-default border bg-white text-start shadow-[0_18px_44px_rgba(23,21,18,0.22)] sm:w-[260px] ${
                isAr ? "font-['Tajawal',sans-serif]" : "font-['Outfit',sans-serif]"
              }`}
            >
              <div className="flex gap-3.5 p-3.5">
                <img
                  src={h.thumb}
                  alt={name}
                  className="h-[72px] w-[72px] shrink-0 object-cover sm:h-[80px] sm:w-[80px]"
                  style={{ backgroundColor: TILE }}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[9px] uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.22em]'}`}
                    style={{ color: OLIVE }}
                  >
                    {isAr ? h.category.ar : h.category.en}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-[12.5px] font-medium leading-snug" style={{ color: INK }}>
                    {name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-[14px] font-bold" style={{ color: INK }}>
                      {formatSAR(h.price)}
                    </span>
                    <span
                      className={`text-[9.5px] uppercase text-neutral-500 ${
                        isAr ? 'tracking-normal' : 'tracking-[0.1em]'
                      }`}
                    >
                      {isAr ? 'ر.س' : 'SAR'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-3.5 pb-3.5">
                <button
                  type="button"
                  className={`w-full bg-[#171512] py-2.5 text-[9.5px] font-medium uppercase text-white transition-colors duration-300 hover:bg-[#5A6B4D] ${
                    isAr ? 'tracking-normal' : 'tracking-[0.24em]'
                  }`}
                >
                  {isAr ? 'عرض المنتج' : 'View Product'}
                </button>
                <a
                  href="#"
                  className={`mt-2.5 block text-center text-[9.5px] uppercase text-neutral-500 underline-offset-4 transition-colors hover:text-[#171512] hover:underline ${
                    isAr ? 'tracking-normal' : 'tracking-[0.18em]'
                  }`}
                >
                  {isAr ? 'أضف إلى السلة' : '+ Add to Cart'}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** One mega-menu column: group title + subcategory links. */
function MegaGroup({ group }: { group: MenuGroup; key?: string | number }) {
  const isAr = useLang() === 'ar';
  return (
    <div className="text-start">
      <p
        className={`text-[11px] font-bold uppercase text-[#171512] ${
          isAr ? "font-['Alexandria',sans-serif] tracking-normal" : 'tracking-[0.18em]'
        }`}
      >
        {isAr ? group.title.ar : group.title.en}
      </p>
      <ul className="mt-3.5 space-y-1">
        {group.items.map((it) => (
          <li key={it.en}>
            <a
              href="#"
              className="block text-[12.5px] leading-relaxed text-neutral-500 decoration-[#5A6B4D] underline-offset-4 transition-colors hover:text-[#171512] hover:underline"
            >
              {isAr ? it.ar : it.en}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Featured promo tile inside a mega-menu panel. */
function MegaFeatured({ img, title, cta }: { img: string; title: Bi; cta: Bi; key?: string | number }) {
  const isAr = useLang() === 'ar';
  return (
    <a href="#" className="group/mf block text-start">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={img}
          alt={isAr ? title.ar : title.en}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/mf:scale-105"
        />
      </div>
      <p
        className={`mt-3.5 text-[12px] font-bold uppercase text-[#171512] ${
          isAr ? "font-['Alexandria',sans-serif] tracking-normal" : 'tracking-[0.18em]'
        }`}
      >
        {isAr ? title.ar : title.en}
      </p>
      <span
        className={`mt-2 inline-flex items-center gap-2 border-b border-[#171512]/25 pb-1 text-[10.5px] uppercase text-[#171512] transition-colors group-hover/mf:border-[#171512] ${
          isAr ? 'tracking-normal' : 'tracking-[0.24em]'
        }`}
      >
        {isAr ? cta.ar : cta.en}
        <ArrowRight
          size={11}
          strokeWidth={1.5}
          className="rtl:rotate-180 transition-transform duration-300 group-hover/mf:translate-x-1 rtl:group-hover/mf:-translate-x-1"
        />
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function LookOne() {
  const [slide, setSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<'shop' | 'services' | null>(null);
  const closeTimer = useRef<number | null>(null);
  const [lang, setLang] = useState<Lang>(() =>
    typeof localStorage !== 'undefined' && localStorage.getItem('diyar-look-lang') === 'en' ? 'en' : 'ar',
  );

  /* mega menu hover intent: ~150ms close delay so the cursor can travel into the panel */
  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 150);
  };
  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, []);

  /* shop-the-look: one open product card at a time, with a small close grace period */
  const [openSpot, setOpenSpot] = useState<string | null>(null);
  const spotTimer = useRef<number | null>(null);
  const cancelSpotClose = () => {
    if (spotTimer.current !== null) {
      window.clearTimeout(spotTimer.current);
      spotTimer.current = null;
    }
  };
  const scheduleSpotClose = () => {
    cancelSpotClose();
    spotTimer.current = window.setTimeout(() => setOpenSpot(null), 120);
  };
  const openSpotNow = (id: string) => {
    cancelSpotClose();
    setOpenSpot(id);
  };
  const toggleSpot = (id: string) => {
    cancelSpotClose();
    setOpenSpot((s) => (s === id ? null : id));
  };
  useEffect(() => {
    return () => {
      if (spotTimer.current !== null) window.clearTimeout(spotTimer.current);
    };
  }, []);
  useEffect(() => {
    if (openSpot === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSpot(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSpot]);

  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  const isAr = lang === 'ar';

  const toggleLang = () => {
    const next: Lang = lang === 'ar' ? 'en' : 'ar';
    if (typeof localStorage !== 'undefined') localStorage.setItem('diyar-look-lang', next);
    setLang(next);
  };

  /* hero auto-advance (resets after manual navigation too) */
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [slide]);

  /* header: transparent over hero → solid chrome after ~60px of scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const prev = () => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => setSlide((s) => (s + 1) % HERO_SLIDES.length);

  /* header chrome: white over the hero, ink on the solid bar.
     While a mega-menu panel is open the header always shows its solid chrome. */
  const solid = scrolled || openMenu !== null;
  const navItemCls = `relative whitespace-nowrap py-2 text-[11.5px] uppercase transition-colors duration-300 after:absolute after:bottom-0 after:start-0 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full ${
    isAr ? 'tracking-normal' : 'tracking-[0.2em]'
  } ${solid ? 'text-[#171512] after:bg-[#171512]' : 'text-white after:bg-white'}`;
  const iconBtnCls = `transition-colors duration-300 ${
    solid ? 'text-[#171512] hover:text-[#5A6B4D]' : 'text-white hover:text-white/70'
  }`;

  return (
    <LangContext.Provider value={lang}>
      <div
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className={`min-h-screen overflow-x-clip antialiased selection:bg-[#5A6B4D] selection:text-white ${
          isAr ? "font-['Tajawal',sans-serif]" : "font-['Outfit',sans-serif]"
        }`}
        style={{ backgroundColor: BG, color: INK }}
      >
        {/* ============================================================ */}
        {/* 1. HEADER — transparent over hero, solid after scroll         */}
        {/* ============================================================ */}
        <header
          onMouseEnter={cancelClose}
          onMouseLeave={() => {
            if (openMenu !== null) scheduleClose();
          }}
          className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
            solid
              ? 'border-[#E8E4DC] bg-[#FDFCF9]/95 shadow-[0_1px_16px_rgba(23,21,18,0.07)] backdrop-blur-md'
              : 'border-transparent bg-transparent'
          }`}
        >
          <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-5 px-6 md:px-10 lg:gap-6">
            {/* logo — white over hero, black on solid bar */}
            <a href="#" className="shrink-0">
              <img
                src="/logo_diyar.svg"
                alt="Diyar"
                className={`h-8 w-auto transition-all duration-300 ${solid ? '' : 'invert'}`}
              />
            </a>

            {/* search */}
            <div
              className={`hidden h-9 w-44 items-center gap-2.5 rounded-full border px-4 transition-colors duration-300 md:flex xl:w-56 ${
                solid ? 'border-[#E8E4DC] bg-white' : 'border-white/40 bg-transparent'
              }`}
            >
              <Search
                size={15}
                strokeWidth={1.5}
                className={`shrink-0 transition-colors duration-300 ${solid ? 'text-neutral-400' : 'text-white'}`}
              />
              <input
                type="text"
                placeholder={t('SEARCH', 'ابحث')}
                className={`w-full min-w-0 bg-transparent text-[11px] uppercase transition-colors duration-300 focus:outline-none ${
                  isAr ? 'tracking-normal' : 'tracking-[0.2em]'
                } ${
                  solid ? 'text-[#171512] placeholder:text-neutral-400' : 'text-white placeholder:text-white/70'
                }`}
              />
              <button
                type="button"
                aria-label={t('Search by photo', 'البحث بالصورة')}
                className={`shrink-0 transition-colors duration-300 ${
                  solid ? 'text-neutral-400 hover:text-[#171512]' : 'text-white hover:text-white/70'
                }`}
              >
                <Camera size={15} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1" />

            {/* nav — Shop & Services open full-width mega menus (panels are siblings below) */}
            <nav className="hidden items-center gap-6 lg:flex">
              {NAV_ITEMS.map((item) => {
                const mega =
                  item.en === 'Shop' ? ('shop' as const) : item.en === 'Services' ? ('services' as const) : null;
                return mega !== null ? (
                  <button
                    key={item.en}
                    type="button"
                    data-testid={`mega-${mega}-trigger`}
                    aria-haspopup="true"
                    aria-expanded={openMenu === mega}
                    onMouseEnter={() => {
                      cancelClose();
                      setOpenMenu(mega);
                    }}
                    onClick={() => {
                      cancelClose();
                      setOpenMenu((m) => (m === mega ? null : mega));
                    }}
                    className={`${navItemCls} cursor-pointer ${openMenu === mega ? 'after:w-full' : ''}`}
                  >
                    {t(item.en, item.ar)}
                  </button>
                ) : (
                  <a key={item.en} href="#" className={navItemCls}>
                    {t(item.en, item.ar)}
                  </a>
                );
              })}
            </nav>

            {/* language toggle — active language emphasized */}
            <button
              type="button"
              data-testid="lang-toggle"
              onClick={toggleLang}
              aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
              className={`hidden shrink-0 items-center gap-2 text-[11px] transition-colors duration-300 sm:flex ${
                isAr ? 'tracking-normal' : 'tracking-[0.18em]'
              } ${solid ? 'text-[#171512]' : 'text-white'}`}
            >
              <span
                className={`transition-colors duration-300 ${
                  !isAr
                    ? `font-bold ${solid ? 'text-[#171512]' : 'text-white'}`
                    : `font-medium ${
                        solid ? 'text-neutral-400 hover:text-[#171512]' : 'text-white/55 hover:text-white'
                      }`
                }`}
              >
                ENG
              </span>
              <span className={`h-3 w-px transition-colors duration-300 ${solid ? 'bg-[#E8E4DC]' : 'bg-white/40'}`} />
              <span
                className={`font-['Amiri',serif] text-[15px] leading-none transition-colors ${
                  isAr
                    ? `font-bold ${solid ? 'text-[#171512]' : 'text-white'}`
                    : solid
                      ? 'text-neutral-500 hover:text-[#171512]'
                      : 'text-white/70 hover:text-white'
                }`}
              >
                عربي
              </span>
            </button>

            {/* icons */}
            <div className="flex shrink-0 items-center gap-4 md:gap-5">
              <button type="button" aria-label={t('Account', 'الحساب')} className={iconBtnCls}>
                <User size={20} strokeWidth={1.25} />
              </button>
              <button type="button" aria-label={t('Wishlist', 'المفضلة')} className={iconBtnCls}>
                <Heart size={20} strokeWidth={1.25} />
              </button>
              <button type="button" aria-label={t('Cart', 'السلة')} className={`relative ${iconBtnCls}`}>
                <ShoppingBag size={20} strokeWidth={1.25} />
                <span
                  className="absolute -end-1.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-semibold text-white"
                  style={{ backgroundColor: OLIVE }}
                >
                  2
                </span>
              </button>
            </div>
          </div>

          {/* mega menu panels — full viewport width, flush under the header (desktop only) */}
          <AnimatePresence>
            {openMenu === 'shop' && (
              <motion.div
                key="mega-shop"
                data-testid="mega-shop-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onMouseEnter={cancelClose}
                className="absolute inset-x-0 top-full hidden border-y bg-white shadow-[0_24px_60px_rgba(23,21,18,0.08)] lg:block"
                style={{ borderColor: HAIR, color: INK }}
              >
                <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10">
                  <div className="grid grid-cols-12 gap-x-10">
                    {/* 6 category groups, 3 × 2 */}
                    <div className="col-span-9 grid grid-cols-3 gap-x-8 gap-y-10">
                      {SHOP_MENU.map((group) => (
                        <MegaGroup key={group.title.en} group={group} />
                      ))}
                    </div>
                    {/* featured side column */}
                    <div className="col-span-3 space-y-8 border-s ps-8" style={{ borderColor: HAIR }}>
                      {MENU_FEATURED.shop.map((f) => (
                        <MegaFeatured key={f.title.en} img={f.img} title={f.title} cta={f.cta} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-10 border-t pt-6" style={{ borderColor: HAIR }}>
                    <ViewMore label={t('View All Categories', 'عرض كل التصنيفات')} />
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
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onMouseEnter={cancelClose}
                className="absolute inset-x-0 top-full hidden border-y bg-white shadow-[0_24px_60px_rgba(23,21,18,0.08)] lg:block"
                style={{ borderColor: HAIR, color: INK }}
              >
                <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10">
                  <div className="grid grid-cols-12 gap-x-10">
                    {/* 8 service groups, 4 × 2 */}
                    <div className="col-span-9 grid grid-cols-4 gap-x-8 gap-y-10">
                      {SERVICES_MENU.map((group) => (
                        <MegaGroup key={group.title.en} group={group} />
                      ))}
                    </div>
                    {/* single featured tile */}
                    <div className="col-span-3 border-s ps-8" style={{ borderColor: HAIR }}>
                      <MegaFeatured
                        img={MENU_FEATURED.services[0].img}
                        title={MENU_FEATURED.services[0].title}
                        cta={MENU_FEATURED.services[0].cta}
                      />
                    </div>
                  </div>
                  <div className="mt-10 border-t pt-6" style={{ borderColor: HAIR }}>
                    <ViewMore label={t('Request a Consultation', 'اطلب استشارة')} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ============================================================ */}
        {/* 2. HERO SLIDER                                                */}
        {/* ============================================================ */}
        <section className="relative h-[88vh] min-h-[560px] overflow-hidden bg-[#171512]">
          <AnimatePresence initial={false}>
            <motion.div
              key={slide}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            >
              <motion.img
                src={HERO_SLIDES[slide].img}
                alt={isAr ? HERO_SLIDES[slide].ar : HERO_SLIDES[slide].en}
                className="h-full w-full object-cover"
                initial={{ scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6.5, ease: 'linear' }}
              />
              {/* subtle bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" />

              <div className="absolute inset-0 flex items-end">
                <div className="mx-auto w-full max-w-[1400px] px-6 pb-28 md:px-10 md:pb-32">
                  <motion.div
                    className="max-w-2xl text-white"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.7, ease: 'easeOut' }}
                  >
                    <p
                      className={`mb-5 text-[11px] uppercase text-white/85 ${
                        isAr ? 'tracking-normal' : 'tracking-[0.4em]'
                      }`}
                    >
                      {isAr ? HERO_SLIDES[slide].tagAr : HERO_SLIDES[slide].tag}
                    </p>
                    <h1
                      className={`mb-9 text-4xl font-extrabold uppercase md:text-6xl ${
                        isAr
                          ? "font-['Alexandria',sans-serif] leading-[1.2] tracking-normal"
                          : "font-['Outfit',sans-serif] leading-[1.04] tracking-tight"
                      }`}
                    >
                      {isAr ? HERO_SLIDES[slide].ar : HERO_SLIDES[slide].en}
                    </h1>
                    <button
                      type="button"
                      className={`bg-[#171512] px-12 py-4 text-[11px] font-medium uppercase text-white transition-colors duration-300 hover:bg-[#5A6B4D] ${
                        isAr ? 'tracking-normal' : 'tracking-[0.32em]'
                      }`}
                    >
                      {t('Shop Now', 'تسوق الآن')}
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* static chrome: indicators + chevrons */}
          <div className="absolute inset-x-0 bottom-9 z-10">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10">
              <div className="flex items-center gap-6">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={isAr ? `الانتقال إلى الشريحة ${i + 1}` : `Go to slide ${i + 1}`}
                    onClick={() => setSlide(i)}
                    className={`flex items-center gap-2.5 text-sm font-light transition-colors ${
                      i === slide ? 'text-white' : 'text-white/45 hover:text-white/75'
                    }`}
                  >
                    {i + 1}
                    <span
                      className={`block h-px bg-white transition-all duration-500 ${i === slide ? 'w-9' : 'w-0'}`}
                    />
                  </button>
                ))}
              </div>
              <div className="hidden items-center gap-3 md:flex">
                <button
                  type="button"
                  aria-label={t('Previous slide', 'الشريحة السابقة')}
                  onClick={prev}
                  className="flex h-11 w-11 items-center justify-center border border-white/40 text-white transition-colors duration-300 hover:bg-white hover:text-[#171512]"
                >
                  <ChevronLeft size={18} strokeWidth={1.25} className={isAr ? 'rotate-180' : undefined} />
                </button>
                <button
                  type="button"
                  aria-label={t('Next slide', 'الشريحة التالية')}
                  onClick={next}
                  className="flex h-11 w-11 items-center justify-center border border-white/40 text-white transition-colors duration-300 hover:bg-white hover:text-[#171512]"
                >
                  <ChevronRight size={18} strokeWidth={1.25} className={isAr ? 'rotate-180' : undefined} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. FEATURED CATEGORIES                                        */}
        {/* ============================================================ */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <SectionHeading
                eyebrow={t('Collection — 01', 'التشكيلة — 01')}
                title={t('Featured Categories', 'أبرز التصنيفات')}
              />
            </Reveal>
          </div>

          <div className="mx-auto mt-10 max-w-[1400px] px-6 md:mt-14 md:px-10">
            <div className="scrollbar-hide -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 md:-mx-10 md:gap-6 md:px-10">
              {CATEGORIES.map((c, i) => (
                <motion.div
                  key={c.en}
                  className="group relative aspect-[3/4] w-[72vw] shrink-0 cursor-pointer snap-start overflow-hidden sm:w-[320px] md:w-[356px]"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                >
                  <img
                    src={c.img}
                    alt={isAr ? c.ar : c.en}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                    <p
                      className={`text-lg font-light uppercase leading-tight md:text-xl ${
                        isAr ? 'tracking-normal' : 'tracking-[0.2em]'
                      }`}
                    >
                      {t(c.en, c.ar)}
                    </p>
                    <div className="mt-5">
                      <ViewMore light />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. SHOP BY ROOM — landscape tiles with an overlapping plaque  */}
        {/* ============================================================ */}
        <section data-testid="shop-by-room" className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionHeading eyebrow={t('Rooms — 02', 'الغرف — 02')} title={t('Shop by Room', 'تسوق حسب الغرفة')} />
                <div className="pb-2">
                  <ViewMore label={t('All Rooms', 'كل الغرف')} />
                </div>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-x-5 gap-y-9 sm:grid-cols-2 md:mt-16 md:gap-x-6 lg:grid-cols-3">
              {ROOMS.map((r, i) => (
                <motion.a
                  key={r.en}
                  href="#"
                  className="group block"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: (i % 3) * 0.05 }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={r.img}
                      alt={isAr ? r.ar : r.en}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                  </div>
                  {/* white plaque sitting over the bottom edge of the photo */}
                  <div
                    className="relative z-10 -mt-9 flex items-baseline justify-between gap-3 border bg-white px-5 py-4 transition-colors duration-300 group-hover:border-[#5A6B4D] ms-5 me-5"
                    style={{ borderColor: HAIR }}
                  >
                    <span
                      className={`min-w-0 truncate font-bold uppercase ${
                        isAr ? 'text-[14px] tracking-normal' : 'text-[12.5px] tracking-[0.18em]'
                      }`}
                    >
                      {t(r.en, r.ar)}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] uppercase text-neutral-400 ${
                        isAr ? 'tracking-normal' : 'tracking-[0.2em]'
                      }`}
                    >
                      {isAr ? `${formatSAR(r.count)} قطعة` : `${formatSAR(r.count)} Pieces`}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. SERVICES                                                   */}
        {/* ============================================================ */}
        <section className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <SectionHeading eyebrow={t('Services — 03', 'الخدمات — 03')} title={t('Our Services', 'خدماتنا')} />
            </Reveal>

            {/* hairline matrix: the cells give the small items structure so they
                don't float in the whitespace under the oversized section title */}
            <div
              className="mt-14 grid grid-cols-2 border-t border-s md:mt-20 lg:grid-cols-4"
              style={{ borderColor: HAIR }}
            >
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.en}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                  className="border-b border-e"
                  style={{ borderColor: HAIR }}
                >
                  <div className="flex h-full flex-col items-center px-5 py-12 text-center md:px-8 md:py-14">
                    <s.icon size={44} strokeWidth={1} className="text-[#5A6B4D]" />
                    <h3
                      className={`mt-7 font-bold uppercase ${
                        isAr
                          ? 'text-[15px] leading-relaxed tracking-normal'
                          : 'text-[13.5px] leading-relaxed tracking-[0.18em]'
                      }`}
                    >
                      {t(s.en, s.ar)}
                    </h3>
                    <div className="mt-5">
                      <ViewMore />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. NEW PRODUCTS                                               */}
        {/* ============================================================ */}
        <section className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionHeading eyebrow={t('New In — 04', 'جديدنا — 04')} title={t('New Products', 'وصل حديثاً')} />
                <div className="pb-2">
                  <ViewMore label={t('View All', 'عرض الكل')} />
                </div>
              </div>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-14 md:mt-16 md:gap-x-6 lg:grid-cols-4">
              {PRODUCTS.slice(0, 8).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: (i % 4) * 0.05 }}
                >
                  <ProductCard p={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. AI STUDIO — the page's one modern, dark, image-led moment   */}
        {/* ============================================================ */}
        <section data-testid="ai-studio" style={{ backgroundColor: INK, color: CREAM }}>
          <div className="grid lg:grid-cols-2">
            {/* visual */}
            <Reveal className="relative overflow-hidden">
              <img
                src={AI_STUDIO.img}
                alt={t(AI_STUDIO.title.en, AI_STUDIO.title.ar)}
                className="aspect-[4/3] h-full w-full object-cover lg:aspect-auto lg:min-h-[680px]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171512] via-[#171512]/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#171512]" />
              {/* floating "before → after" chip, purely decorative */}
              <div className="absolute bottom-6 start-6 flex items-center gap-3 border border-white/25 bg-black/35 px-4 py-2.5 backdrop-blur-sm">
                <span className="block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: OLIVE_LT }} />
                <span
                  className={`text-[10px] uppercase text-white ${isAr ? 'tracking-normal' : 'tracking-[0.26em]'}`}
                >
                  {t('AI Preview', 'معاينة ذكية')}
                </span>
              </div>
            </Reveal>

            {/* copy */}
            <div className="flex items-center">
              <Reveal className="w-full px-6 py-16 md:px-14 lg:px-20 lg:py-24" delay={0.1}>
                <SectionHeading
                  light
                  eyebrow={t(`${AI_STUDIO.eyebrow.en} — 05`, `${AI_STUDIO.eyebrow.ar} — 05`)}
                  title={t(AI_STUDIO.title.en, AI_STUDIO.title.ar)}
                />
                <p className="mt-7 max-w-md text-[15px] font-light leading-relaxed text-[#F6F3EC]/65">
                  {t(AI_STUDIO.body.en, AI_STUDIO.body.ar)}
                </p>

                {/* three numbered steps */}
                <ol className="mt-10 max-w-md">
                  {AI_STUDIO.steps.map((s, i) => (
                    <li
                      key={s.en}
                      className="flex items-center gap-5 border-t border-white/12 py-4 last:border-b"
                    >
                      <span
                        className="shrink-0 font-['Outfit',sans-serif] text-[13px] font-bold"
                        style={{ color: OLIVE_LT }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[14px] font-light text-[#F6F3EC]/85">{t(s.en, s.ar)}</span>
                    </li>
                  ))}
                </ol>

                <button
                  type="button"
                  className={`mt-10 bg-[#F6F3EC] px-10 py-4 text-[11px] font-medium uppercase text-[#171512] transition-colors duration-300 hover:bg-[#5A6B4D] hover:text-white ${
                    isAr ? 'tracking-normal' : 'tracking-[0.28em]'
                  }`}
                >
                  {t(AI_STUDIO.cta.en, AI_STUDIO.cta.ar)}
                </button>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 8. CUSTOM FURNITURE MANUFACTURING                             */}
        {/* ============================================================ */}
        <section className="border-t" style={{ borderColor: HAIR }}>
          <div className="grid lg:grid-cols-2">
            {/* image sits on the opposite side to the AI Studio section above it,
                so two consecutive split sections don't stack the same way.
                Mobile keeps image-first; only the desktop columns swap. */}
            <Reveal className="overflow-hidden lg:order-2">
              <img
                src={IMG.workshop}
                alt={t('Diyar furniture workshop', 'ورشة ديار للأثاث')}
                className="aspect-[4/3] h-full w-full object-cover lg:aspect-auto lg:min-h-[620px]"
              />
            </Reveal>
            <div className="flex items-center bg-white lg:order-1">
              <Reveal className="px-6 py-16 md:px-16 lg:px-20 lg:py-24 xl:px-24" delay={0.1}>
                <p
                  className={`text-[11px] uppercase ${
                    isAr ? "font-['Tajawal',sans-serif] tracking-normal" : 'tracking-[0.32em]'
                  }`}
                  style={{ color: OLIVE }}
                >
                  {t('Craftsmanship — 06', 'الحرفية — 06')}
                </p>
                <h2
                  className={`mt-4 text-4xl font-extrabold uppercase md:text-5xl ${
                    isAr
                      ? "font-['Alexandria',sans-serif] leading-[1.15] tracking-normal"
                      : "font-['Outfit',sans-serif] leading-[0.98] tracking-tight"
                  }`}
                >
                  {t('Custom Furniture Manufacturing', 'تنفيذ الأثاث حسب الطلب')}
                </h2>
                <p className="mt-7 max-w-md text-[15px] font-light leading-relaxed text-neutral-600">
                  {t(
                    'We bring your vision to life through custom furniture crafted to perfectly fit your space, style, and lifestyle.',
                    'نحوّل رؤيتك إلى واقع من خلال أثاث يُصنع خصيصاً ليلائم مساحتك وذوقك وأسلوب حياتك.',
                  )}
                </p>
                <div className="mt-9">
                  <ViewMore />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 9. SHOP THE LOOK — interactive room with product hotspots     */}
        {/* ============================================================ */}
        <section data-testid="shop-the-look" className="border-t" style={{ borderColor: HAIR }}>
          {/* heading */}
          <div className="mx-auto max-w-[1400px] px-6 py-20 pb-10 md:px-10 md:py-28 md:pb-14">
            <Reveal>
              <SectionHeading eyebrow={t('The Room — 07', 'الغرفة — 07')} title={t('Shop the Look', 'تسوق الغرفة')} />
              <p
                className={`mt-6 max-w-xl text-sm font-light leading-relaxed text-neutral-600 md:text-[15px] ${
                  isAr ? 'tracking-normal' : 'tracking-[0.02em]'
                }`}
              >
                {t(
                  'Hover any point to explore the products in this space.',
                  'مرّر المؤشر على أي نقطة لاستكشاف منتجات هذه المساحة.',
                )}
              </p>
            </Reveal>
          </div>

          {/* the shoppable image — hero of the section */}
          <div className="relative min-h-[75vh] w-full overflow-hidden">
            <img
              src={IMG.roomHotspots}
              alt={t('Styled interior with shoppable products', 'مساحة داخلية منسقة بمنتجات قابلة للتسوق')}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* very light scrim so the white dots read on bright areas */}
            <div className="pointer-events-none absolute inset-0 bg-black/10" />
            {/* keeps the container at min-h even though the image is absolute */}
            <div className="relative min-h-[75vh] w-full" />

            {ROOM_HOTSPOTS.map((h, i) => (
              <ShopHotspot
                key={h.id}
                h={h}
                delay={i * 0.55}
                open={openSpot === h.id}
                onOpen={() => openSpotNow(h.id)}
                onScheduleClose={scheduleSpotClose}
                onToggle={() => toggleSpot(h.id)}
              />
            ))}
          </div>

          {/* design assistance panel — kept, now sitting under the shoppable image */}
          <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-6">
                <p
                  className={`text-[11px] uppercase ${
                    isAr ? "font-['Tajawal',sans-serif] tracking-normal" : 'tracking-[0.32em]'
                  }`}
                  style={{ color: OLIVE }}
                >
                  {t('Design Studio', 'استوديو التصميم')}
                </p>
                <a
                  href="#"
                  className={`group/da mt-4 inline-flex flex-wrap items-center gap-4 text-3xl font-extrabold uppercase md:text-4xl ${
                    isAr
                      ? "font-['Alexandria',sans-serif] leading-[1.2] tracking-normal"
                      : "font-['Outfit',sans-serif] leading-[1.02] tracking-tight"
                  }`}
                >
                  {t('Get Free Design Assistance', 'احصل على مساعدة التصميم مجاناً')}
                  <ArrowRight
                    size={30}
                    strokeWidth={1.5}
                    className={`transition-transform duration-300 ${
                      isAr ? 'rotate-180 group-hover/da:-translate-x-2' : 'group-hover/da:translate-x-2'
                    }`}
                  />
                </a>
                <p
                  className={`mt-6 max-w-md text-sm font-light leading-relaxed text-neutral-600 md:text-[15px] ${
                    isAr ? 'tracking-normal' : 'tracking-[0.04em]'
                  }`}
                >
                  {t(
                    'Our designers help you plan, style and furnish every room — at no cost.',
                    'مصممونا يساعدونك في تخطيط كل غرفة وتنسيقها وتأثيثها — دون أي تكلفة.',
                  )}
                </p>
                <div className="mt-8">
                  <ViewMore label={t('Book a Free Session', 'احجز جلسة مجانية')} />
                </div>
              </Reveal>

              {/* what's included */}
              <Reveal className="lg:col-span-6" delay={0.15}>
                <div className="border bg-white p-8 md:p-10" style={{ borderColor: HAIR }}>
                  <p
                    className={`text-[10px] uppercase text-neutral-400 ${
                      isAr ? 'tracking-normal' : 'tracking-[0.3em]'
                    }`}
                  >
                    {t("What's included", 'ما الذي تشمله الخدمة')}
                  </p>
                  <ul className="mt-4 sm:grid sm:grid-cols-2 sm:gap-x-8">
                    {DESIGN_ASSIST_ITEMS.map((item) => (
                      <li key={item.en} className="border-b py-3.5" style={{ borderColor: HAIR }}>
                        <span className="text-[13px] font-medium">{t(item.en, item.ar)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 10. BEST SELLERS — compact ranked rail of the product card    */}
        {/* ============================================================ */}
        <section data-testid="best-sellers" className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionHeading
                  eyebrow={t('Most Loved — 08', 'الأكثر تفضيلاً — 08')}
                  title={t('Best Sellers', 'الأكثر مبيعاً')}
                />
                <div className="pb-2">
                  <ViewMore label={t('View All', 'عرض الكل')} />
                </div>
              </div>
            </Reveal>
          </div>

          {/* rail: scrolls on small screens, settles into a row from lg */}
          <div className="mx-auto mt-12 max-w-[1400px] px-6 md:mt-16 md:px-10">
            <div className="scrollbar-hide -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 md:-mx-10 md:gap-6 md:px-10 lg:mx-0 lg:overflow-visible lg:px-0">
              {PRODUCTS.slice(0, 4).map((p, i) => (
                <motion.div
                  key={p.id}
                  className="w-[68vw] shrink-0 snap-start sm:w-[300px] lg:w-auto lg:flex-1 lg:shrink"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                >
                  <ProductCard p={p} rank={i + 1} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 11. FIND YOUR STYLE                                           */}
        {/* ============================================================ */}
        <section className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <SectionHeading eyebrow={t('Styles — 09', 'الأساليب — 09')} title={t('Find Your Style', 'اكتشف أسلوبك')} />
            </Reveal>

            {/* uneven editorial grid — middle tiles taller */}
            <div className="mt-12 grid grid-cols-2 items-start gap-x-5 gap-y-12 md:mt-16 md:grid-cols-5 md:gap-x-6">
              {STYLES.map((s, i) => {
                const tall = i === 2 || i === 3;
                return (
                  <motion.div
                    key={s.en}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                    className={i === STYLES.length - 1 ? 'col-span-2 md:col-span-1' : ''}
                  >
                    <a href="#" className={`group block ${tall ? '' : 'md:mt-14'}`}>
                      <div
                        className={`overflow-hidden ${
                          i === STYLES.length - 1 ? 'aspect-[16/9] md:aspect-[3/4]' : tall ? 'aspect-[3/5]' : 'aspect-[3/4]'
                        }`}
                      >
                        <img
                          src={s.img}
                          alt={isAr ? s.ar : s.en}
                          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                        />
                      </div>
                      <h3
                        className={`mt-4 text-2xl ${
                          isAr
                            ? "font-['Alexandria',sans-serif] font-bold leading-snug"
                            : "font-['Marcellus',serif] leading-none"
                        }`}
                      >
                        {t(s.en, s.ar)}
                      </h3>
                      <p
                        className={`mt-1.5 text-[10px] uppercase text-neutral-400 ${
                          isAr ? 'tracking-normal' : 'tracking-[0.26em]'
                        }`}
                      >
                        {isAr ? `${formatSAR(s.count)} منتج` : `${formatSAR(s.count)} Products`}
                      </p>
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 12. WHY DIYAR — type-led trust row on hairline rules          */}
        {/* ============================================================ */}
        <section data-testid="why-diyar" className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <SectionHeading eyebrow={t('Our Promise — 10', 'وعدنا — 10')} title={t('Why Diyar', 'لماذا ديار')} />
            </Reveal>

            <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
              {WHY_DIYAR.map((u, i) => (
                <motion.div
                  key={u.title.en}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                  className="border-t border-[#171512]/15 pt-8"
                >
                  <u.icon size={30} strokeWidth={1} className="text-[#5A6B4D]" />
                  <h3
                    className={`mt-6 font-bold uppercase ${
                      isAr ? 'text-[14px] leading-relaxed tracking-normal' : 'text-[12.5px] tracking-[0.18em]'
                    }`}
                  >
                    {t(u.title.en, u.title.ar)}
                  </h3>
                  <p className="mt-3 text-[13.5px] font-light leading-relaxed text-neutral-600">
                    {t(u.body.en, u.body.ar)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 13. FEATURED STORES — the marketplace supply side              */}
        {/* ============================================================ */}
        <section data-testid="featured-stores" className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionHeading
                  eyebrow={t('Marketplace — 11', 'المنصة — 11')}
                  title={t('Featured Stores', 'متاجر مختارة')}
                />
                <div className="pb-2">
                  <ViewMore label={t('All Stores', 'كل المتاجر')} />
                </div>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 md:gap-6 lg:grid-cols-4">
              {STORES.map((s, i) => (
                <motion.div
                  key={s.name.en}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                >
                  <div
                    className="group flex h-full flex-col border bg-white transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(23,21,18,0.10)]"
                    style={{ borderColor: HAIR }}
                  >
                    <div className="aspect-[3/2] overflow-hidden">
                      <img
                        src={s.cover}
                        alt={isAr ? s.name.ar : s.name.en}
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      />
                    </div>

                    <div className="relative flex flex-1 flex-col px-6 pb-6">
                      {/* monogram badge overlapping the cover */}
                      <span
                        dir="ltr"
                        className="absolute -top-7 start-6 flex h-14 w-14 items-center justify-center bg-[#171512] font-['Outfit',sans-serif] text-[15px] font-bold tracking-[0.06em] text-white"
                        aria-hidden="true"
                      >
                        {s.initials}
                      </span>

                      <h3
                        className={`mt-10 font-bold uppercase ${
                          isAr ? 'text-[15px] tracking-normal' : 'text-[13px] tracking-[0.18em]'
                        }`}
                      >
                        {t(s.name.en, s.name.ar)}
                      </h3>
                      <p className="mt-2 text-[13px] font-light leading-relaxed text-neutral-600">
                        {t(s.specialty.en, s.specialty.ar)}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <Stars rating={s.rating} />
                        <span className="text-[12px] font-medium text-neutral-500">{s.rating}</span>
                        <span
                          className={`text-[10px] uppercase text-neutral-400 ${
                            isAr ? 'tracking-normal' : 'tracking-[0.2em]'
                          }`}
                        >
                          {isAr ? `${formatSAR(s.products)} منتج` : `${formatSAR(s.products)} Products`}
                        </span>
                      </div>

                      <div className="mt-6 pt-1">
                        <ViewMore label={t('Visit Store', 'زيارة المتجر')} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 14. LOYALTY — calm tinted band, no photography                */}
        {/* ============================================================ */}
        <section
          data-testid="loyalty"
          className="border-t py-20 md:py-28"
          style={{ borderColor: HAIR, backgroundColor: TILE }}
        >
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-5">
                <SectionHeading
                  eyebrow={t(`${LOYALTY.eyebrow.en} — 12`, `${LOYALTY.eyebrow.ar} — 12`)}
                  title={t(LOYALTY.title.en, LOYALTY.title.ar)}
                />
                <p className="mt-7 max-w-md text-[15px] font-light leading-relaxed text-neutral-600">
                  {t(LOYALTY.body.en, LOYALTY.body.ar)}
                </p>
                <button
                  type="button"
                  className={`mt-9 bg-[#171512] px-10 py-4 text-[11px] font-medium uppercase text-white transition-colors duration-300 hover:bg-[#5A6B4D] ${
                    isAr ? 'tracking-normal' : 'tracking-[0.28em]'
                  }`}
                >
                  {t(LOYALTY.cta.en, LOYALTY.cta.ar)}
                </button>
              </Reveal>

              <div className="lg:col-span-7 lg:pt-3">
                {LOYALTY.perks.map((p, i) => (
                  <motion.div
                    key={p.title.en}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                    className="flex items-start gap-5 border-t py-7 last:border-b sm:gap-7"
                    style={{ borderColor: '#DED8CB' }}
                  >
                    <p.icon size={26} strokeWidth={1} className="mt-0.5 shrink-0 text-[#5A6B4D]" />
                    <div className="min-w-0">
                      <h3
                        className={`font-bold uppercase ${
                          isAr ? 'text-[14px] tracking-normal' : 'text-[12.5px] tracking-[0.18em]'
                        }`}
                      >
                        {t(p.title.en, p.title.ar)}
                      </h3>
                      <p className="mt-2 text-[13.5px] font-light leading-relaxed text-neutral-600">
                        {t(p.body.en, p.body.ar)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 15. REVIEWS — dark typographic band, no avatars               */}
        {/* ============================================================ */}
        <section
          data-testid="reviews"
          className="py-20 md:py-28"
          style={{ backgroundColor: NIGHT, color: CREAM }}
        >
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <SectionHeading
                light
                eyebrow={t('Customers — 13', 'عملاؤنا — 13')}
                title={t('What They Say', 'ماذا يقولون')}
              />
            </Reveal>

            <div className="mt-12 grid gap-x-6 gap-y-8 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
              {REVIEWS.map((r, i) => (
                <motion.div
                  key={r.name.en}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                  className="flex h-full flex-col border border-white/12 p-7"
                >
                  <Stars light rating={r.rating} />
                  <p className="mt-6 flex-1 text-[14px] font-light leading-relaxed text-[#F6F3EC]/75">
                    {t(r.text.en, r.text.ar)}
                  </p>
                  <div className="mt-7 border-t border-white/12 pt-5">
                    <p
                      className={`font-bold uppercase ${
                        isAr ? 'text-[13px] tracking-normal' : 'text-[11.5px] tracking-[0.18em]'
                      }`}
                    >
                      {t(r.name.en, r.name.ar)}
                    </p>
                    <p
                      className={`mt-1.5 text-[10px] uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.24em]'}`}
                      style={{ color: OLIVE_LT }}
                    >
                      {t(r.city.en, r.city.ar)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 16. DESIGN BLOG — editorial cards                             */}
        {/* ============================================================ */}
        <section data-testid="design-blog" className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionHeading
                  eyebrow={t('Journal — 14', 'المدونة — 14')}
                  title={t('The Design Blog', 'مدونة التصميم')}
                />
                <div className="pb-2">
                  <ViewMore label={t('All Articles', 'كل المقالات')} />
                </div>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-x-6 gap-y-12 md:mt-16 md:grid-cols-3">
              {BLOG_POSTS.map((post, i) => (
                <motion.article
                  key={post.title.en}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                  className="group flex h-full flex-col"
                >
                  <a href="#" className="block overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={post.img}
                        alt={isAr ? post.title.ar : post.title.en}
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      />
                    </div>
                  </a>
                  <p
                    className={`mt-6 text-[10px] uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`}
                    style={{ color: OLIVE }}
                  >
                    {t(post.category.en, post.category.ar)}
                  </p>
                  <h3
                    className={`mt-3 text-2xl ${
                      isAr
                        ? "font-['Alexandria',sans-serif] font-bold leading-snug"
                        : "font-['Marcellus',serif] leading-tight"
                    }`}
                  >
                    <a href="#" className="decoration-[#5A6B4D] underline-offset-[6px] hover:underline">
                      {t(post.title.en, post.title.ar)}
                    </a>
                  </h3>
                  <p className="mt-4 flex-1 text-[13.5px] font-light leading-relaxed text-neutral-600">
                    {t(post.excerpt.en, post.excerpt.ar)}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <ViewMore label={t('Read Article', 'اقرأ المقال')} />
                    <span
                      className={`text-[10px] uppercase text-neutral-400 ${
                        isAr ? 'tracking-normal' : 'tracking-[0.22em]'
                      }`}
                    >
                      {isAr ? `${post.readMins} دقائق قراءة` : `${post.readMins} min read`}
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 17. B2B TEASER                                                */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden">
          <img
            src={IMG.loungeDark}
            alt={t('Commercial lounge project', 'مشروع صالة تجارية')}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative mx-auto flex min-h-[62vh] max-w-[1400px] flex-col items-center justify-center px-6 py-28 text-center text-white md:px-10">
            <Reveal>
              <h2
                className={`text-4xl uppercase md:text-5xl ${
                  isAr
                    ? "font-['Alexandria',sans-serif] font-extrabold leading-[1.2] tracking-normal"
                    : "font-['Marcellus',serif] tracking-[0.06em]"
                }`}
              >
                {t('Turnkey Project Solutions', 'حلول متكاملة للشركات والمشاريع')}
              </h2>
              <p
                className={`mx-auto mt-6 max-w-xl text-sm font-light text-white/80 md:text-base ${
                  isAr ? 'tracking-normal' : 'tracking-[0.06em]'
                }`}
              >
                {t(
                  'Design, build & deliver — we manage every stage of your project.',
                  'نصمّم وننفّذ ونسلّم — ندير كل مرحلة من مراحل مشروعك.',
                )}
              </p>
              <div className="mt-10">
                <a
                  href="#"
                  className={`group/b2b inline-flex items-center gap-2.5 border-b border-white/60 pb-1.5 text-[11px] uppercase text-white transition-colors hover:border-white ${
                    isAr ? 'tracking-normal' : 'tracking-[0.3em]'
                  }`}
                >
                  {t('Request a Consultation', 'اطلب استشارة')}
                  <ArrowRight
                    size={12}
                    strokeWidth={1.5}
                    className={`transition-transform duration-300 ${
                      isAr ? 'rotate-180 group-hover/b2b:-translate-x-1' : 'group-hover/b2b:translate-x-1'
                    }`}
                  />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 18. BECOME A PARTNER — three roles + a dark dashboard strip    */}
        {/* ============================================================ */}
        <section data-testid="partner" className="py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-7">
                  <SectionHeading
                    eyebrow={t(`${PARTNER.eyebrow.en} — 15`, `${PARTNER.eyebrow.ar} — 15`)}
                    title={t(PARTNER.title.en, PARTNER.title.ar)}
                  />
                </div>
                <p className="max-w-md self-end text-[15px] font-light leading-relaxed text-neutral-600 lg:col-span-5">
                  {t(PARTNER.body.en, PARTNER.body.ar)}
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-5 md:mt-16 md:gap-6 lg:grid-cols-3">
              {PARTNER.roles.map((role, i) => (
                <motion.div
                  key={role.title.en}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                >
                  <div
                    className="flex h-full flex-col border bg-white p-8 transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(23,21,18,0.10)] md:p-10"
                    style={{ borderColor: HAIR }}
                  >
                    <role.icon size={32} strokeWidth={1} className="text-[#5A6B4D]" />
                    <h3
                      className={`mt-7 font-bold uppercase ${
                        isAr ? 'text-[15px] tracking-normal' : 'text-[13px] tracking-[0.18em]'
                      }`}
                    >
                      {t(role.title.en, role.title.ar)}
                    </h3>
                    <p className="mt-3 flex-1 text-[13.5px] font-light leading-relaxed text-neutral-600">
                      {t(role.body.en, role.body.ar)}
                    </p>
                    <div className="mt-7">
                      <ViewMore label={t(role.cta.en, role.cta.ar)} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* dashboard strip — one dark note to close the pitch */}
            <Reveal delay={0.1}>
              <div
                className="mt-6 flex flex-col gap-7 p-8 md:flex-row md:items-center md:justify-between md:gap-10 md:p-12"
                style={{ backgroundColor: INK, color: CREAM }}
              >
                <div className="max-w-xl">
                  <h3
                    className={`font-extrabold uppercase ${
                      isAr
                        ? "font-['Alexandria',sans-serif] text-2xl leading-snug tracking-normal"
                        : "font-['Outfit',sans-serif] text-2xl leading-tight tracking-tight md:text-3xl"
                    }`}
                  >
                    {t(PARTNER.dashboard.title.en, PARTNER.dashboard.title.ar)}
                  </h3>
                  <p className="mt-3 text-[14px] font-light leading-relaxed text-[#F6F3EC]/65">
                    {t(PARTNER.dashboard.body.en, PARTNER.dashboard.body.ar)}
                  </p>
                </div>
                <button
                  type="button"
                  className={`shrink-0 self-start bg-[#F6F3EC] px-10 py-4 text-[11px] font-medium uppercase text-[#171512] transition-colors duration-300 hover:bg-[#5A6B4D] hover:text-white md:self-auto ${
                    isAr ? 'tracking-normal' : 'tracking-[0.28em]'
                  }`}
                >
                  {t(PARTNER.dashboard.cta.en, PARTNER.dashboard.cta.ar)}
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 19. APP PROMO                                                 */}
        {/* ============================================================ */}
        <section data-testid="app-promo" className="border-t bg-white py-20 md:py-28" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-5">
                <div className="overflow-hidden" style={{ backgroundColor: TILE }}>
                  <img
                    src={APP_PROMO.img}
                    alt={t(APP_PROMO.title.en, APP_PROMO.title.ar)}
                    className="aspect-[4/5] h-full w-full object-cover"
                  />
                </div>
              </Reveal>

              <Reveal className="lg:col-span-7" delay={0.1}>
                <SectionHeading
                  eyebrow={t(`${APP_PROMO.eyebrow.en} — 16`, `${APP_PROMO.eyebrow.ar} — 16`)}
                  title={t(APP_PROMO.title.en, APP_PROMO.title.ar)}
                />
                <p className="mt-7 max-w-lg text-[15px] font-light leading-relaxed text-neutral-600">
                  {t(APP_PROMO.body.en, APP_PROMO.body.ar)}
                </p>

                <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                  {APP_PROMO.features.map((f, i) => (
                    <motion.div
                      key={f.title.en}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                      className="flex items-start gap-4"
                    >
                      <f.icon size={24} strokeWidth={1} className="mt-0.5 shrink-0 text-[#5A6B4D]" />
                      <div className="min-w-0">
                        <h3
                          className={`font-bold uppercase ${
                            isAr ? 'text-[13.5px] tracking-normal' : 'text-[12px] tracking-[0.18em]'
                          }`}
                        >
                          {t(f.title.en, f.title.ar)}
                        </h3>
                        <p className="mt-2 text-[13px] font-light leading-relaxed text-neutral-600">
                          {t(f.body.en, f.body.ar)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-11 flex flex-wrap gap-4">
                  {[
                    { label: 'App Store', sub: t('Download on the', 'حمّله من') },
                    { label: 'Google Play', sub: t('Get it on', 'احصل عليه من') },
                  ].map((store) => (
                    <button
                      key={store.label}
                      type="button"
                      className="bg-[#171512] px-9 py-3.5 text-start text-white transition-colors duration-300 hover:bg-[#5A6B4D]"
                    >
                      <span
                        className={`block text-[9px] uppercase text-white/60 ${
                          isAr ? 'tracking-normal' : 'tracking-[0.22em]'
                        }`}
                      >
                        {store.sub}
                      </span>
                      <span
                        dir="ltr"
                        className={`mt-1 block font-['Outfit',sans-serif] text-[13px] font-semibold uppercase ${
                          isAr ? 'tracking-normal' : 'tracking-[0.14em]'
                        }`}
                      >
                        {store.label}
                      </span>
                    </button>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 20. FOOTER                                                    */}
        {/* ============================================================ */}
        <footer style={{ backgroundColor: '#14120F', color: '#EFE9DD' }}>
          <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
              {/* brand */}
              <div className="lg:col-span-4">
                <img src="/logo_diyar.svg" alt="Diyar" className="h-8 w-auto invert" />
                <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-[#EFE9DD]/60">
                  {t(FOOTER_LINKS.about, FOOTER_LINKS.aboutAr)}
                </p>
                <div className="mt-7 flex items-center gap-5">
                  <a href="#" aria-label="Instagram" className="text-[#EFE9DD]/55 transition-colors hover:text-[#EFE9DD]">
                    <Instagram size={18} strokeWidth={1.5} />
                  </a>
                  <a href="#" aria-label="Facebook" className="text-[#EFE9DD]/55 transition-colors hover:text-[#EFE9DD]">
                    <Facebook size={18} strokeWidth={1.5} />
                  </a>
                  <a href="#" aria-label="LinkedIn" className="text-[#EFE9DD]/55 transition-colors hover:text-[#EFE9DD]">
                    <Linkedin size={18} strokeWidth={1.5} />
                  </a>
                </div>
              </div>

              {/* quick links */}
              <div className="lg:col-span-2">
                <h4 className={`text-[11px] font-semibold uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`}>
                  {t('Quick Links', 'روابط سريعة')}
                </h4>
                <ul className="mt-6 space-y-3.5">
                  {FOOTER_QUICK.map((l) => (
                    <li key={l.en}>
                      <a href="#" className="text-sm font-light text-[#EFE9DD]/60 transition-colors hover:text-[#EFE9DD]">
                        {t(l.en, l.ar)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* support */}
              <div className="lg:col-span-3">
                <h4 className={`text-[11px] font-semibold uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`}>
                  {t('Customer Support', 'خدمة العملاء')}
                </h4>
                <ul className="mt-6 space-y-3.5">
                  {FOOTER_SUPPORT.map((l) => (
                    <li key={l.en}>
                      <a href="#" className="text-sm font-light text-[#EFE9DD]/60 transition-colors hover:text-[#EFE9DD]">
                        {t(l.en, l.ar)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* contact + subscribe */}
              <div className="lg:col-span-3">
                <h4 className={`text-[11px] font-semibold uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`}>
                  {t('Contact', 'تواصل معنا')}
                </h4>
                <ul className="mt-6 space-y-3.5 text-sm font-light text-[#EFE9DD]/60">
                  <li dir="ltr" className={isAr ? 'text-right' : undefined}>
                    {FOOTER_LINKS.phone}
                  </li>
                  <li>{FOOTER_LINKS.email}</li>
                </ul>

                <h4
                  className={`mt-10 text-[11px] font-semibold uppercase ${
                    isAr ? 'tracking-normal' : 'tracking-[0.28em]'
                  }`}
                >
                  {t('Subscribe', 'النشرة البريدية')}
                </h4>
                <div className="mt-5 flex items-end gap-4">
                  <input
                    type="email"
                    placeholder={t('YOUR EMAIL', 'بريدك الإلكتروني')}
                    className={`w-full border-b border-[#EFE9DD]/25 bg-transparent pb-2.5 text-[11px] uppercase text-[#EFE9DD] placeholder:text-[#EFE9DD]/35 transition-colors focus:border-[#EFE9DD] focus:outline-none ${
                      isAr ? 'tracking-normal' : 'tracking-[0.2em]'
                    }`}
                  />
                  <button
                    type="button"
                    className={`shrink-0 border border-[#EFE9DD]/40 px-6 py-2.5 text-[10px] uppercase transition-colors duration-300 hover:bg-[#EFE9DD] hover:text-[#14120F] ${
                      isAr ? 'tracking-normal' : 'tracking-[0.26em]'
                    }`}
                  >
                    {t('Submit', 'اشترك')}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-16 border-t border-[#EFE9DD]/10 pt-8 text-center">
              <p className={`text-xs font-light text-[#EFE9DD]/40 ${isAr ? 'tracking-normal' : 'tracking-[0.18em]'}`}>
                {t('© 2026 Diyar. All Rights Reserved.', '© 2026 ديار. جميع الحقوق محفوظة.')}
              </p>
            </div>
          </div>
        </footer>

        <LookSwitcher />
      </div>
    </LangContext.Provider>
  );
}
