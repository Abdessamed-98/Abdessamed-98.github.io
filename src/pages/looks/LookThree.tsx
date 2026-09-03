/**
 * Look 3 — "Warm Modern"
 * Bold contemporary take on the warm minimal-luxury direction: massive Outfit
 * headlines, rounded geometry, terracotta energy and a signature marquee strip.
 * A confident modern Saudi lifestyle brand — energetic, but always premium.
 */
import { useCallback, useEffect, useState } from 'react';
import type { Key, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Variants } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Heart,
  Instagram,
  Linkedin,
  Plus,
  Search,
  ShoppingBag,
  Star,
  User,
} from 'lucide-react';
import {
  CATEGORIES,
  DESIGN_ASSIST_ITEMS,
  FOOTER_LINKS,
  HERO_SLIDES,
  IMG,
  LookSwitcher,
  NAV_LINKS,
  PRODUCTS,
  SERVICES,
  STYLES,
  formatSAR,
} from './lookShared';

/* ------------------------------- constants ------------------------------- */

const CONTAINER = 'mx-auto w-full max-w-[1400px] px-6 md:px-10';
const AR = "font-['Alexandria',sans-serif]";

const MARQUEE_ITEMS = ['FURNITURE', 'INTERIOR DESIGN', 'CUSTOM MANUFACTURING', 'B2B SOLUTIONS'];

const HOTSPOTS = [
  { label: 'Lighting', top: '40%', left: '17%' },
  { label: 'Dining Tables', top: '68%', left: '60%' },
  { label: 'Vases & Vessels', top: '54%', left: '55%' },
];

const heroVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 90 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -90, transition: { duration: 0.55, ease: [0.32, 0.72, 0, 1] } }),
};

/* -------------------------------- helpers -------------------------------- */

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GridItem({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className?: string;
  index: number;
  /** consumed by React, declared so list usage type-checks with the resolved JSX types */
  key?: Key;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.05 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  ar,
  en,
  dark = false,
  right,
}: {
  ar: string;
  en: ReactNode;
  dark?: boolean;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className={`${AR} text-lg font-bold ${dark ? 'text-[#F3EDE3]/70' : 'text-[#B4552D]'}`}>{ar}</p>
        <h2
          className={`mt-3 max-w-3xl text-4xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-6xl ${
            dark ? 'text-white' : 'text-[#221D16]'
          }`}
        >
          {en}
        </h2>
      </div>
      {right}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          strokeWidth={0}
          className={i < Math.round(rating) ? 'fill-[#B4552D]' : 'fill-[#DED4C2]'}
        />
      ))}
    </div>
  );
}

/* ----------------------------- hero slider ------------------------------- */

