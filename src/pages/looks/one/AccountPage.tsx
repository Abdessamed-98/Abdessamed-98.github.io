/**
 * Look 1 — the account.
 *
 * The original spreads the account over nine routes (profile, orders, service
 * requests, reviews, notifications, notification settings, addresses, security,
 * language). Here they are sections of one page behind one index, each with its
 * own URL — /account/orders, /account/reviews … — so any of them can be linked
 * to, and moving between them never reloads the frame.
 *
 * The page opens on the numbers that matter (orders, saved, addresses, points),
 * and every section has a real action: track and rate an order, answer a quote,
 * write a review, add an address, change the password.
 */
import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Package, Heart, MapPin, Award, LogOut, Bell, Wrench, Star as StarIcon, ShieldCheck, Languages, Settings2,
  User as UserIcon, MessageSquare, Plus, Check, Smartphone, Monitor,
} from 'lucide-react';
import { CATALOG, formatSAR, lookBase, productPath, type Bi } from '../lookShared';
import { HAIR, INK, MUTED, NIGHT, OLIVE, OLIVE_LT, TILE, primaryBtnCls, useLook, Stars } from './ui';
import { useShell } from './shellContext';
import { useWishlist } from '../../../context/WishlistContext';
import { Sheet } from './Sheet';
import {
  Badge, EmptyState, RatingInput, StatusTimeline, Tabs, TextArea, TextField, Toggle, capsCls, displayCls, CONTAINER,
} from './kit';
import {
  DEMO_ORDERS, LOYALTY_POINTS, MY_REVIEWS, NOTIFICATIONS, ORDER_STEPS, PROVIDERS, REQUEST_STEPS, SERVICE_REQUESTS,
  type DemoOrder,
} from './data';

type Section = 'orders' | 'requests' | 'reviews' | 'notifications' | 'details' | 'addresses' | 'security' | 'language' | 'settings';

const SECTIONS: { key: Section; icon: typeof Package; label: Bi }[] = [
  { key: 'orders', icon: Package, label: { en: 'Orders', ar: 'الطلبات' } },
  { key: 'requests', icon: Wrench, label: { en: 'Service requests', ar: 'طلبات الخدمات' } },
  { key: 'reviews', icon: StarIcon, label: { en: 'Reviews', ar: 'التقييمات' } },
  { key: 'notifications', icon: Bell, label: { en: 'Notifications', ar: 'الإشعارات' } },
  { key: 'details', icon: UserIcon, label: { en: 'Details', ar: 'البيانات' } },
  { key: 'addresses', icon: MapPin, label: { en: 'Addresses', ar: 'العناوين' } },
  { key: 'security', icon: ShieldCheck, label: { en: 'Security', ar: 'الأمان' } },
  { key: 'language', icon: Languages, label: { en: 'Language', ar: 'اللغة' } },
  { key: 'settings', icon: Settings2, label: { en: 'Alerts', ar: 'التنبيهات' } },
];

const accountPath = (s?: Section) => `${lookBase(1)}/account${s && s !== 'orders' ? `/${s}` : ''}`;

interface SessionOrder {
  id: string;
  placedAt: string;
  total: number;
  lines: { name: string; qty: number; total: number }[];
}

/** Orders placed in this session, newest first (written by checkout). */
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

