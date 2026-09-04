/**
 * Look 3 — "Quiet Gallery"
 * Museum-catalog calm inside the warm minimal-luxury brief: warm greige canvas,
 * serif-led Title Case headings (Playfair), Marcellus small-caps labels, bronze
 * used only as a whisper (rules, links, captions), museum captions under images,
 * ghost numerals, hairlines, sharp corners, and very slow, quiet motion.
 *
 * Fully bilingual (Arabic-first): the header ENG | عربي switch flips the page
 * between RTL Arabic (Amiri headings, Alexandria labels, Tajawal body — no
 * letterspacing on Arabic script) and the original English look.
 */
import { useEffect, useRef, useState, type Key, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Camera, User, Heart, ShoppingBag, Star, ArrowRight,
  ChevronLeft, ChevronRight, Instagram, Facebook, Linkedin,
} from 'lucide-react';
import {
  IMG, HERO_SLIDES, NAV_ITEMS, CATEGORIES, SERVICES, PRODUCTS, STYLES,
  DESIGN_ASSIST_ITEMS, FOOTER_LINKS, FOOTER_QUICK, FOOTER_SUPPORT,
  SHOP_MENU, SERVICES_MENU, MENU_FEATURED,
  formatSAR, LookSwitcher, type Lang, type Bi, type MenuGroup,
} from './lookShared';

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */
const BG = '#F1EDE5';       // warm greige canvas
const ALT = '#FBFAF7';      // alternating section white
const INK = '#2A241C';      // warm ink
const MUTED = '#8B8378';    // warm grey
const BRONZE = '#8A6D4F';   // sparing accent
const HAIR = '#DDD6CA';     // hairlines
const DARK = '#1B1712';     // footer / B2B brown-black
const CREAM = '#EFE9DD';    // text on dark
const GOLDISH = '#C9B393';  // accent on dark

const CONTAINER = 'mx-auto w-full max-w-[1360px] px-6 md:px-10';

const PLAYFAIR = "font-['Playfair_Display',serif]";
const MARCELLUS = "font-['Marcellus',serif]";
const AMIRI = "font-['Amiri',serif]";
const ALEXANDRIA = "font-['Alexandria',sans-serif]";
const TAJAWAL = "font-['Tajawal',sans-serif]";

/** Serif display face per language — Amiri's calligraphic tone stands in for Playfair in Arabic. */
const serif = (lang: Lang) => (lang === 'ar' ? AMIRI : PLAYFAIR);
/** Arabic headings breathe more — letterforms and marks need taller lines than Playfair's tight leading. */
const headingLeading = (lang: Lang, en: string) => (lang === 'ar' ? 'leading-[1.35]' : en);

/* Positions track features in /looks/room-hotspots.jpg: floor lamp, wall tapestry, table vases. */
const HOTSPOTS = [
  { en: 'Lighting', ar: 'الإنارة', top: '33%', left: '83%' },
  { en: 'Wall Art', ar: 'اللوحات', top: '29%', left: '61%' },
  { en: 'Vases & Vessels', ar: 'المزهريات والأواني', top: '70%', left: '47%' },
];

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

/** Calm scroll reveal — fade and rise, nothing more. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  key?: Key; // allow list usage — no @types/react, so `key` is checked structurally
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Centered museum-catalog section header: thin bronze rule, Marcellus eyebrow, Playfair Title Case. */
function SectionHeader({ eyebrow, lang, children }: { eyebrow: string; lang: Lang; children: ReactNode }) {
  return (
    <Reveal className="flex flex-col items-center text-center">
      <span className="h-px w-10" style={{ backgroundColor: BRONZE }} />
      <p
        className={`mt-6 ${
          lang === 'ar' ? `${ALEXANDRIA} text-[11px] tracking-normal` : `${MARCELLUS} text-[10px] uppercase tracking-[0.4em]`
        }`}
        style={{ color: MUTED }}
      >
        {eyebrow}
      </p>
      <h2 className={`${serif(lang)} mt-5 text-4xl md:text-5xl ${headingLeading(lang, 'leading-[1.12]')}`} style={{ color: INK }}>
        {children}
      </h2>
    </Reveal>
  );
}

