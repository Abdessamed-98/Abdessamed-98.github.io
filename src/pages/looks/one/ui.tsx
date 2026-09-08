/**
 * Look 1 — "Editorial Light": shared primitives.
 * Palette, the look-wide language context and the small pieces (Reveal,
 * SectionHeading, ViewMore, Stars, ProductCard, Breadcrumb) that the home page,
 * the search page and the product page all draw from.
 */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, ArrowRight, Heart, ChevronRight, Check } from 'lucide-react';
import {
  formatSAR, storeOf, productPath,
  type Lang, type LookProduct, type CatalogProduct,
} from '../lookShared';

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */
export const BG = '#FDFCF9';      // near-white warm canvas
export const INK = '#171512';     // text
export const OLIVE = '#5A6B4D';   // accent
export const HAIR = '#E8E4DC';    // hairlines
export const RED = '#B03A2E';     // sale / AI link
export const TILE = '#F6F3EC';    // product image tile
export const OLIVE_LT = '#A7B894'; // olive lifted for the dark bands
export const CREAM = '#F6F3EC';   // type colour on the dark bands
export const NIGHT = '#14120F';   // dark band ground (same as the footer)

/* ------------------------------------------------------------------ */
/* Language context                                                    */
/* ------------------------------------------------------------------ */
export interface LookCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Pick the string for the active language. */
  t: (en: string, ar: string) => string;
}

export const LookContext = createContext<LookCtx>({
  lang: 'ar',
  setLang: () => undefined,
  t: (_en, ar) => ar,
});

/** Language + translator provided by the LookOne layout to every page under /look/1. */
export const useLook = () => useContext(LookContext);
export const useLang = () => useContext(LookContext).lang;

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

/** Restrained scroll-reveal wrapper. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  key?: string | number;
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
 * `size="sm"` is the page-title scale used by the inner pages.
 */
export function SectionHeading({
  eyebrow,
  title,
  light = false,
  size = 'lg',
  as: Tag = 'h2',
}: {
  eyebrow: string;
  title: string;
  light?: boolean;
  size?: 'lg' | 'sm';
  as?: 'h1' | 'h2';
}) {
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
      <Tag
        className={`font-extrabold uppercase ${
          size === 'lg' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-3xl md:text-4xl lg:text-5xl'
        } ${
          isAr
            ? "font-['Alexandria',sans-serif] leading-[1.15] tracking-normal"
            : "font-['Outfit',sans-serif] leading-[0.95] tracking-tight"
        }`}
        style={{ color: light ? CREAM : INK }}
      >
        {title}
      </Tag>
    </div>
  );
}

/** Tiny letterspaced uppercase "VIEW MORE →" link with hairline underline. */
export function ViewMore({ label, light = false, to }: { label?: string; light?: boolean; to?: string }) {
  const isAr = useLang() === 'ar';
  const text = label ?? (isAr ? 'عرض المزيد' : 'View More');
  const cls = `group/vm inline-flex items-center gap-2.5 pb-1.5 border-b text-[11px] uppercase transition-colors ${
    isAr ? 'tracking-normal' : 'tracking-[0.28em]'
  } ${
    light
      ? 'text-white border-white/50 hover:border-white'
      : 'text-[#171512] border-[#171512]/25 hover:border-[#171512]'
  }`;
  const inner = (
    <>
      {text}
      <ArrowRight
        size={12}
        strokeWidth={1.5}
        className={`transition-transform duration-300 ${
          isAr ? 'rotate-180 group-hover/vm:-translate-x-1' : 'group-hover/vm:translate-x-1'
        }`}
      />
    </>
  );
  return to ? (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href="#" className={cls}>
      {inner}
    </a>
  );
}

