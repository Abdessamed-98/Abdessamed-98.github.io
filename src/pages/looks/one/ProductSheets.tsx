/**
 * Look 1 — the product page's two sheets: "Try with AI" and "Share".
 *
 * Try with AI: a sample room (or your own photo), one press, and the piece set
 * into it — the result is the same draggable before / after the home page uses.
 * It is a demo: the sample room has a real "after"; your own photo gets the
 * product laid onto it, and the sheet says so.
 *
 * Share: the link, WhatsApp, X, email, and the phone's own share sheet where
 * there is one.
 */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Upload, Sparkles, Link2, Mail, Check, Smartphone } from 'lucide-react';
import { lookBase, type CatalogProduct } from '../lookShared';
import { HAIR, MUTED, OLIVE, TILE, primaryBtnCls, useLook } from './ui';
import { Sheet } from './Sheet';
import { BeforeAfter } from './BeforeAfter';
import { capsCls } from './kit';

export function TryAISheet({ open, onClose, p }: { open: boolean; onClose: () => void; p: CatalogProduct }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const [photo, setPhoto] = useState<string | null>(null);
  const [stage, setStage] = useState<'pick' | 'working' | 'done'>('pick');
  const file = useRef<HTMLInputElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (open) return;
    setStage('pick');
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, [open]);

  useEffect(() => () => {
    if (photo) URL.revokeObjectURL(photo);
  }, [photo]);

  const run = () => {
    setStage('working');
    timer.current = window.setTimeout(() => setStage('done'), 1600);
  };
  const before = photo ?? '/before.png';

  return (
    <Sheet open={open} onClose={onClose} side="center" wide testId="ai-sheet" eyebrow={t('Diyar AI', 'ديار الذكي')} title={t('See it in your room', 'شاهدها في غرفتك')}>
      <div className="px-6 py-6">
        {stage === 'done' ? (
          photo ? (
            <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: TILE }} data-testid="ai-result">
              <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <img src={p.img} alt={t(p.name.en, p.name.ar)} className="absolute bottom-[8%] left-1/2 w-[46%] -translate-x-1/2 mix-blend-multiply" />
            </div>
          ) : (
            <div data-testid="ai-result">
              <BeforeAfter
                before="/before.png"
                after="/after.png"
                beforeLabel={t('Your room', 'غرفتك')}
                afterLabel={t('With the piece', 'مع القطعة')}
                alt={t('The room before and after', 'الغرفة قبل وبعد')}
                className="aspect-[4/3] w-full"
              />
            </div>
          )
        ) : (
          <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: TILE }}>
            <img src={before} alt="" className={`absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 ${stage === 'working' ? 'blur-[2px] brightness-90' : ''}`} />
            {stage === 'working' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#171512]/30 text-white">
                <Sparkles size={22} strokeWidth={1.4} className="animate-pulse" />
                <span className={`text-[11.5px] font-medium ${caps}`}>{t('Placing the piece…', 'جاري وضع القطعة…')}</span>
                <span className="h-px w-40 overflow-hidden bg-white/25">
                  <motion.span className="block h-full w-full bg-white" style={{ transformOrigin: isAr ? 'right' : 'left' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, ease: 'easeOut' }} />
                </span>
              </div>
            )}
            <span className={`absolute start-4 top-4 bg-white/90 px-2.5 py-1 text-[11px] font-semibold ${caps}`}>
              {photo ? t('Your photo', 'صورتك') : t('Sample room', 'غرفة نموذجية')}
            </span>
          </div>
        )}

        <div className="mt-5 flex items-center gap-4 border p-3" style={{ borderColor: HAIR }}>
          <img src={p.img} alt="" className="h-14 w-14 shrink-0 object-contain p-1" style={{ backgroundColor: TILE }} />
          <span className="min-w-0 flex-1 truncate text-[14.5px] font-bold">{t(p.name.en, p.name.ar)}</span>
        </div>

        <input
          ref={file}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setPhoto(URL.createObjectURL(f));
            setStage('pick');
          }}
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {stage === 'done' ? (
            <button type="button" onClick={() => setStage('pick')} className={`h-12 border text-[11.5px] font-medium transition-colors hover:border-[#171512] ${caps}`} style={{ borderColor: HAIR }}>
              {t('Try another photo', 'جرّب صورة أخرى')}
            </button>
          ) : (
            <button
              type="button"
              data-testid="ai-upload"
              onClick={() => file.current?.click()}
              className={`inline-flex h-12 items-center justify-center gap-2 border text-[11.5px] font-medium transition-colors hover:border-[#171512] ${caps}`}
              style={{ borderColor: HAIR }}
            >
              <Upload size={14} strokeWidth={1.5} />
              {photo ? t('Change photo', 'تغيير الصورة') : t('Use my photo', 'استخدم صورتي')}
            </button>
          )}
          {stage === 'done' ? (
            <Link to={`${lookBase(1)}/ai-designer`} onClick={onClose} className={`inline-flex h-12 items-center justify-center gap-2 ${primaryBtnCls(isAr)}`}>
              <Sparkles size={14} strokeWidth={1.5} />
              {t('Design the whole room', 'صمّم الغرفة كاملة')}
            </Link>
          ) : (
            <button type="button" data-testid="ai-run" disabled={stage === 'working'} onClick={run} className={`inline-flex h-12 items-center justify-center gap-2 disabled:opacity-60 ${primaryBtnCls(isAr)}`}>
              <Sparkles size={14} strokeWidth={1.5} />
              {t('Place it', 'ضعها في الغرفة')}
            </button>
          )}
        </div>
        <p className="mt-4 text-center text-[13px]" style={{ color: MUTED }}>
          {t('Demo preview — photos stay on your device.', 'معاينة توضيحية — صورك تبقى على جهازك.')}
        </p>
      </div>
    </Sheet>
  );
}

