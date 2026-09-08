/**
 * Look 3 — "Quiet Gallery" shared primitives.
 * The layout (LookThree.tsx), the home sections, the search page and the
 * product page all draw from here so nothing is duplicated: palette, type,
 * the language context, and the small museum-catalog pieces (Reveal,
 * SectionHeader, HairButton, BronzeLink, Stars, ProductTile, Crumbs).
 */
import {
  createContext, useContext, useEffect, useRef, useState,
  type CSSProperties, type Key, type ReactNode,
} from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Star, Heart, ChevronRight } from 'lucide-react';
import {
  formatSAR, storeOf, productPath,
  type Lang, type LookProduct, type CatalogProduct,
} from '../lookShared';

/* ------------------------------------------------------------------ */
/* Palette + type                                                      */
/* ------------------------------------------------------------------ */
export const BG = '#F1EDE5';       // warm greige canvas
export const ALT = '#FBFAF7';      // alternating section white
export const INK = '#2A241C';      // warm ink
export const MUTED = '#8B8378';    // warm grey
export const BRONZE = '#8A6D4F';   // sparing accent
export const HAIR = '#DDD6CA';     // hairlines
export const DARK = '#1B1712';     // footer / B2B brown-black
export const CREAM = '#EFE9DD';    // text on dark
export const GOLDISH = '#C9B393';  // accent on dark

export const CONTAINER = 'mx-auto w-full max-w-[1360px] px-6 md:px-10';

export const PLAYFAIR = "font-['Playfair_Display',serif]";
export const MARCELLUS = "font-['Marcellus',serif]";
export const AMIRI = "font-['Amiri',serif]";
export const ALEXANDRIA = "font-['Alexandria',sans-serif]";
export const TAJAWAL = "font-['Tajawal',sans-serif]";

/** Serif display face per language — Amiri's calligraphic tone stands in for Playfair in Arabic. */
export const serif = (lang: Lang) => (lang === 'ar' ? AMIRI : PLAYFAIR);
/** Arabic headings breathe more — letterforms and marks need taller lines than Playfair's tight leading. */
export const headingLeading = (lang: Lang, en: string) => (lang === 'ar' ? 'leading-[1.35]' : en);

/** Marcellus eyebrow; Alexandria, never letterspaced, in Arabic. */
export const eyebrowCls = (lang: Lang) =>
  lang === 'ar' ? `${ALEXANDRIA} text-[11px] tracking-normal` : `${MARCELLUS} text-[10px] uppercase tracking-[0.3em]`;
/** Plain small-caps label — buttons, tags, chips. */
export const capsCls = (lang: Lang) =>
  lang === 'ar' ? `${ALEXANDRIA} text-[11px] tracking-normal` : 'text-[10px] uppercase tracking-[0.3em]';
/** The smaller caption variant under images and prices. */
export const captionCls = (lang: Lang) =>
  lang === 'ar' ? `${ALEXANDRIA} text-[10px] tracking-normal` : 'text-[9px] uppercase tracking-[0.3em]';

/** Two-digit catalogue numeral — the look's recurring ghost-Playfair motif. */
export const pad2 = (n: number) => String(n).padStart(2, '0');

/** The drawer's / sheets' easing — a long, quiet decelerate in the page's slow register. */
export const DRAWER_EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

/** Product cutouts are photographed on white and sit inside the plate; room shots fill it. */
export const isCutout = (src: string) => src.startsWith('/looks/product-');

/* ------------------------------------------------------------------ */
/* Language context                                                    */
/* ------------------------------------------------------------------ */
export interface LookContextValue {
  lang: Lang;
  setLang: (next: Lang) => void;
  t: (en: string, ar: string) => string;
}

const LookContext = createContext<LookContextValue | null>(null);
export const LookProvider = LookContext.Provider;

/** Language + translator for anything rendered inside the LookThree layout. */
export function useLook(): LookContextValue {
  const ctx = useContext(LookContext);
  if (!ctx) throw new Error('useLook() must be used inside the LookThree layout');
  return ctx;
}

/** A flag that flips on for `ms` then off again — the inline "Added" confirmations. */
export function useFlash(ms = 1600): [boolean, () => void] {
  const [on, setOn] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);
  const trigger = () => {
    setOn(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOn(false), ms);
  };
  return [on, trigger];
}

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

/** Calm scroll reveal — fade and rise, nothing more. */
export function Reveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  key?: Key; // allow list usage — no @types/react, so `key` is checked structurally
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/**
 * Centered museum-catalog section header: thin rule, Marcellus eyebrow, Playfair Title Case.
 * `tone="cream"` is the same header re-lit for the dark #1B1712 bands.
 */