/** Rating stars, size 12, filled per rating. `light` inverts them for the dark bands. */
export function Stars({ rating, light = false }: { rating: number; light?: boolean }) {
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

/** The black rectangle primary button — hover olive. Shared by every page. */
export const primaryBtnCls = (isAr: boolean) =>
  `bg-[#171512] text-white transition-colors duration-300 hover:bg-[#5A6B4D] text-[11px] font-medium uppercase ${
    isAr ? 'tracking-normal' : 'tracking-[0.28em]'
  }`;

/** Tiny uppercase eyebrow label class (tracking-normal in Arabic). */
export const eyebrowCls = (isAr: boolean, extra = 'text-[10px] text-neutral-400') =>
  `uppercase ${extra} ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`;

/* ------------------------------------------------------------------ */
/* Product card                                                        */
/* ------------------------------------------------------------------ */

/** What the card needs to render, whichever product shape it was given. */
interface CardData {
  id: number;
  img: string;
  brand: string;
  name: string;
  rating: number;
  reviews?: number;
  price: number;
  oldPrice?: number;
  sale: boolean;
  isNew: boolean;
}

const isCatalog = (p: LookProduct | CatalogProduct): p is CatalogProduct => 'gallery' in p;

function toCard(p: LookProduct | CatalogProduct, lang: Lang): CardData {
  if (isCatalog(p)) {
    const store = storeOf(p.store);
    return {
      id: p.id,
      img: p.img,
      brand: store.name[lang],
      name: p.name[lang],
      rating: p.rating,
      reviews: p.reviews,
      price: p.price,
      oldPrice: p.oldPrice,
      sale: !!p.oldPrice,
      isNew: !!p.isNew,
    };
  }
  return {
    id: p.id,
    img: p.img,
    brand: lang === 'ar' && p.brand === 'DIYAR HOME' ? 'ديار هوم' : p.brand,
    name: lang === 'ar' ? p.nameAr : p.nameEn,
    rating: p.rating,
    price: p.price,
    oldPrice: p.oldPrice,
    sale: !!p.sale || !!p.oldPrice,
    isNew: false,
  };
}

/**
 * The look's product card — image tile, store, name, stars, price, actions.
 * Accepts the homepage `LookProduct` or a `CatalogProduct` from the search /
 * product pages. `rank` shows 01–04 and drops the add-to-cart button so the
 * Best Sellers rail stays compact. The tile and the name link to the product page.
 */
export function ProductCard({
  p,
  rank,
  testId,
}: {
  p: LookProduct | CatalogProduct;
  rank?: number;
  testId?: string;
  key?: string | number;
}) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const c = toCard(p, lang);
  const to = productPath(1, c.id);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="group flex h-full flex-col" data-testid={testId}>
      {/* image tile */}
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: TILE }}>
        {/* badges — sale first, then new, stacked at the start edge */}
        <div className="absolute start-4 top-4 z-10 flex flex-col gap-1.5">
          {c.sale && (
            <span
              className={`text-[10px] font-semibold uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`}
              style={{ color: RED }}
            >
              {t('Sale', 'تخفيض')}
            </span>
          )}
          {c.isNew && (
            <span
              className={`text-[10px] font-semibold uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`}
              style={{ color: OLIVE }}
            >
              {t('New', 'جديد')}
            </span>
          )}
        </div>
        {rank !== undefined && (
          <span
            className="absolute end-4 top-2 z-10 font-['Outfit',sans-serif] text-[42px] font-extrabold leading-none text-[#171512]/15"
            aria-hidden="true"
          >
            {String(rank).padStart(2, '0')}
          </span>
        )}
        {/* wishlist — top end (bottom end when the rank digit is there) */}
        <button
          type="button"
          onClick={() => setWished((w) => !w)}
          aria-pressed={wished}
          aria-label={t('Add to wishlist', 'أضف إلى المفضلة')}
          className={`absolute end-3 z-10 flex h-9 w-9 items-center justify-center transition-colors ${
            rank !== undefined ? 'bottom-3' : 'top-3'
          } ${wished ? 'text-[#B03A2E]' : 'text-[#171512]/60 hover:text-[#171512]'}`}
        >
          <Heart size={17} strokeWidth={1.25} className={wished ? 'fill-[#B03A2E]' : 'fill-transparent'} />
        </button>
        <Link to={to} className="block h-full w-full" aria-label={c.name}>
          <img
            src={c.img}
            alt={c.name}
            className="h-full w-full object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
      </div>

      {/* info */}
      <p className={`mt-5 ${eyebrowCls(isAr)}`}>{c.brand}</p>
      <h3 className="mt-1.5 truncate text-sm font-medium" title={c.name}>
        <Link to={to} className="decoration-[#5A6B4D] underline-offset-4 hover:underline">
          {c.name}
        </Link>
      </h3>
      <div className="mt-2 flex items-center gap-2">
        <Stars rating={c.rating} />
        {c.reviews !== undefined && <span className="text-[11px] text-neutral-400">({c.reviews})</span>}
      </div>

      {/* price row */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2 overflow-hidden">
          <span className="text-[15px] font-bold">{formatSAR(c.price)}</span>
          <span className={`text-[10px] uppercase text-neutral-500 ${isAr ? 'tracking-normal' : 'tracking-[0.1em]'}`}>
            {t('SAR', 'ر.س')}
          </span>
          {c.oldPrice && <span className="text-xs text-neutral-400 line-through">{formatSAR(c.oldPrice)}</span>}
        </div>
        <button
          type="button"
          className={`shrink-0 text-[10px] font-semibold uppercase leading-none underline-offset-4 hover:underline ${
            isAr ? 'tracking-normal' : 'tracking-[0.24em]'
          }`}
          style={{ color: RED }}
        >
          {t('Try with AI', 'جرب AI')}
        </button>
      </div>

      {/* add to cart — full card only; the rail stays quiet */}
      {rank === undefined && (
        <button
          type="button"
          onClick={addToCart}
          className={`mt-5 inline-flex w-full items-center justify-center gap-2 border border-[#171512] py-3.5 text-[10px] font-medium uppercase transition-colors duration-300 ${
            added ? 'bg-[#5A6B4D] border-[#5A6B4D] text-white' : 'hover:bg-[#171512] hover:text-white'
          } ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`}
        >
          {added && <Check size={13} strokeWidth={2} />}
          {added ? t('Added', 'أُضيف') : t('Add to Cart', 'أضف إلى السلة')}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Breadcrumb                                                          */
/* ------------------------------------------------------------------ */
export interface Crumb {
  label: string;
  to?: string;
}

/** Tiny uppercase trail: Home › Shop › … The last crumb is the current page. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const isAr = useLang() === 'ar';
  return (
    <nav aria-label={isAr ? 'مسار التنقل' : 'Breadcrumb'}>
      <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.24em]'}`}>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-2">
              {c.to && !last ? (
                <Link to={c.to} className="text-neutral-400 transition-colors hover:text-[#171512]">
                  {c.label}
                </Link>
              ) : (
                <span className={last ? 'text-[#171512]' : 'text-neutral-400'} aria-current={last ? 'page' : undefined}>
                  {c.label}
                </span>
              )}
              {!last && (
                <ChevronRight
                  size={11}
                  strokeWidth={1.5}
                  className={isAr ? 'rotate-180' : ''}
                  style={{ color: OLIVE }}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
