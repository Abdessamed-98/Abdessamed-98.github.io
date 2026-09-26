/**
 * Look 1 — the parts the inner pages are assembled from.
 *
 * Fifteen-odd pages were added in one pass; the way that stays one design and
 * not fifteen is that none of them invent their own tabs, fields, empty states
 * or page heads. They come from here.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { Breadcrumb, FIELD, HAIR, INK, MUTED, OLIVE, TILE, primaryBtnCls, useLook, type Crumb } from './ui';
import { useShell } from './shellContext';
import type { StoreService } from './data';

export const CONTAINER = 'mx-auto max-w-[1400px] px-6 md:px-10';

export const capsCls = (isAr: boolean) => (isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]');

/** Display type for page and block titles, in the look's two faces. */
export const displayCls = (isAr: boolean, size: 'xl' | 'lg' | 'md' | 'sm' = 'lg') => {
  const scale = {
    xl: 'text-3xl md:text-5xl',
    lg: 'text-3xl md:text-4xl',
    md: 'text-2xl md:text-[28px]',
    sm: 'text-[19px] md:text-[21px]',
  }[size];
  return `font-extrabold ${scale} ${
    isAr
      ? "font-['Alexandria',sans-serif] leading-[1.2] tracking-normal"
      : "font-['Outfit',sans-serif] uppercase leading-[1.05] tracking-tight"
  }`;
};

/* ------------------------------------------------------------------ */
/* Page head                                                           */
/* ------------------------------------------------------------------ */

/** The head every inner page opens with: trail, eyebrow, title, a line of intro. */
export function PageHead({
  crumbs,
  eyebrow,
  title,
  intro,
  aside,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  intro?: string;
  aside?: ReactNode;
}) {
  const { lang } = useLook();
  const isAr = lang === 'ar';
  return (
    <div className={`${CONTAINER} pt-10 md:pt-14`}>
      <Breadcrumb items={crumbs} />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className={`mb-3 text-[11px] ${capsCls(isAr)}`} style={{ color: OLIVE }}>
              {eyebrow}
            </p>
          )}
          <h1 className={displayCls(isAr, 'xl')} style={{ color: INK }}>
            {title}
          </h1>
          {intro && (
            <p className="mt-5 text-[15px] font-light leading-relaxed" style={{ color: '#4A443C' }}>
              {intro}
            </p>
          )}
        </div>
        {aside}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

export interface TabItem<K extends string> {
  key: K;
  label: string;
  count?: number;
  to?: string;
}

