/**
 * Look 2 — "Dark Luxury" primitives.
 * Design tokens, the language context and the small building blocks shared by
 * the layout (LookTwo.tsx), the home page, the search page and the product page.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, ShoppingBag, Heart, Check, ChevronRight } from 'lucide-react';
import { formatSAR, storeOf, productPath } from '../lookShared';
import type { Lang, LookNo, LookProduct, CatalogProduct } from '../lookShared';

/* ------------------------------------------------------------------ */
/* Design tokens (class fragments — kept as literal strings so the     */
/* Tailwind scanner picks them up)                                     */
/* ------------------------------------------------------------------ */
export const LOOK: LookNo = 2;

export const DISPLAY = "font-['Playfair_Display',serif]";
export const CAPS = "font-['Marcellus',serif]";
/* Arabic counterparts: Amiri serif for display, Alexandria for labels.
   CRITICAL: Arabic text must never carry letterspacing — every AR label
   fragment below uses tracking-normal where the EN one tracks out. */
export const AR_DISPLAY = "font-['Amiri',serif]";
export const AR_LABEL = "font-['Alexandria',sans-serif]";

const GOLD_BTN_BASE =
  'inline-flex items-center justify-center gap-3 border border-[#C9A86A]/70 px-9 py-4 ' +
  'uppercase text-[#C9A86A] ' +
  'transition-all duration-300 hover:bg-[#C9A86A] hover:text-[#131009] cursor-pointer';
export const goldBtn = (ar: boolean) =>
  ar
    ? `${GOLD_BTN_BASE} ${AR_LABEL} text-[13px] tracking-normal`
    : `${GOLD_BTN_BASE} ${CAPS} text-[11px] tracking-[0.3em]`;

/** Dark form control: espresso panel, hairline border, gold focus. */
export const FIELD =
  'bg-[#1C1610] border border-white/15 text-[#EFE9DD] outline-none transition-colors duration-300 focus:border-[#C9A86A]/70 focus-within:border-[#C9A86A]/70';

/** Demo-only links that must not navigate. */
export const stop = (e: { preventDefault: () => void }) => e.preventDefault();

/* ------------------------------------------------------------------ */
/* Language context — owned by the layout, read by every page          */
/* ------------------------------------------------------------------ */
export interface LookCtx {
  lang: Lang;
  setLang: (next: Lang) => void;
  isAr: boolean;
  t: (en: string, ar: string) => string;
}

const LookContext = createContext<LookCtx | null>(null);
export const LookProvider = LookContext.Provider;

export function useLook(): LookCtx {
  const ctx = useContext(LookContext);
  if (!ctx) throw new Error('useLook() must be used inside the <LookTwo> layout');
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
export function Reveal({
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

/** Gold small-caps text link. With `to` it routes; without, it is a demo link. */
export function GoldLink({
  ar = false, to, className = '', children,
}: { ar?: boolean; to?: string; className?: string; children: ReactNode }) {
  const cls = `${ar ? `${AR_LABEL} text-[12px] tracking-normal` : `${CAPS} text-[11px] tracking-[0.3em]`} inline-flex items-center gap-2.5 uppercase text-[#C9A86A] border-b border-[#C9A86A]/40 pb-1.5 hover:border-[#C9A86A] transition-colors duration-300 ${className}`;
  return to ? (
    <Link to={to} className={cls}>{children}</Link>
  ) : (
    <a href="#" onClick={stop} className={cls}>{children}</a>
  );
}

/** Five gold stars, filled to `rating`. Shared by products, stores and reviews. */
export function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((n) => (
        <Star
          key={n}
          size={size}
          className={n < Math.round(rating) ? 'text-[#C9A86A] fill-[#C9A86A]' : 'text-[#C9A86A]/25 fill-[#C9A86A]/20'}
        />
      ))}
    </span>
  );
}

/** Section titles read "Plain words + gold accent" — italic in EN, upright in AR. */
export function accentLast(text: string, ar: boolean) {
  const parts = text.trim().split(' ');
  const last = parts.pop() ?? '';
  const head = parts.join(' ');
  return (
    <>
      {head}
      {head && ' '}
      <em className={`text-[#C9A86A] ${ar ? 'not-italic' : 'italic'}`}>{last}</em>
    </>
  );
}

