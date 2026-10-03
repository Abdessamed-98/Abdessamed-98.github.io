/**
 * Look 1 — sign in, register, verify, reset.
 *
 * A sheet rather than a page: signing in is something you do in the middle of
 * something else. The original site's four views are here — sign in, register
 * (with the account type: customer, store, service provider or affiliate), the
 * phone verification code, and a forgotten password — and every field arrives
 * filled in: this is a demo, nobody should type credentials to see a design.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ShoppingBag, Store, Wrench, Megaphone, ArrowRight } from 'lucide-react';
import { FIELD, HAIR, MUTED, OLIVE, primaryBtnCls, useLook } from './ui';
import { Sheet } from './Sheet';
import { TextField, capsCls } from './kit';
import type { AuthIntent, AuthRole } from './shellContext';

type View = 'in' | 'up' | 'otp' | 'forgot' | 'reset';
type Role = AuthRole;

const DEMO = { phone: '0551234567', password: 'diyar1234', code: '4827' };

export function AuthSheet({
  open,
  onClose,
  onSignIn,
  onNotice,
  intent,
}: {
  open: boolean;
  onClose: () => void;
  onSignIn: (name: string) => void;
  onNotice?: (message: string) => void;
  intent?: AuthIntent;
}) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [view, setView] = useState<View>('in');
  const [role, setRole] = useState<Role>('customer');
  const [after, setAfter] = useState<'register' | 'reset'>('register');
  const [form, setForm] = useState({ name: '', phone: DEMO.phone, password: DEMO.password, code: DEMO.code, next: 'diyar5678' });

  useEffect(() => {
    if (!open) return;
    setView(intent?.view ?? 'in');
    setRole(intent?.role ?? 'customer');
    setForm({ name: t('Abdullah Al-Harbi', 'عبدالله الحربي'), phone: DEMO.phone, password: DEMO.password, code: DEMO.code, next: 'diyar5678' });
  }, [open, t, intent]);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (view === 'in') {
      onSignIn(form.name.trim() || t('Guest', 'ضيف'));
      onClose();
    } else if (view === 'up') {
      setAfter('register');
      setView('otp');
    } else if (view === 'forgot') {
      setAfter('reset');
      setView('otp');
    } else if (view === 'otp') {
      if (after === 'register') {
        onSignIn(form.name.trim() || t('Guest', 'ضيف'));
        onClose();
        if (role !== 'customer') {
          onNotice?.(t('Account created — your partner dashboard is being set up.', 'تم إنشاء الحساب — جاري تجهيز لوحة الشريك.'));
        }
      } else {
        setView('reset');
      }
    } else if (view === 'reset') {
      setView('in');
      onNotice?.(t('Password updated — sign in with the new one.', 'تم تحديث كلمة المرور — سجّل دخولك بالجديدة.'));
    }
  };

  const titles: Record<View, string> = {
    in: t('Sign In', 'تسجيل الدخول'),
    up: t('Create Account', 'إنشاء حساب'),
    otp: t('Verify Your Number', 'تأكيد رقم الجوال'),
    forgot: t('Forgot Password', 'نسيت كلمة المرور'),
    reset: t('New Password', 'كلمة مرور جديدة'),
  };
  const cta: Record<View, string> = {
    in: t('Sign In', 'تسجيل الدخول'),
    up: t('Continue', 'متابعة'),
    otp: t('Verify', 'تأكيد'),
    forgot: t('Send Code', 'إرسال الرمز'),
    reset: t('Save Password', 'حفظ كلمة المرور'),
  };

  const roles: { key: Role; icon: typeof Store; title: string; line: string }[] = [
    { key: 'customer', icon: ShoppingBag, title: t('Customer', 'عميل'), line: t('Shop and book services', 'تسوّق واطلب الخدمات') },
    { key: 'store', icon: Store, title: t('Store', 'تاجر'), line: t('Sell your products', 'اعرض منتجاتك وبِعها') },
    { key: 'provider', icon: Wrench, title: t('Service provider', 'مقدم خدمة'), line: t('Take on jobs nearby', 'استقبل طلبات قريبة منك') },
    { key: 'affiliate', icon: Megaphone, title: t('Affiliate', 'مسوق'), line: t('Earn on every sale', 'اربح عمولة على كل بيع') },
  ];

  return (
    <Sheet open={open} onClose={onClose} side="center" testId="auth-sheet" eyebrow={t('Diyar Account', 'حساب ديار')} title={titles[view]}>
      <form onSubmit={submit} className="px-6 py-6" data-view={view}>
        {(view === 'in' || view === 'up') && (
          <div className="mb-6 flex border" style={{ borderColor: HAIR }}>
            {(['in', 'up'] as const).map((m) => (
              <button
                key={m}
                type="button"
                data-testid={`auth-mode-${m}`}
                onClick={() => setView(m)}
                aria-pressed={view === m}
                className={`flex-1 py-3 text-[11.5px] font-medium transition-colors ${capsCls(isAr)} ${
                  view === m ? 'bg-[#171512] text-white' : 'hover:text-[#171512]'
                }`}
                style={view === m ? undefined : { color: MUTED }}
              >
                {m === 'in' ? t('Sign In', 'تسجيل الدخول') : t('Register', 'حساب جديد')}
              </button>
            ))}
          </div>
        )}

        {view === 'up' && (
          <fieldset className="mb-6">
            <legend className={`mb-3 text-[11.5px] font-medium ${capsCls(isAr)}`} style={{ color: MUTED }}>
              {t('I am joining as', 'أنضم بصفتي')}
            </legend>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {roles.map((r) => {
                const on = role === r.key;
                return (
                  <button
                    key={r.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    data-testid={`auth-role-${r.key}`}
                    onClick={() => setRole(r.key)}
                    className="flex items-start gap-3 border p-3 text-start transition-colors"
                    style={{ borderColor: on ? '#171512' : FIELD, backgroundColor: on ? '#F6F3EC' : '#FFFFFF' }}
                  >
                    <r.icon size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: on ? OLIVE : MUTED }} />
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold">{r.title}</span>
                      <span className="mt-0.5 block text-[13px] font-light leading-snug" style={{ color: MUTED }}>
                        {r.line}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <div className="grid gap-5">
          {view === 'up' && <TextField id="au-name" label={t('Full name', 'الاسم الكامل')} value={form.name} onChange={set('name')} required />}
          {(view === 'in' || view === 'up' || view === 'forgot') && (
            <TextField id="au-phone" label={t('Phone', 'رقم الجوال')} value={form.phone} onChange={set('phone')} ltr inputMode="tel" required />
          )}
          {(view === 'in' || view === 'up') && (
            <TextField id="au-pass" label={t('Password', 'كلمة المرور')} value={form.password} onChange={set('password')} type="password" required />
          )}
          {view === 'otp' && (
            <div>
              <p className="mb-5 text-[14.5px] font-light leading-relaxed" style={{ color: '#4A443C' }}>
                {t(`We sent a 4-digit code to ${form.phone}.`, `أرسلنا رمزاً من 4 أرقام إلى ${form.phone}.`)}
              </p>
              <CodeInput value={form.code} onChange={set('code')} />
              <button
                type="button"
                onClick={() => onNotice?.(t('A new code is on its way.', 'تم إرسال رمز جديد.'))}
                className="mt-4 text-[13px] underline-offset-4 hover:underline"
                style={{ color: MUTED }}
              >
                {t('Resend code in 0:42', 'إعادة الإرسال خلال 0:42')}
              </button>
            </div>
          )}
          {view === 'reset' && (
            <TextField id="au-next" label={t('New password', 'كلمة المرور الجديدة')} value={form.next} onChange={set('next')} type="password" required />
          )}
          {view === 'forgot' && (
            <p className="text-[14.5px] font-light leading-relaxed" style={{ color: '#4A443C' }}>
              {t('Enter the number on your account and we will text you a code.', 'أدخل الرقم المسجل في حسابك وسنرسل لك رمزاً.')}
            </p>
          )}
        </div>

        <button type="submit" data-testid="auth-submit" className={`mt-6 flex w-full items-center justify-center gap-2 py-4 ${primaryBtnCls(isAr)}`}>
          {cta[view]}
          {view === 'up' && <ArrowRight size={13} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />}
        </button>

        {view === 'in' && (
          <button
            type="button"
            data-testid="auth-forgot"
            onClick={() => setView('forgot')}
            className="mt-4 block w-full text-center text-[13px] underline-offset-4 hover:underline"
            style={{ color: MUTED }}
          >
            {t('Forgot your password?', 'نسيت كلمة المرور؟')}
          </button>
        )}
        {(view === 'otp' || view === 'forgot' || view === 'reset') && (
          <button
            type="button"
            onClick={() => setView('in')}
            className="mt-4 block w-full text-center text-[13px] underline-offset-4 hover:underline"
            style={{ color: MUTED }}
          >
            {t('Back to sign in', 'العودة لتسجيل الدخول')}
          </button>
        )}

        <p className="mt-6 flex items-center justify-center gap-2 border-t pt-5 text-[13px]" style={{ borderColor: HAIR, color: MUTED }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: OLIVE }} />
          {t('Demo — details are filled in and nothing is sent.', 'عرض توضيحي — البيانات معبأة ولا يُرسل شيء.')}
        </p>
      </form>
    </Sheet>
  );
}

/** Four boxes that behave like one field: type, paste, backspace across them. */
function CodeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useLook();
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(4, ' ').slice(0, 4).split('');

  const put = (i: number, d: string) => {
    const next = digits.map((c, j) => (j === i ? d : c)).join('').replace(/ /g, '');
    onChange(next);
  };

  return (
    <div className="flex gap-3" dir="ltr" data-testid="auth-code">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          aria-label={t(`Digit ${i + 1}`, `الرقم ${i + 1}`)}
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(-1);
            put(i, v || ' ');
            if (v) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !d.trim()) refs.current[i - 1]?.focus();
          }}
          onPaste={(e) => {
            const v = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
            if (v) {
              e.preventDefault();
              onChange(v);
            }
          }}
          className="h-14 w-14 border bg-white text-center font-['Outfit',sans-serif] text-[22px] font-bold outline-none focus:border-[#171512] focus:ring-1 focus:ring-[#171512]"
          style={{ borderColor: FIELD }}
        />
      ))}
    </div>
  );
}
