/**
 * Look 2 — "Dark Luxury"
 * The showroom at night: warm espresso black, brass-gold hairlines, candle-lit
 * imagery, serif display type. A five-star-hotel reading of the client's warm
 * minimal-luxury reference direction.
 */
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Camera, User, Heart, ShoppingBag, Star, ArrowRight,
  Instagram, Facebook, Linkedin, ChevronLeft, ChevronRight,
} from 'lucide-react';
import {
  IMG, HERO_SLIDES, NAV_LINKS, CATEGORIES, SERVICES, PRODUCTS, STYLES,
  DESIGN_ASSIST_ITEMS, FOOTER_LINKS, formatSAR, LookSwitcher,
} from './lookShared';
import type { LookSlide } from './lookShared';

/* ------------------------------------------------------------------ */
/* Design tokens (class fragments — kept as literal strings so the     */
/* Tailwind scanner picks them up)                                     */
/* ------------------------------------------------------------------ */
const DISPLAY = "font-['Playfair_Display',serif]";
const CAPS = "font-['Marcellus',serif]";
const AR = "font-['Amiri',serif]";

const GOLD_BTN =
  "inline-flex items-center justify-center gap-3 border border-[#C9A86A]/70 px-9 py-4 " +
  "text-[11px] tracking-[0.3em] uppercase text-[#C9A86A] font-['Marcellus',serif] " +
  "transition-all duration-300 hover:bg-[#C9A86A] hover:text-[#131009] cursor-pointer";

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

function GoldLink({ children }: { children: ReactNode }) {
  return (
    <a
      href="#"
      onClick={stop}
      className={`${CAPS} inline-flex items-center gap-2.5 text-[11px] tracking-[0.3em] uppercase text-[#C9A86A] border-b border-[#C9A86A]/40 pb-1.5 hover:border-[#C9A86A] transition-colors duration-300`}
    >
      {children}
    </a>
  );
}

function Hotspot({ top, left, label }: { top: string; left: string; label: string }) {
  return (
    <div className="absolute z-[5] flex items-center gap-3" style={{ top, left }}>
      <span className="relative flex w-3 h-3 shrink-0">
        <span
          className="absolute inset-0 rounded-full bg-[#C9A86A]"
          style={{ animation: 'lt-pulse 2.6s ease-out infinite' }}
        />
        <span className="relative w-3 h-3 rounded-full bg-[#C9A86A] shadow-[0_0_12px_rgba(201,168,106,0.8)]" />
      </span>
      <span className={`${CAPS} hidden sm:block bg-[#131009]/75 backdrop-blur-sm border border-[#C9A86A]/30 px-3 py-1.5 text-[9px] tracking-[0.25em] uppercase text-[#EFE9DD] whitespace-nowrap`}>
        {label}
      </span>
    </div>
  );
}