/** An underline rail. Scrolls sideways on a phone rather than wrapping. */
export function Tabs<K extends string>({
  items,
  value,
  onChange,
  testId,
  dark = false,
}: {
  items: TabItem<K>[];
  value: K;
  onChange?: (key: K) => void;
  testId?: string;
  dark?: boolean;
}) {
  const { lang } = useLook();
  const isAr = lang === 'ar';
  const idle = dark ? 'rgba(246,243,236,0.55)' : MUTED;
  const active = dark ? '#FFFFFF' : INK;

  return (
    <div
      role="tablist"
      data-testid={testId}
      className="scrollbar-hide -mb-px flex gap-x-8 overflow-x-auto border-b"
      style={{ borderColor: dark ? 'rgba(255,255,255,0.14)' : HAIR }}
    >
      {items.map((it) => {
        const on = it.key === value;
        const cls = `flex shrink-0 items-center gap-2 border-b-2 pb-4 pt-1 text-[12px] font-bold transition-colors ${capsCls(isAr)}`;
        const style = { borderColor: on ? (dark ? '#A7B894' : INK) : 'transparent', color: on ? active : idle };
        const body = (
          <>
            {it.label}
            {it.count !== undefined && (
              <span className="font-['Outfit',sans-serif] text-[10px] font-medium tabular-nums" style={{ color: on ? OLIVE : idle }}>
                {it.count}
              </span>
            )}
          </>
        );
        return it.to ? (
          <Link key={it.key} to={it.to} role="tab" aria-selected={on} data-tab={it.key} className={cls} style={style}>
            {body}
          </Link>
        ) : (
          <button
            key={it.key}
            type="button"
            role="tab"
            aria-selected={on}
            data-tab={it.key}
            onClick={() => onChange?.(it.key)}
            className={cls}
            style={style}
          >
            {body}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form fields                                                         */
/* ------------------------------------------------------------------ */

const fieldCls =
  'w-full border bg-white px-4 text-[13px] text-[#171512] outline-none transition-colors placeholder:text-[#9A9388] focus:border-[#171512] focus:ring-1 focus:ring-[#171512]';

function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  const { lang } = useLook();
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 block text-[11px] font-medium ${lang === 'ar' ? 'tracking-normal' : 'uppercase tracking-[0.18em]'}`}
      style={{ color: MUTED }}
    >
      {children}
    </label>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  ltr = false,
  placeholder,
  required = false,
  inputMode,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  ltr?: boolean;
  placeholder?: string;
  required?: boolean;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric';
  autoComplete?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        dir={ltr ? 'ltr' : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldCls} h-12 ${ltr ? 'text-start' : ''}`}
        style={{ borderColor: FIELD }}
      />
    </div>
  );
}

export function TextArea({
  id,
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldCls} resize-none py-3.5`}
        style={{ borderColor: FIELD }}
      />
    </div>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldCls} h-12`}
        style={{ borderColor: FIELD }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** A square switch, in the look's olive. */
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="relative h-6 w-11 shrink-0 border transition-colors"
      style={{ borderColor: on ? OLIVE : FIELD, backgroundColor: on ? OLIVE : 'transparent' }}
    >
      <span className={`absolute top-1/2 block h-4 w-4 -translate-y-1/2 transition-all ${on ? 'start-[22px] bg-white' : 'start-1 bg-[#C9C2B4]'}`} />
    </button>
  );
}

/** Five stars you can set. */
export function RatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const { t } = useLook();
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-1" dir="ltr" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={t(`${n} of 5`, `${n} من 5`)}
          aria-pressed={value === n}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="p-1"
        >
          <Star size={24} strokeWidth={1.25} className={n <= shown ? 'fill-[#171512] text-[#171512]' : 'text-[#C9C2B4]'} />
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: { label: string; to?: string; onClick?: () => void };
}) {
  const { lang } = useLook();
  const isAr = lang === 'ar';
  return (
    <div className="border px-6 py-16 text-center" style={{ borderColor: HAIR }} data-testid="empty-state">
      <p className="text-[15px] font-bold">{title}</p>
      {body && (
        <p className="mx-auto mt-3 max-w-sm text-[13px] font-light leading-relaxed" style={{ color: '#4A443C' }}>
          {body}
        </p>
      )}
      {action &&
        (action.to ? (
          <Link to={action.to} className={`mt-8 inline-block px-10 py-4 ${primaryBtnCls(isAr)}`}>
            {action.label}
          </Link>
        ) : (
          <button type="button" onClick={action.onClick} className={`mt-8 px-10 py-4 ${primaryBtnCls(isAr)}`}>
            {action.label}
          </button>
        ))}
    </div>
  );
}

