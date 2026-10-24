/**
 * Look 1 — «طلب تنفيذ»: the request form from the original site, in Look 1's
 * dress. The visitor says what they want done, picks (or arrives with) the
 * category and subcategory, adds a budget and photos, and Diyar matches a
 * partner. Opened from service cards, the category pages, the catalogue and
 * the provider pages, each of which presets what it already knows.
 */
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Check, ImagePlus, X } from 'lucide-react';
import { SERVICES } from '../lookShared';
import { HAIR, OLIVE, TILE, primaryBtnCls, useLook } from './ui';
import { Sheet } from './Sheet';

/** What the opener already knows: a category (SERVICES[i].en), a subcategory key, a named service/provider. */
export interface ServicePreset {
  category?: string;
  /** kept for older callers; services have no subcategories */
  sub?: string;
  /** e.g. «تصميم داخلي — استوديو إيوان»: shown as the requested service */
  service?: string;
  /** «طلب خدمة»: a direct request to one chosen provider for one of their services —
   *  no category picking, the provider answers with a quote. Without it the form is
   *  «طلب تنفيذ»: an open request that the category's providers bid on. */
  direct?: boolean;
  provider?: string;
}

const CITIES = [
  { en: 'Jeddah', ar: 'جدة' },
  { en: 'Riyadh', ar: 'الرياض' },
  { en: 'Dammam', ar: 'الدمام' },
  { en: 'Makkah', ar: 'مكة' },
  { en: 'Madinah', ar: 'المدينة' },
  { en: 'Other', ar: 'أخرى' },
];

