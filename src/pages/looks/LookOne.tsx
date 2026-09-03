/**
 * Look 1 — "Editorial Light"
 * Warm minimal luxury e-commerce direction (Zara Home / RH aesthetic).
 * Near-white warm canvas, huge bold uppercase section titles with Amiri
 * Arabic lead-ins, editorial photography, hairline dividers, restrained motion.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Camera, User, Heart, ShoppingBag, Star, ArrowRight,
  Instagram, Facebook, Linkedin, ChevronLeft, ChevronRight,
} from 'lucide-react';
import {
  IMG, HERO_SLIDES, NAV_LINKS, CATEGORIES, SERVICES, PRODUCTS, STYLES,
  DESIGN_ASSIST_ITEMS, FOOTER_LINKS, formatSAR, LookSwitcher,
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

/** Amiri Arabic lead-in over a huge bold uppercase Outfit title. */
function SectionHeading({ arLead, title }: { arLead: string; title: string }) {
  return (
    <div>
      <p className="font-['Amiri',serif] text-xl md:text-2xl mb-3" style={{ color: OLIVE }}>
        {arLead}
      </p>
      <h2
        className="font-['Outfit',sans-serif] font-extrabold uppercase leading-[0.95] tracking-tight text-4xl md:text-5xl lg:text-6xl"
        style={{ color: INK }}
      >
        {title}
      </h2>
    </div>
  );
}