/** A labelled step sequence — order tracking, request progress. */
export function StatusTimeline({
  steps,
  current,
}: {
  steps: { label: string; note?: string }[];
  /** index of the step in progress; everything before it is done */
  current: number;
}) {
  return (
    <ol className="grid gap-0 sm:grid-cols-4" data-testid="status-timeline">
      {steps.map((s, i) => {
        const done = i < current;
        const now = i === current;
        return (
          <li key={s.label} className="relative flex gap-3 pb-6 sm:block sm:pb-0 sm:pe-4">
            {/* the rail: vertical on a phone, across on a desktop */}
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute start-[11px] top-6 h-[calc(100%-1.5rem)] w-px sm:start-6 sm:top-[11px] sm:h-px sm:w-[calc(100%-1.5rem)]"
                style={{ backgroundColor: done ? OLIVE : HAIR }}
              />
            )}
            <span
              className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center border"
              style={{
                borderColor: done || now ? OLIVE : FIELD,
                backgroundColor: done ? OLIVE : '#FDFCF9',
              }}
            >
              {done ? (
                <Check size={13} strokeWidth={2.25} className="text-white" />
              ) : now ? (
                <span className="h-2 w-2 animate-pulse" style={{ backgroundColor: OLIVE }} />
              ) : null}
            </span>
            <span className="sm:mt-3 sm:block">
              <span className="block text-[13px] font-bold" style={{ color: done || now ? INK : MUTED }}>
                {s.label}
              </span>
              {s.note && (
                <span className="mt-1 block text-[11px] font-light" style={{ color: MUTED }}>
                  {s.note}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Lightbox                                                            */
/* ------------------------------------------------------------------ */

/** Full-screen gallery: arrows, keyboard, swipe, Escape. */
export function Lightbox({
  images,
  index,
  onIndex,
  open,
  onClose,
  caption,
}: {
  images: string[];
  index: number;
  onIndex: (i: number) => void;
  open: boolean;
  onClose: () => void;
  caption?: (i: number) => string;
}) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const startX = useRef<number | null>(null);
  const go = (d: number) => onIndex((index + d + images.length) % images.length);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // arrows follow the reading direction
      if (e.key === 'ArrowRight') go(isAr ? -1 : 1);
      if (e.key === 'ArrowLeft') go(isAr ? 1 : -1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  });

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          data-testid="lightbox"
          dir={isAr ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-[90] flex flex-col bg-[#14120F]/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={t('Gallery', 'المعرض')}
        >
          <div className="flex items-center justify-between px-5 py-4 text-white">
            <span className="font-['Outfit',sans-serif] text-[12px] tracking-[0.2em] text-white/70" dir="ltr">
              {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('Close', 'إغلاق')}
              className="flex h-10 w-10 items-center justify-center border border-white/30 transition-colors hover:bg-white hover:text-[#171512]"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 md:px-20"
            onPointerDown={(e) => (startX.current = e.clientX)}
            onPointerUp={(e) => {
              if (startX.current === null) return;
              const dx = e.clientX - startX.current;
              startX.current = null;
              if (Math.abs(dx) > 40) go((dx < 0) !== isAr ? 1 : -1);
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={images[index]}
                src={images[index]}
                alt={caption?.(index) ?? ''}
                draggable={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="max-h-full max-w-full select-none object-contain"
              />
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t('Previous', 'السابق')}
                  className="absolute start-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/30 text-white transition-colors hover:bg-white hover:text-[#171512] md:flex"
                >
                  <ChevronLeft size={18} strokeWidth={1.25} className={isAr ? 'rotate-180' : ''} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t('Next', 'التالي')}
                  className="absolute end-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/30 text-white transition-colors hover:bg-white hover:text-[#171512] md:flex"
                >
                  <ChevronRight size={18} strokeWidth={1.25} className={isAr ? 'rotate-180' : ''} />
                </button>
              </>
            )}
          </div>

          {caption && (
            <p className="px-5 pb-5 text-center text-[13px] font-light text-white/75">{caption(index)}</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

/** A numbered figure: label above, value below. */
export function Stat({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  const { lang } = useLook();
  return (
    <div>
      <p className={`text-[10px] ${capsCls(lang === 'ar')}`} style={{ color: dark ? 'rgba(246,243,236,0.6)' : MUTED }}>
        {label}
      </p>
      <p
        className="mt-1.5 font-['Outfit',sans-serif] text-[22px] font-bold tabular-nums"
        style={{ color: dark ? '#FFFFFF' : INK }}
        dir="ltr"
      >
        {value}
      </p>
    </div>
  );
}

/** Small status badge: square, hairline, one of four tones. */
export function Badge({ tone, children }: { tone: 'olive' | 'ink' | 'muted' | 'red'; children: ReactNode }) {
  const colors = {
    olive: { c: OLIVE, b: 'rgba(90,107,77,0.35)' },
    ink: { c: INK, b: 'rgba(23,21,18,0.3)' },
    muted: { c: MUTED, b: FIELD },
    red: { c: '#B03A2E', b: 'rgba(176,58,46,0.35)' },
  }[tone];
  return (
    <span className="inline-flex items-center border px-2.5 py-1 text-[10px] font-semibold" style={{ color: colors.c, borderColor: colors.b }}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Service offers — a store's or a provider's services tab             */
/* ------------------------------------------------------------------ */

/** Cards with price, timing and a request button that opens the service sheet pre-filled. */
export function ServiceOffers({ intro, list, testId }: { intro: string; list: StoreService[]; testId: string }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const { openService } = useShell();
  return (
    <section className="py-12 md:py-16" data-testid={testId}>
      <p className="max-w-2xl text-[15px] font-light leading-relaxed" style={{ color: '#4A443C' }}>
        {intro}
      </p>
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {list.map((sv) => (
          <li key={sv.title.en} className="flex flex-col border p-6 md:p-7" style={{ borderColor: HAIR }} data-testid="service-offer">
            <span className="flex h-12 w-12 items-center justify-center" style={{ backgroundColor: TILE }}>
              <sv.icon size={20} strokeWidth={1.4} style={{ color: OLIVE }} />
            </span>
            <p className="mt-6 text-[17px] font-bold">{t(sv.title.en, sv.title.ar)}</p>
            <p className="mt-2 flex-1 text-[13.5px] font-light leading-relaxed" style={{ color: '#4A443C' }}>{t(sv.body.en, sv.body.ar)}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 border-t pt-5" style={{ borderColor: HAIR }}>
              <div>
                <dt className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('Price', 'السعر')}</dt>
                <dd className="mt-1 text-[13px] font-bold">{t(sv.price.en, sv.price.ar)}</dd>
              </div>
              <div>
                <dt className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('Timing', 'المدة')}</dt>
                <dd className="mt-1 text-[13px] font-bold">{t(sv.lead.en, sv.lead.ar)}</dd>
              </div>
            </dl>
            <button
              type="button"
              data-testid="service-offer-request"
              onClick={() => openService(t(sv.title.en, sv.title.ar))}
              className={`mt-6 w-full py-3.5 ${primaryBtnCls(isAr)}`}
            >
              {t('Request', 'اطلب الخدمة')}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