export function RequestServiceSheet({ open, onClose, preset }: { open: boolean; onClose: () => void; preset?: ServicePreset | string }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [sent, setSent] = useState(false);
  const p: ServicePreset = typeof preset === 'string' ? { service: preset } : preset ?? {};
  const [category, setCategory] = useState('');
  const [form, setForm] = useState({ details: '', budget: '', city: '', phone: '', date: '' });
  const direct = !!p.direct;
  const [photos, setPhotos] = useState<string[]>([]);
  const file = useRef<HTMLInputElement>(null);

  // reopening starts clean, with whatever the opener knew already picked
  useEffect(() => {
    if (!open) return;
    setSent(false);
    setCategory(p.category ?? '');
    setForm({ details: '', budget: '', city: '', phone: '', date: '' });
    setPhotos([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, p.category, p.service, p.direct, p.provider]);

  const field = 'h-12 w-full border bg-white px-4 text-[14px] outline-none transition-colors focus:border-[#171512]';
  const label = `mb-2 block text-[11px] ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.22em]'} text-neutral-500`;

  const addPhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const files: File[] = e.target.files ? Array.from(e.target.files as ArrayLike<File>).filter((f) => f.type.startsWith('image/')) : [];
    e.target.value = '';
    if (files.length) setPhotos((l) => [...l, ...files.map((f) => URL.createObjectURL(f))].slice(0, 6));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      side="center"
      testId="service-sheet"
      eyebrow={t('Diyar Services', 'خدمات ديار')}
      title={sent ? t('Request received', 'تم استلام الطلب') : direct ? t('Request service', 'طلب خدمة') : t('Request execution', 'طلب تنفيذ')}
    >
      {sent ? (
        <div className="px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center" style={{ backgroundColor: OLIVE }}>
            <Check size={22} strokeWidth={2} className="text-white" />
          </span>
          <p className="mt-6 text-[15px] font-light leading-relaxed text-neutral-700">
            {direct
              ? t(
                  `Thank you. ${p.provider ?? 'The provider'} will call you within one business day with a quote.`,
                  `شكراً لك. سيتواصل معك ${p.provider ?? 'مقدم الخدمة'} خلال يوم عمل واحد بعرض السعر.`,
                )
              : t(
                  'Thank you. Your request goes to the providers in this category, and their price offers will reach you here and by phone.',
                  'شكراً لك. سيصل طلبك إلى مقدمي الخدمات في هذا التصنيف، وستصلك عروض أسعارهم هنا وعلى جوالك.',
                )}
          </p>
          <button type="button" onClick={onClose} className={`mt-8 px-10 py-4 ${primaryBtnCls(isAr)}`}>
            {t('Done', 'تم')}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="px-6 py-6" data-testid="request-form">
          {direct ? (
            <dl className="mb-5 grid gap-2 border px-4 py-3 text-[14px]" style={{ borderColor: HAIR, backgroundColor: TILE }} data-testid="request-service-name">
              <div className="flex items-baseline gap-2">
                <dt className="shrink-0 text-neutral-500">{t('Service', 'الخدمة')}:</dt>
                <dd className="font-bold">{p.service}</dd>
              </div>
              {p.provider && (
                <div className="flex items-baseline gap-2">
                  <dt className="shrink-0 text-neutral-500">{t('Provider', 'مقدم الخدمة')}:</dt>
                  <dd className="font-bold">{p.provider}</dd>
                </div>
              )}
            </dl>
          ) : p.service ? (
            <p className="mb-5 flex items-center gap-2 border px-4 py-3 text-[14px]" style={{ borderColor: HAIR, backgroundColor: TILE }} data-testid="request-service-name">
              <span className="text-neutral-500">{t('Service', 'الخدمة')}:</span>
              <span className="font-bold">{p.service}</span>
            </p>
          ) : null}

          {/* the category, then its subcategories — preset when the visitor came from one; not asked on a direct request */}
          {!direct && (
          <div>
            <label className={label} htmlFor="rs-category">{t('Category', 'تصنيف الخدمة')}</label>
            <select
              id="rs-category"
              data-testid="request-categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={field}
              style={{ borderColor: HAIR }}
            >
              <option value="">{t('Choose a category', 'اختر التصنيف')}</option>
              {SERVICES.map((s) => (
                <option key={s.en} value={s.en}>{t(s.en, s.ar)}</option>
              ))}
            </select>
          </div>
          )}
          <div className={direct ? '' : 'mt-5'}>
            <label className={label} htmlFor="rs-details">{direct ? t('Tell the provider about the job', 'أخبر مقدم الخدمة عن العمل') : t('What do you need done?', 'ما الذي تريد تنفيذه؟')}</label>
            <textarea
              id="rs-details"
              required
              rows={4}
              data-testid="request-details"
              placeholder={t('The space, its size, and what you have in mind…', 'المساحة وحجمها وما يدور في بالك… (مثال: صالة 20 م² أريد تصميمها وتأثيثها)')}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className="w-full resize-none border bg-white p-4 text-[14.5px] outline-none transition-colors focus:border-[#171512]"
              style={{ borderColor: HAIR }}
            />
          </div>

          {/* photos of the space, if they have them */}
          <div className="mt-4">
            <p className={label}>{t('Photos of the space (optional)', 'صور المكان (اختياري)')}</p>
            <div className="flex flex-wrap gap-2">
              {photos.map((src, i) => (
                <span key={src} className="relative h-16 w-16 overflow-hidden border" style={{ borderColor: HAIR }}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button type="button" aria-label={t('Remove', 'إزالة')} onClick={() => setPhotos((l) => l.filter((_, k) => k !== i))} className="absolute end-0.5 top-0.5 flex h-5 w-5 items-center justify-center bg-white/90">
                    <X size={11} strokeWidth={2} />
                  </button>
                </span>
              ))}
              {photos.length < 6 && (
                <button type="button" onClick={() => file.current?.click()} data-testid="request-photos" className="flex h-16 w-16 flex-col items-center justify-center gap-1 border border-dashed text-neutral-500 transition-colors hover:border-[#171512] hover:text-[#171512]" style={{ borderColor: '#C9C2B4' }}>
                  <ImagePlus size={16} strokeWidth={1.5} />
                  <span className="text-[10px]">{t('Add', 'إضافة')}</span>
                </button>
              )}
              <input ref={file} type="file" accept="image/*" multiple className="hidden" onChange={addPhotos} />
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {direct ? (
              <div>
                <label className={label} htmlFor="rs-date">{t('Preferred visit date', 'موعد الزيارة المفضل')}</label>
                <input id="rs-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={field} style={{ borderColor: HAIR }} />
              </div>
            ) : (
              <div>
                <label className={label} htmlFor="rs-budget">{t('Budget (optional)', 'الميزانية (اختياري)')}</label>
                <input id="rs-budget" placeholder={t('e.g. 5,000 – 8,000', 'مثال: 5,000 – 8,000')} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={field} style={{ borderColor: HAIR }} />
              </div>
            )}
            <div>
              <label className={label} htmlFor="rs-city">{t('City', 'المدينة')}</label>
              <select id="rs-city" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={field} style={{ borderColor: HAIR }}>
                <option value="" disabled>{t('Choose', 'اختر')}</option>
                {CITIES.map((c) => (
                  <option key={c.en} value={c.en}>{t(c.en, c.ar)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="rs-phone">{t('Phone', 'رقم الجوال')}</label>
              <input id="rs-phone" required dir="ltr" inputMode="tel" placeholder="05X XXX XXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`${field} text-start`} style={{ borderColor: HAIR }} />
            </div>
          </div>

          <button type="submit" data-testid="service-submit" className={`mt-6 w-full py-4 ${primaryBtnCls(isAr)}`}>
            {t('Send request', 'إرسال الطلب')}
          </button>
          <p className="mt-3 text-center text-[13px] font-light text-neutral-500">
            {direct
              ? t(`A quote from ${p.provider ?? 'the provider'} within one business day · no obligation`, `عرض سعر من ${p.provider ?? 'مقدم الخدمة'} خلال يوم عمل · دون التزام`)
              : t('Free · price offers from the providers in this category · no obligation', 'مجاناً · عروض أسعار من مقدمي الخدمات في التصنيف · دون التزام')}
          </p>
        </form>
      )}
    </Sheet>
  );
}
