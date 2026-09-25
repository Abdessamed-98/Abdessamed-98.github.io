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
import { ArrowRight, MessageSquareText, Phone, Sparkles, X, MessageSquare } from 'lucide-react';
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
          <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-center gap-4 px-10 text-[11.5px]">
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
                <Link to={it.to} className={`hidden shrink-0 items-center gap-1.5 border-b border-white/40 pb-px font-medium hover:border-white sm:inline-flex ${capsCls(isAr)} text-[10px]`}>
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
              <p className={`text-[10px] font-semibold ${capsCls(isAr)}`} style={{ color: '#B03A2E' }}>{t('Limited time', 'لفترة محدودة')}</p>
              <p className={`mt-4 text-[28px] font-extrabold leading-tight md:text-[34px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`}>
                {t('Summer sale — up to 40% off sofas', 'عروض الصيف — خصم حتى 40% على الأرائك')}
              </p>
              <p className="mt-4 text-[14px] font-light leading-relaxed text-[#4A443C]">
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
