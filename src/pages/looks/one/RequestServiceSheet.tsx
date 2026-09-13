/** Look 1 — request a service. A short form, then a plain confirmation. */
import { useEffect, useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { SERVICES } from '../lookShared';
import { HAIR, OLIVE, primaryBtnCls, useLook } from './ui';
import { Sheet } from './Sheet';

export function RequestServiceSheet({
  open,
  onClose,
  service,
}: {
  open: boolean;
  onClose: () => void;
  /** the service the visitor came from, if any */
  service?: string;
}) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', city: '', service: '', details: '' });

  // reopening for another service starts clean
  useEffect(() => {
    if (open) {
      setSent(false);
      setForm((f) => ({ ...f, service: service ?? '' }));
    }
  }, [open, service]);

  const field = 'h-12 w-full border bg-white px-4 text-[13px] outline-none transition-colors focus:border-[#171512]';
  const label = `mb-2 block text-[10px] ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.22em]'} text-neutral-500`;

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
      title={sent ? t('Request received', 'تم استلام الطلب') : t('Request a Visit', 'اطلب زيارة')}
    >
      {sent ? (
        <div className="px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center" style={{ backgroundColor: OLIVE }}>
            <Check size={22} strokeWidth={2} className="text-white" />
          </span>
          <p className="mt-6 text-[15px] font-light leading-relaxed text-neutral-700">
            {t(
              'Thank you. Our team will call you within one business day to arrange the visit.',
              'شكراً لك. سيتواصل فريقنا معك خلال يوم عمل واحد لتحديد موعد الزيارة.',
            )}
          </p>
          <button type="button" onClick={onClose} className={`mt-8 px-10 py-4 ${primaryBtnCls(isAr)}`}>
            {t('Done', 'تم')}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="px-6 py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="rs-name">{t('Full name', 'الاسم الكامل')}</label>
              <input
                id="rs-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={field}
                style={{ borderColor: HAIR }}
              />
            </div>
            <div>
              <label className={label} htmlFor="rs-phone">{t('Phone', 'رقم الجوال')}</label>
              <input
                id="rs-phone"
                required
                dir="ltr"
                inputMode="tel"
                placeholder="05X XXX XXXX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`${field} text-start`}
                style={{ borderColor: HAIR }}
              />
            </div>
            <div>
              <label className={label} htmlFor="rs-city">{t('City', 'المدينة')}</label>
              <input
                id="rs-city"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={field}
                style={{ borderColor: HAIR }}
              />
            </div>
            <div>
              <label className={label} htmlFor="rs-service">{t('Service', 'الخدمة')}</label>
              <select
                id="rs-service"
                required
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className={field}
                style={{ borderColor: HAIR }}
              >
                <option value="" disabled>
                  {t('Choose a service', 'اختر الخدمة')}
                </option>
                {SERVICES.map((s) => {
                  const name = t(s.en, s.ar);
                  return (
                    <option key={s.en} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className={label} htmlFor="rs-details">{t('About the space', 'عن المساحة')}</label>
            <textarea
              id="rs-details"
              rows={4}
              placeholder={t('Rooms, size, what you have in mind…', 'الغرف، المساحة، وما يدور في بالك…')}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className="w-full resize-none border bg-white p-4 text-[13px] outline-none transition-colors focus:border-[#171512]"
              style={{ borderColor: HAIR }}
            />
          </div>

          <button type="submit" data-testid="service-submit" className={`mt-6 w-full py-4 ${primaryBtnCls(isAr)}`}>
            {t('Send Request', 'إرسال الطلب')}
          </button>
          <p className="mt-3 text-center text-[11px] font-light text-neutral-500">
            {t('Free consultation · No obligation', 'استشارة مجانية · دون التزام')}
          </p>
        </form>
      )}
    </Sheet>
  );
}
