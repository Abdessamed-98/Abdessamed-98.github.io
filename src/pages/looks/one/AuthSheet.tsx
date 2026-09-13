/**
 * Look 1 — sign in / create account.
 *
 * A sheet rather than a page: signing in is something you do in the middle of
 * something else, and sending the visitor to a separate screen loses whatever
 * they were doing.
 */
import { useEffect, useState, type FormEvent } from 'react';
import { HAIR, OLIVE, primaryBtnCls, useLook } from './ui';
import { Sheet } from './Sheet';

export function AuthSheet({
  open,
  onClose,
  onSignIn,
}: {
  open: boolean;
  onClose: () => void;
  onSignIn: (name: string) => void;
}) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [mode, setMode] = useState<'in' | 'up'>('in');
  // a demo account, filled in: nobody should type credentials to see a design
  const [form, setForm] = useState({ name: '', phone: '0551234567', password: 'diyar1234' });

  useEffect(() => {
    if (!open) return;
    setMode('in');
    setForm({ name: t('Abdullah Al-Harbi', 'عبدالله الحربي'), phone: '0551234567', password: 'diyar1234' });
  }, [open, t]);

  const field = 'h-12 w-full border bg-white px-4 text-[13px] outline-none transition-colors focus:border-[#171512]';
  const label = `mb-2 block text-[10px] ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.22em]'} text-neutral-500`;
  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSignIn(form.name.trim() || t('Guest', 'ضيف'));
    onClose();
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      side="center"
      testId="auth-sheet"
      eyebrow={t('Diyar Account', 'حساب ديار')}
      title={mode === 'in' ? t('Sign In', 'تسجيل الدخول') : t('Create Account', 'إنشاء حساب')}
    >
      <form onSubmit={submit} className="px-6 py-6">
        {/* mode switch */}
        <div className="flex border" style={{ borderColor: HAIR }}>
          {(['in', 'up'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`flex-1 py-3 text-[11px] font-medium transition-colors ${caps} ${
                mode === m ? 'bg-[#171512] text-white' : 'text-neutral-500 hover:text-[#171512]'
              }`}
            >
              {m === 'in' ? t('Sign In', 'تسجيل الدخول') : t('Register', 'حساب جديد')}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5">
          {mode === 'up' && (
            <div>
              <label className={label} htmlFor="au-name">{t('Full name', 'الاسم الكامل')}</label>
              <input
                id="au-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={field}
                style={{ borderColor: HAIR }}
              />
            </div>
          )}
          <div>
            <label className={label} htmlFor="au-phone">{t('Phone', 'رقم الجوال')}</label>
            <input
              id="au-phone"
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
            <label className={label} htmlFor="au-pass">{t('Password', 'كلمة المرور')}</label>
            <input
              id="au-pass"
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={field}
              style={{ borderColor: HAIR }}
            />
          </div>
        </div>

        <button type="submit" data-testid="auth-submit" className={`mt-6 w-full py-4 ${primaryBtnCls(isAr)}`}>
          {mode === 'in' ? t('Sign In', 'تسجيل الدخول') : t('Create Account', 'إنشاء حساب')}
        </button>

        {mode === 'in' && (
          <button
            type="button"
            className="mt-4 block w-full text-center text-[11px] font-light text-neutral-500 underline-offset-4 hover:underline"
          >
            {t('Forgot your password?', 'نسيت كلمة المرور؟')}
          </button>
        )}

        <p className="mt-6 border-t pt-5 text-center text-[11px] font-light leading-relaxed text-neutral-500" style={{ borderColor: HAIR }}>
          {t('By continuing you agree to Diyar’s terms and privacy policy.', 'بالمتابعة أنت توافق على شروط ديار وسياسة الخصوصية.')}
        </p>
        <p className="mt-3 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: OLIVE }} />
          {t('Demo only — no account is created.', 'عرض توضيحي — لا يتم إنشاء حساب فعلي.')}
        </p>
      </form>
    </Sheet>
  );
}