function Heading({
  lead, center = false, children,
}: { lead: string; center?: boolean; children: ReactNode }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <p className={`${AR} text-[#C9A86A] text-xl md:text-2xl mb-4`}>{lead}</p>
      <h2 className={`${DISPLAY} text-4xl md:text-6xl text-[#EFE9DD] leading-[1.08]`}>{children}</h2>
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

  const fallback: LookSlide = { img: IMG.hero, ar: '', en: '', tag: '' };
  const active: LookSlide = HERO_SLIDES[slide] ?? fallback;

  const prev = () => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => setSlide((s) => (s + 1) % HERO_SLIDES.length);

  /* header chrome: white over the hero, ivory on the solid bar; gold hovers */
  const navLinkCls = `${CAPS} block whitespace-nowrap py-2 text-[11px] uppercase tracking-[0.25em] transition-colors duration-300 hover:text-[#C9A86A] ${
    scrolled ? 'text-[#EFE9DD]/75' : 'text-white'
  }`;
  const headerIconCls = `cursor-pointer transition-colors duration-300 hover:text-[#C9A86A] ${
    scrolled ? 'text-[#EFE9DD]/75' : 'text-white'
  }`;

  return (
    <div
      dir="ltr"
      className="min-h-screen bg-[#131009] text-[#EFE9DD] font-['Outfit',sans-serif] font-light antialiased overflow-x-clip selection:bg-[#C9A86A]/30"
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
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled ? 'bg-[#131009]/95 backdrop-blur-md border-white/10' : 'bg-transparent border-transparent'
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
              scrolled ? 'border-white/15' : 'border-white/40'
            }`}
          >
            <Search
              size={15}
              strokeWidth={1.25}
              className={`shrink-0 transition-colors duration-300 ${scrolled ? 'text-[#EFE9DD]/45' : 'text-white'}`}
            />
            <input
              type="text"
              placeholder="Search…"
              className={`bg-transparent flex-1 min-w-0 text-[13px] font-light outline-none transition-colors duration-300 ${
                scrolled ? 'text-[#EFE9DD] placeholder:text-[#EFE9DD]/35' : 'text-white placeholder:text-white/70'
              }`}
            />
            <button
              aria-label="Search by photo"
              className={`shrink-0 cursor-pointer transition-colors duration-300 hover:text-[#C9A86A] ${
                scrolled ? 'text-[#C9A86A]/70' : 'text-white'
              }`}
            >
              <Camera size={16} strokeWidth={1.25} />
            </button>
          </div>

          {/* Nav — single line (mega-menu panel keeps its own solid chrome) */}
          <nav className="hidden lg:block ml-auto">
            <ul className="flex items-center gap-6 xl:gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link} className={link === 'Shop' ? 'relative group' : undefined}>
                  <a href="#" onClick={stop} className={navLinkCls}>
                    {link}
                  </a>
                  {link === 'Shop' && (
                    <div className="absolute right-0 top-full z-50 pt-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
                      <div className="w-[620px] bg-[#1C1610] border border-[#C9A86A]/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)] p-8">
                        <p className={`${CAPS} text-[10px] tracking-[0.35em] text-[#C9A86A] mb-6`}>SHOP BY CATEGORY</p>
                        <div className="grid grid-cols-3 gap-x-8 gap-y-5">
                          {CATEGORIES.map((c) => (
                            <a key={c.en} href="#" onClick={stop} className="group/cat block">
                              <span className={`${CAPS} block text-[11px] uppercase tracking-[0.15em] text-[#EFE9DD]/85 group-hover/cat:text-[#C9A86A] transition-colors`}>
                                {c.en}
                              </span>
                              <span className={`${AR} block text-sm text-[#EFE9DD]/45 mt-1`}>{c.ar}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Language + account icons */}
          <div className="flex items-center gap-4 md:gap-5 shrink-0 ml-auto lg:ml-0">
            <button
              className={`${CAPS} flex items-center gap-2 text-[11px] tracking-[0.2em] transition-colors duration-300 hover:text-[#C9A86A] cursor-pointer ${
                scrolled ? 'text-[#EFE9DD]/80' : 'text-white'
              }`}
            >
              ENG <span className={scrolled ? 'text-[#C9A86A]/60' : 'text-white/60'}>|</span>
              <span className={`${AR} text-[14px] leading-none`}>عربي</span>
            </button>
            <span className={`hidden sm:block h-4 w-px transition-colors duration-300 ${scrolled ? 'bg-white/10' : 'bg-white/30'}`} />
            <button aria-label="Account" className={headerIconCls}>
              <User size={19} strokeWidth={1.25} />
            </button>
            <button aria-label="Wishlist" className={headerIconCls}>
              <Heart size={19} strokeWidth={1.25} />
            </button>
            <button aria-label="Shopping bag" className={`relative ${headerIconCls}`}>
              <ShoppingBag size={19} strokeWidth={1.25} />
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#C9A86A] text-[#131009] text-[8px] font-medium flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </div>
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

        {/* Static overlays so the crossfade never flashes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131009] via-[#131009]/25 to-[#131009]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#131009]/70 via-transparent to-transparent pointer-events-none" />

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
                <span className={`${CAPS} text-[11px] tracking-[0.4em] text-[#C9A86A]`}>{active.tag}</span>
              </div>
              <h1 className={`${AR} text-5xl md:text-7xl text-[#EFE9DD] leading-[1.2] mb-4`}>{active.ar}</h1>
              <p className={`${DISPLAY} italic text-2xl md:text-4xl text-[#C9A86A] mb-10`}>{active.en}</p>
              <button className={GOLD_BTN}>
                EXPLORE <ArrowRight size={14} strokeWidth={1.5} />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Chevrons */}
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

        {/* Roman-numeral indicators */}
        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-20 flex items-end gap-8">
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
            <Heading lead="الواجهة" center>
              Featured <em className="italic">Categories</em>
            </Heading>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.en} delay={(i % 3) * 0.06}>
                <a href="#" onClick={stop} className="group relative block aspect-[4/5] overflow-hidden bg-[#1C1610]">
                  <img
                    src={c.img}
                    alt={c.en}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131009]/95 via-[#131009]/25 to-transparent" />
                  <div className="absolute inset-3 border border-[#C9A86A]/30 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <p className={`${AR} text-lg md:text-xl text-[#C9A86A] mb-1`}>{c.ar}</p>
                    <h3 className={`${CAPS} text-xs md:text-base uppercase tracking-[0.2em] text-[#EFE9DD] mb-4`}>{c.en}</h3>
                    <span className={`${CAPS} inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#C9A86A] border-b border-[#C9A86A]/40 pb-1 opacity-80 group-hover:opacity-100 group-hover:border-[#C9A86A] transition-all duration-300`}>
                      VIEW MORE <ArrowRight size={11} strokeWidth={1.5} />
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
            <Heading lead="خدماتنا" center>
              Our <em className="italic">Services</em>
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
                    <span>
                      <span className={`${CAPS} block text-[11px] md:text-xs uppercase tracking-[0.2em] text-[#EFE9DD]`}>{s.en}</span>
                      <span className={`${AR} block text-sm text-[#EFE9DD]/45 mt-1.5`}>{s.ar}</span>
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
            <Heading lead="وصل حديثاً">
              The New <em className="italic">Collection</em>
            </Heading>
            <GoldLink>
              VIEW ALL <ArrowRight size={12} strokeWidth={1.5} />
            </GoldLink>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {PRODUCTS.slice(0, 8).map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.06} className="h-full">
                <article className="group h-full flex flex-col bg-[#1C1610] p-3 border border-white/5 hover:border-[#C9A86A]/25 transition-colors duration-500">
                  {/* White-cutout imagery sits on a warm ivory tile */}
                  <div className="relative aspect-square overflow-hidden bg-[#F4EFE6]">
                    {p.sale && (
                      <span className={`${CAPS} absolute top-3 left-3 z-10 bg-[#C9A86A] text-[#131009] text-[9px] tracking-[0.25em] px-2.5 py-1`}>
                        SALE
                      </span>
                    )}
                    <img
                      src={p.img}
                      alt={p.nameEn}
                      className="w-full h-full object-contain mix-blend-multiply p-3 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-col flex-1 pt-4 px-1 pb-1">
                    <span className="text-[9px] tracking-[0.3em] text-[#EFE9DD]/50">{p.brand}</span>
                    <h3 className="text-sm text-[#EFE9DD] font-light leading-snug mt-1.5">{p.nameEn}</h3>

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
                      <a href="#" onClick={stop} className={`${AR} text-[13px] text-[#C9A86A] hover:underline underline-offset-4`}>
                        جرب AI
                      </a>
                    </div>

                    <div className="flex items-baseline gap-2 mt-2.5">
                      <span className={`${DISPLAY} text-lg text-[#C9A86A]`}>{formatSAR(p.price)}</span>
                      <span className="text-[10px] tracking-[0.2em] text-[#C9A86A]/70">SAR</span>
                      {p.oldPrice !== undefined && (
                        <span className={`${DISPLAY} text-xs line-through text-[#EFE9DD]/40`}>{formatSAR(p.oldPrice)}</span>
                      )}
                    </div>

                    <button className={`${CAPS} mt-auto pt-3`}>
                      <span className="w-full flex items-center justify-center gap-2 border border-[#C9A86A]/50 text-[#C9A86A] text-[10px] tracking-[0.25em] py-2.5 hover:bg-[#C9A86A] hover:text-[#131009] transition-colors duration-300 cursor-pointer">
                        <ShoppingBag size={13} strokeWidth={1.25} /> ADD TO CART
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
                alt="Diyar custom furniture workshop"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <p className={`${AR} text-[#C9A86A] text-xl md:text-2xl mb-4`}>تنفيذ الأثاث</p>
            <h2 className={`${DISPLAY} text-4xl md:text-5xl lg:text-6xl text-[#EFE9DD] leading-[1.1] mb-8`}>
              Custom Furniture,
              <br />
              <em className="italic text-[#C9A86A]">Made for You</em>
            </h2>
            <p className="text-[#EFE9DD]/60 font-light leading-relaxed max-w-md mb-10">
              We bring your vision to life through custom furniture crafted to perfectly fit
              your space, style, and lifestyle.
            </p>
            <GoldLink>
              VIEW MORE <ArrowRight size={12} strokeWidth={1.5} />
            </GoldLink>
          </Reveal>
        </div>
      </section>

      {/* =================== 7. GET FREE DESIGN ASSISTANCE =================== */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <img
          src={IMG.roomHotspots}
          alt=""
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#131009]/90 via-[#131009]/40 to-[#131009]/25" />

        <Hotspot top="19%" left="58%" label="Lighting" />
        <Hotspot top="47%" left="74%" label="Dining Tables" />
        <Hotspot top="64%" left="52%" label="Vases & Vessels" />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
          <Reveal className="max-w-xl bg-[#131009]/80 backdrop-blur-md border border-[#C9A86A]/25 p-8 md:p-12">
            <p className={`${AR} text-[#C9A86A] text-xl md:text-2xl mb-3`}>استشارة مجانية</p>
            <h2 className={`${DISPLAY} text-3xl md:text-5xl text-[#EFE9DD] leading-[1.1] mb-8`}>
              Get Free <em className="italic">Design</em> Assistance
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-10">
              {DESIGN_ASSIST_ITEMS.map((item) => (
                <li key={item.en} className="border-b border-white/10 pb-3">
                  <span className="block text-sm text-[#EFE9DD] font-light">{item.en}</span>
                  <span className={`${AR} block text-[13px] text-[#EFE9DD]/45 mt-0.5`}>{item.ar}</span>
                </li>
              ))}
            </ul>
            <button className={GOLD_BTN}>
              BOOK A CONSULTATION <ArrowRight size={13} strokeWidth={1.5} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ========================= 8. FIND YOUR STYLE ========================= */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal className="mb-14 md:mb-20">
            <Heading lead="اكتشف ذوقك" center>
              Find Your <em className="italic">Style</em>
            </Heading>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[190px] md:auto-rows-[255px] gap-3 md:gap-5">
            {STYLES.map((st, i) => (
              <Reveal key={st.en} delay={i * 0.06} className={STYLE_PLACEMENT[i] ?? ''}>
                <a href="#" onClick={stop} className="group relative block w-full h-full overflow-hidden bg-[#1C1610]">
                  <img
                    src={st.img}
                    alt={st.en}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#131009]/25" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131009]/90 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                    <h3 className={`${DISPLAY} text-2xl md:text-3xl text-[#EFE9DD]`}>{st.en}</h3>
                    <p className={`${CAPS} text-[10px] tracking-[0.3em] text-[#C9A86A]/80 mt-1.5`}>
                      {formatSAR(st.count)} PRODUCTS
                    </p>
                    <p className={`${AR} text-sm text-[#EFE9DD]/55 mt-0.5`}>{st.ar}</p>
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
          <p className={`${AR} text-[#C9A86A] text-2xl md:text-3xl mb-5`}>حلول متكاملة للشركات والمشاريع</p>
          <h2 className={`${DISPLAY} text-4xl md:text-6xl text-[#EFE9DD] leading-[1.08] mb-6`}>
            Turnkey <em className="italic">Project</em> Solutions
          </h2>
          <p className="text-[#EFE9DD]/65 font-light tracking-wide mb-10">
            Design, build &amp; deliver — we manage every stage of your project.
          </p>
          <GoldLink>
            REQUEST A CONSULTATION <ArrowRight size={12} strokeWidth={1.5} />
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
              <p className="text-sm text-[#EFE9DD]/60 font-light leading-relaxed max-w-sm mb-3">
                {FOOTER_LINKS.about}
              </p>
              <p dir="rtl" className={`${AR} text-sm text-[#EFE9DD]/45 leading-relaxed max-w-sm mb-8 text-right`}>
                {FOOTER_LINKS.aboutAr}
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
              <h4 className={`${CAPS} text-[11px] tracking-[0.3em] text-[#C9A86A] mb-6`}>QUICK LINKS</h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.quick.map((l) => (
                  <li key={l}>
                    <a href="#" onClick={stop} className="text-sm font-light text-[#EFE9DD]/60 hover:text-[#C9A86A] transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className={`${CAPS} text-[11px] tracking-[0.3em] text-[#C9A86A] mb-6`}>CUSTOMER SUPPORT</h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.support.map((l) => (
                  <li key={l}>
                    <a href="#" onClick={stop} className="text-sm font-light text-[#EFE9DD]/60 hover:text-[#C9A86A] transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + subscribe */}
            <div>
              <h4 className={`${CAPS} text-[11px] tracking-[0.3em] text-[#C9A86A] mb-6`}>CONTACT</h4>
              <ul className="space-y-3 mb-10">
                <li className={`${DISPLAY} text-sm text-[#C9A86A] tracking-wide`}>{FOOTER_LINKS.phone}</li>
                <li className="text-sm font-light text-[#C9A86A]">{FOOTER_LINKS.email}</li>
              </ul>
              <h4 className={`${CAPS} text-[11px] tracking-[0.3em] text-[#C9A86A] mb-5`}>SUBSCRIBE</h4>
              <div className="flex items-center gap-3 border-b border-[#C9A86A]/40 pb-2.5 focus-within:border-[#C9A86A] transition-colors">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-transparent flex-1 min-w-0 text-sm font-light outline-none text-[#EFE9DD] placeholder:text-[#EFE9DD]/30"
                />
                <button className={`${CAPS} text-[10px] tracking-[0.3em] text-[#C9A86A] hover:text-[#EFE9DD] transition-colors cursor-pointer shrink-0`}>
                  SUBMIT
                </button>
              </div>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/10 text-center">
            <p className={`${CAPS} text-[10px] tracking-[0.3em] text-[#EFE9DD]/40`}>
              © 2026 DIYAR. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>

      <LookSwitcher />
    </div>
  );
}