/** Hairline-bordered rectangle button. Sharp corners, letterspaced caps, slow fill on hover. */
function HairButton({
  label,
  tone = 'ink',
  className = '',
  lang = 'en',
}: {
  label: string;
  tone?: 'ink' | 'white' | 'cream';
  className?: string;
  lang?: Lang;
}) {
  const tones = {
    ink: 'border-[#2A241C]/40 text-[#2A241C] hover:bg-[#2A241C] hover:border-[#2A241C] hover:text-[#EFE9DD]',
    white: 'border-white/60 text-white hover:bg-white hover:border-white hover:text-[#2A241C]',
    cream: 'border-[#EFE9DD]/50 text-[#EFE9DD] hover:bg-[#EFE9DD] hover:border-[#EFE9DD] hover:text-[#1B1712]',
  } as const;
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className={`inline-block border px-10 py-4 transition-colors duration-300 ${
        lang === 'ar' ? `${ALEXANDRIA} text-[11px] tracking-normal` : 'text-[10px] uppercase tracking-[0.3em]'
      } ${tones[tone]} ${className}`}
    >
      {label}
    </a>
  );
}

/** Bronze small-caps link with a thin underline. */
function BronzeLink({ label, className = '', lang = 'en' }: { label: string; className?: string; lang?: Lang }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className={`inline-block border-b border-[#8A6D4F]/35 pb-1 text-[#8A6D4F] transition-colors duration-300 hover:border-[#8A6D4F] ${
        lang === 'ar' ? `${ALEXANDRIA} text-[11px] tracking-normal` : 'text-[10px] uppercase tracking-[0.3em]'
      } ${className}`}
    >
      {label}
    </a>
  );
}

/** Rating stars — size 11, filled in bronze. */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[3px]" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          strokeWidth={1}
          className={i < Math.round(rating) ? 'fill-[#8A6D4F] text-[#8A6D4F]' : 'fill-transparent text-[#DDD6CA]'}
        />
      ))}
    </div>
  );
}