export default function AccountPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { user, signOut, openAuth } = useShell();
  const wishlist = useWishlist();
  const { section: raw } = useParams();
  const section: Section = SECTIONS.some((s) => s.key === raw) ? (raw as Section) : 'orders';
  const caps = capsCls(isAr);

  if (!user) {
    return (
      <main className="pt-[72px]">
        <div className="mx-auto max-w-[560px] px-6 py-24 text-center md:px-10">
          <p className={`text-[11px] ${caps}`} style={{ color: MUTED }}>{t('Account', 'الحساب')}</p>
          <h1 className={`mt-4 ${displayCls(isAr, 'lg')}`}>{t('Sign in to Diyar', 'سجّل دخولك إلى ديار')}</h1>
          <p className="mt-5 text-[15px] font-light leading-relaxed" style={{ color: '#4A443C' }}>
            {t('Your orders, addresses and saved pieces live in your account.', 'طلباتك وعناوينك وقطعك المحفوظة موجودة في حسابك.')}
          </p>
          <button type="button" data-testid="account-signin" onClick={() => openAuth()} className={`mt-8 px-10 py-4 ${primaryBtnCls(isAr)}`}>
            {t('Sign In', 'تسجيل الدخول')}
          </button>
        </div>
      </main>
    );
  }

  const orderCount = DEMO_ORDERS.length + sessionOrders().length;
  const stats = [
    { icon: Package, label: t('Orders', 'الطلبات'), value: String(orderCount), to: accountPath('orders') },
    { icon: Heart, label: t('Saved', 'المحفوظات'), value: String(wishlist.count), to: `${lookBase(1)}/wishlist` },
    { icon: MapPin, label: t('Addresses', 'العناوين'), value: '2', to: accountPath('addresses') },
    { icon: Award, label: t('Points', 'النقاط'), value: formatSAR(LOYALTY_POINTS), to: `${lookBase(1)}/loyalty` },
  ];
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <main className="pt-[72px]" data-testid="account-page" data-section={section}>
      {/* identity band */}
      <div style={{ backgroundColor: NIGHT }}>
        <div className={`${CONTAINER} py-12 md:py-16`}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={`text-[11px] ${caps}`} style={{ color: OLIVE_LT }}>{t('Welcome back', 'أهلاً بعودتك')}</p>
              <h1 className={`mt-4 text-white ${displayCls(isAr, 'xl')}`}>{user}</h1>
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

          <ul className="mt-10 grid grid-cols-2 gap-px md:grid-cols-4" style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}>
            {stats.map((s) => (
              <li key={s.label} style={{ backgroundColor: NIGHT }}>
                <Link to={s.to} className="flex items-center gap-4 p-5 transition-colors hover:bg-white/5">
                  <s.icon size={18} strokeWidth={1.4} className="shrink-0" style={{ color: OLIVE_LT }} />
                  <span className="min-w-0">
                    <span className={`block text-[10px] ${caps}`} style={{ color: 'rgba(246,243,236,0.6)' }}>{s.label}</span>
                    <span className="mt-1 block font-['Outfit',sans-serif] text-[20px] font-bold tabular-nums text-white">{s.value}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={CONTAINER}>
        <nav className="pt-8" aria-label={t('Account sections', 'أقسام الحساب')}>
          <Tabs
            testId="account-nav"
            value={section}
            items={SECTIONS.map((s) => ({
              key: s.key,
              label: t(s.label.en, s.label.ar),
              to: accountPath(s.key),
              count: s.key === 'notifications' && unread ? unread : undefined,
            }))}
          />
        </nav>

        <section className="py-10 md:py-14" data-testid={`account-${section}`}>
          {section === 'orders' && <Orders />}
          {section === 'requests' && <Requests />}
          {section === 'reviews' && <Reviews />}
          {section === 'notifications' && <Inbox />}
          {section === 'details' && <Details user={user} />}
          {section === 'addresses' && <Addresses />}
          {section === 'security' && <Security />}
          {section === 'language' && <LanguagePick />}
          {section === 'settings' && <Alerts />}
        </section>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Orders — tracking and rating                                        */
/* ------------------------------------------------------------------ */

function Orders() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { toast } = useShell();
  const caps = capsCls(isAr);
  const [rated, setRated] = useState<Set<string>>(() => new Set(DEMO_ORDERS.filter((o) => o.rated).map((o) => o.id)));
  const [rating, setRating] = useState<DemoOrder | null>(null);
  const fresh = sessionOrders();
  const steps = ORDER_STEPS.map((s) => ({ label: t(s.en, s.ar) }));

  return (
    <div className="grid gap-5">
      {fresh.map((o) => (
        <article key={o.id} className="border" style={{ borderColor: HAIR }} data-testid="order-card">
          <OrderHead id={o.id} date={t('Today', 'اليوم')} total={o.total} badge={<Badge tone="olive">{t('Confirmed', 'مؤكد')}</Badge>} />
          <div className="px-6 py-6"><StatusTimeline steps={steps} current={0} /></div>
          <ul className="divide-y divide-[#E8E4DC] border-t" style={{ borderColor: HAIR }}>
            {o.lines.map((l, i) => (
              <li key={i} className="flex items-baseline justify-between gap-4 px-6 py-3.5 text-[13px]">
                <span className="min-w-0 flex-1 truncate font-medium">{l.name} <span style={{ color: MUTED }}>× {l.qty}</span></span>
                <span className="font-['Outfit',sans-serif] font-bold tabular-nums">{formatSAR(l.total)}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}

      {DEMO_ORDERS.map((o) => {
        const done = o.step >= ORDER_STEPS.length;
        const isRated = rated.has(o.id);
        return (
          <article key={o.id} className="border" style={{ borderColor: HAIR }} data-testid="order-card">
            <OrderHead
              id={o.id}
              date={t(o.date.en, o.date.ar)}
              total={o.total}
              badge={<Badge tone={done ? 'muted' : 'olive'}>{done ? t('Delivered', 'تم التوصيل') : t(ORDER_STEPS[o.step].en, ORDER_STEPS[o.step].ar)}</Badge>}
            />
            <div className="px-6 py-6"><StatusTimeline steps={steps} current={o.step} /></div>
            <ul className="divide-y divide-[#E8E4DC] border-t" style={{ borderColor: HAIR }}>
              {o.productIds.map((id) => {
                const p = CATALOG.find((x) => x.id === id);
                if (!p) return null;
                return (
                  <li key={id} className="flex items-center gap-4 px-6 py-4">
                    <img src={p.img} alt="" className="h-14 w-12 shrink-0 object-cover" style={{ backgroundColor: TILE }} />
                    <Link to={productPath(1, id)} className="min-w-0 flex-1 truncate text-[13px] font-bold hover:text-[#5A6B4D]">
                      {t(p.name.en, p.name.ar)}
                    </Link>
                    <span className="font-['Outfit',sans-serif] text-[13px] font-bold tabular-nums">{formatSAR(p.price)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-wrap items-center gap-6 border-t px-6 py-4" style={{ borderColor: HAIR }}>
              {done && !isRated && (
                <button
                  type="button"
                  data-testid="order-rate"
                  onClick={() => setRating(o)}
                  className={`inline-flex items-center gap-2 border-b pb-1 text-[11px] font-medium ${caps}`}
                  style={{ borderColor: INK }}
                >
                  <StarIcon size={12} strokeWidth={1.5} />
                  {t('Rate this order', 'قيّم هذا الطلب')}
                </button>
              )}
              {isRated && (
                <span className="inline-flex items-center gap-2 text-[11px] font-medium" style={{ color: OLIVE }}>
                  <Check size={13} strokeWidth={2} />
                  {t('Rated — thank you', 'تم التقييم — شكراً لك')}
                </span>
              )}
              <Link to={`${lookBase(1)}/chat`} className={`text-[11px] font-medium hover:text-[#171512] ${caps}`} style={{ color: MUTED }}>
                {t('Need help?', 'تحتاج مساعدة؟')}
              </Link>
            </div>
          </article>
        );
      })}

      <RateSheet
        open={!!rating}
        title={rating ? t(`Order #${rating.id}`, `الطلب #${rating.id}`) : ''}
        onClose={() => setRating(null)}
        onDone={() => {
          if (rating) setRated((s) => new Set(s).add(rating.id));
          setRating(null);
          toast(t('Thanks — your rating is in.', 'شكراً — تم إرسال تقييمك.'));
        }}
      />
    </div>
  );
}

function OrderHead({ id, date, total, badge }: { id: string; date: string; total: number; badge: ReactNode }) {
  const { lang, t } = useLook();
  const caps = capsCls(lang === 'ar');
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5" style={{ borderColor: HAIR, backgroundColor: TILE }}>
      <div>
        <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{date}</p>
        <p className="mt-1.5 font-['Outfit',sans-serif] text-[18px] font-bold">#{id}</p>
      </div>
      {badge}
      <div className="text-end">
        <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('Total', 'الإجمالي')}</p>
        <p className="mt-1.5 font-['Outfit',sans-serif] text-[18px] font-bold tabular-nums">
          {formatSAR(total)} <span className="text-[11px] font-medium" style={{ color: MUTED }}>{t('SAR', 'ر.س')}</span>
        </p>
      </div>
    </div>
  );
}

/** Stars and a line of text — used for orders and for products. */
function RateSheet({ open, title, onClose, onDone }: { open: boolean; title: string; onClose: () => void; onDone: () => void }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const [stars, setStars] = useState(5);
  const [text, setText] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onDone();
    setText('');
    setStars(5);
  };
  return (
    <Sheet open={open} onClose={onClose} side="center" testId="rate-sheet" eyebrow={title} title={t('How was it?', 'كيف كانت التجربة؟')}>
      <form onSubmit={submit} className="grid gap-6 px-6 py-6">
        <RatingInput value={stars} onChange={setStars} />
        <TextArea id="rate-text" label={t('Tell others about it (optional)', 'أخبر الآخرين (اختياري)')} value={text} onChange={setText} rows={4} />
        <button type="submit" data-testid="rate-submit" className={`w-full py-4 ${primaryBtnCls(isAr)}`}>
          {t('Send Rating', 'إرسال التقييم')}
        </button>
      </form>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* Service requests                                                    */
/* ------------------------------------------------------------------ */

function Requests() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const { toast } = useShell();
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const steps = REQUEST_STEPS.map((s) => ({ label: t(s.en, s.ar) }));

  return (
    <div className="grid gap-5">
      {SERVICE_REQUESTS.map((r) => {
        const provider = PROVIDERS.find((p) => p.id === r.providerId);
        const quoteOpen = r.step === 2 && !accepted.has(r.id);
        return (
          <article key={r.id} className="border" style={{ borderColor: HAIR }} data-testid="request-card">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5" style={{ borderColor: HAIR, backgroundColor: TILE }}>
              <div>
                <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{r.id} · {t(r.date.en, r.date.ar)}</p>
                <p className="mt-1.5 text-[16px] font-bold">{t(r.service.en, r.service.ar)}</p>
              </div>
              {r.quote !== undefined && (
                <div className="text-end">
                  <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('Quote', 'عرض السعر')}</p>
                  <p className="mt-1.5 font-['Outfit',sans-serif] text-[18px] font-bold tabular-nums">
                    {formatSAR(r.quote)} <span className="text-[11px] font-medium" style={{ color: MUTED }}>{t('SAR', 'ر.س')}</span>
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 py-6">
              <StatusTimeline steps={steps} current={accepted.has(r.id) ? 3 : Math.min(r.step, steps.length)} />
              <p className="mt-6 text-[13px] font-light leading-relaxed" style={{ color: '#4A443C' }}>{t(r.details.en, r.details.ar)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 border-t px-6 py-4" style={{ borderColor: HAIR }}>
              {provider && (
                <Link to={`${lookBase(1)}/provider/${provider.id}`} className="inline-flex items-center gap-2.5 text-[12px] font-bold hover:text-[#5A6B4D]">
                  <span dir="ltr" className="flex h-7 w-7 items-center justify-center bg-[#171512] font-['Outfit',sans-serif] text-[9px] font-bold text-white">{provider.initials}</span>
                  {t(provider.name.en, provider.name.ar)}
                </Link>
              )}
              {quoteOpen && (
                <button
                  type="button"
                  data-testid="request-accept"
                  onClick={() => {
                    setAccepted((s) => new Set(s).add(r.id));
                    toast(t('Quote accepted — the provider will schedule the work.', 'تم قبول العرض — سيحدد مقدم الخدمة موعد التنفيذ.'));
                  }}
                  className={`px-6 py-3 ${primaryBtnCls(isAr)}`}
                >
                  {t('Accept Quote', 'قبول العرض')}
                </button>
              )}
              <Link to={`${lookBase(1)}/chat?with=${r.providerId}`} className={`inline-flex items-center gap-2 text-[11px] font-medium hover:text-[#171512] ${caps}`} style={{ color: MUTED }}>
                <MessageSquare size={13} strokeWidth={1.5} />
                {t('Message', 'مراسلة')}
              </Link>
            </div>
          </article>
        );
      })}
      <div>
        <Link to={`${lookBase(1)}/services`} className={`inline-flex items-center gap-2 border-b pb-1.5 text-[11px] font-medium ${caps}`} style={{ borderColor: INK }}>
          <Plus size={12} strokeWidth={1.75} />
          {t('Request a new service', 'اطلب خدمة جديدة')}
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

function Reviews() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { toast } = useShell();
  const [tab, setTab] = useState<'pending' | 'published'>('pending');
  const [pending, setPending] = useState<number[]>(MY_REVIEWS.pending);
  const [writing, setWriting] = useState<number | null>(null);
  const published = MY_REVIEWS.published;
  const writingProduct = writing ? CATALOG.find((p) => p.id === writing) : undefined;

  return (
    <div className="lg:max-w-4xl">
      <Tabs
        testId="reviews-tabs"
        value={tab}
        onChange={setTab}
        items={[
          { key: 'pending', label: t('To review', 'بانتظار التقييم'), count: pending.length },
          { key: 'published', label: t('Published', 'المنشورة'), count: published.length },
        ]}
      />
      <div className="mt-8">
        {tab === 'pending' &&
          (pending.length === 0 ? (
            <EmptyState title={t('All caught up', 'لا يوجد ما تقيّمه')} body={t('Everything you bought has been reviewed.', 'قيّمت كل ما اشتريته.')} />
          ) : (
            <ul className="grid gap-4">
              {pending.map((id) => {
                const p = CATALOG.find((x) => x.id === id);
                if (!p) return null;
                return (
                  <li key={id} className="flex flex-wrap items-center gap-5 border p-5" style={{ borderColor: HAIR }} data-testid="review-pending">
                    <img src={p.img} alt="" className="h-20 w-16 object-cover" style={{ backgroundColor: TILE }} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-bold">{t(p.name.en, p.name.ar)}</span>
                      <span className="mt-1 block text-[12px] font-light" style={{ color: MUTED }}>{t('Delivered in August', 'تم التوصيل في أغسطس')}</span>
                    </span>
                    <button type="button" data-testid="review-write" onClick={() => setWriting(id)} className={`px-6 py-3 ${primaryBtnCls(isAr)}`}>
                      {t('Write a Review', 'اكتب تقييماً')}
                    </button>
                  </li>
                );
              })}
            </ul>
          ))}
        {tab === 'published' && (
          <ul className="grid gap-4">
            {published.map((r) => {
              const p = CATALOG.find((x) => x.id === r.productId);
              if (!p) return null;
              return (
                <li key={r.productId} className="flex gap-5 border p-5" style={{ borderColor: HAIR }}>
                  <img src={p.img} alt="" className="h-20 w-16 shrink-0 object-cover" style={{ backgroundColor: TILE }} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold">{t(p.name.en, p.name.ar)}</span>
                    <span className="mt-2 flex items-center gap-3">
                      <Stars rating={r.rating} />
                      <span className="text-[11px]" style={{ color: MUTED }}>{t(r.date.en, r.date.ar)}</span>
                    </span>
                    <span className="mt-3 block text-[13px] font-light leading-relaxed" style={{ color: '#4A443C' }}>{t(r.text.en, r.text.ar)}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <RateSheet
        open={!!writing}
        title={writingProduct ? t(writingProduct.name.en, writingProduct.name.ar) : ''}
        onClose={() => setWriting(null)}
        onDone={() => {
          setPending((list) => list.filter((id) => id !== writing));
          setWriting(null);
          toast(t('Review published.', 'تم نشر تقييمك.'));
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Notifications inbox                                                 */
/* ------------------------------------------------------------------ */

function Inbox() {
  const { lang, t } = useLook();
  const caps = capsCls(lang === 'ar');
  const [read, setRead] = useState<Set<string>>(() => new Set(NOTIFICATIONS.filter((n) => !n.unread).map((n) => n.id)));
  const unread = NOTIFICATIONS.filter((n) => !read.has(n.id)).length;
  const icon = { order: Package, offer: Award, service: Wrench, account: UserIcon };

  return (
    <div className="lg:max-w-4xl">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[13px]" style={{ color: MUTED }}>
          {unread ? t(`${unread} unread`, `${unread} غير مقروءة`) : t('All read', 'كلها مقروءة')}
        </p>
        {unread > 0 && (
          <button
            type="button"
            data-testid="inbox-read-all"
            onClick={() => setRead(new Set(NOTIFICATIONS.map((n) => n.id)))}
            className={`border-b pb-1 text-[11px] font-medium ${caps}`}
            style={{ borderColor: INK }}
          >
            {t('Mark all as read', 'تحديد الكل كمقروء')}
          </button>
        )}
      </div>
      <ul className="border" style={{ borderColor: HAIR }}>
        {NOTIFICATIONS.map((n, i) => {
          const Icon = icon[n.kind];
          const isUnread = !read.has(n.id);
          return (
            <li
              key={n.id}
              data-testid="inbox-item"
              data-unread={isUnread}
              onClick={() => setRead((s) => new Set(s).add(n.id))}
              className={`flex cursor-pointer gap-4 px-5 py-5 transition-colors hover:bg-[#F6F3EC] ${i ? 'border-t' : ''}`}
              style={{ borderColor: HAIR, backgroundColor: isUnread ? '#FBF9F4' : undefined }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border" style={{ borderColor: HAIR }}>
                <Icon size={16} strokeWidth={1.5} style={{ color: OLIVE }} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className={`text-[14px] ${isUnread ? 'font-bold' : 'font-medium'}`}>{t(n.title.en, n.title.ar)}</span>
                  <span className="shrink-0 text-[11px]" style={{ color: MUTED }}>{t(n.when.en, n.when.ar)}</span>
                </span>
                <span className="mt-1 block text-[13px] font-light" style={{ color: '#4A443C' }}>{t(n.body.en, n.body.ar)}</span>
              </span>
              {isUnread && <span className="mt-2 h-2 w-2 shrink-0" style={{ backgroundColor: OLIVE }} aria-label={t('Unread', 'غير مقروء')} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Details, addresses, security, language, alerts                      */
/* ------------------------------------------------------------------ */

function SaveBar({ label }: { label?: string }) {
  const { lang, t } = useLook();
  return (
    <button type="submit" data-testid="form-save" className={`mt-8 px-10 py-4 ${primaryBtnCls(lang === 'ar')}`}>
      {label ?? t('Save Changes', 'حفظ التغييرات')}
    </button>
  );
}

function Details({ user }: { user: string }) {
  const { t } = useLook();
  const { toast } = useShell();
  const [f, setF] = useState({ name: user, phone: '0551234567', email: 'abdullah@example.com', city: t('Jeddah', 'جدة') });
  return (
    <form
      className="lg:max-w-3xl"
      onSubmit={(e) => {
        e.preventDefault();
        toast(t('Details saved.', 'تم حفظ البيانات.'));
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="d-name" label={t('Full name', 'الاسم الكامل')} value={f.name} onChange={(v) => setF({ ...f, name: v })} />
        <TextField id="d-phone" label={t('Phone', 'رقم الجوال')} value={f.phone} onChange={(v) => setF({ ...f, phone: v })} ltr inputMode="tel" />
        <TextField id="d-email" label={t('Email', 'البريد الإلكتروني')} value={f.email} onChange={(v) => setF({ ...f, email: v })} ltr inputMode="email" />
        <TextField id="d-city" label={t('City', 'المدينة')} value={f.city} onChange={(v) => setF({ ...f, city: v })} />
      </div>
      <SaveBar />
    </form>
  );
}

function Addresses() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const { toast } = useShell();
  const [list, setList] = useState([
    { id: 'home', label: t('Home', 'المنزل'), line: t('Al Rawdah District, Jeddah 23434', 'حي الروضة، جدة 23434'), primary: true },
    { id: 'work', label: t('Work', 'العمل'), line: t('Tahlia Street, Al Khalidiyah, Jeddah', 'شارع التحلية، الخالدية، جدة'), primary: false },
  ]);
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ label: t('Villa', 'الفيلا'), district: t('Obhur', 'أبحر'), city: t('Jeddah', 'جدة') });

  return (
    <div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:max-w-4xl">
        {list.map((a) => (
          <li key={a.id} className="border p-6" style={{ borderColor: a.primary ? INK : HAIR }} data-testid="address-card">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[14px] font-bold">{a.label}</span>
              {a.primary ? (
                <span className={`text-[10px] font-semibold ${caps}`} style={{ color: OLIVE }}>{t('Default', 'الافتراضي')}</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setList((l) => l.map((x) => ({ ...x, primary: x.id === a.id })))}
                  className={`text-[10px] font-medium hover:text-[#171512] ${caps}`}
                  style={{ color: MUTED }}
                >
                  {t('Make default', 'اجعله الافتراضي')}
                </button>
              )}
            </div>
            <p className="mt-3 text-[13px] font-light leading-relaxed" style={{ color: '#4A443C' }}>{a.line}</p>
            {!a.primary && (
              <button
                type="button"
                onClick={() => setList((l) => l.filter((x) => x.id !== a.id))}
                className={`mt-5 text-[11px] font-medium transition-colors hover:text-[#B03A2E] ${caps}`}
                style={{ color: MUTED }}
              >
                {t('Remove', 'حذف')}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            type="button"
            data-testid="address-add"
            onClick={() => setAdding(true)}
            className="flex h-full min-h-[140px] w-full flex-col items-center justify-center gap-3 border border-dashed text-[12px] font-medium transition-colors hover:bg-[#F6F3EC]"
            style={{ borderColor: '#C9C2B4' }}
          >
            <Plus size={18} strokeWidth={1.5} style={{ color: OLIVE }} />
            {t('Add an address', 'إضافة عنوان')}
          </button>
        </li>
      </ul>

      <Sheet open={adding} onClose={() => setAdding(false)} side="center" testId="address-sheet" eyebrow={t('Addresses', 'العناوين')} title={t('New Address', 'عنوان جديد')}>
        <form
          className="grid gap-5 px-6 py-6"
          onSubmit={(e) => {
            e.preventDefault();
            setList((l) => [...l, { id: `a${l.length}`, label: f.label, line: `${f.district}, ${f.city}`, primary: false }]);
            setAdding(false);
            toast(t('Address added.', 'تمت إضافة العنوان.'));
          }}
        >
          <TextField id="a-label" label={t('Name it', 'اسم العنوان')} value={f.label} onChange={(v) => setF({ ...f, label: v })} />
          <TextField id="a-district" label={t('District and street', 'الحي والشارع')} value={f.district} onChange={(v) => setF({ ...f, district: v })} />
          <TextField id="a-city" label={t('City', 'المدينة')} value={f.city} onChange={(v) => setF({ ...f, city: v })} />
          <button type="submit" data-testid="address-save" className={`mt-2 w-full py-4 ${primaryBtnCls(isAr)}`}>
            {t('Save Address', 'حفظ العنوان')}
          </button>
        </form>
      </Sheet>
    </div>
  );
}

function Security() {
  const { lang, t } = useLook();
  const caps = capsCls(lang === 'ar');
  const { toast } = useShell();
  const [f, setF] = useState({ current: 'diyar1234', next: 'diyar5678', again: 'diyar5678' });
  const [twoStep, setTwoStep] = useState(true);
  const sessions = [
    { icon: Smartphone, name: t('iPhone · Jeddah', 'آيفون · جدة'), when: t('This device', 'هذا الجهاز'), current: true },
    { icon: Monitor, name: t('Chrome on Windows · Riyadh', 'كروم على ويندوز · الرياض'), when: t('3 days ago', 'قبل 3 أيام'), current: false },
  ];
  return (
    <div className="grid gap-12 lg:max-w-3xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast(t('Password changed.', 'تم تغيير كلمة المرور.'));
        }}
      >
        <h2 className={`mb-6 text-[15px] font-bold ${caps}`}>{t('Password', 'كلمة المرور')}</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TextField id="s-current" label={t('Current password', 'كلمة المرور الحالية')} value={f.current} onChange={(v) => setF({ ...f, current: v })} type="password" />
          </div>
          <TextField id="s-next" label={t('New password', 'كلمة المرور الجديدة')} value={f.next} onChange={(v) => setF({ ...f, next: v })} type="password" />
          <TextField id="s-again" label={t('Repeat it', 'أعد كتابتها')} value={f.again} onChange={(v) => setF({ ...f, again: v })} type="password" />
        </div>
        <SaveBar label={t('Change Password', 'تغيير كلمة المرور')} />
      </form>

      <div className="flex items-center justify-between gap-6 border p-5" style={{ borderColor: HAIR }}>
        <span>
          <span className="block text-[14px] font-bold">{t('Two-step verification', 'التحقق بخطوتين')}</span>
          <span className="mt-1 block text-[12px] font-light" style={{ color: MUTED }}>{t('A code by text message on every new sign-in.', 'رمز برسالة نصية عند كل تسجيل دخول جديد.')}</span>
        </span>
        <Toggle on={twoStep} onChange={setTwoStep} label={t('Two-step verification', 'التحقق بخطوتين')} />
      </div>

      <div>
        <h2 className={`mb-4 text-[15px] font-bold ${caps}`}>{t('Where you are signed in', 'أين سجّلت الدخول')}</h2>
        <ul className="border" style={{ borderColor: HAIR }}>
          {sessions.map((s, i) => (
            <li key={s.name} className={`flex items-center gap-4 px-5 py-4 ${i ? 'border-t' : ''}`} style={{ borderColor: HAIR }}>
              <s.icon size={18} strokeWidth={1.4} style={{ color: OLIVE }} />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-bold">{s.name}</span>
                <span className="mt-0.5 block text-[11px]" style={{ color: MUTED }}>{s.when}</span>
              </span>
              {!s.current && (
                <button type="button" onClick={() => toast(t('Signed out of that device.', 'تم تسجيل الخروج من ذلك الجهاز.'))} className={`text-[11px] font-medium hover:text-[#B03A2E] ${caps}`} style={{ color: MUTED }}>
                  {t('Sign out', 'خروج')}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LanguagePick() {
  const { lang, setLang, t } = useLook();
  const options = [
    { key: 'ar' as const, name: 'العربية', line: 'الواجهة بالعربية ومن اليمين إلى اليسار' },
    { key: 'en' as const, name: 'English', line: 'Interface in English, left to right' },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:max-w-3xl" role="radiogroup" aria-label={t('Language', 'اللغة')}>
      {options.map((o) => {
        const on = lang === o.key;
        return (
          <button
            key={o.key}
            type="button"
            role="radio"
            aria-checked={on}
            data-testid={`lang-${o.key}`}
            dir={o.key === 'ar' ? 'rtl' : 'ltr'}
            onClick={() => setLang(o.key)}
            className="flex items-center justify-between gap-4 border p-6 text-start transition-colors"
            style={{ borderColor: on ? INK : HAIR, backgroundColor: on ? '#F6F3EC' : '#FFFFFF' }}
          >
            <span>
              <span className={`block text-[20px] font-bold ${o.key === 'ar' ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif]"}`}>{o.name}</span>
              <span className="mt-1.5 block text-[12px] font-light" style={{ color: MUTED }}>{o.line}</span>
            </span>
            {on && <Check size={18} strokeWidth={2} style={{ color: OLIVE }} />}
          </button>
        );
      })}
    </div>
  );
}

function Alerts() {
  const { t } = useLook();
  const [state, setState] = useState({ orders: true, offers: true, services: false, email: true, sms: true });
  const rows: { key: keyof typeof state; title: string; hint: string }[] = [
    { key: 'orders', title: t('Order updates', 'تحديثات الطلبات'), hint: t('Shipping, delivery and installation', 'الشحن والتوصيل والتركيب') },
    { key: 'services', title: t('Service reminders', 'تذكيرات الخدمات'), hint: t('Visits and quotes', 'الزيارات وعروض الأسعار') },
    { key: 'offers', title: t('Offers and new arrivals', 'العروض والوصل حديثاً'), hint: t('Once a week, never more', 'مرة أسبوعياً، لا أكثر') },
    { key: 'email', title: t('By email', 'عبر البريد'), hint: t('Receipts and summaries', 'الإيصالات والملخصات') },
    { key: 'sms', title: t('By text message', 'عبر الرسائل النصية'), hint: t('Delivery-day updates only', 'تحديثات يوم التوصيل فقط') },
  ];
  return (
    <ul className="border lg:max-w-3xl" style={{ borderColor: HAIR }}>
      {rows.map((r, i) => (
        <li key={r.key} className={`flex items-center justify-between gap-6 px-6 py-5 ${i ? 'border-t' : ''}`} style={{ borderColor: HAIR }}>
          <span className="min-w-0">
            <span className="block text-[14px] font-bold">{r.title}</span>
            <span className="mt-1 block text-[12px] font-light" style={{ color: MUTED }}>{r.hint}</span>
          </span>
          <Toggle on={state[r.key]} onChange={(v) => setState({ ...state, [r.key]: v })} label={r.title} />
        </li>
      ))}
    </ul>
  );
}

