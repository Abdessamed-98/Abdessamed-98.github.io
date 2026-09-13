/**
 * Look 1 — the account area: orders, details, addresses, notifications.
 *
 * The original spreads these across eight routes. Here they are four panels
 * behind one index, because the content is thin and moving between them is the
 * point. The page opens with the numbers that matter — orders, saved pieces,
 * addresses, points — so it is not an empty shell with a list of links.
 *
 * Orders placed in this session are read back from the snapshots checkout
 * writes, and shown above the earlier ones.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, User, MapPin, Bell, LogOut, Check, Heart, Award, ChevronLeft } from 'lucide-react';
import { CATALOG, formatSAR, lookBase, productPath, searchPath } from '../lookShared';
import { Breadcrumb, HAIR, INK, MUTED, NIGHT, OLIVE, OLIVE_LT, TILE, primaryBtnCls, useLook } from './ui';
import { useShell } from './shellContext';
import { useWishlist } from '../../../context/WishlistContext';

type TabKey = 'orders' | 'profile' | 'addresses' | 'notifications';

interface SessionOrder {
  id: string;
  placedAt: string;
  total: number;
  lines: { name: string; qty: number; total: number }[];
}

/** Orders placed in this session, newest first. */
function sessionOrders(): SessionOrder[] {
  try {
    return Object.keys(sessionStorage)
      .filter((k) => k.startsWith('diyar-look1-order-'))
      .map((k) => JSON.parse(sessionStorage.getItem(k) ?? 'null') as SessionOrder)
      .filter(Boolean)
      .sort((a, b) => (a.placedAt < b.placedAt ? 1 : -1));
  } catch {
    return [];
  }
}

/** One order from before this session, so the page is never a blank slate. */
const PAST_ORDER: SessionOrder = {
  id: '418902',
  placedAt: '2026-08-14T10:12:00.000Z',
  total: 8_640,
  lines: [{ name: '', qty: 1, total: 8_640 }],
};