/** Pulsing white hotspot dot with a small Marcellus chip label. Dots stay physically positioned in RTL. */
function Hotspot({
  top, left, label, lang, delay = 0,
}: { top: string; left: string; label: string; lang: Lang; delay?: number; key?: Key }) {
  return (
    <div className="absolute z-10" style={{ top, left }}>
      <div className="relative h-3 w-3">
        <motion.span
          className="absolute inset-0 rounded-full bg-white/70"
          animate={{ scale: [1, 2.8], opacity: [0.7, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay }}
        />
        <span className="absolute inset-0 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" />
        <span
          className={`absolute left-6 top-1/2 hidden -translate-y-1/2 whitespace-nowrap bg-white/95 px-3 py-1.5 md:inline-block ${
            lang === 'ar' ? `${ALEXANDRIA} text-[10px] tracking-normal` : `${MARCELLUS} text-[9px] uppercase tracking-[0.3em]`
          }`}
          style={{ color: INK }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header + mega menus                                                 */
/* ------------------------------------------------------------------ */

type MenuKey = 'shop' | 'services';

/** One mega-menu column: serif group title over a thin bronze rule, muted sub-items. */
function MegaGroup({ group, lang }: { group: MenuGroup; lang: Lang; key?: Key }) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  return (
    <div>
      <h3
        className={`${serif(lang)} ${lang === 'ar' ? 'text-[16px] tracking-normal' : 'text-[15px]'}`}
        style={{ color: INK }}
      >
        {t(group.title.en, group.title.ar)}
      </h3>
      <span className="mt-3 block h-px w-6" style={{ backgroundColor: BRONZE }} />
      <ul className="mt-4 space-y-2">
        {group.items.map((item) => (
          <li key={item.en}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className={`block text-[12.5px] leading-relaxed text-[#8B8378] transition-colors duration-300 hover:text-[#8A6D4F] ${
                lang === 'ar' ? `${TAJAWAL} tracking-normal` : ''
              }`}
            >
              {t(item.en, item.ar)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Museum-piece promo tile: image above, caption below in small serif, bronze underlined CTA. */
function MegaFeatured({ tile, lang }: { tile: { img: string; title: Bi; cta: Bi }; lang: Lang; key?: Key }) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  return (
    <a href="#" onClick={(e) => e.preventDefault()} className="group block">
      <div className="overflow-hidden" style={{ backgroundColor: BG }}>
        <img
          src={tile.img}
          alt={tile.title.en}
          className="aspect-[4/3] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
        />
      </div>
      {/* Museum caption */}
      <div className="pt-4">
        <p className={`${serif(lang)} text-[16px] leading-snug`} style={{ color: INK }}>
          {t(tile.title.en, tile.title.ar)}
        </p>
        <span
          className={`mt-2 inline-flex items-center gap-1.5 border-b border-[#8A6D4F]/35 pb-0.5 text-[#8A6D4F] transition-colors duration-300 group-hover:border-[#8A6D4F] ${
            lang === 'ar' ? `${ALEXANDRIA} text-[11px] tracking-normal` : 'text-[10px] uppercase tracking-[0.3em]'
          }`}
        >
          {t(tile.cta.en, tile.cta.ar)}
          <ArrowRight size={11} strokeWidth={1.25} className="rtl:rotate-180" />
        </span>
      </div>
    </a>
  );
}

/** Bronze small-caps link closing a mega panel, arrow flips in RTL. */
function MegaBottomLink({ label, lang }: { label: string; lang: Lang }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className={`inline-flex items-center gap-2 text-[#8A6D4F] transition-opacity duration-300 hover:opacity-75 ${
        lang === 'ar' ? `${ALEXANDRIA} text-[11px] tracking-normal` : `${MARCELLUS} text-[10px] uppercase tracking-[0.3em]`
      }`}
    >
      {label}
      <ArrowRight size={12} strokeWidth={1.25} className="rtl:rotate-180" />
    </a>
  );
}

function Header({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const closeTimer = useRef<number | null>(null);
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /** Cancel a pending close (the cursor made it back into the header or panel). */
  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  /** Close after a short grace period so the cursor can travel into the panel. */
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 150);
  };
  const openPanel = (menu: MenuKey) => {
    cancelClose();
    setOpenMenu(menu);
  };

  useEffect(() => cancelClose, []);

  const solid = scrolled || openMenu !== null;

  return (
    <header
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'border-b border-[#DDD6CA] bg-[#F1EDE5] text-[#2A241C]' : 'border-b border-transparent bg-transparent text-white'
      }`}
    >
      <div className={`${CONTAINER} flex h-[72px] items-center gap-6`}>
        {/* Logo */}
        <a href="#" onClick={(e) => e.preventDefault()} className="shrink-0">
          <img
            src="/logo_diyar.svg"
            alt="Diyar"
            className={`h-7 w-auto transition-all duration-300 ${solid ? '' : 'invert'}`}
          />
        </a>

        {/* Slim search */}
        <div
          className={`hidden h-10 w-60 items-center gap-3 rounded-full border px-4 transition-colors duration-300 lg:flex ${
            solid ? 'border-[#DDD6CA]' : 'border-white/40'
          }`}
        >
          <Search size={14} strokeWidth={1.5} className="shrink-0 opacity-80" />
          <input
            type="text"
            placeholder={t('Search', 'ابحث')}
            className={`w-full bg-transparent text-[11px] outline-none placeholder:text-inherit placeholder:opacity-50 ${
              lang === 'ar' ? 'tracking-normal' : 'tracking-[0.12em]'
            }`}
          />
          <button aria-label="Visual search" className="shrink-0 opacity-80 transition-opacity hover:opacity-100">
            <Camera size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav */}
        <nav className="ms-auto hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => {
            const menuKey: MenuKey | null =
              item.en === 'Shop' ? 'shop' : item.en === 'Services' ? 'services' : null;
            const navCls = `transition-opacity duration-300 hover:opacity-100 ${
              lang === 'ar' ? `${ALEXANDRIA} text-[12px] tracking-normal` : 'text-[11px] uppercase tracking-[0.22em]'
            }`;
            if (menuKey !== null) {
              return (
                <a
                  key={item.en}
                  href="#"
                  data-testid={`mega-${menuKey}-trigger`}
                  aria-haspopup="true"
                  aria-expanded={openMenu === menuKey}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenMenu((m) => (m === menuKey ? null : menuKey));
                  }}
                  onMouseEnter={() => openPanel(menuKey)}
                  className={`${openMenu === menuKey ? 'opacity-100' : 'opacity-90'} ${navCls}`}
                >
                  {t(item.en, item.ar)}
                </a>
              );
            }
            return (
              <a
                key={item.en}
                href="#"
                onClick={(e) => e.preventDefault()}
                onMouseEnter={scheduleClose}
                className={`opacity-90 ${navCls}`}
              >
                {t(item.en, item.ar)}
              </a>
            );
          })}
        </nav>

        {/* Right utilities */}
        <div className="ms-auto flex items-center gap-5 lg:ms-0">
          <button
            data-testid="lang-toggle"
            onClick={onToggle}
            className="flex items-center gap-1.5 text-[11px]"
            aria-label={t('Switch language to Arabic', 'التبديل إلى الإنجليزية')}
          >
            <span
              className={`tracking-[0.15em] transition-opacity duration-300 ${
                lang === 'en' ? 'border-b border-[#8A6D4F] pb-px opacity-100' : 'opacity-50 hover:opacity-80'
              }`}
            >
              ENG
            </span>
            <span className="opacity-40">|</span>
            <span
              className={`${AMIRI} text-[13px] tracking-normal transition-opacity duration-300 ${
                lang === 'ar' ? 'border-b border-[#8A6D4F] pb-px opacity-100' : 'opacity-50 hover:opacity-80'
              }`}
            >
              عربي
            </span>
          </button>
          <button aria-label="Account" className="transition-opacity hover:opacity-70">
            <User size={17} strokeWidth={1.25} />
          </button>
          <button aria-label="Wishlist" className="transition-opacity hover:opacity-70">
            <Heart size={17} strokeWidth={1.25} />
          </button>
          <button aria-label="Cart" className="transition-opacity hover:opacity-70">
            <ShoppingBag size={17} strokeWidth={1.25} />
          </button>
        </div>
      </div>

      {/* Mega menus — desktop only, a quiet fade beneath the header */}
      <AnimatePresence>
        {openMenu === 'shop' && (
          <motion.div
            key="shop"
            data-testid="mega-shop-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-x-0 top-full hidden border-b border-[#DDD6CA] bg-[#FBFAF7] text-[#2A241C] shadow-[0_24px_60px_rgba(42,36,28,0.09)] lg:block"
          >
            <div className={`${CONTAINER} pb-8 pt-10`}>
              <div className="flex items-start gap-12">
                <div className="grid flex-1 grid-cols-3 gap-x-10 gap-y-10">
                  {SHOP_MENU.map((group) => (
                    <MegaGroup key={group.title.en} group={group} lang={lang} />
                  ))}
                </div>
                {/* Featured side column — museum pieces */}
                <div className="grid w-[280px] shrink-0 grid-cols-1 gap-9 border-s ps-10" style={{ borderColor: HAIR }}>
                  {MENU_FEATURED.shop.map((tile) => (
                    <MegaFeatured key={tile.title.en} tile={tile} lang={lang} />
                  ))}
                </div>
              </div>
              <div className="mt-10 border-t pt-5" style={{ borderColor: HAIR }}>
                <MegaBottomLink lang={lang} label={t('View All Categories', 'عرض كل التصنيفات')} />
              </div>
            </div>
          </motion.div>
        )}
        {openMenu === 'services' && (
          <motion.div
            key="services"
            data-testid="mega-services-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-x-0 top-full hidden border-b border-[#DDD6CA] bg-[#FBFAF7] text-[#2A241C] shadow-[0_24px_60px_rgba(42,36,28,0.09)] lg:block"
          >
            <div className={`${CONTAINER} pb-8 pt-10`}>
              <div className="flex items-start gap-12">
                <div className="grid flex-1 grid-cols-4 gap-x-10 gap-y-10">
                  {SERVICES_MENU.map((group) => (
                    <MegaGroup key={group.title.en} group={group} lang={lang} />
                  ))}
                </div>
                {/* Single featured tile */}
                <div className="w-[280px] shrink-0 border-s ps-10" style={{ borderColor: HAIR }}>
                  <MegaFeatured tile={MENU_FEATURED.services[0]} lang={lang} />
                </div>
              </div>
              <div className="mt-10 border-t pt-5" style={{ borderColor: HAIR }}>
                <MegaBottomLink lang={lang} label={t('Request a Consultation', 'اطلب استشارة')} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero({ lang }: { lang: Lang }) {
  const [slide, setSlide] = useState(0);
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);

  useEffect(() => {
    const id = window.setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 7000);
    return () => window.clearInterval(id);
  }, []);

  const current = HERO_SLIDES[slide];
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="relative h-screen min-h-[620px] overflow-hidden" style={{ backgroundColor: DARK }}>
      {/* Slides — slow crossfade with a quiet drift-in scale */}
      <AnimatePresence>
        <motion.div
          key={slide}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <motion.img
            src={current.img}
            alt={current.en}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'linear' }}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Soft dark gradient, bottom third */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

      {/* Copy — bottom start */}
      <div className={`${CONTAINER} absolute inset-x-0 bottom-0 pb-20 md:pb-24`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <p
              className={`text-white/80 ${
                lang === 'ar' ? `${ALEXANDRIA} text-[11px] tracking-normal` : `${MARCELLUS} text-[10px] uppercase tracking-[0.3em]`
              }`}
            >
              {lang === 'ar' ? current.tagAr : current.tag}
            </p>
            <h1 className={`${serif(lang)} mt-5 text-5xl text-white md:text-6xl ${headingLeading(lang, 'leading-[1.12]')}`}>
              {lang === 'ar' ? current.ar : current.en}
            </h1>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8">
          <HairButton lang={lang} label={t('Discover', 'اكتشف')} tone="white" />
        </div>

        {/* Indicators — bottom end. Numerals stay Latin in both languages. */}
        <div className="absolute bottom-20 end-6 hidden items-center gap-5 md:end-10 md:bottom-24 md:flex">
          <span dir="ltr" className={`${PLAYFAIR} text-sm tracking-[0.2em] text-white/90`}>
            {pad(slide + 1)} <span className="text-white/40">/ {pad(HERO_SLIDES.length)}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous slide"
              onClick={() => setSlide((s) => (s + HERO_SLIDES.length - 1) % HERO_SLIDES.length)}
              className="flex h-9 w-9 items-center justify-center border border-white/40 text-white transition-colors duration-300 hover:bg-white hover:text-[#2A241C]"
            >
              <ChevronLeft size={15} strokeWidth={1.25} className="rtl:rotate-180" />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)}
              className="flex h-9 w-9 items-center justify-center border border-white/40 text-white transition-colors duration-300 hover:bg-white hover:text-[#2A241C]"
            >
              <ChevronRight size={15} strokeWidth={1.25} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function FeaturedCategories({ lang }: { lang: Lang }) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  return (
    <section className="py-28" style={{ backgroundColor: ALT }}>
      <div className={CONTAINER}>
        <SectionHeader lang={lang} eyebrow={t('Collection — 01', 'التشكيلة — 01')}>
          {lang === 'ar' ? <>أبرز <em>التصنيفات</em></> : <>Featured <em>Categories</em></>}
        </SectionHeader>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 md:mt-20 md:grid-cols-3 md:gap-x-10">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.en} delay={(i % 3) * 0.08}>
              <div className="group block cursor-pointer">
                <div className="overflow-hidden" style={{ backgroundColor: BG }}>
                  <img
                    src={c.img}
                    alt={c.en}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                </div>
                {/* Museum caption */}
                <div className="pt-5 text-center">
                  <h3 className={`${serif(lang)} text-xl`} style={{ color: INK }}>
                    {t(c.en, c.ar)}
                  </h3>
                  <div className="mt-3">
                    <BronzeLink lang={lang} label={t('View More', 'عرض المزيد')} />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services({ lang }: { lang: Lang }) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  return (
    <section className="py-28">
      <div className={CONTAINER}>
        <SectionHeader lang={lang} eyebrow={t('Practice — 02', 'الحرفة — 02')}>
          {t('Our Services', 'خدماتنا')}
        </SectionHeader>

        <div className="mt-16 grid grid-cols-2 gap-x-8 md:mt-20 md:grid-cols-4 md:gap-x-12">
          {SERVICES.map((s, i) => (
            <Reveal key={s.en} delay={(i % 4) * 0.07}>
              <div className="relative border-t pt-9 pb-14" style={{ borderColor: HAIR }}>
                <span
                  aria-hidden
                  className={`${PLAYFAIR} pointer-events-none absolute end-0 top-5 select-none text-6xl leading-none text-[#2A241C14]`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <s.icon size={26} strokeWidth={1} className="text-[#8A6D4F]" />
                <h3 className={`${serif(lang)} mt-6 text-lg leading-snug`} style={{ color: INK }}>
                  {t(s.en, s.ar)}
                </h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewProducts({ lang }: { lang: Lang }) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  return (
    <section className="py-28" style={{ backgroundColor: ALT }}>
      <div className={CONTAINER}>
        <SectionHeader lang={lang} eyebrow={t('Featured — 03', 'مختارات — 03')}>
          {lang === 'ar' ? <>وصل <em>حديثاً</em></> : <>New <em>Arrivals</em></>}
        </SectionHeader>
        <Reveal className="mt-10 flex justify-center md:justify-end">
          <BronzeLink lang={lang} label={t('View All', 'عرض الكل')} />
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4 md:gap-x-8">
          {PRODUCTS.slice(0, 8).map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.06}>
              <div className="group flex h-full flex-col">
                <div className="relative overflow-hidden border bg-white" style={{ borderColor: HAIR }}>
                  {p.sale && (
                    <span
                      className={`absolute start-3 top-3 z-10 ${
                        lang === 'ar' ? `${ALEXANDRIA} text-[10px] tracking-normal` : 'text-[9px] uppercase tracking-[0.3em]'
                      }`}
                      style={{ color: BRONZE }}
                    >
                      {t('Sale', 'تخفيض')}
                    </span>
                  )}
                  <img
                    src={p.img}
                    alt={p.nameEn}
                    className="aspect-square w-full object-contain p-6 transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col pt-4">
                  <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: MUTED }}>
                    {p.brand}
                  </p>
                  <h3 className="mt-1.5 text-[14px] font-light leading-snug" style={{ color: INK }}>
                    {t(p.nameEn, p.nameAr)}
                  </h3>
                  <div className="mt-2.5">
                    <Stars rating={p.rating} />
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2">
                    <span className={`${PLAYFAIR} text-lg`} style={{ color: INK }}>
                      {formatSAR(p.price)}
                    </span>
                    <span
                      className={lang === 'ar' ? 'text-[11px] tracking-normal' : 'text-[10px] tracking-[0.15em]'}
                      style={{ color: MUTED }}
                    >
                      {t('SAR', 'ر.س')}
                    </span>
                    {p.oldPrice && (
                      <span className="text-xs line-through" style={{ color: MUTED }}>
                        {formatSAR(p.oldPrice)}
                      </span>
                    )}
                  </div>
                  <div className="mt-2.5">
                    <BronzeLink lang={lang} label={t('Try with AI', 'جرب AI')} />
                  </div>
                  <button
                    className={`mt-4 w-full border border-[#2A241C]/30 py-3 transition-colors duration-300 hover:border-[#2A241C] hover:bg-[#2A241C] hover:text-[#EFE9DD] ${
                      lang === 'ar' ? `${ALEXANDRIA} text-[11px] tracking-normal` : 'text-[10px] uppercase tracking-[0.3em]'
                    }`}
                  >
                    {t('Add to Cart', 'أضف إلى السلة')}
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Atelier({ lang }: { lang: Lang }) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  return (
    <section className="grid lg:grid-cols-[11fr_9fr]">
      <div className="relative min-h-[420px] overflow-hidden lg:min-h-0">
        <img src={IMG.workshop} alt="Diyar atelier workshop" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex items-center px-6 py-24 md:px-16 lg:py-36" style={{ backgroundColor: BG }}>
        <Reveal>
          <span className="block h-px w-10" style={{ backgroundColor: BRONZE }} />
          <p
            className={`mt-6 ${
              lang === 'ar' ? `${ALEXANDRIA} text-[11px] tracking-normal` : `${MARCELLUS} text-[10px] uppercase tracking-[0.4em]`
            }`}
            style={{ color: MUTED }}
          >
            {t('Atelier', 'المشغل')}
          </p>
          <h2
            className={`${serif(lang)} mt-5 text-4xl md:text-[2.75rem] ${headingLeading(lang, 'leading-[1.15]')}`}
            style={{ color: INK }}
          >
            {lang === 'ar' ? <>أثاث مخصص، <em>صُنع لأجلك</em></> : <>Custom Furniture, <em>Made for You</em></>}
          </h2>
          <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed" style={{ color: MUTED }}>
            {t(
              'We bring your vision to life through custom furniture crafted to perfectly fit your space, style, and lifestyle.',
              'نحوّل رؤيتك إلى واقع من خلال أثاث مخصص يُصنع بعناية ليلائم مساحتك وذوقك وأسلوب حياتك.',
            )}
          </p>
          <div className="mt-10">
            <HairButton lang={lang} label={t('Start Your Project', 'ابدأ مشروعك')} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DesignAssistance({ lang }: { lang: Lang }) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  return (
    <section className="relative flex min-h-[75vh] items-end overflow-hidden">
      <img src={IMG.roomHotspots} alt="Styled dining room" className="absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-black/10" />

      {HOTSPOTS.map((h, i) => (
        <Hotspot key={h.en} top={h.top} left={h.left} label={t(h.en, h.ar)} lang={lang} delay={i * 0.5} />
      ))}

      <div className={`${CONTAINER} relative z-10 w-full pb-14 pt-44 md:pb-20`}>
        <Reveal className="max-w-md bg-white p-8 md:p-10">
          <span className="block h-px w-10" style={{ backgroundColor: BRONZE }} />
          <h2 className={`${serif(lang)} mt-6 text-3xl ${headingLeading(lang, 'leading-[1.15]')}`} style={{ color: INK }}>
            {lang === 'ar' ? <>مساعدة <em>تصميم</em> مجانية</> : <>Complimentary <em>Design</em> Assistance</>}
          </h2>
          <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-7" style={{ borderColor: HAIR }}>
            {DESIGN_ASSIST_ITEMS.map((item) => (
              <div key={item.en}>
                <p
                  className={`text-[11px] font-light ${lang === 'ar' ? 'tracking-normal' : 'tracking-[0.06em]'}`}
                  style={{ color: INK }}
                >
                  {t(item.en, item.ar)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <HairButton lang={lang} label={t('Book a Session', 'احجز جلسة')} className="w-full text-center" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FindYourStyle({ lang }: { lang: Lang }) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  return (
    <section className="py-28" style={{ backgroundColor: ALT }}>
      <div className={CONTAINER}>
        <SectionHeader lang={lang} eyebrow={t('Gallery — 04', 'المعرض — 04')}>
          {lang === 'ar' ? <>اكتشف <em>أسلوبك</em></> : <>Find Your <em>Style</em></>}
        </SectionHeader>

        {/* Asymmetric gallery wall — center tile taller and lifted */}
        <div className="mt-20 grid grid-cols-2 items-start gap-x-6 gap-y-14 md:mt-28 md:grid-cols-5">
          {STYLES.map((s, i) => {
            const isCenter = i === 2;
            return (
              <Reveal
                key={s.en}
                delay={i * 0.07}
                className={`${isCenter ? 'md:-mt-12' : ''} ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}
              >
                <a href="#" onClick={(e) => e.preventDefault()} className="group block">
                  <div className="overflow-hidden" style={{ backgroundColor: BG }}>
                    <img
                      src={s.img}
                      alt={s.en}
                      className={`w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 ${
                        isCenter ? 'aspect-[3/5]' : 'aspect-[3/4]'
                      }`}
                    />
                  </div>
                  {/* Museum caption */}
                  <div className="pt-4 text-center">
                    <h3 className={`${serif(lang)} text-xl`} style={{ color: INK }}>
                      {t(s.en, s.ar)}
                    </h3>
                    <p
                      className={`mt-1 ${lang === 'ar' ? `${ALEXANDRIA} text-[10px] tracking-normal` : 'text-[9px] uppercase tracking-[0.3em]'}`}
                      style={{ color: MUTED }}
                    >
                      {lang === 'ar' ? `${formatSAR(s.count)} قطعة` : `${formatSAR(s.count)} pieces`}
                    </p>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function B2B({ lang }: { lang: Lang }) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  return (
    <section className="grid md:grid-cols-2">
      <div className="relative min-h-[380px] overflow-hidden md:min-h-[560px]">
        <img src={IMG.restaurant} alt="Hospitality project by Diyar" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex items-center justify-center px-6 py-24 md:px-16 md:py-32" style={{ backgroundColor: DARK }}>
        <Reveal className="flex max-w-md flex-col items-center text-center">
          <span className="h-px w-10" style={{ backgroundColor: GOLDISH }} />
          <p
            className={`mt-6 text-[#EFE9DD]/50 ${
              lang === 'ar' ? `${ALEXANDRIA} text-[11px] tracking-normal` : `${MARCELLUS} text-[10px] uppercase tracking-[0.4em]`
            }`}
          >
            {t('B2B — 05', 'قطاع الأعمال — 05')}
          </p>
          <h2 className={`${serif(lang)} mt-5 text-4xl ${headingLeading(lang, 'leading-[1.15]')}`} style={{ color: CREAM }}>
            {lang === 'ar' ? <>حلول <em>متكاملة</em> للشركات والمشاريع</> : <>Turnkey <em>Project</em> Solutions</>}
          </h2>
          <p className="mt-5 text-[15px] font-light leading-relaxed text-[#EFE9DD]/55">
            {t(
              'From concept to handover — furniture, fit-out, and design for hotels, offices, and restaurants.',
              'من الفكرة إلى التسليم — أثاث وتجهيز وتصميم للفنادق والمكاتب والمطاعم.',
            )}
          </p>
          <div className="mt-10">
            <HairButton lang={lang} label={t('Request a Consultation', 'اطلب استشارة')} tone="cream" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer({ lang }: { lang: Lang }) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  const colTitle =
    lang === 'ar'
      ? `${ALEXANDRIA} text-[11px] tracking-normal text-[#EFE9DD]/75`
      : `${MARCELLUS} text-[10px] uppercase tracking-[0.35em] text-[#EFE9DD]/75`;
  const link = 'text-[13px] font-light text-[#EFE9DD]/55 transition-colors duration-300 hover:text-[#C9B393]';

  return (
    <footer style={{ backgroundColor: DARK, color: CREAM }}>
      <div className={`${CONTAINER} grid gap-14 py-20 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-10`}>
        {/* Brand */}
        <div>
          <img src="/logo_diyar.svg" alt="Diyar" className="h-7 w-auto invert" />
          <p className="mt-6 max-w-xs text-[13px] font-light leading-relaxed text-[#EFE9DD]/55">
            {t(FOOTER_LINKS.about, FOOTER_LINKS.aboutAr)}
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className={colTitle}>{t('Quick Links', 'روابط سريعة')}</h3>
          <ul className="mt-6 space-y-3">
            {FOOTER_QUICK.map((l) => (
              <li key={l.en}>
                <a href="#" onClick={(e) => e.preventDefault()} className={link}>
                  {t(l.en, l.ar)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className={colTitle}>{t('Customer Support', 'خدمة العملاء')}</h3>
          <ul className="mt-6 space-y-3">
            {FOOTER_SUPPORT.map((l) => (
              <li key={l.en}>
                <a href="#" onClick={(e) => e.preventDefault()} className={link}>
                  {t(l.en, l.ar)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + subscribe */}
        <div>
          <h3 className={colTitle}>{t('Contact', 'تواصل معنا')}</h3>
          <div className="mt-6 space-y-3">
            <a href="#" onClick={(e) => e.preventDefault()} className={`${link} block tracking-[0.08em]`}>
              <span dir="ltr">{FOOTER_LINKS.phone}</span>
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className={`${link} block tracking-[0.08em]`}>
              {FOOTER_LINKS.email}
            </a>
          </div>

          <h3 className={`${colTitle} mt-10`}>{t('Subscribe', 'النشرة البريدية')}</h3>
          <div className="mt-5 flex items-center gap-4 border-b border-[#EFE9DD]/25 pb-3">
            <input
              type="email"
              placeholder={t('Your email address', 'بريدك الإلكتروني')}
              className={`w-full bg-transparent text-[12px] font-light text-[#EFE9DD] outline-none placeholder:text-[#EFE9DD]/35 ${
                lang === 'ar' ? 'tracking-normal' : 'tracking-[0.08em]'
              }`}
            />
            <button
              className={`shrink-0 text-[#C9B393] transition-opacity hover:opacity-70 ${
                lang === 'ar' ? `${ALEXANDRIA} text-[11px] tracking-normal` : 'text-[10px] uppercase tracking-[0.3em]'
              }`}
            >
              {t('Submit', 'اشترك')}
            </button>
          </div>

          <div className="mt-8 flex items-center gap-3">
            {[
              { Icon: Instagram, label: 'Instagram' },
              { Icon: Facebook, label: 'Facebook' },
              { Icon: Linkedin, label: 'LinkedIn' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EFE9DD]/25 text-[#EFE9DD]/70 transition-colors duration-300 hover:border-[#EFE9DD]/70 hover:text-[#EFE9DD]"
              >
                <Icon size={15} strokeWidth={1.25} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p
          className={`py-7 text-center text-[#EFE9DD]/40 ${
            lang === 'ar' ? `${ALEXANDRIA} text-[10px] tracking-normal` : 'text-[9px] uppercase tracking-[0.35em]'
          }`}
        >
          {t('© 2026 Diyar. All Rights Reserved.', '© 2026 ديار — جميع الحقوق محفوظة.')}
        </p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LookThree() {
  const [lang, setLang] = useState<Lang>(() =>
    typeof localStorage !== 'undefined' && localStorage.getItem('diyar-look-lang') === 'en' ? 'en' : 'ar',
  );

  const toggleLang = () => {
    const next: Lang = lang === 'ar' ? 'en' : 'ar';
    if (typeof localStorage !== 'undefined') localStorage.setItem('diyar-look-lang', next);
    setLang(next);
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen overflow-x-hidden antialiased ${lang === 'ar' ? TAJAWAL : "font-['Outfit',sans-serif]"}`}
      style={{ backgroundColor: BG, color: INK }}
    >
      <Header lang={lang} onToggle={toggleLang} />
      <Hero lang={lang} />
      <FeaturedCategories lang={lang} />
      <Services lang={lang} />
      <NewProducts lang={lang} />
      <Atelier lang={lang} />
      <DesignAssistance lang={lang} />
      <FindYourStyle lang={lang} />
      <B2B lang={lang} />
      <Footer lang={lang} />
      <LookSwitcher />
    </div>
  );
}
