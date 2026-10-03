/**
 * Look 1 — the site-wide extras the original carries: the announcement line
 * over the home page, the floating contact button, and the home page's one
 * promotional pop-up.
 *
 * All three are quieter than the original: the announcement folds away as soon
 * as you scroll and stays gone once dismissed; the pop-up shows once per visit,
 * late, and only on the home page.
 */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, MessageSquareText, Phone, Sparkles, X, MessageSquare, PencilRuler } from 'lucide-react';
import { FOOTER_LINKS, lookBase, searchPath } from '../lookShared';
import { primaryBtnCls, useLook } from './ui';
import { capsCls } from './kit';

const DISMISS_KEY = 'diyar-look1-announce';
const PROMO_KEY = 'diyar-look1-promo';

const read = (k: string) => {
  try {
    return sessionStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string) => {
  try {
    sessionStorage.setItem(k, '1');
  } catch {
    /* storage blocked — it will simply show again next visit */
  }
};

/* ------------------------------------------------------------------ */
/* Announcement line                                                   */
/* ------------------------------------------------------------------ */

export function AnnouncementBar({ show }: { show: boolean }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [gone, setGone] = useState(() => read(DISMISS_KEY) === '1');
  const [i, setI] = useState(0);

  const items = [
    { text: t('Up to 40% off majlis and hospitality pieces', 'خصومات حتى 40% على المجالس وتجهيزات الضيافة'), cta: t('Shop the offers', 'تسوق العروض'), to: searchPath(1, { sale: true }) },
    { text: t('Try the AI designer on your own room', 'جرّب المصمم الذكي على غرفتك'), cta: t('Try it', 'جرّب الآن'), to: `${lookBase(1)}/ai-designer` },
    { text: t('Free delivery and installation across the Kingdom', 'توصيل وتركيب مجاني لكل مناطق المملكة'), cta: t('How it works', 'كيف يعمل'), to: `${lookBase(1)}/help/shipping` },
  ];

  const visible = show && !gone;
  useEffect(() => {
    if (!visible) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % items.length), 6000);
    return () => window.clearInterval(id);
  }, [visible, items.length]);

  const it = items[i];
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          key="announce"
          data-testid="announcement"
          initial={{ height: 0 }}
          animate={{ height: 36 }}
          exit={{ height: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 overflow-hidden bg-[#14120F] text-[#F6F3EC]"
        >
          <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-center gap-4 px-10 text-[13px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="flex min-w-0 items-center gap-3"
              >
                <span className="truncate font-light">{it.text}</span>
                <Link to={it.to} className={`hidden shrink-0 items-center gap-1.5 border-b border-white/40 pb-px font-medium hover:border-white sm:inline-flex ${capsCls(isAr)} text-[11px]`}>
                  {it.cta}
                  <ArrowRight size={11} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                </Link>
              </motion.span>
            </AnimatePresence>
            <button
              type="button"
              data-testid="announcement-close"
              aria-label={t('Dismiss', 'إغلاق')}
              onClick={() => {
                write(DISMISS_KEY);
                setGone(true);
              }}
              className="absolute end-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-white/60 transition-colors hover:text-white"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Floating contact                                                    */
/* ------------------------------------------------------------------ */

export function FloatingContact() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  // on the home page the hero has its own controls in that corner: wait until it scrolls away
  const isHome = pathname.replace(/\/$/, '') === lookBase(1);
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    if (!isHome) return;
    let last: boolean | null = null;
    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.6;
      if (next !== last) setPastHero((last = next));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);
  // the chat page is the thing this button opens; the product page has a buy bar on phones
  if (pathname.startsWith(`${lookBase(1)}/chat`)) return null;
  if (isHome && !pastHero) return null;
  const lifted = pathname.includes('/product/');

  const actions = [
    { icon: Sparkles, label: t('AI designer', 'المصمم الذكي'), to: `${lookBase(1)}/ai-designer` },
    { icon: MessageSquare, label: t('Chat with us', 'تحدث معنا'), to: `${lookBase(1)}/chat` },
    { icon: Phone, label: t('Call us', 'اتصل بنا'), href: `tel:${FOOTER_LINKS.phone.replace(/\s/g, '')}` },
  ];

  return (
    <div className={`fixed end-5 z-[60] flex flex-col items-end gap-2 md:end-8 ${lifted ? 'bottom-[92px] lg:bottom-8' : 'bottom-5 md:bottom-8'}`} data-testid="floating-contact">
      <AnimatePresence>
        {open &&
          actions.map((a, i) => {
            const cls = 'flex items-center gap-3 border border-[#E8E4DC] bg-[#FDFCF9] py-2.5 pe-2.5 ps-4 text-[12px] font-medium shadow-[0_12px_30px_rgba(23,21,18,0.12)] transition-colors hover:border-[#171512]';
            const body = (
              <>
                {a.label}
                <span className="flex h-8 w-8 items-center justify-center bg-[#171512] text-white">
                  <a.icon size={15} strokeWidth={1.5} />
                </span>
              </>
            );
            return (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: (actions.length - 1 - i) * 0.04 } }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
              >
                {a.to ? (
                  <Link to={a.to} className={cls} data-testid="floating-action">{body}</Link>
                ) : (
                  <a href={a.href} className={cls} data-testid="floating-action">{body}</a>
                )}
              </motion.div>
            );
          })}
      </AnimatePresence>
      <button
        type="button"
        data-testid="floating-toggle"
        aria-expanded={open}
        aria-label={open ? t('Close', 'إغلاق') : t('Contact us', 'تواصل معنا')}
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-12 items-center justify-center bg-[#171512] text-white shadow-[0_14px_34px_rgba(23,21,18,0.28)] transition-colors hover:bg-[#5A6B4D] md:h-14 md:w-14"
      >
        {open ? <X size={20} strokeWidth={1.5} /> : <MessageSquareText size={20} strokeWidth={1.5} className={isAr ? '-scale-x-100' : ''} />}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Home promo pop-up                                                   */
/* ------------------------------------------------------------------ */

export function PromoPopup({ active }: { active: boolean }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!active || read(PROMO_KEY) === '1') return;
    const id = window.setTimeout(() => {
      write(PROMO_KEY);
      setOpen(true);
    }, 7000);
    return () => window.clearTimeout(id);
  }, [active]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="promo"
          dir={isAr ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-[85] flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" aria-label={t('Close', 'إغلاق')} onClick={() => setOpen(false)} className="absolute inset-0 bg-[#14120F]/55 backdrop-blur-[2px]" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('Summer offers', 'عروض الصيف')}
            data-testid="promo-popup"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid w-full max-w-[860px] overflow-hidden bg-[#FDFCF9] md:grid-cols-2"
          >
            <img src="/looks/promo/lead-summer.webp" alt="" className="aspect-[4/3] h-full w-full object-cover md:aspect-auto" />
            <div className="flex flex-col justify-center p-8 md:p-10">
              <p className={`text-[11px] font-semibold ${capsCls(isAr)}`} style={{ color: '#B03A2E' }}>{t('Limited time', 'لفترة محدودة')}</p>
              <p className={`mt-4 text-[28px] font-extrabold leading-tight md:text-[34px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`}>
                {t('Summer sale — up to 40% off sofas', 'عروض الصيف — خصم حتى 40% على الأرائك')}
              </p>
              <p className="mt-4 text-[15px] font-light leading-relaxed text-[#4A443C]">
                {t('While stock lasts. Delivery and installation included.', 'حتى نفاد الكمية. التوصيل والتركيب مشمولان.')}
              </p>
              <Link to={searchPath(1, { sale: true })} onClick={() => setOpen(false)} data-testid="promo-popup-cta" className={`mt-8 self-start px-9 py-4 ${primaryBtnCls(isAr)}`}>
                {t('Shop the Sale', 'تسوق العروض')}
              </Link>
            </div>
            <button
              type="button"
              data-testid="promo-popup-close"
              onClick={() => setOpen(false)}
              aria-label={t('Close', 'إغلاق')}
              className="absolute end-3 top-3 flex h-10 w-10 items-center justify-center bg-white/90 text-[#171512] transition-colors hover:bg-[#171512] hover:text-white"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/* Side contact — a designer, or WhatsApp                               */
/* ------------------------------------------------------------------ */

/** WhatsApp's mark (lucide has none). */
function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.17-3.48-8.4z" />
    </svg>
  );
}

/**
 * Two ways to a person, where the look switcher used to hang: Diyar's own
 * designer (a chat with the design team — not the AI tool), and
 * WhatsApp. Icons at rest; the label slides out on hover or focus.
 */
export function SideContact() {
  const { lang, t } = useLook();
  const phone = FOOTER_LINKS.phone.replace(/[^0-9]/g, '');
  const hello = encodeURIComponent(t('Hello Diyar, I have a question.', 'مرحباً ديار، لدي استفسار.'));
  const item = 'group/sc flex h-11 items-center overflow-hidden text-white shadow-[0_10px_26px_rgba(23,21,18,0.22)] md:h-12';
  const icon = 'flex h-11 w-11 shrink-0 items-center justify-center md:h-12 md:w-12';
  const label = `max-w-0 whitespace-nowrap text-[12px] font-medium opacity-0 transition-all duration-300 group-hover/sc:max-w-[180px] group-hover/sc:pl-1.5 group-hover/sc:pr-5 group-hover/sc:opacity-100 group-focus-visible/sc:max-w-[180px] group-focus-visible/sc:pl-1.5 group-focus-visible/sc:pr-5 group-focus-visible/sc:opacity-100 ${
    lang === 'ar' ? '' : 'uppercase tracking-[0.12em] text-[11px]'
  }`;
  return (
    <div dir="ltr" className="fixed left-0 top-1/2 z-[45] flex -translate-y-1/2 flex-col items-start gap-1.5" data-testid="side-contact">
      {/* the same conversation the AI designer's "chat with a designer" opens: Diyar's own designer */}
      <Link
        to={`${lookBase(1)}/chat?with=diyar-designer`}
        data-testid="side-designer"
        aria-label={t('Consult a designer', 'استشر مصمم')}
        className={`${item} border border-s-0 border-white/15 bg-[#171512] transition-colors hover:bg-[#5A6B4D]`}
      >
        <span className={icon}><PencilRuler size={19} strokeWidth={1.5} /></span>
        <span className={label} dir={lang === 'ar' ? 'rtl' : 'ltr'}>{t('Consult a designer', 'استشر مصمم')}</span>
      </Link>
      <a
        data-testid="side-whatsapp"
        aria-label={t('WhatsApp', 'واتساب')}
        href={`https://wa.me/${phone}?text=${hello}`}
        target="_blank"
        rel="noreferrer"
        className={`${item} bg-[#25D366] transition-colors hover:bg-[#1EBE5A]`}
      >
        <span className={icon}><WhatsAppIcon size={21} /></span>
        <span className={label} dir={lang === 'ar' ? 'rtl' : 'ltr'}>{t('WhatsApp', 'واتساب')}</span>
      </a>
    </div>
  );
}