/** Tiny letterspaced uppercase "VIEW MORE →" link with hairline underline. */
function ViewMore({ label = 'View More', light = false }: { label?: string; light?: boolean }) {
  return (
    <a
      href="#"
      className={`group/vm inline-flex items-center gap-2.5 pb-1.5 border-b text-[11px] uppercase tracking-[0.28em] transition-colors ${
        light
          ? 'text-white border-white/50 hover:border-white'
          : 'text-[#171512] border-[#171512]/25 hover:border-[#171512]'
      }`}
    >
      {label}
      <ArrowRight size={12} strokeWidth={1.5} className="transition-transform duration-300 group-hover/vm:translate-x-1" />
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

/** Decorative pulsing hotspot dot with a tiny label. */
function Hotspot({ top, left, label, delay = 0 }: { top: string; left: string; label: string; delay?: number }) {
  return (
    <div className="absolute z-10" style={{ top, left }}>
      <div className="relative h-3.5 w-3.5">
        <motion.span
          className="absolute inset-0 rounded-full bg-white/60"
          animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay }}
        />
        <span className="absolute inset-0 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
        <span className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.28em] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
          {label}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function LookOne() {
  const [slide, setSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);

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

  /* header chrome: white over the hero, ink on the solid bar */
  const navItemCls = `relative whitespace-nowrap py-2 text-[11.5px] uppercase tracking-[0.2em] transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full ${
    scrolled ? 'text-[#171512] after:bg-[#171512]' : 'text-white after:bg-white'
  }`;
  const iconBtnCls = `transition-colors duration-300 ${
    scrolled ? 'text-[#171512] hover:text-[#5A6B4D]' : 'text-white hover:text-white/70'
  }`;

  return (
    <div
      dir="ltr"
      className="min-h-screen overflow-x-clip font-['Outfit',sans-serif] antialiased selection:bg-[#5A6B4D] selection:text-white"
      style={{ backgroundColor: BG, color: INK }}
    >
      {/* ============================================================ */}
      {/* 1. HEADER — transparent over hero, solid after scroll         */}
      {/* ============================================================ */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled
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
              className={`h-8 w-auto transition-all duration-300 ${scrolled ? '' : 'invert'}`}
            />
          </a>

          {/* search */}
          <div
            className={`hidden h-9 w-44 items-center gap-2.5 rounded-full border px-4 transition-colors duration-300 md:flex xl:w-56 ${
              scrolled ? 'border-[#E8E4DC] bg-white' : 'border-white/40 bg-transparent'
            }`}
          >
            <Search
              size={15}
              strokeWidth={1.5}
              className={`shrink-0 transition-colors duration-300 ${scrolled ? 'text-neutral-400' : 'text-white'}`}
            />
            <input
              type="text"
              placeholder="SEARCH"
              className={`w-full min-w-0 bg-transparent text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 focus:outline-none ${
                scrolled ? 'text-[#171512] placeholder:text-neutral-400' : 'text-white placeholder:text-white/70'
              }`}
            />
            <button
              type="button"
              aria-label="Search by photo"
              className={`shrink-0 transition-colors duration-300 ${
                scrolled ? 'text-neutral-400 hover:text-[#171512]' : 'text-white hover:text-white/70'
              }`}
            >
              <Camera size={15} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1" />

          {/* nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) =>
              link === 'Shop' ? (
                /* Shop — hover mega-menu (panel keeps its own solid chrome) */
                <div key={link} className="group relative">
                  <a href="#" className={navItemCls}>
                    {link}
                  </a>
                  <div className="invisible absolute right-0 top-full z-50 pt-5 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div
                      className="grid w-[620px] grid-cols-3 gap-x-8 gap-y-6 border bg-white p-8 shadow-[0_18px_50px_rgba(23,21,18,0.1)]"
                      style={{ borderColor: HAIR }}
                    >
                      {CATEGORIES.map((c) => (
                        <a key={c.en} href="#" className="group/cat block">
                          <span className="block text-[11px] uppercase tracking-[0.18em] text-[#171512] transition-colors group-hover/cat:text-[#5A6B4D]">
                            {c.en}
                          </span>
                          <span className="mt-1 block font-['Amiri',serif] text-sm text-neutral-500">{c.ar}</span>
                        </a>
                      ))}
                      <div className="col-span-3 border-t pt-5" style={{ borderColor: HAIR }}>
                        <ViewMore label="View All Categories" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <a key={link} href="#" className={navItemCls}>
                  {link}
                </a>
              ),
            )}
          </nav>

          {/* language toggle (visual only) */}
          <button
            type="button"
            className={`hidden shrink-0 items-center gap-2 text-[11px] tracking-[0.18em] transition-colors duration-300 sm:flex ${
              scrolled ? 'text-[#171512]' : 'text-white'
            }`}
          >
            <span className="font-medium">ENG</span>
            <span className={`h-3 w-px transition-colors duration-300 ${scrolled ? 'bg-[#E8E4DC]' : 'bg-white/40'}`} />
            <span
              className={`font-['Amiri',serif] text-[15px] leading-none transition-colors ${
                scrolled ? 'text-neutral-500 hover:text-[#171512]' : 'text-white/70 hover:text-white'
              }`}
            >
              عربي
            </span>
          </button>

          {/* icons */}
          <div className="flex shrink-0 items-center gap-4 md:gap-5">
            <button type="button" aria-label="Account" className={iconBtnCls}>
              <User size={20} strokeWidth={1.25} />
            </button>
            <button type="button" aria-label="Wishlist" className={iconBtnCls}>
              <Heart size={20} strokeWidth={1.25} />
            </button>
            <button type="button" aria-label="Cart" className={`relative ${iconBtnCls}`}>
              <ShoppingBag size={20} strokeWidth={1.25} />
              <span
                className="absolute -right-1.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-semibold text-white"
                style={{ backgroundColor: OLIVE }}
              >
                2
              </span>
            </button>
          </div>
        </div>
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
              alt={HERO_SLIDES[slide].en}
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
                  <p className="mb-5 text-[11px] uppercase tracking-[0.4em] text-white/85">{HERO_SLIDES[slide].tag}</p>
                  <h1 className="mb-3 font-['Amiri',serif] text-5xl leading-[1.25] md:text-7xl">{HERO_SLIDES[slide].ar}</h1>
                  <p className="mb-9 text-lg font-light uppercase tracking-[0.22em] text-white/90 md:text-2xl">
                    {HERO_SLIDES[slide].en}
                  </p>
                  <button
                    type="button"
                    className="bg-[#171512] px-12 py-4 text-[11px] font-medium uppercase tracking-[0.32em] text-white transition-colors duration-300 hover:bg-[#5A6B4D]"
                  >
                    Shop Now
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
                  aria-label={`Go to slide ${i + 1}`}
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
                aria-label="Previous slide"
                onClick={prev}
                className="flex h-11 w-11 items-center justify-center border border-white/40 text-white transition-colors duration-300 hover:bg-white hover:text-[#171512]"
              >
                <ChevronLeft size={18} strokeWidth={1.25} />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={next}
                className="flex h-11 w-11 items-center justify-center border border-white/40 text-white transition-colors duration-300 hover:bg-white hover:text-[#171512]"
              >
                <ChevronRight size={18} strokeWidth={1.25} />
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
            <SectionHeading arLead="الأقسام المميزة" title="Featured Categories" />
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
                  alt={c.en}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <p className="font-['Amiri',serif] text-2xl leading-tight">{c.ar}</p>
                  <p className="mt-1.5 text-[12px] uppercase tracking-[0.24em] text-white/90">{c.en}</p>
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
            <SectionHeading arLead="خدماتنا" title="Our Services" />
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
                  <h3 className="mt-6 text-[12px] font-bold uppercase tracking-[0.2em] leading-relaxed">{s.en}</h3>
                  <p className="mt-1.5 font-['Amiri',serif] text-base text-neutral-500">{s.ar}</p>
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
              <SectionHeading arLead="وصل حديثاً" title="New Products" />
              <div className="pb-2">
                <ViewMore label="View All" />
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
                      <span className="absolute left-4 top-4 z-10 text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: RED }}>
                        Sale
                      </span>
                    )}
                    <img
                      src={p.img}
                      alt={p.nameEn}
                      className="h-full w-full object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* info */}
                  <p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-neutral-400">{p.brand}</p>
                  <h3 className="mt-1.5 truncate text-sm font-medium" title={p.nameEn}>
                    {p.nameEn}
                  </h3>
                  <div className="mt-2">
                    <Stars rating={p.rating} />
                  </div>

                  {/* price row */}
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2 overflow-hidden">
                      <span className="text-[15px] font-bold">{formatSAR(p.price)}</span>
                      <span className="text-[10px] uppercase tracking-[0.1em] text-neutral-500">SAR</span>
                      {p.oldPrice && (
                        <span className="text-xs text-neutral-400 line-through">{formatSAR(p.oldPrice)}</span>
                      )}
                    </div>
                    <a
                      href="#"
                      className="shrink-0 font-['Amiri',serif] text-[15px] leading-none underline-offset-4 hover:underline"
                      style={{ color: RED }}
                    >
                      جرب AI
                    </a>
                  </div>

                  {/* add to cart */}
                  <button
                    type="button"
                    className="mt-5 w-full border border-[#171512] py-3.5 text-[10px] font-medium uppercase tracking-[0.28em] transition-colors duration-300 hover:bg-[#171512] hover:text-white"
                  >
                    Add to Cart
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
              alt="Diyar furniture workshop"
              className="aspect-[4/3] h-full w-full object-cover lg:aspect-auto lg:min-h-[620px]"
            />
          </Reveal>
          <div className="flex items-center bg-white">
            <Reveal className="px-6 py-16 md:px-16 lg:px-20 lg:py-24 xl:px-24" delay={0.1}>
              <p className="font-['Amiri',serif] text-xl md:text-2xl" style={{ color: OLIVE }}>
                تنفيذ الأثاث
              </p>
              <h2 className="mt-3 font-['Outfit',sans-serif] text-4xl font-extrabold uppercase leading-[0.98] tracking-tight md:text-5xl">
                Custom Furniture Manufacturing
              </h2>
              <p className="mt-7 max-w-md text-[15px] font-light leading-relaxed text-neutral-600">
                We bring your vision to life through custom furniture crafted to perfectly fit your space, style, and
                lifestyle.
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
        <img src={IMG.roomHotspots} alt="Styled interior" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />

        {/* decorative hotspots */}
        <Hotspot top="26%" left="30%" label="Lighting" />
        <Hotspot top="56%" left="50%" label="Dining Tables" delay={0.7} />
        <Hotspot top="42%" left="76%" label="Vases & Vessels" delay={1.4} />

        <div className="relative mx-auto flex min-h-[70vh] max-w-[1400px] flex-col justify-end gap-10 px-6 py-16 md:px-10 md:py-20 lg:flex-row lg:items-end lg:justify-between">
          {/* headline panel — bottom-left */}
          <Reveal className="max-w-xl text-white">
            <p className="font-['Amiri',serif] text-xl text-white/90 md:text-2xl">استشارة تصميم مجانية</p>
            <a
              href="#"
              className="group/da mt-3 inline-flex flex-wrap items-center gap-4 font-['Outfit',sans-serif] text-3xl font-extrabold uppercase leading-[1.02] tracking-tight md:text-5xl"
            >
              Get Free Design Assistance
              <ArrowRight size={34} strokeWidth={1.5} className="transition-transform duration-300 group-hover/da:translate-x-2" />
            </a>
            <p className="mt-5 text-sm font-light tracking-[0.04em] text-white/85 md:text-base">
              Our designers help you plan, style and furnish every room — at no cost.
            </p>
          </Reveal>

          {/* checklist card */}
          <Reveal className="w-full lg:max-w-sm" delay={0.15}>
            <div className="bg-white p-8 shadow-[0_24px_60px_rgba(0,0,0,0.18)] md:p-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">What&apos;s included</p>
              <ul className="mt-4">
                {DESIGN_ASSIST_ITEMS.map((item, i) => (
                  <li
                    key={item.en}
                    className={`flex items-center justify-between gap-4 py-3.5 ${
                      i < DESIGN_ASSIST_ITEMS.length - 1 ? 'border-b' : ''
                    }`}
                    style={{ borderColor: HAIR }}
                  >
                    <span className="text-[13px] font-medium">{item.en}</span>
                    <span className="shrink-0 font-['Amiri',serif] text-sm text-neutral-500">{item.ar}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <ViewMore label="Book a Free Session" />
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
            <SectionHeading arLead="اكتشف ذوقك" title="Find Your Style" />
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
                        alt={s.en}
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-3">
                      <h3 className="font-['Marcellus',serif] text-2xl leading-none">{s.en}</h3>
                      <span className="font-['Amiri',serif] text-sm text-neutral-500">{s.ar}</span>
                    </div>
                    <p className="mt-1.5 text-[10px] uppercase tracking-[0.26em] text-neutral-400">
                      {formatSAR(s.count)} Products
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
        <img src={IMG.loungeDark} alt="Commercial lounge project" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto flex min-h-[62vh] max-w-[1400px] flex-col items-center justify-center px-6 py-28 text-center text-white md:px-10">
          <Reveal>
            <p className="font-['Amiri',serif] text-2xl leading-relaxed text-white/90 md:text-3xl">
              حلول متكاملة للشركات والمشاريع
            </p>
            <h2 className="mt-4 font-['Marcellus',serif] text-4xl uppercase tracking-[0.06em] md:text-5xl">
              Turnkey Project Solutions
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm font-light tracking-[0.06em] text-white/80 md:text-base">
              Design, build &amp; deliver — we manage every stage of your project.
            </p>
            <div className="mt-10">
              <a
                href="#"
                className="group/b2b inline-flex items-center gap-2.5 border-b border-white/60 pb-1.5 text-[11px] uppercase tracking-[0.3em] text-white transition-colors hover:border-white"
              >
                Request a Consultation
                <ArrowRight size={12} strokeWidth={1.5} className="transition-transform duration-300 group-hover/b2b:translate-x-1" />
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
              <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-[#EFE9DD]/60">{FOOTER_LINKS.about}</p>
              <p className="mt-3 max-w-sm font-['Amiri',serif] text-[15px] leading-relaxed text-[#EFE9DD]/50" dir="rtl">
                {FOOTER_LINKS.aboutAr}
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
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.28em]">Quick Links</h4>
              <ul className="mt-6 space-y-3.5">
                {FOOTER_LINKS.quick.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm font-light text-[#EFE9DD]/60 transition-colors hover:text-[#EFE9DD]">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* support */}
            <div className="lg:col-span-3">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.28em]">Customer Support</h4>
              <ul className="mt-6 space-y-3.5">
                {FOOTER_LINKS.support.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm font-light text-[#EFE9DD]/60 transition-colors hover:text-[#EFE9DD]">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* contact + subscribe */}
            <div className="lg:col-span-3">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.28em]">Contact</h4>
              <ul className="mt-6 space-y-3.5 text-sm font-light text-[#EFE9DD]/60">
                <li dir="ltr">{FOOTER_LINKS.phone}</li>
                <li>{FOOTER_LINKS.email}</li>
              </ul>

              <h4 className="mt-10 text-[11px] font-semibold uppercase tracking-[0.28em]">Subscribe</h4>
              <div className="mt-5 flex items-end gap-4">
                <input
                  type="email"
                  placeholder="YOUR EMAIL"
                  className="w-full border-b border-[#EFE9DD]/25 bg-transparent pb-2.5 text-[11px] uppercase tracking-[0.2em] text-[#EFE9DD] placeholder:text-[#EFE9DD]/35 transition-colors focus:border-[#EFE9DD] focus:outline-none"
                />
                <button
                  type="button"
                  className="shrink-0 border border-[#EFE9DD]/40 px-6 py-2.5 text-[10px] uppercase tracking-[0.26em] transition-colors duration-300 hover:bg-[#EFE9DD] hover:text-[#14120F]"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-[#EFE9DD]/10 pt-8 text-center">
            <p className="text-xs font-light tracking-[0.18em] text-[#EFE9DD]/40">© 2026 Diyar. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <LookSwitcher />
    </div>
  );
}