/** Gold small-caps eyebrow — the same rule the Heading component uses. */
export const eyebrowCls = (ar: boolean) =>
  `${ar ? `${AR_LABEL} text-[13px] tracking-normal` : `${CAPS} text-[11px] tracking-[0.4em]`} uppercase text-[#C9A86A]`;

/** Small gold label used for counts, categories and metadata. */
export const metaCls = (ar: boolean) =>
  ar ? `${AR_LABEL} text-[11px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.25em]`;

export function Heading({
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

/** Breadcrumb trail in gold small caps; the last item is the current page. */
export function Crumbs({ items }: { items: { label: string; to?: string }[] }) {
  const { isAr } = useLook();
  return (
    <nav
      aria-label="Breadcrumb"
      className={`${isAr ? `${AR_LABEL} text-[12px] tracking-normal` : `${CAPS} text-[10px] tracking-[0.25em]`} uppercase`}
    >
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${it.label}-${i}`} className="flex min-w-0 items-center gap-2.5">
              {i > 0 && <ChevronRight size={10} strokeWidth={1.5} className="shrink-0 text-[#C9A86A]/50 rtl:rotate-180" />}
              {it.to && !last ? (
                <Link to={it.to} className="whitespace-nowrap text-[#EFE9DD]/50 transition-colors duration-300 hover:text-[#C9A86A]">
                  {it.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className="max-w-[70vw] truncate text-[#C9A86A]">
                  {it.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** A short-lived "done" flag — drives the inline "Added" confirmations. */
export function useFlash(ms = 1600): [boolean, () => void] {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on) return;
    const id = window.setTimeout(() => setOn(false), ms);
    return () => window.clearTimeout(id);
  }, [on, ms]);
  return [on, () => setOn(true)];
}

/* ------------------------------------------------------------------ */
/* Product card                                                        */
/* ------------------------------------------------------------------ */

/** `/looks/product-*.jpg` are white cutouts (ivory tile, multiply); the rest are photos. */
export const isCutout = (src: string) => src.startsWith('/looks/product-');

/** The card's own view of a product — built from either data shape. */
interface CardData {
  id: number;
  img: string;
  store: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews?: number;
  isNew?: boolean;
}

function toCard(p: LookProduct | CatalogProduct, lang: Lang): CardData {
  if ('name' in p) {
    return {
      id: p.id, img: p.img, store: storeOf(p.store).name[lang], name: p.name[lang],
      price: p.price, oldPrice: p.oldPrice, rating: p.rating, reviews: p.reviews, isNew: p.isNew,
    };
  }
  return {
    id: p.id, img: p.img, store: p.brand, name: lang === 'ar' ? p.nameAr : p.nameEn,
    price: p.price, oldPrice: p.oldPrice, rating: p.rating,
  };
}

/**
 * One product tile — ivory cutout tile, store line, gold stars, Playfair price.
 * Shared by the home rails, the search grid and the product page's related row.
 * The image and the name route to the product page; cart / wishlist / AI stay demo.
 */
export function ProductCard({
  p, rank, panel = 'bg-[#1C1610] border-white/5', testId,
}: { p: LookProduct | CatalogProduct; rank?: string; panel?: string; testId?: string; key?: string | number }) {
  const { lang, isAr: ar, t } = useLook();
  const c = toCard(p, lang);
  const to = productPath(LOOK, c.id);
  const [wished, setWished] = useState(false);
  const [added, flashAdded] = useFlash();
  const tagCls = `${ar ? `${AR_LABEL} text-[10px] tracking-normal` : `${CAPS} text-[9px] tracking-[0.25em]`} px-2.5 py-1 uppercase`;
  const cutout = isCutout(c.img);

  return (
    <article
      data-testid={testId}
      className={`group h-full flex flex-col border p-3 transition-colors duration-500 hover:border-[#C9A86A]/25 ${panel}`}
    >
      {rank && (
        <div className="flex items-center gap-3 pb-3">
          <span className={`${DISPLAY} text-2xl leading-none text-[#C9A86A]`}>{rank}</span>
          <span className="flex-1 h-px bg-[#C9A86A]/25" />
        </div>
      )}

      {/* White-cutout imagery sits on a warm ivory tile; photos fill it */}
      <div className="relative">
        <Link to={to} className={`block aspect-square overflow-hidden ${cutout ? 'bg-[#F4EFE6]' : 'bg-[#1C1610]'}`}>
          <img
            src={c.img}
            alt={c.name}
            className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 ${
              cutout ? 'object-contain mix-blend-multiply p-3' : 'object-cover'
            }`}
          />
        </Link>
        <div className="pointer-events-none absolute top-3 start-3 z-10 flex flex-col items-start gap-1.5">
          {c.oldPrice !== undefined && (
            <span className={`${tagCls} bg-[#C9A86A] text-[#131009]`}>{t('SALE', 'تخفيض')}</span>
          )}
          {c.isNew && (
            <span className={`${tagCls} border border-[#C9A86A]/60 bg-[#131009] text-[#C9A86A]`}>{t('NEW', 'جديد')}</span>
          )}
        </div>
        <button
          type="button"
          aria-pressed={wished}
          aria-label={t('Add to wishlist', 'أضف إلى المفضلة')}
          onClick={() => setWished((w) => !w)}
          className="absolute top-2.5 end-2.5 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F4EFE6]/85 text-[#131009]/60 transition-colors duration-300 hover:text-[#131009]"
        >
          <Heart size={15} strokeWidth={1.25} className={wished ? 'fill-[#C9A86A] text-[#C9A86A]' : ''} />
        </button>
      </div>

      <div className="flex flex-col flex-1 pt-4 px-1 pb-1">
        {/* Marketplace: the seller reads above the name */}
        <span className={`${ar ? `${AR_LABEL} text-[10px] tracking-normal` : `${CAPS} text-[9px] tracking-[0.3em]`} uppercase text-[#C9A86A]/80`}>
          {c.store}
        </span>
        <h3 className="text-sm text-[#EFE9DD] font-light leading-snug mt-1.5">
          <Link to={to} className="transition-colors duration-300 hover:text-[#C9A86A]">{c.name}</Link>
        </h3>

        <div className="flex items-center justify-between gap-2 mt-2.5">
          <span className="flex items-center gap-2">
            <Stars rating={c.rating} />
            {c.reviews !== undefined && (
              <span className={`${metaCls(ar)} text-[#EFE9DD]/40`}>({c.reviews})</span>
            )}
          </span>
          <button
            type="button"
            className={`${ar ? `${AR_LABEL} text-[10px] tracking-normal` : `${CAPS} text-[9px] tracking-[0.25em]`} cursor-pointer uppercase text-[#C9A86A] hover:underline underline-offset-4`}
          >
            {t('TRY WITH AI', 'جرب AI')}
          </button>
        </div>

        <div className="flex items-baseline gap-2 mt-2.5">
          <span className={`${DISPLAY} text-lg text-[#C9A86A]`}>{formatSAR(c.price)}</span>
          <span className={`${ar ? 'text-[11px] tracking-normal' : 'text-[10px] tracking-[0.2em]'} text-[#C9A86A]/70`}>
            {t('SAR', 'ر.س')}
          </span>
          {c.oldPrice !== undefined && (
            <span className={`${DISPLAY} text-xs line-through text-[#EFE9DD]/40`}>{formatSAR(c.oldPrice)}</span>
          )}
        </div>

        <button type="button" onClick={flashAdded} className={`${ar ? AR_LABEL : CAPS} mt-auto pt-3 cursor-pointer`}>
          <span
            className={`w-full flex items-center justify-center gap-2 border ${ar ? 'text-[12px] tracking-normal' : 'text-[10px] tracking-[0.25em]'} py-2.5 transition-colors duration-300 ${
              added
                ? 'border-[#C9A86A] bg-[#C9A86A] text-[#131009]'
                : 'border-[#C9A86A]/50 text-[#C9A86A] hover:bg-[#C9A86A] hover:text-[#131009]'
            }`}
          >
            {added ? (
              <><Check size={13} strokeWidth={1.5} /> {t('ADDED', 'أُضيف')}</>
            ) : (
              <><ShoppingBag size={13} strokeWidth={1.25} /> {t('ADD TO CART', 'أضف إلى السلة')}</>
            )}
          </span>
        </button>
      </div>
    </article>
  );
}