function HeroSlider() {
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback((d: number) => {
    setDir(d);
    setSlide((s) => (s + d + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [slide, go]);

  const current = HERO_SLIDES[slide];

  return (
    <section className={`${CONTAINER} mt-4`}>
      <div className="relative h-[82vh] max-h-[860px] min-h-[540px] overflow-hidden rounded-[2.5rem] bg-[#3E4633]">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={slide}
            custom={dir}
            variants={heroVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <img src={current.img} alt={current.en} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/5" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 pb-20 md:p-14 md:pb-24">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
                className="inline-flex w-fit items-center rounded-full bg-[#B4552D] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white"
              >
                {current.tag}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.55, ease: 'easeOut' }}
                className={`${AR} mt-5 max-w-4xl text-5xl font-extrabold leading-[1.15] text-white md:text-7xl`}
              >
                {current.ar}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.55, ease: 'easeOut' }}
                className="mt-4 text-lg font-medium text-white/90 md:text-2xl"
              >
                {current.en}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.55, ease: 'easeOut' }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <button className="rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#221D16] transition-colors hover:bg-[#B4552D] hover:text-white">
                  Shop Now
                </button>
                <button className="rounded-full border-2 border-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-[#221D16]">
                  Explore
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* pill-dot indicators */}
        <div className="absolute bottom-7 left-8 z-10 flex items-center gap-2 md:left-14">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.en}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => {
                setDir(i > slide ? 1 : -1);
                setSlide(i);
              }}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                i === slide ? 'w-9 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* big round chevrons */}
        <div className="absolute bottom-6 right-6 z-10 hidden gap-3 md:flex md:right-10">
          <button
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-[#221D16]"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => go(1)}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-[#221D16]"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- page ---------------------------------- */

export default function LookThree() {
  return (
    <div dir="ltr" className="min-h-screen overflow-x-clip bg-[#F3EDE3] font-['Outfit',sans-serif] text-[#221D16] antialiased">
      <style>{`
        @keyframes look3-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes look3-pulse {
          0% { transform: scale(1); opacity: 0.85; }
          75% { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }
      `}</style>

      {/* 1 — HEADER: floating pill */}
      <header className="sticky top-0 z-50">
        <div className={CONTAINER}>
          <div className="mt-4 flex items-center gap-3 rounded-full bg-white/80 py-2.5 pl-6 pr-2.5 shadow-[0_12px_40px_rgba(34,29,22,0.10)] backdrop-blur-xl md:gap-5">
            <a href="#" className="shrink-0">
              <img src="/logo_diyar.svg" alt="Diyar" className="h-7 w-auto md:h-8" />
            </a>
            <nav className="hidden items-center gap-6 xl:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="whitespace-nowrap text-[13px] font-semibold text-[#221D16]/80 transition-colors hover:text-[#B4552D]"
                >
                  {link}
                </a>
              ))}
            </nav>
            <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-full bg-[#F3EDE3] px-4 py-2.5 md:flex lg:max-w-xs">
              <Search size={16} className="shrink-0 text-[#221D16]/45" />
              <input
                type="text"
                placeholder="Search products…"
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[#221D16]/40"
              />
              <button aria-label="Search by image" className="shrink-0 text-[#221D16]/45 transition-colors hover:text-[#B4552D]">
                <Camera size={16} />
              </button>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-1 md:gap-1.5">
              <button className="hidden items-center gap-1.5 px-2 text-[11px] font-bold tracking-wide sm:flex">
                ENG <span className="text-[#221D16]/25">|</span>{' '}
                <span className={`${AR} text-xs`}>عربي</span>
              </button>
              <button
                aria-label="Account"
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#F3EDE3]"
              >
                <User size={18} />
              </button>
              <button
                aria-label="Wishlist"
                className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#F3EDE3] sm:flex"
              >
                <Heart size={18} />
              </button>
              <button
                aria-label="Cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#F3EDE3]"
              >
                <ShoppingBag size={18} />
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B4552D] text-[9px] font-bold text-white">
                  2
                </span>
              </button>
              <button className="hidden whitespace-nowrap rounded-full bg-[#B4552D] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#96431F] lg:block">
                Book a Designer
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2 — HERO SLIDER */}
      <HeroSlider />

      {/* 3 — MARQUEE STRIP (signature) */}
      <div className="mt-16 overflow-hidden bg-[#B4552D] py-4 md:mt-20 md:py-5" aria-hidden="true">
        <div className="flex w-max animate-[look3-marquee_30s_linear_infinite]">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center">
              {Array.from({ length: 3 }).flatMap((_, r) =>
                MARQUEE_ITEMS.map((item) => (
                  <span
                    key={`${r}-${item}`}
                    className="flex items-center whitespace-nowrap text-xl font-extrabold uppercase tracking-[0.1em] text-white md:text-2xl"
                  >
                    <span className="px-6 md:px-8">{item}</span>
                    <span className="text-base text-white/60">✦</span>
                  </span>
                )),
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4 — FEATURED CATEGORIES: bento grid */}
      <section className={`${CONTAINER} mt-20 md:mt-28`}>
        <Reveal>
          <SectionHeading
            ar="أبرز التصنيفات"
            en={
              <>
                Shop by
                <br />
                Category
              </>
            }
            right={
              <button
                aria-label="View all categories"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#221D16] text-white transition-colors hover:bg-[#B4552D]"
              >
                <ArrowUpRight size={22} />
              </button>
            }
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <GridItem key={c.en} index={i} className={i === 0 || i === 5 ? 'sm:col-span-2' : ''}>
              <a href="#" className="group relative block h-64 overflow-hidden rounded-[2rem] md:h-80">
                <img
                  src={c.img}
                  alt={c.en}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2.5 rounded-full bg-white/90 px-4 py-2 backdrop-blur-sm">
                  <span className="text-sm font-bold">{c.en}</span>
                  <span className={`${AR} text-xs text-[#221D16]/60`}>{c.ar}</span>
                </div>
                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ArrowUpRight size={16} />
                </div>
              </a>
            </GridItem>
          ))}
        </div>
      </section>

      {/* 5 — SERVICES: dark olive block */}
      <section className={`${CONTAINER} mt-20 md:mt-28`}>
        <div className="rounded-[2.5rem] bg-[#3E4633] px-6 py-14 md:px-14 md:py-20">
          <Reveal>
            <SectionHeading
              dark
              ar="كل ما تحتاجه لمساحتك"
              en={
                <>
                  Everything
                  <br />
                  for your space
                </>
              }
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <GridItem key={s.en} index={i}>
                  <div className="group h-full rounded-[1.5rem] border border-white/10 p-5 transition-colors duration-300 hover:bg-white/10 md:p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white md:h-14 md:w-14">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-white md:text-base">{s.en}</p>
                    <p className={`${AR} mt-1.5 text-xs text-white/60`}>{s.ar}</p>
                  </div>
                </GridItem>
              );
            })}
          </div>
          <Reveal className="mt-12 flex justify-center">
            <button className="rounded-full bg-[#B4552D] px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#96431F]">
              All Services
            </button>
          </Reveal>
        </div>
      </section>

      {/* 6 — NEW PRODUCTS */}
      <section className={`${CONTAINER} mt-20 md:mt-28`}>
        <Reveal>
          <SectionHeading
            ar="وصل حديثاً"
            en="New Arrivals"
            right={
              <button className="rounded-full border-2 border-[#221D16] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:bg-[#221D16] hover:text-white">
                View All
              </button>
            }
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {PRODUCTS.slice(0, 8).map((p, i) => (
            <GridItem key={p.id} index={i} className="h-full">
              <div className="group flex h-full flex-col rounded-[1.75rem] bg-white p-3 shadow-[0_20px_60px_rgba(34,29,22,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(34,29,22,0.14)]">
                <div className="relative overflow-hidden rounded-2xl bg-[#FAF7F0]">
                  <img
                    src={p.img}
                    alt={p.nameEn}
                    className="aspect-square w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.sale && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#B4552D] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                      Sale
                    </span>
                  )}
                  <button
                    aria-label="Add to wishlist"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#221D16] shadow-sm transition-colors hover:bg-[#B4552D] hover:text-white"
                  >
                    <Heart size={15} />
                  </button>
                </div>
                <div className="flex flex-1 flex-col px-2 pb-1 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#221D16]/40">{p.brand}</p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">{p.nameEn}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <Stars rating={p.rating} />
                    <button dir="rtl" className={`${AR} text-xs font-bold text-[#B4552D] hover:underline`}>
                      جرب AI
                    </button>
                  </div>
                  <div className="mb-3 mt-2 flex flex-wrap items-baseline gap-x-2">
                    <span className="text-lg font-extrabold">{formatSAR(p.price)}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#221D16]/50">SAR</span>
                    {p.oldPrice && (
                      <span className="text-xs text-[#221D16]/35 line-through">{formatSAR(p.oldPrice)}</span>
                    )}
                  </div>
                  <button className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-full bg-[#221D16] py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#B4552D]">
                    <Plus size={14} /> Add to Cart
                  </button>
                </div>
              </div>
            </GridItem>
          ))}
        </div>
      </section>

      {/* 7 — CUSTOM FURNITURE MANUFACTURING */}
      <section className={`${CONTAINER} mt-20 md:mt-28`}>
        <Reveal>
          <div className="grid overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_60px_rgba(34,29,22,0.08)] lg:grid-cols-2">
            <div className="relative min-h-[280px] lg:min-h-[540px]">
              <img src={IMG.workshop} alt="Diyar workshop" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center gap-5 p-8 md:p-12 lg:p-16">
              <p className={`${AR} text-lg font-bold text-[#B4552D]`}>تنفيذ الأثاث</p>
              <h2 className="text-4xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-5xl">
                Custom Furniture Manufacturing
              </h2>
              <p className="max-w-md text-base leading-relaxed text-[#221D16]/60">
                We bring your vision to life through custom furniture crafted to perfectly fit your space, style, and
                lifestyle.
              </p>
              <div className="mt-2">
                <button className="rounded-full bg-[#B4552D] px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#96431F]">
                  Start Your Project
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 8 — GET FREE DESIGN ASSISTANCE: hotspot room */}
      <section className={`${CONTAINER} mt-20 md:mt-28`}>
        <Reveal>
          <div className="relative min-h-[65vh] overflow-hidden rounded-[2.5rem]">
            <img
              src={IMG.roomHotspots}
              alt="Styled interior with shoppable pieces"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {HOTSPOTS.map((h) => (
              <div key={h.label} className="absolute hidden sm:block" style={{ top: h.top, left: h.left }}>
                <span className="absolute -inset-1.5 rounded-full bg-[#B4552D] animate-[look3-pulse_2.2s_ease-out_infinite]" />
                <span className="relative block h-4 w-4 rounded-full bg-[#B4552D] ring-4 ring-white/80" />
                <span className="absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold shadow-lg">
                  {h.label}
                </span>
              </div>
            ))}
            <div className="absolute inset-x-0 bottom-0 m-4 flex flex-wrap items-center gap-4 rounded-3xl bg-white/85 p-5 backdrop-blur-md md:m-6 md:gap-5 md:p-6">
              <div>
                <p className={`${AR} text-sm font-bold text-[#B4552D]`}>استشارة تصميم مجانية</p>
                <h3 className="mt-1 text-xl font-extrabold uppercase tracking-tight md:text-2xl">
                  Get Free Design Assistance
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {DESIGN_ASSIST_ITEMS.slice(0, 4).map((d) => (
                  <span
                    key={d.en}
                    className="rounded-full border border-[#221D16]/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#221D16]/80"
                  >
                    {d.en}
                  </span>
                ))}
              </div>
              <button className="rounded-full bg-[#B4552D] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#96431F] md:ml-auto">
                Talk to a Designer
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 9 — FIND YOUR STYLE: snap-scroll row */}
      <section className="mt-20 md:mt-28">
        <div className={CONTAINER}>
          <Reveal>
            <SectionHeading
              ar="اكتشف أسلوبك"
              en="Find Your Style"
              right={
                <button
                  aria-label="Browse all styles"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#221D16] text-white transition-colors hover:bg-[#B4552D]"
                >
                  <ArrowUpRight size={22} />
                </button>
              }
            />
          </Reveal>
        </div>
        <div className={`${CONTAINER} mt-10`}>
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STYLES.map((s, i) => (
              <GridItem key={s.en} index={i} className="shrink-0 snap-start">
                <a
                  href="#"
                  className="group relative block aspect-[3/4] w-72 overflow-hidden rounded-[2rem] md:w-80"
                >
                  <img
                    src={s.img}
                    alt={s.en}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className={`${AR} text-sm font-bold text-white/80`}>{s.ar}</p>
                    <p className="mt-1 text-2xl font-extrabold uppercase tracking-tight text-white">{s.en}</p>
                    <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                      {s.count} Products
                    </p>
                  </div>
                </a>
              </GridItem>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — B2B TEASER */}
      <section className={`${CONTAINER} mt-20 md:mt-28`}>
        <Reveal>
          <div className="grid overflow-hidden rounded-[2.5rem] bg-[#3E4633] lg:grid-cols-2">
            <div className="order-2 flex flex-col justify-center gap-5 p-8 md:p-12 lg:order-1 lg:p-16">
              <p className={`${AR} text-lg font-bold text-white/80`}>حلول متكاملة للشركات والمشاريع</p>
              <h2 className="text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white md:text-6xl">
                Turnkey Project Solutions
              </h2>
              <p className="max-w-md text-base leading-relaxed text-white/60">
                Design, build &amp; deliver — we manage every stage of your project.
              </p>
              <div className="mt-2">
                <button className="rounded-full bg-white px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#221D16] transition-colors hover:bg-[#B4552D] hover:text-white">
                  Request a Consultation
                </button>
              </div>
            </div>
            <div className="order-1 p-4 md:p-6 lg:order-2">
              <img
                src={IMG.restaurant}
                alt="Hospitality project by Diyar"
                className="h-64 w-full rounded-[2rem] object-cover lg:h-full lg:min-h-[500px]"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* 11 — FOOTER */}
      <footer className="mt-20 rounded-t-[2.5rem] bg-[#221D16] text-[#F3EDE3] md:mt-28">
        <div className={`${CONTAINER} pb-10 pt-16 md:pt-20`}>
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr]">
            <div>
              <img src="/logo_diyar.svg" alt="Diyar" className="h-9 w-auto invert" />
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#F3EDE3]/60">{FOOTER_LINKS.about}</p>
              <p dir="rtl" className={`${AR} mt-3 max-w-sm text-left text-xs leading-relaxed text-[#F3EDE3]/45`}>
                {FOOTER_LINKS.aboutAr}
              </p>
              <div className="mt-7 flex gap-3">
                {(
                  [
                    [Instagram, 'Instagram'],
                    [Facebook, 'Facebook'],
                    [Linkedin, 'LinkedIn'],
                  ] as const
                ).map(([Icon, label]) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#F3EDE3]/80 transition-colors hover:border-transparent hover:bg-[#B4552D] hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-[#F3EDE3]/50">Quick Links</h4>
              <ul className="mt-6 space-y-3.5 text-sm">
                {FOOTER_LINKS.quick.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[#F3EDE3]/80 transition-colors hover:text-[#E0764A]">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-[#F3EDE3]/50">Customer Support</h4>
              <ul className="mt-6 space-y-3.5 text-sm">
                {FOOTER_LINKS.support.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[#F3EDE3]/80 transition-colors hover:text-[#E0764A]">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-[#F3EDE3]/50">Contact</h4>
              <ul className="mt-6 space-y-3.5 text-sm">
                <li>
                  <a href="#" dir="ltr" className="text-[#F3EDE3]/80 transition-colors hover:text-[#E0764A]">
                    {FOOTER_LINKS.phone}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#F3EDE3]/80 transition-colors hover:text-[#E0764A]">
                    {FOOTER_LINKS.email}
                  </a>
                </li>
              </ul>
              <h4 className="mt-10 text-xs font-bold uppercase tracking-[0.25em] text-[#F3EDE3]/50">Subscribe</h4>
              <form className="relative mt-5" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-full border border-white/15 bg-white/5 py-4 pl-6 pr-14 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#B4552D]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#B4552D] text-white transition-colors hover:bg-[#96431F]"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
          <div className="mt-14 border-t border-white/10 pt-7 text-center text-xs text-white/40">
            © 2026 Diyar. All Rights Reserved.
          </div>
        </div>
      </footer>

      <LookSwitcher />
    </div>
  );
}
