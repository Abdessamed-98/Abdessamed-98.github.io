/**
 * Look 3 — "Quiet Gallery"
 * Museum-catalog calm inside the warm minimal-luxury brief: warm greige canvas,
 * serif-led Title Case headings (Playfair), Marcellus small-caps labels, bronze
 * used only as a whisper (rules, links, captions), museum captions under images,
 * ghost numerals, hairlines, sharp corners, and very slow, quiet motion.
 */
import { useEffect, useState, type Key, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Camera, User, Heart, ShoppingBag, Star,
  ChevronLeft, ChevronRight, Instagram, Facebook, Linkedin,
} from 'lucide-react';
import {
  IMG, HERO_SLIDES, NAV_LINKS, CATEGORIES, SERVICES, PRODUCTS, STYLES,
  DESIGN_ASSIST_ITEMS, FOOTER_LINKS, formatSAR, LookSwitcher,
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
const GOLDISH = '#C9B393';  // Arabic lead on dark

const CONTAINER = 'mx-auto w-full max-w-[1360px] px-6 md:px-10';

const PLAYFAIR = "font-['Playfair_Display',serif]";
const MARCELLUS = "font-['Marcellus',serif]";
const AMIRI = "font-['Amiri',serif]";

const HOTSPOTS = [
  { label: 'Lighting', top: '38%', left: '15%' },
  { label: 'Dining Tables', top: '66%', left: '58%' },
  { label: 'Vases & Vessels', top: '46%', left: '42%' },
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

/** Centered museum-catalog section header: thin bronze rule, Amiri lead, Playfair Title Case. */
function SectionHeader({ eyebrow, ar, children }: { eyebrow: string; ar: string; children: ReactNode }) {
  return (
    <Reveal className="flex flex-col items-center text-center">
      <span className="h-px w-10" style={{ backgroundColor: BRONZE }} />
      <p className={`${MARCELLUS} mt-6 text-[10px] uppercase tracking-[0.4em]`} style={{ color: MUTED }}>
        {eyebrow}
      </p>
      <p className={`${AMIRI} mt-4 text-xl`} style={{ color: BRONZE }}>
        {ar}
      </p>
      <h2 className={`${PLAYFAIR} mt-2 text-4xl md:text-5xl leading-[1.12]`} style={{ color: INK }}>
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
}: {
  label: string;
  tone?: 'ink' | 'white' | 'cream';
  className?: string;
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
      className={`inline-block border px-10 py-4 text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 ${tones[tone]} ${className}`}
    >
      {label}
    </a>
  );
}

/** Bronze small-caps link with a thin underline. */
function BronzeLink({ label, className = '' }: { label: string; className?: string }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className={`inline-block border-b border-[#8A6D4F]/35 pb-1 text-[10px] uppercase tracking-[0.3em] text-[#8A6D4F] transition-colors duration-300 hover:border-[#8A6D4F] ${className}`}
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

/** Pulsing white hotspot dot with a small Marcellus chip label. */
function Hotspot({
  top, left, label, delay = 0,
}: { top: string; left: string; label: string; delay?: number; key?: Key }) {
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
          className={`${MARCELLUS} absolute left-6 top-1/2 hidden -translate-y-1/2 whitespace-nowrap bg-white/95 px-3 py-1.5 text-[9px] uppercase tracking-[0.3em] md:inline-block`}
          style={{ color: INK }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || shopOpen;

  return (
    <header
      onMouseLeave={() => setShopOpen(false)}
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
            placeholder="Search"
            className="w-full bg-transparent text-[11px] tracking-[0.12em] outline-none placeholder:text-inherit placeholder:opacity-50"
          />
          <button aria-label="Visual search" className="shrink-0 opacity-80 transition-opacity hover:opacity-100">
            <Camera size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav */}
        <nav className="ml-auto hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              onClick={(e) => e.preventDefault()}
              onMouseEnter={() => setShopOpen(link === 'Shop')}
              className="text-[11px] uppercase tracking-[0.22em] opacity-90 transition-opacity duration-300 hover:opacity-100"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Right utilities */}
        <div className="ml-auto flex items-center gap-5 lg:ml-0">
          <button className="flex items-center gap-1.5 text-[11px] tracking-[0.15em]">
            ENG <span className="opacity-40">|</span> <span className={`${AMIRI} text-[13px]`}>عربي</span>
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

      {/* Shop hover panel */}
      <AnimatePresence>
        {shopOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-x-0 top-full border-b border-[#DDD6CA] bg-white"
          >
            <div className={`${CONTAINER} grid grid-cols-2 gap-x-12 gap-y-5 py-10 md:grid-cols-3`}>
              {CATEGORIES.map((c) => (
                <a
                  key={c.en}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="group flex items-baseline justify-between border-b border-[#DDD6CA]/70 pb-3"
                >
                  <span className={`${PLAYFAIR} text-[15px] text-[#2A241C] transition-colors duration-300 group-hover:text-[#8A6D4F]`}>
                    {c.en}
                  </span>
                  <span className={`${AMIRI} text-sm`} style={{ color: MUTED }}>
                    {c.ar}
                  </span>
                </a>
              ))}
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

function Hero() {
  const [slide, setSlide] = useState(0);

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

      {/* Copy — bottom left */}
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
            <p className={`${MARCELLUS} text-[10px] uppercase tracking-[0.3em] text-white/80`}>{current.tag}</p>
            <h1 className={`${AMIRI} mt-5 text-5xl leading-[1.3] text-white md:text-6xl`}>
              {current.ar}
            </h1>
            <p className={`${PLAYFAIR} mt-3 text-xl italic text-white/90`}>{current.en}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8">
          <HairButton label="Discover" tone="white" />
        </div>

        {/* Indicators — bottom right */}
        <div className="absolute bottom-20 right-6 hidden items-center gap-5 md:right-10 md:bottom-24 md:flex">
          <span className={`${PLAYFAIR} text-sm tracking-[0.2em] text-white/90`}>
            {pad(slide + 1)} <span className="text-white/40">/ {pad(HERO_SLIDES.length)}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous slide"
              onClick={() => setSlide((s) => (s + HERO_SLIDES.length - 1) % HERO_SLIDES.length)}
              className="flex h-9 w-9 items-center justify-center border border-white/40 text-white transition-colors duration-300 hover:bg-white hover:text-[#2A241C]"
            >
              <ChevronLeft size={15} strokeWidth={1.25} />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)}
              className="flex h-9 w-9 items-center justify-center border border-white/40 text-white transition-colors duration-300 hover:bg-white hover:text-[#2A241C]"
            >
              <ChevronRight size={15} strokeWidth={1.25} />
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

function FeaturedCategories() {
  return (
    <section className="py-28" style={{ backgroundColor: ALT }}>
      <div className={CONTAINER}>
        <SectionHeader eyebrow="Collection — 01" ar="الواجهة">
          Featured <em>Categories</em>
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
                  <h3 className={`${PLAYFAIR} text-xl`} style={{ color: INK }}>
                    {c.en}
                  </h3>
                  <p className={`${AMIRI} mt-1 text-sm`} style={{ color: BRONZE }}>
                    {c.ar}
                  </p>
                  <div className="mt-3">
                    <BronzeLink label="View More" />
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

function Services() {
  return (
    <section className="py-28">
      <div className={CONTAINER}>
        <SectionHeader eyebrow="Practice — 02" ar="خدماتنا">
          Our Services
        </SectionHeader>

        <div className="mt-16 grid grid-cols-2 gap-x-8 md:mt-20 md:grid-cols-4 md:gap-x-12">
          {SERVICES.map((s, i) => (
            <Reveal key={s.en} delay={(i % 4) * 0.07}>
              <div className="relative border-t pt-9 pb-14" style={{ borderColor: HAIR }}>
                <span
                  aria-hidden
                  className={`${PLAYFAIR} pointer-events-none absolute right-0 top-5 select-none text-6xl leading-none text-[#2A241C14]`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <s.icon size={26} strokeWidth={1} className="text-[#8A6D4F]" />
                <h3 className={`${PLAYFAIR} mt-6 text-lg leading-snug`} style={{ color: INK }}>
                  {s.en}
                </h3>
                <p className={`${AMIRI} mt-1.5 text-sm`} style={{ color: MUTED }}>
                  {s.ar}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewProducts() {
  return (
    <section className="py-28" style={{ backgroundColor: ALT }}>
      <div className={CONTAINER}>
        <SectionHeader eyebrow="Featured — 03" ar="وصل حديثاً">
          New <em>Arrivals</em>
        </SectionHeader>
        <Reveal className="mt-10 flex justify-center md:justify-end">
          <BronzeLink label="View All" />
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4 md:gap-x-8">
          {PRODUCTS.slice(0, 8).map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.06}>
              <div className="group flex h-full flex-col">
                <div className="relative overflow-hidden border bg-white" style={{ borderColor: HAIR }}>
                  {p.sale && (
                    <span className="absolute left-3 top-3 z-10 text-[9px] uppercase tracking-[0.3em]" style={{ color: BRONZE }}>
                      Sale
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
                    {p.nameEn}
                  </h3>
                  <div className="mt-2.5">
                    <Stars rating={p.rating} />
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2">
                    <span className={`${PLAYFAIR} text-lg`} style={{ color: INK }}>
                      {formatSAR(p.price)}
                    </span>
                    <span className="text-[10px] tracking-[0.15em]" style={{ color: MUTED }}>
                      SAR
                    </span>
                    {p.oldPrice && (
                      <span className="text-xs line-through" style={{ color: MUTED }}>
                        {formatSAR(p.oldPrice)}
                      </span>
                    )}
                  </div>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className={`${AMIRI} mt-1.5 text-sm transition-opacity hover:opacity-70`}
                    style={{ color: BRONZE }}
                  >
                    جرب AI
                  </a>
                  <button className="mt-4 w-full border border-[#2A241C]/30 py-3 text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 hover:border-[#2A241C] hover:bg-[#2A241C] hover:text-[#EFE9DD]">
                    Add to Cart
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

function Atelier() {
  return (
    <section className="grid lg:grid-cols-[11fr_9fr]">
      <div className="relative min-h-[420px] overflow-hidden lg:min-h-0">
        <img src={IMG.workshop} alt="Diyar atelier workshop" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex items-center px-6 py-24 md:px-16 lg:py-36" style={{ backgroundColor: BG }}>
        <Reveal>
          <span className="block h-px w-10" style={{ backgroundColor: BRONZE }} />
          <p className={`${MARCELLUS} mt-6 text-[10px] uppercase tracking-[0.4em]`} style={{ color: MUTED }}>
            Atelier
            <span className="mx-3" style={{ color: BRONZE }}>—</span>
            <span className={`${AMIRI} text-sm normal-case tracking-normal`} style={{ color: BRONZE }}>
              تنفيذ الأثاث
            </span>
          </p>
          <h2 className={`${PLAYFAIR} mt-5 text-4xl leading-[1.15] md:text-[2.75rem]`} style={{ color: INK }}>
            Custom Furniture, <em>Made for You</em>
          </h2>
          <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed" style={{ color: MUTED }}>
            We bring your vision to life through custom furniture crafted to perfectly fit your space, style, and
            lifestyle.
          </p>
          <div className="mt-10">
            <HairButton label="Start Your Project" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DesignAssistance() {
  return (
    <section className="relative flex min-h-[75vh] items-end overflow-hidden">
      <img src={IMG.roomHotspots} alt="Styled dining room" className="absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-black/10" />

      {HOTSPOTS.map((h, i) => (
        <Hotspot key={h.label} {...h} delay={i * 0.5} />
      ))}

      <div className={`${CONTAINER} relative z-10 w-full pb-14 pt-44 md:pb-20`}>
        <Reveal className="max-w-md bg-white p-8 md:p-10">
          <p className={`${AMIRI} text-lg`} style={{ color: BRONZE }}>
            استشارة تصميم مجانية لمساحتك
          </p>
          <h2 className={`${PLAYFAIR} mt-2 text-3xl leading-[1.15]`} style={{ color: INK }}>
            Complimentary <em>Design</em> Assistance
          </h2>
          <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-7" style={{ borderColor: HAIR }}>
            {DESIGN_ASSIST_ITEMS.map((item) => (
              <div key={item.en}>
                <p className="text-[11px] font-light tracking-[0.06em]" style={{ color: INK }}>
                  {item.en}
                </p>
                <p className={`${AMIRI} mt-0.5 text-xs`} style={{ color: MUTED }}>
                  {item.ar}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <HairButton label="Book a Session" className="w-full text-center" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FindYourStyle() {
  return (
    <section className="py-28" style={{ backgroundColor: ALT }}>
      <div className={CONTAINER}>
        <SectionHeader eyebrow="Gallery — 04" ar="اكتشف ذوقك">
          Find Your <em>Style</em>
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
                    <h3 className={`${PLAYFAIR} text-xl`} style={{ color: INK }}>
                      {s.en}
                    </h3>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.3em]" style={{ color: MUTED }}>
                      {formatSAR(s.count)} pieces
                    </p>
                    <p className={`${AMIRI} mt-1 text-sm`} style={{ color: BRONZE }}>
                      {s.ar}
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

function B2B() {
  return (
    <section className="grid md:grid-cols-2">
      <div className="relative min-h-[380px] overflow-hidden md:min-h-[560px]">
        <img src={IMG.restaurant} alt="Hospitality project by Diyar" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex items-center justify-center px-6 py-24 md:px-16 md:py-32" style={{ backgroundColor: DARK }}>
        <Reveal className="flex max-w-md flex-col items-center text-center">
          <span className="h-px w-10" style={{ backgroundColor: GOLDISH }} />
          <p className={`${MARCELLUS} mt-6 text-[10px] uppercase tracking-[0.4em] text-[#EFE9DD]/50`}>
            B2B — 05
          </p>
          <p className={`${AMIRI} mt-5 text-xl`} style={{ color: GOLDISH }}>
            حلول متكاملة للشركات والمشاريع
          </p>
          <h2 className={`${PLAYFAIR} mt-2 text-4xl leading-[1.15]`} style={{ color: CREAM }}>
            Turnkey <em>Project</em> Solutions
          </h2>
          <p className="mt-5 text-[15px] font-light leading-relaxed text-[#EFE9DD]/55">
            From concept to handover — furniture, fit-out, and design for hotels, offices, and restaurants.
          </p>
          <div className="mt-10">
            <HairButton label="Request a Consultation" tone="cream" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  const colTitle = `${MARCELLUS} text-[10px] uppercase tracking-[0.35em] text-[#EFE9DD]/75`;
  const link = 'text-[13px] font-light text-[#EFE9DD]/55 transition-colors duration-300 hover:text-[#C9B393]';

  return (
    <footer style={{ backgroundColor: DARK, color: CREAM }}>
      <div className={`${CONTAINER} grid gap-14 py-20 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-10`}>
        {/* Brand */}
        <div>
          <img src="/logo_diyar.svg" alt="Diyar" className="h-7 w-auto invert" />
          <p className="mt-6 max-w-xs text-[13px] font-light leading-relaxed text-[#EFE9DD]/55">
            {FOOTER_LINKS.about}
          </p>
          <p dir="rtl" className={`${AMIRI} mt-4 max-w-xs text-sm leading-relaxed text-[#EFE9DD]/45`}>
            {FOOTER_LINKS.aboutAr}
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className={colTitle}>Quick Links</h3>
          <ul className="mt-6 space-y-3">
            {FOOTER_LINKS.quick.map((l) => (
              <li key={l}>
                <a href="#" onClick={(e) => e.preventDefault()} className={link}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className={colTitle}>Customer Support</h3>
          <ul className="mt-6 space-y-3">
            {FOOTER_LINKS.support.map((l) => (
              <li key={l}>
                <a href="#" onClick={(e) => e.preventDefault()} className={link}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + subscribe */}
        <div>
          <h3 className={colTitle}>Contact</h3>
          <div className="mt-6 space-y-3">
            <a href="#" onClick={(e) => e.preventDefault()} className={`${link} block tracking-[0.08em]`}>
              {FOOTER_LINKS.phone}
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className={`${link} block tracking-[0.08em]`}>
              {FOOTER_LINKS.email}
            </a>
          </div>

          <h3 className={`${colTitle} mt-10`}>Subscribe</h3>
          <div className="mt-5 flex items-center gap-4 border-b border-[#EFE9DD]/25 pb-3">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full bg-transparent text-[12px] font-light tracking-[0.08em] text-[#EFE9DD] outline-none placeholder:text-[#EFE9DD]/35"
            />
            <button className="shrink-0 text-[10px] uppercase tracking-[0.3em] text-[#C9B393] transition-opacity hover:opacity-70">
              Submit
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
        <p className="py-7 text-center text-[9px] uppercase tracking-[0.35em] text-[#EFE9DD]/40">
          © 2026 Diyar. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LookThree() {
  return (
    <div
      dir="ltr"
      className="min-h-screen overflow-x-hidden font-['Outfit',sans-serif] antialiased"
      style={{ backgroundColor: BG, color: INK }}
    >
      <Header />
      <Hero />
      <FeaturedCategories />
      <Services />
      <NewProducts />
      <Atelier />
      <DesignAssistance />
      <FindYourStyle />
      <B2B />
      <Footer />
      <LookSwitcher />
    </div>
  );
}