export default function AccountPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { user, signOut, openAuth, openWishlist } = useShell();
  const wishlist = useWishlist();
  const [tab, setTab] = useState<TabKey>('orders');
  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]';

  const tabs: { key: TabKey; icon: typeof Package; en: string; ar: string }[] = [
    { key: 'orders', icon: Package, en: 'Orders', ar: 'الطلبات' },
    { key: 'profile', icon: User, en: 'Details', ar: 'البيانات' },
    { key: 'addresses', icon: MapPin, en: 'Addresses', ar: 'العناوين' },
    { key: 'notifications', icon: Bell, en: 'Notifications', ar: 'الإشعارات' },
  ];

  if (!user) {
    return (
      <main className="pt-[72px]">
        <div className="mx-auto max-w-[560px] px-6 py-24 text-center md:px-10">
          <p className={`text-[11px] ${caps}`} style={{ color: MUTED }}>{t('Account', 'الحساب')}</p>
          <h1
            className={`mt-4 font-extrabold ${
              isAr
                ? "font-['Alexandria',sans-serif] text-3xl leading-[1.2] tracking-normal"
                : "font-['Outfit',sans-serif] text-3xl uppercase leading-[1.05] tracking-tight"
            }`}
          >
            {t('Sign in to Diyar', 'سجّل دخولك إلى ديار')}
          </h1>
          <p className="mt-5 text-[15px] font-light leading-relaxed" style={{ color: '#4A443C' }}>
            {t(
              'Your orders, addresses and saved pieces live in your account.',
              'طلباتك وعناوينك وقطعك المحفوظة موجودة في حسابك.',
            )}
          </p>
          <button type="button" data-testid="account-signin" onClick={openAuth} className={`mt-8 px-10 py-4 ${primaryBtnCls(isAr)}`}>
            {t('Sign In', 'تسجيل الدخول')}
          </button>
        </div>
      </main>
    );
  }

  const orders = [...sessionOrders(), PAST_ORDER];
  const stats = [
    { icon: Package, label: t('Orders', 'الطلبات'), value: String(orders.length) },
    { icon: Heart, label: t('Saved', 'المحفوظات'), value: String(wishlist.count), onClick: openWishlist },
    { icon: MapPin, label: t('Addresses', 'العناوين'), value: '2' },
    { icon: Award, label: t('Points', 'النقاط'), value: '1,240' },
  ];

  return (
    <main className="pt-[72px]">
      {/* identity band */}
      <div style={{ backgroundColor: NIGHT }}>
        <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-10 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={`text-[11px] ${caps}`} style={{ color: OLIVE_LT }}>{t('Welcome back', 'أهلاً بعودتك')}</p>
              <h1
                className={`mt-4 font-extrabold text-white ${
                  isAr
                    ? "font-['Alexandria',sans-serif] text-3xl leading-[1.15] tracking-normal md:text-5xl"
                    : "font-['Outfit',sans-serif] text-3xl uppercase leading-[1.02] tracking-tight md:text-5xl"
                }`}
              >
                {user}
              </h1>
            </div>
            <button
              type="button"
              data-testid="account-signout"
              onClick={signOut}
              className={`inline-flex items-center gap-2.5 border-b pb-1.5 text-[11px] font-medium text-white/80 transition-colors hover:text-white ${caps}`}
              style={{ borderColor: 'rgba(255,255,255,0.5)' }}
            >
              <LogOut size={13} strokeWidth={1.5} />
              {t('Sign Out', 'تسجيل الخروج')}
            </button>
          </div>

          {/* the numbers */}
          <ul className="mt-10 grid grid-cols-2 gap-px md:grid-cols-4" style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}>
            {stats.map((s) => (
              <li key={s.label} style={{ backgroundColor: NIGHT }}>
                {s.onClick ? (
                  <button type="button" onClick={s.onClick} className="flex w-full items-center gap-4 p-5 text-start transition-colors hover:bg-white/5">
                    <StatBody icon={s.icon} label={s.label} value={s.value} caps={caps} />
                  </button>
                ) : (
                  <div className="flex items-center gap-4 p-5">
                    <StatBody icon={s.icon} label={s.label} value={s.value} caps={caps} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* index */}
        <nav className="flex flex-wrap gap-x-8 gap-y-3 border-b pt-8" style={{ borderColor: HAIR }} aria-label={t('Account sections', 'أقسام الحساب')}>
          {tabs.map((item) => {
            const on = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                aria-current={on ? 'page' : undefined}
                data-testid={`account-tab-${item.key}`}
                className={`-mb-px flex items-center gap-2.5 border-b-2 pb-4 text-[12px] font-bold transition-colors ${caps}`}
                style={{ borderColor: on ? INK : 'transparent', color: on ? INK : MUTED }}
              >
                <item.icon size={15} strokeWidth={1.5} style={{ color: on ? OLIVE : MUTED }} />
                {t(item.en, item.ar)}
              </button>
            );
          })}
        </nav>

        <section className="py-10 md:py-14">
          {tab === 'orders' && (
            <ul className="grid gap-5">
              {orders.map((o, idx) => {
                const fresh = idx < orders.length - 1;
                return (
                  <li key={o.id} className="border" style={{ borderColor: HAIR }}>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5" style={{ borderColor: HAIR, backgroundColor: TILE }}>
                      <div>
                        <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('Order', 'طلب')}</p>
                        <p className="mt-1.5 font-['Outfit',sans-serif] text-[18px] font-bold">#{o.id}</p>
                      </div>
                      <span className="flex items-center gap-2 text-[11px] font-semibold" style={{ color: OLIVE }}>
                        <Check size={14} strokeWidth={2} />
                        {fresh ? t('Confirmed', 'مؤكد') : t('Delivered', 'تم التسليم')}
                      </span>
                      <div className="text-end">
                        <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('Total', 'الإجمالي')}</p>
                        <p className="mt-1.5 font-['Outfit',sans-serif] text-[18px] font-bold tabular-nums">
                          {formatSAR(o.total)} <span className="text-[11px] font-medium" style={{ color: MUTED }}>{t('SAR', 'ر.س')}</span>
                        </p>
                      </div>
                    </div>

                    <ul className="divide-y" style={{ borderColor: HAIR }}>
                      {o.lines.map((l, i) => {
                        // the seeded order has no name of its own: borrow a catalogue piece
                        const fallback = CATALOG[(i + 3) % CATALOG.length];
                        const name = l.name || t(fallback.name.en, fallback.name.ar);
                        return (
                          <li key={i} className="flex items-center gap-4 px-6 py-4">
                            <img src={fallback.img} alt="" className="h-14 w-12 shrink-0 object-cover" style={{ backgroundColor: TILE }} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-bold">{name}</span>
                              <span className="mt-1 block text-[11px] font-light" style={{ color: MUTED }}>
                                {t('Qty', 'الكمية')} {l.qty}
                              </span>
                            </span>
                            <span className="font-['Outfit',sans-serif] text-[13px] font-bold tabular-nums">{formatSAR(l.total)}</span>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="flex flex-wrap items-center gap-6 px-6 py-4">
                      <Link
                        to={productPath(1, CATALOG[0].id)}
                        className={`inline-flex items-center gap-2 border-b pb-1 text-[11px] font-medium transition-colors hover:text-[#5A6B4D] ${caps}`}
                        style={{ borderColor: INK }}
                      >
                        {t('Buy Again', 'اطلبه مجدداً')}
                        <ChevronLeft size={12} strokeWidth={1.5} className={isAr ? '' : 'rotate-180'} />
                      </Link>
                      <button type="button" className={`text-[11px] font-medium transition-colors hover:text-[#171512] ${caps}`} style={{ color: MUTED }}>
                        {t('Track Order', 'تتبّع الطلب')}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {tab === 'profile' && (
            <div className="grid gap-5 sm:grid-cols-2 lg:max-w-3xl">
              <Detail label={t('Full name', 'الاسم الكامل')} value={user} />
              <Detail label={t('Phone', 'رقم الجوال')} value="0551234567" ltr />
              <Detail label={t('Email', 'البريد الإلكتروني')} value="abdullah@example.com" ltr />
              <Detail label={t('City', 'المدينة')} value={t('Jeddah', 'جدة')} />
            </div>
          )}

          {tab === 'addresses' && (
            <ul className="grid gap-5 sm:grid-cols-2 lg:max-w-3xl">
              {[
                { label: t('Home', 'المنزل'), line: t('Al Rawdah District, Jeddah 23434', 'حي الروضة، جدة 23434'), primary: true },
                { label: t('Work', 'العمل'), line: t('Tahlia Street, Al Khalidiyah, Jeddah', 'شارع التحلية، الخالدية، جدة'), primary: false },
              ].map((a) => (
                <li key={a.label} className="border p-6" style={{ borderColor: HAIR }}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[14px] font-bold">{a.label}</span>
                    {a.primary && (
                      <span className={`text-[10px] font-semibold ${caps}`} style={{ color: OLIVE }}>
                        {t('Default', 'الافتراضي')}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-[13px] font-light leading-relaxed" style={{ color: '#4A443C' }}>{a.line}</p>
                  <div className="mt-5 flex items-center gap-5">
                    <button type="button" className={`border-b pb-1 text-[11px] font-medium ${caps}`} style={{ borderColor: INK }}>
                      {t('Edit', 'تعديل')}
                    </button>
                    <button type="button" className={`text-[11px] font-medium transition-colors hover:text-[#B03A2E] ${caps}`} style={{ color: MUTED }}>
                      {t('Remove', 'حذف')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {tab === 'notifications' && (
            <ul className="border lg:max-w-3xl" style={{ borderColor: HAIR }}>
              {[
                { en: 'Order updates', ar: 'تحديثات الطلبات', hint: { en: 'Shipping, delivery and installation', ar: 'الشحن والتوصيل والتركيب' }, on: true },
                { en: 'Offers and new arrivals', ar: 'العروض والوصل حديثاً', hint: { en: 'Once a week, never more', ar: 'مرة واحدة أسبوعياً، لا أكثر' }, on: true },
                { en: 'Service reminders', ar: 'تذكيرات الخدمات', hint: { en: 'Visits and quotes', ar: 'الزيارات وعروض الأسعار' }, on: false },
              ].map((n, i) => (
                <li
                  key={n.en}
                  className={`flex items-center justify-between gap-6 px-6 py-5 ${i ? 'border-t' : ''}`}
                  style={{ borderColor: HAIR }}
                >
                  <span className="min-w-0">
                    <span className="block text-[14px] font-bold">{t(n.en, n.ar)}</span>
                    <span className="mt-1 block text-[12px] font-light" style={{ color: MUTED }}>{t(n.hint.en, n.hint.ar)}</span>
                  </span>
                  <Toggle on={n.on} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="pb-16">
          <Breadcrumb items={[{ label: t('Home', 'الرئيسية'), to: lookBase(1) }, { label: t('Account', 'الحساب') }]} />
        </div>
      </div>
    </main>
  );
}

function StatBody({ icon: Icon, label, value, caps }: { icon: typeof Package; label: string; value: string; caps: string }) {
  return (
    <>
      <Icon size={18} strokeWidth={1.4} className="shrink-0" style={{ color: OLIVE_LT }} />
      <span className="min-w-0">
        <span className={`block text-[10px] ${caps}`} style={{ color: 'rgba(246,243,236,0.6)' }}>{label}</span>
        <span className="mt-1 block font-['Outfit',sans-serif] text-[20px] font-bold tabular-nums text-white">{value}</span>
      </span>
    </>
  );
}

function Detail({ label, value, ltr = false }: { label: string; value: string; ltr?: boolean; key?: string }) {
  const { lang } = useLook();
  const isAr = lang === 'ar';
  return (
    <div className="border p-5" style={{ borderColor: HAIR, backgroundColor: TILE }}>
      <p className={`text-[10px] font-medium ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]'}`} style={{ color: MUTED }}>
        {label}
      </p>
      <p className="mt-2.5 text-[15px] font-medium" dir={ltr ? 'ltr' : undefined} style={{ color: INK }}>
        {value}
      </p>
    </div>
  );
}

/** Presentational only — this look demonstrates the design, not the backend. */
function Toggle({ on }: { on: boolean }) {
  const [state, setState] = useState(on);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={state}
      onClick={() => setState((s) => !s)}
      className="relative h-6 w-11 shrink-0 border transition-colors"
      style={{ borderColor: state ? OLIVE : '#C9C2B4', backgroundColor: state ? OLIVE : 'transparent' }}
    >
      <span
        className={`absolute top-1/2 block h-4 w-4 -translate-y-1/2 transition-all ${state ? 'start-[22px] bg-white' : 'start-1 bg-[#C9C2B4]'}`}
      />
    </button>
  );
}

/** kept for the empty state if the seeded order is ever removed */
export function EmptyOrders() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  return (
    <div className="border py-20 text-center" style={{ borderColor: HAIR }}>
      <p className="text-[15px] font-bold">{t('No orders yet', 'لا توجد طلبات بعد')}</p>
      <Link to={searchPath(1)} className={`mt-8 inline-block px-10 py-4 ${primaryBtnCls(isAr)}`}>
        {t('Browse the Catalogue', 'تصفّح الكتالوج')}
      </Link>
    </div>
  );
}