export function SectionHeader({
  eyebrow, lang, tone = 'ink', children,
}: { eyebrow: string; lang: Lang; tone?: 'ink' | 'cream'; children: ReactNode }) {
  const dark = tone === 'cream';
  return (
    <Reveal className="flex flex-col items-center text-center">
      <span className="h-px w-10" style={{ backgroundColor: dark ? GOLDISH : BRONZE }} />
      <p
        className={`mt-6 ${
          lang === 'ar' ? `${ALEXANDRIA} text-[11px] tracking-normal` : `${MARCELLUS} text-[10px] uppercase tracking-[0.4em]`
        } ${dark ? 'text-[#EFE9DD]/50' : ''}`}
        style={dark ? undefined : { color: MUTED }}
      >
        {eyebrow}
      </p>
      <h2
        className={`${serif(lang)} mt-5 text-4xl md:text-5xl ${headingLeading(lang, 'leading-[1.12]')}`}
        style={{ color: dark ? CREAM : INK }}
      >
        {children}
      </h2>
    </Reveal>
  );
}

/**
 * Hairline-bordered rectangle button. Sharp corners, letterspaced caps, slow fill on hover.
 * Renders a router `Link` when given `to`, otherwise a real `<button>`.
 * `tone="fill"` is the ink-filled primary (Add to Cart); `size="block"` matches a 50px form row.
 */
export function HairButton({
  label,
  tone = 'ink',
  size = 'md',
  className = '',
  lang = 'en',
  to,
  onClick,
  testId,
  type = 'button',
}: {
  label: ReactNode;
  tone?: 'ink' | 'white' | 'cream' | 'fill';
  size?: 'md' | 'sm' | 'block';
  className?: string;
  lang?: Lang;
  to?: string;
  onClick?: () => void;
  testId?: string;
  type?: 'button' | 'submit';
}) {
  const tones = {
    ink: 'border-[#2A241C]/40 text-[#2A241C] hover:bg-[#2A241C] hover:border-[#2A241C] hover:text-[#EFE9DD]',
    white: 'border-white/60 text-white hover:bg-white hover:border-white hover:text-[#2A241C]',
    cream: 'border-[#EFE9DD]/50 text-[#EFE9DD] hover:bg-[#EFE9DD] hover:border-[#EFE9DD] hover:text-[#1B1712]',
    fill: 'border-[#2A241C] bg-[#2A241C] text-[#EFE9DD] hover:border-[#3B3329] hover:bg-[#3B3329]',
  } as const;
  const sizes = {
    md: 'inline-block px-10 py-4',
    sm: 'inline-block px-5 py-2.5',
    block: 'inline-flex h-[50px] items-center justify-center px-8',
  } as const;
  const cls = `cursor-pointer border text-center transition-colors duration-300 ${sizes[size]} ${capsCls(lang)} ${tones[tone]} ${className}`;
  if (to) {
    return (
      <Link to={to} data-testid={testId} className={cls}>
        {label}
      </Link>
    );
  }
  return (
    <button type={type} data-testid={testId} onClick={onClick} className={cls}>
      {label}
    </button>
  );
}

/**
 * Bronze small-caps link with a thin underline — `tone="gold"` for the dark bands.
 * A router `Link` when given `to`; otherwise a button (demo action or no-op).
 */
export function BronzeLink({
  label, className = '', lang = 'en', tone = 'bronze', to, onClick, testId,
}: {
  label: string;
  className?: string;
  lang?: Lang;
  tone?: 'bronze' | 'gold';
  to?: string;
  onClick?: () => void;
  testId?: string;
}) {
  const tones = {
    bronze: 'border-[#8A6D4F]/35 text-[#8A6D4F] hover:border-[#8A6D4F]',
    gold: 'border-[#C9B393]/35 text-[#C9B393] hover:border-[#C9B393]',
  } as const;
  const cls = `inline-block cursor-pointer border-b pb-1 transition-colors duration-300 ${tones[tone]} ${capsCls(lang)} ${className}`;
  if (to) {
    return (
      <Link to={to} data-testid={testId} className={cls}>
        {label}
      </Link>
    );
  }
  return (
    <button type="button" data-testid={testId} onClick={onClick} className={cls}>
      {label}
    </button>
  );
}

