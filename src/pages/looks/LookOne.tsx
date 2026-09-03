/**
 * Look 1 — "Editorial Light"
 * Warm minimal luxury e-commerce direction (Zara Home / RH aesthetic).
 * Near-white warm canvas, huge bold uppercase section titles with tiny
 * letterspaced eyebrows, editorial photography, hairline dividers,
 * restrained motion. Bilingual: Arabic (default, RTL) + English.
 */
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Camera, User, Heart, ShoppingBag, Star, ArrowRight,
  Instagram, Facebook, Linkedin, ChevronLeft, ChevronRight,
} from 'lucide-react';
import {
  IMG, HERO_SLIDES, NAV_ITEMS, CATEGORIES, SERVICES, PRODUCTS, STYLES,
  DESIGN_ASSIST_ITEMS, FOOTER_LINKS, FOOTER_QUICK, FOOTER_SUPPORT, formatSAR, LookSwitcher,
  SHOP_MENU, SERVICES_MENU, MENU_FEATURED,
  type Lang, type MenuGroup, type Bi,
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

/** Tiny letterspaced eyebrow over a huge bold uppercase title. */
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  const isAr = useLang() === 'ar';
  return (
    <div>
      <p
        className={`mb-4 text-[11px] uppercase ${
          isAr ? "font-['Tajawal',sans-serif] tracking-normal" : 'tracking-[0.32em]'
        }`}
        style={{ color: OLIVE }}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-extrabold uppercase text-4xl md:text-5xl lg:text-6xl ${
          isAr
            ? "font-['Alexandria',sans-serif] leading-[1.15] tracking-normal"
            : "font-['Outfit',sans-serif] leading-[0.95] tracking-tight"
        }`}
        style={{ color: INK }}
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

/** Rating stars, size 12, filled per rating. */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[3px]" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          strokeWidth={1}
          className={i < Math.round(rating) ? 'fill-[#171512] text-[#171512]' : 'fill-transparent text-[#D9D3C7]'}
        />
      ))}
    </div>
  );
}

/** Decorative pulsing hotspot dot with a tiny label (pinned to image features — stays physical). */
function Hotspot({ top, left, label, delay = 0 }: { top: string; left: string; label: string; delay?: number }) {
  const isAr = useLang() === 'ar';
  return (
    <div className="absolute z-10" style={{ top, left }}>
      <div className="relative h-3.5 w-3.5">
        <motion.span
          className="absolute inset-0 rounded-full bg-white/60"
          animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay }}
        />
        <span className="absolute inset-0 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
        <span
          className={`absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] uppercase text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.6)] ${
            isAr ? 'tracking-normal' : 'tracking-[0.28em]'
          }`}
        >
          {label}
        </span>
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
        {/* 4. SERVICES                                                   */}
        {/* ============================================================ */}
        <section className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <SectionHeading eyebrow={t('Services — 02', 'الخدمات — 02')} title={t('Our Services', 'خدماتنا')} />
            </Reveal>

            <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-16 md:mt-20 lg:grid-cols-4 lg:gap-x-12">
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.en}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <s.icon size={34} strokeWidth={1.25} className="text-[#5A6B4D]" />
                    <h3
                      className={`mt-6 text-[12px] font-bold uppercase leading-relaxed ${
                        isAr ? 'tracking-normal' : 'tracking-[0.2em]'
                      }`}
                    >
                      {t(s.en, s.ar)}
                    </h3>
                    <div className="mt-6">
                      <ViewMore />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. NEW PRODUCTS                                               */}
        {/* ============================================================ */}
        <section className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionHeading eyebrow={t('New In — 03', 'جديدنا — 03')} title={t('New Products', 'وصل حديثاً')} />
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
                      <img
                        src={p.img}
                        alt={isAr ? p.nameAr : p.nameEn}
                        className="h-full w-full object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* info */}
                    <p
                      className={`mt-5 text-[10px] uppercase text-neutral-400 ${
                        isAr ? 'tracking-normal' : 'tracking-[0.28em]'
                      }`}
                    >
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
                        <span
                          className={`text-[10px] uppercase text-neutral-500 ${
                            isAr ? 'tracking-normal' : 'tracking-[0.1em]'
                          }`}
                        >
                          {t('SAR', 'ر.س')}
                        </span>
                        {p.oldPrice && (
                          <span className="text-xs text-neutral-400 line-through">{formatSAR(p.oldPrice)}</span>
                        )}
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

                    {/* add to cart */}
                    <button
                      type="button"
                      className={`mt-5 w-full border border-[#171512] py-3.5 text-[10px] font-medium uppercase transition-colors duration-300 hover:bg-[#171512] hover:text-white ${
                        isAr ? 'tracking-normal' : 'tracking-[0.28em]'
                      }`}
                    >
                      {t('Add to Cart', 'أضف إلى السلة')}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. CUSTOM FURNITURE MANUFACTURING                             */}
        {/* ============================================================ */}
        <section className="border-t" style={{ borderColor: HAIR }}>
          <div className="grid lg:grid-cols-2">
            <Reveal className="overflow-hidden">
              <img
                src={IMG.workshop}
                alt={t('Diyar furniture workshop', 'ورشة ديار للأثاث')}
                className="aspect-[4/3] h-full w-full object-cover lg:aspect-auto lg:min-h-[620px]"
              />
            </Reveal>
            <div className="flex items-center bg-white">
              <Reveal className="px-6 py-16 md:px-16 lg:px-20 lg:py-24 xl:px-24" delay={0.1}>
                <p
                  className={`text-[11px] uppercase ${
                    isAr ? "font-['Tajawal',sans-serif] tracking-normal" : 'tracking-[0.32em]'
                  }`}
                  style={{ color: OLIVE }}
                >
                  {t('Craftsmanship — 04', 'الحرفية — 04')}
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
        {/* 7. GET FREE DESIGN ASSISTANCE                                 */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden">
          <img
            src={IMG.roomHotspots}
            alt={t('Styled interior', 'مساحة داخلية منسقة')}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />

          {/* decorative hotspots */}
          <Hotspot top="26%" left="30%" label={t('Lighting', 'الإنارة')} />
          <Hotspot top="56%" left="50%" label={t('Dining Tables', 'طاولات الطعام')} delay={0.7} />
          <Hotspot top="42%" left="76%" label={t('Vases & Vessels', 'المزهريات والأواني')} delay={1.4} />

          <div className="relative mx-auto flex min-h-[70vh] max-w-[1400px] flex-col justify-end gap-10 px-6 py-16 md:px-10 md:py-20 lg:flex-row lg:items-end lg:justify-between">
            {/* headline panel — bottom-start */}
            <Reveal className="max-w-xl text-white">
              <p
                className={`text-[11px] uppercase text-white/85 ${isAr ? 'tracking-normal' : 'tracking-[0.32em]'}`}
              >
                {t('Design Studio — 05', 'استوديو التصميم — 05')}
              </p>
              <a
                href="#"
                className={`group/da mt-4 inline-flex flex-wrap items-center gap-4 text-3xl font-extrabold uppercase md:text-5xl ${
                  isAr
                    ? "font-['Alexandria',sans-serif] leading-[1.2] tracking-normal"
                    : "font-['Outfit',sans-serif] leading-[1.02] tracking-tight"
                }`}
              >
                {t('Get Free Design Assistance', 'احصل على مساعدة التصميم مجاناً')}
                <ArrowRight
                  size={34}
                  strokeWidth={1.5}
                  className={`transition-transform duration-300 ${
                    isAr ? 'rotate-180 group-hover/da:-translate-x-2' : 'group-hover/da:translate-x-2'
                  }`}
                />
              </a>
              <p
                className={`mt-5 text-sm font-light text-white/85 md:text-base ${
                  isAr ? 'tracking-normal' : 'tracking-[0.04em]'
                }`}
              >
                {t(
                  'Our designers help you plan, style and furnish every room — at no cost.',
                  'مصممونا يساعدونك في تخطيط كل غرفة وتنسيقها وتأثيثها — دون أي تكلفة.',
                )}
              </p>
            </Reveal>

            {/* checklist card */}
            <Reveal className="w-full lg:max-w-sm" delay={0.15}>
              <div className="bg-white p-8 shadow-[0_24px_60px_rgba(0,0,0,0.18)] md:p-10">
                <p
                  className={`text-[10px] uppercase text-neutral-400 ${
                    isAr ? 'tracking-normal' : 'tracking-[0.3em]'
                  }`}
                >
                  {t("What's included", 'ما الذي تشمله الخدمة')}
                </p>
                <ul className="mt-4">
                  {DESIGN_ASSIST_ITEMS.map((item, i) => (
                    <li
                      key={item.en}
                      className={`py-3.5 ${i < DESIGN_ASSIST_ITEMS.length - 1 ? 'border-b' : ''}`}
                      style={{ borderColor: HAIR }}
                    >
                      <span className="text-[13px] font-medium">{t(item.en, item.ar)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <ViewMore label={t('Book a Free Session', 'احجز جلسة مجانية')} />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 8. FIND YOUR STYLE                                            */}
        {/* ============================================================ */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <SectionHeading eyebrow={t('Styles — 06', 'الأساليب — 06')} title={t('Find Your Style', 'اكتشف أسلوبك')} />
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
        {/* 9. B2B TEASER                                                 */}
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
        {/* 10. FOOTER                                                    */}
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
