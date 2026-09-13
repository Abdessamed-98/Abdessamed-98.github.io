/**
 * Look 1 — search by photograph.
 *
 * Upload a room or a piece, and the catalogue is searched for what is in it.
 * The matching is a demo: the picked file is shown back, then the visitor is
 * taken to the results the camera icon promises.
 */
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { searchPath } from '../lookShared';
import { HAIR, OLIVE, TILE, primaryBtnCls, useLook } from './ui';
import { Sheet } from './Sheet';

export function ImageSearchSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = (file?: File) => {
    if (!file) return;
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  };

  const search = () => {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      onClose();
      navigate(searchPath(1, { category: 'home' }));
    }, 900);
  };

  const reset = () => {
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
  };

  return (
    <Sheet
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      side="center"
      testId="image-search-sheet"
      eyebrow={t('Visual search', 'البحث بالصورة')}
      title={t('Search by Photo', 'ابحث بالصورة')}
    >
      <div className="px-6 py-6">
        <input
          ref={input}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => pick(e.target.files?.[0])}
        />

        {preview ? (
          <div>
            <div className="relative overflow-hidden border" style={{ borderColor: HAIR, backgroundColor: TILE }}>
              <img src={preview} alt="" className="max-h-[320px] w-full object-contain" />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="button"
                data-testid="image-search-go"
                onClick={search}
                disabled={busy}
                className={`inline-flex flex-1 items-center justify-center gap-2.5 py-4 ${primaryBtnCls(isAr)} disabled:opacity-70`}
              >
                {busy && <Loader2 size={14} className="animate-spin" />}
                {busy ? t('Searching…', 'جارٍ البحث…') : t('Find Similar', 'ابحث عن المشابه')}
              </button>
              <button
                type="button"
                onClick={() => input.current?.click()}
                className={`border-b pb-1 text-[11px] font-medium transition-colors hover:text-[#5A6B4D] ${
                  isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]'
                }`}
                style={{ borderColor: '#171512' }}
              >
                {t('Choose Another', 'اختر صورة أخرى')}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            data-testid="image-search-pick"
            onClick={() => input.current?.click()}
            className="flex w-full flex-col items-center justify-center border border-dashed px-6 py-16 text-center transition-colors hover:bg-[#F6F3EC]"
            style={{ borderColor: '#C8C1B4' }}
          >
            <span className="flex h-16 w-16 items-center justify-center border" style={{ borderColor: HAIR, backgroundColor: TILE }}>
              <Camera size={22} strokeWidth={1.25} style={{ color: OLIVE }} />
            </span>
            <span className="mt-5 text-[14px] font-bold">{t('Upload a photo', 'ارفع صورة')}</span>
            <span className="mt-2 max-w-xs text-[12px] font-light leading-relaxed text-neutral-500">
              {t(
                'A room, a piece you like, or a screenshot — we will look for the closest pieces in the catalogue.',
                'غرفة، أو قطعة أعجبتك، أو لقطة شاشة — سنبحث عن أقرب القطع في الكتالوج.',
              )}
            </span>
          </button>
        )}

        <ul className="mt-6 grid gap-2 border-t pt-5" style={{ borderColor: HAIR }}>
          {[
            { en: 'Photograph the whole piece, straight on', ar: 'صوّر القطعة كاملة من الأمام' },
            { en: 'Daylight beats a flash', ar: 'ضوء النهار أفضل من الفلاش' },
            { en: 'One piece per photo', ar: 'قطعة واحدة في كل صورة' },
          ].map((tip) => (
            <li key={tip.en} className="flex items-center gap-2.5 text-[11px] font-light text-neutral-500">
              <ImageIcon size={12} strokeWidth={1.5} style={{ color: OLIVE }} />
              {t(tip.en, tip.ar)}
            </li>
          ))}
        </ul>
      </div>
    </Sheet>
  );
}