export function ShareSheet({ open, onClose, title }: { open: boolean; onClose: () => void; title: string }) {
  const { lang, t } = useLook();
  const caps = capsCls(lang === 'ar');
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const text = encodeURIComponent(`${title} — ${url}`);
  const canNative = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard blocked — the field below is selectable */
    }
    setCopied(true);
  };

  const row = 'flex items-center gap-4 px-5 py-4 text-[13px] font-medium transition-colors hover:bg-[#F6F3EC]';
  return (
    <Sheet open={open} onClose={onClose} side="center" testId="share-sheet" eyebrow={title} title={t('Share', 'مشاركة')}>
      <div className="px-6 py-6">
        <div className="flex items-stretch border" style={{ borderColor: HAIR }}>
          <input readOnly value={url} dir="ltr" onFocus={(e) => e.currentTarget.select()} className="min-w-0 flex-1 bg-transparent px-4 text-[14px] outline-none" style={{ color: MUTED }} aria-label={t('Link', 'الرابط')} />
          <button type="button" data-testid="share-copy" onClick={copy} className={`inline-flex shrink-0 items-center gap-2 bg-[#171512] px-5 py-3.5 text-[11.5px] font-medium text-white ${caps}`}>
            {copied ? <Check size={13} strokeWidth={2} /> : <Link2 size={13} strokeWidth={1.5} />}
            {copied ? t('Copied', 'تم النسخ') : t('Copy', 'نسخ')}
          </button>
        </div>
        <ul className="mt-5 divide-y divide-[#E8E4DC] border" style={{ borderColor: HAIR }}>
          <li style={{ borderColor: HAIR }}>
            <a className={row} href={`https://wa.me/?text=${text}`} target="_blank" rel="noreferrer">
              <span className="flex h-8 w-8 items-center justify-center font-['Outfit',sans-serif] text-[13px] font-bold text-white" style={{ backgroundColor: '#25D366' }}>W</span>
              WhatsApp
            </a>
          </li>
          <li style={{ borderColor: HAIR }}>
            <a className={row} href={`https://x.com/intent/post?text=${text}`} target="_blank" rel="noreferrer">
              <span className="flex h-8 w-8 items-center justify-center bg-[#171512] font-['Outfit',sans-serif] text-[14px] font-bold text-white">X</span>
              X
            </a>
          </li>
          <li style={{ borderColor: HAIR }}>
            <a className={row} href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}>
              <span className="flex h-8 w-8 items-center justify-center border" style={{ borderColor: HAIR }}>
                <Mail size={14} strokeWidth={1.5} style={{ color: OLIVE }} />
              </span>
              {t('Email', 'البريد الإلكتروني')}
            </a>
          </li>
          {canNative && (
            <li style={{ borderColor: HAIR }}>
              <button type="button" className={`${row} w-full`} onClick={() => navigator.share({ title, url }).catch(() => {})}>
                <span className="flex h-8 w-8 items-center justify-center border" style={{ borderColor: HAIR }}>
                  <Smartphone size={14} strokeWidth={1.5} style={{ color: OLIVE }} />
                </span>
                {t('More options', 'خيارات أخرى')}
              </button>
            </li>
          )}
        </ul>
      </div>
    </Sheet>
  );
}
