/**
 * Look 1's one overlay shell — every drawer and dialog in this look is built on
 * it, so they cannot drift apart the way the original site's five overlays did
 * (three corner radii, four different close buttons).
 *
 * Sharp corners, hairline border, cream ground, dark blurred backdrop. Slides
 * from the start or end edge, or sits centred as a dialog. Escape closes it,
 * the page behind it cannot scroll, focus is trapped inside and returns to
 * whatever opened it.
 */
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { HAIR, INK, useLook } from './ui';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Sheet({
  open,
  onClose,
  side = 'end',
  eyebrow,
  title,
  children,
  footer,
  testId,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  /** 'end' and 'start' slide in from that edge; 'center' is a plain dialog */
  side?: 'start' | 'end' | 'center';
  eyebrow?: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  testId?: string;
  wide?: boolean;
}) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;

    const { overflow, paddingInlineEnd } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingInlineEnd = `${gap}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    const id = window.setTimeout(() => {
      const target = panel.current?.querySelector<HTMLElement>(FOCUSABLE);
      (target ?? panel.current)?.focus();
    }, 60);

    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(id);
      document.body.style.overflow = overflow;
      document.body.style.paddingInlineEnd = paddingInlineEnd;
      opener.current?.focus?.();
    };
  }, [open, onClose]);

  // The sheet is portalled onto <body>, outside the look's dir="rtl" wrapper, so it
  // carries its own direction — otherwise 'end' resolves to the wrong edge and the
  // drawer slides in from the side the visitor is not looking at.
  const centred = side === 'center';
  // the drawer edge is logical: 'end' is the left in Arabic, the right in English
  const edge = centred ? '' : side === 'end' ? 'end-0' : 'start-0';
  const slideFrom = centred ? 0 : (side === 'end') === isAr ? '-100%' : '100%';

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" dir={isAr ? 'rtl' : 'ltr'} data-testid={testId}>
          <motion.div
            className="absolute inset-0 bg-[#171512]/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={centred ? { opacity: 0, y: 24 } : { x: slideFrom }}
            animate={centred ? { opacity: 1, y: 0 } : { x: 0 }}
            exit={centred ? { opacity: 0, y: 24 } : { x: slideFrom }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={
              centred
                ? `absolute inset-x-4 top-1/2 mx-auto -translate-y-1/2 flex max-h-[86vh] flex-col border bg-[#FDFCF9] shadow-[0_30px_90px_rgba(23,21,18,0.35)] outline-none ${
                    wide ? 'max-w-3xl' : 'max-w-lg'
                  }`
                : `absolute inset-y-0 ${edge} flex w-full flex-col border-s bg-[#FDFCF9] shadow-[0_0_80px_rgba(23,21,18,0.3)] outline-none ${
                    wide ? 'max-w-[560px]' : 'max-w-[440px]'
                  }`
            }
            style={{ borderColor: HAIR }}
          >
            <header className="flex items-start justify-between gap-4 border-b px-6 py-5" style={{ borderColor: HAIR }}>
              <div className="min-w-0">
                {eyebrow && (
                  <p
                    className={`text-[10px] uppercase ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`}
                    style={{ color: '#8C8578' }}
                  >
                    {eyebrow}
                  </p>
                )}
                <h2
                  className={`mt-1.5 font-bold ${
                    isAr ? "font-['Alexandria',sans-serif] text-[17px] tracking-normal" : "font-['Outfit',sans-serif] text-[15px] uppercase tracking-[0.16em]"
                  }`}
                  style={{ color: INK }}
                >
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                data-testid="sheet-close"
                aria-label={t('Close', 'إغلاق')}
                className="flex h-10 w-10 shrink-0 items-center justify-center border transition-colors hover:bg-[#171512] hover:text-white"
                style={{ borderColor: HAIR }}
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </header>

            <div className="scrollbar-hide flex-1 overflow-y-auto overscroll-contain">{children}</div>

            {footer && (
              <footer className="border-t px-6 py-5" style={{ borderColor: HAIR }}>
                {footer}
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