/** Rating stars — size 11, filled in bronze. */
export function Stars({ rating }: { rating: number }) {
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

/* ------------------------------------------------------------------ */
/* Product tile                                                        */
/* ------------------------------------------------------------------ */

type TileSource = LookProduct | CatalogProduct;
const isCatalog = (p: TileSource): p is CatalogProduct => 'sku' in p;

/**
 * The look's product tile: white plate, museum caption below, bronze stars,
 * Playfair price. Takes either a home-page `LookProduct` or a `CatalogProduct`
 * (search results, related pieces) — the store name reads above the piece
 * because Diyar is a marketplace. Plate and name link to the product page;
 * `rank` prints a ghost Playfair numeral on the plate (Best Sellers).
 */
export function ProductTile({
  p, lang, rank, testId,
}: { p: TileSource; lang: Lang; rank?: number; testId?: string; key?: Key }) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  const [added, flashAdded] = useFlash();
  const [saved, setSaved] = useState(false);

  const catalog = isCatalog(p);
  const name = catalog ? p.name[lang] : lang === 'ar' ? p.nameAr : p.nameEn;
  const store = catalog ? storeOf(p.store).name[lang] : p.brand;
  const reviews = catalog ? p.reviews : undefined;
  const isNew = catalog && !!p.isNew;
  const onSale = !!p.oldPrice;
  const to = productPath(3, p.id);

  return (
    <div className="group flex h-full flex-col" data-testid={testId}>
      <div className="relative overflow-hidden border bg-white" style={{ borderColor: HAIR }}>
        {(onSale || isNew) && (
          <div
            className={`pointer-events-none absolute start-3 top-3 z-10 flex flex-col gap-1 ${captionCls(lang)}`}
            style={{ color: BRONZE }}
          >
            {onSale && <span>{t('Sale', 'تخفيض')}</span>}
            {isNew && <span>{t('New', 'جديد')}</span>}
          </div>
        )}
        {rank !== undefined && (
          <span
            aria-hidden
            dir="ltr"
            className={`${PLAYFAIR} pointer-events-none absolute end-3 top-1 z-10 select-none text-5xl leading-none text-[#2A241C14]`}
          >
            {pad2(rank)}
          </span>
        )}
        <Link to={to} className="block" aria-label={name}>
          <img
            src={p.img}
            alt={name}
            className={`aspect-square w-full transition-transform duration-[1200ms] ease-out group-hover:scale-105 ${
              isCutout(p.img) ? 'object-contain p-6' : 'object-cover'
            }`}
          />
        </Link>
        <button
          type="button"
          aria-label={t('Add to wishlist', 'أضف إلى المفضلة')}
          aria-pressed={saved}
          onClick={() => setSaved((s) => !s)}
          className="absolute bottom-3 end-3 z-10 cursor-pointer p-1 transition-opacity duration-300 hover:opacity-70"
        >
          <Heart
            size={15}
            strokeWidth={1.25}
            className={saved ? 'fill-[#8A6D4F] text-[#8A6D4F]' : 'text-[#8B8378]'}
          />
        </button>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <p className={captionCls(lang)} style={{ color: MUTED }}>
          {store}
        </p>
        <h3 className="mt-1.5 text-[14px] font-light leading-snug" style={{ color: INK }}>
          <Link to={to} className="transition-colors duration-300 hover:text-[#8A6D4F]">
            {name}
          </Link>
        </h3>
        <div className="mt-2.5 flex items-center gap-2">
          <Stars rating={p.rating} />
          {reviews !== undefined && (
            <span dir="ltr" className="text-[10px] tracking-[0.08em]" style={{ color: MUTED }}>
              ({reviews})
            </span>
          )}
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
          type="button"
          onClick={flashAdded}
          className={`mt-4 w-full cursor-pointer border py-3 transition-colors duration-300 ${capsCls(lang)} ${
            added
              ? 'border-[#2A241C] bg-[#2A241C] text-[#EFE9DD]'
              : 'border-[#2A241C]/30 hover:border-[#2A241C] hover:bg-[#2A241C] hover:text-[#EFE9DD]'
          }`}
        >
          {added ? t('Added', 'أُضيف') : t('Add to Cart', 'أضف إلى السلة')}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Breadcrumb                                                          */
/* ------------------------------------------------------------------ */

export interface Crumb { label: string; to?: string }

/** Marcellus breadcrumb trail — the last item is the current page and is not a link. */
export function Crumbs({
  items, lang, className = '', align = 'center',
}: { items: Crumb[]; lang: Lang; className?: string; align?: 'center' | 'start' }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 ${
        align === 'center' ? 'justify-center' : 'justify-start'
      } ${eyebrowCls(lang)} ${className}`}
      style={{ color: MUTED }}
    >
      {items.map((c, i) => (
        <span key={`${c.label}-${i}`} className="flex items-center gap-2.5">
          {i > 0 && <ChevronRight size={10} strokeWidth={1.25} className="opacity-60 rtl:rotate-180" />}
          {c.to ? (
            <Link to={c.to} className="transition-colors duration-300 hover:text-[#8A6D4F]">
              {c.label}
            </Link>
          ) : (
            <span aria-current="page" style={{ color: INK }}>{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
