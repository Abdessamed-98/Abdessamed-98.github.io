/**
 * Look 1 — checkout, and the confirmation that follows it.
 *
 * Three steps on one page rather than three routes: delivery, payment, review.
 * A wizard hides how little is being asked for; this way the visitor sees the
 * whole commitment at once and the summary stays beside it the entire time.
 *
 * Placing the order snapshots it into sessionStorage under its number, so the
 * confirmation survives a refresh even though the cart has been emptied.
 */
import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, ShieldCheck, Truck, CreditCard, Wallet, Banknote } from 'lucide-react';
import { formatSAR, lookBase, productPath, searchPath, storeOf } from '../lookShared';
import { Breadcrumb, FIELD, HAIR, INK, MUTED, OLIVE, TILE, primaryBtnCls, useLook } from './ui';
import { useLookCart, type CartView } from './cart';

const VAT = 0.15;
const FREE_SHIPPING_OVER = 3000;
const SHIPPING = 150;

interface OrderSnapshot {
  id: string;
  placedAt: string;
  name: string;
  city: string;
  payment: string;
  lines: { name: string; qty: number; total: number }[];
  total: number;
}

const orderKey = (id: string) => `diyar-look1-order-${id}`;

/* ------------------------------------------------------------------ */
/* Checkout                                                            */
/* ------------------------------------------------------------------ */

export default function CheckoutPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { items, subtotal, clear } = useLookCart();
  const navigate = useNavigate();

  const [payment, setPayment] = useState('mada');
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', notes: '' });

  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING;
  const vat = Math.round(subtotal * VAT);
  const total = subtotal + shipping + vat;
  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]';

  const methods = [
    { key: 'mada', icon: CreditCard, en: 'Mada / Credit Card', ar: 'مدى / بطاقة ائتمانية' },
    { key: 'apple', icon: Wallet, en: 'Apple Pay', ar: 'Apple Pay' },
    { key: 'tabby', icon: Wallet, en: 'Split in 4 payments', ar: 'قسّمها على 4 دفعات' },
    { key: 'cash', icon: Banknote, en: 'Cash on delivery', ar: 'الدفع عند الاستلام' },
  ];

  const placeOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!items.length) return;
    const id = String(Math.floor(100000 + Math.random() * 899999));
    const snapshot: OrderSnapshot = {
      id,
      placedAt: new Date().toISOString(),
      name: form.name,
      city: form.city,
      payment: t(methods.find((m) => m.key === payment)?.en ?? '', methods.find((m) => m.key === payment)?.ar ?? ''),
      lines: items.map((l) => ({ name: t(l.product.name.en, l.product.name.ar), qty: l.qty, total: l.lineTotal })),
      total,
    };
    try {
      sessionStorage.setItem(orderKey(id), JSON.stringify(snapshot));
    } catch {
      // a blocked storage is not a reason to lose the order
    }
    clear();
    navigate(`${lookBase(1)}/order/${id}`);
  };

  const field =
    'h-12 w-full border bg-white px-4 text-[13px] text-[#171512] outline-none transition-colors focus:border-[#171512] focus:ring-1 focus:ring-[#171512]';
  const label = `mb-2 block text-[11px] font-medium ${isAr ? 'tracking-normal' : 'uppercase tracking-[0.18em]'}`;

  return (
    <main className="pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10 md:py-14">
        <Breadcrumb
          items={[
            { label: t('Home', 'الرئيسية'), to: lookBase(1) },
            { label: t('Cart', 'السلة') },
            { label: t('Checkout', 'إتمام الطلب') },
          ]}
        />

        <h1
          className={`mt-6 font-extrabold ${
            isAr
              ? "font-['Alexandria',sans-serif] text-3xl leading-[1.2] tracking-normal md:text-4xl"
              : "font-['Outfit',sans-serif] text-3xl uppercase leading-[1.05] tracking-tight md:text-5xl"
          }`}
        >
          {t('Checkout', 'إتمام الطلب')}
        </h1>

        {items.length === 0 ? (
          <div className="mt-16 border py-20 text-center" style={{ borderColor: HAIR }}>
            <p className={`text-[11px] text-[#5F5950] ${caps}`}>{t('Empty cart', 'السلة فارغة')}</p>
            <p className="mt-3 text-[15px] font-light text-[#4A443C]">
              {t('There is nothing to check out yet.', 'لا توجد منتجات لإتمام طلبها بعد.')}
            </p>
            <Link to={searchPath(1)} className={`mt-8 inline-block px-10 py-4 ${primaryBtnCls(isAr)}`}>
              {t('Browse the Catalogue', 'تصفّح الكتالوج')}
            </Link>
          </div>
        ) : (
          <form onSubmit={placeOrder} className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* ---- the three steps ---- */}
            <div className="lg:col-span-7">
              <Step n="01" title={t('Delivery', 'التوصيل')}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={label} style={{ color: MUTED }} htmlFor="co-name">{t('Full name', 'الاسم الكامل')}</label>
                    <input
                      id="co-name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={field}
                      style={{ borderColor: FIELD }}
                    />
                  </div>
                  <div>
                    <label className={label} style={{ color: MUTED }} htmlFor="co-phone">{t('Phone', 'رقم الجوال')}</label>
                    <input
                      id="co-phone"
                      required
                      dir="ltr"
                      inputMode="tel"
                      placeholder="05X XXX XXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`${field} text-start`}
                      style={{ borderColor: FIELD }}
                    />
                  </div>
                  <div>
                    <label className={label} style={{ color: MUTED }} htmlFor="co-city">{t('City', 'المدينة')}</label>
                    <input
                      id="co-city"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={field}
                      style={{ borderColor: FIELD }}
                    />
                  </div>
                  <div>
                    <label className={label} style={{ color: MUTED }} htmlFor="co-address">{t('Address', 'العنوان')}</label>
                    <input
                      id="co-address"
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className={field}
                      style={{ borderColor: FIELD }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-3 border px-4 py-3.5" style={{ borderColor: HAIR, backgroundColor: TILE }}>
                  <Truck size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: OLIVE }} />
                  <p className="text-[12px] font-light leading-relaxed text-[#4A443C]">
                    {t(
                      'Kingdom-wide delivery with professional assembly by our own crews. Free over 3,000 SAR.',
                      'توصيل لكل مناطق المملكة مع تركيب احترافي على يد فرقنا. مجاناً لما يتجاوز 3,000 ر.س.',
                    )}
                  </p>
                </div>
              </Step>

              <Step n="02" title={t('Payment', 'الدفع')}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {methods.map((m) => {
                    const on = payment === m.key;
                    return (
                      <label
                        key={m.key}
                        className={`flex cursor-pointer items-center gap-3 border px-4 py-4 transition-colors ${
                          on ? 'bg-[#F6F3EC]' : 'hover:bg-[#F6F3EC]/60'
                        }`}
                        style={{ borderColor: on ? INK : HAIR }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={m.key}
                          checked={on}
                          onChange={() => setPayment(m.key)}
                          className="sr-only"
                        />
                        <m.icon size={17} strokeWidth={1.5} style={{ color: on ? INK : '#8C8578' }} />
                        <span className="text-[13px] font-medium">{t(m.en, m.ar)}</span>
                        {on && <Check size={15} strokeWidth={2} className="ms-auto" style={{ color: OLIVE }} />}
                      </label>
                    );
                  })}
                </div>
                <p className="mt-4 flex items-center gap-2 text-[11px] text-[#5F5950]">
                  <ShieldCheck size={14} strokeWidth={1.5} style={{ color: OLIVE }} />
                  {t('Payments are processed securely.', 'تتم معالجة المدفوعات بشكل آمن.')}
                </p>
              </Step>

              <Step n="03" title={t('Review', 'المراجعة')} last>
                <ul className="divide-y border" style={{ borderColor: HAIR }}>
                  {items.map((line) => (
                    <ReviewLine key={line.uid} line={line} />
                  ))}
                </ul>
                <div>
                  <label className={`${label} mt-5`} style={{ color: MUTED }} htmlFor="co-notes">{t('Order notes', 'ملاحظات الطلب')}</label>
                  <textarea
                    id="co-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full resize-none border bg-white p-4 text-[13px] text-[#171512] outline-none transition-colors focus:border-[#171512]"
                    style={{ borderColor: FIELD }}
                  />
                </div>
              </Step>
            </div>

            {/* ---- summary ---- */}
            <aside className="lg:col-span-5">
              <div className="border p-6 lg:sticky lg:top-[96px]" style={{ borderColor: HAIR, backgroundColor: TILE }}>
                <p className={`text-[10px] text-[#5F5950] ${caps}`}>{t('Order summary', 'ملخص الطلب')}</p>

                <dl className="mt-5 space-y-3 text-[13px]">
                  <Row label={t('Subtotal', 'المجموع الفرعي')} value={`${formatSAR(subtotal)} ${t('SAR', 'ر.س')}`} />
                  <Row
                    label={t('Shipping', 'الشحن')}
                    value={shipping === 0 ? t('Free', 'مجاني') : `${formatSAR(shipping)} ${t('SAR', 'ر.س')}`}
                  />
                  <Row label={t('VAT (15%)', 'ضريبة القيمة المضافة (15%)')} value={`${formatSAR(vat)} ${t('SAR', 'ر.س')}`} />
                </dl>

                <div className="mt-5 flex items-baseline justify-between border-t pt-5" style={{ borderColor: HAIR }}>
                  <span className={`text-[11px] ${caps}`}>{t('Total', 'الإجمالي')}</span>
                  <span className="font-['Outfit',sans-serif] text-[24px] font-bold tabular-nums" style={{ color: INK }}>
                    {formatSAR(total)} <span className="text-[12px] font-medium text-[#5F5950]">{t('SAR', 'ر.س')}</span>
                  </span>
                </div>

                <button type="submit" data-testid="place-order" className={`mt-6 w-full py-4 ${primaryBtnCls(isAr)}`}>
                  {t('Place Order', 'تأكيد الطلب')}
                </button>
                <p className="mt-3 text-center text-[11px] font-light text-[#5F5950]">
                  {t('You can pay on delivery if you prefer.', 'يمكنك الدفع عند الاستلام إذا رغبت.')}
                </p>
              </div>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}

function Step({ n, title, children, last = false }: { n: string; title: string; children: ReactNode; last?: boolean }) {
  const { lang } = useLook();
  const isAr = lang === 'ar';
  return (
    <section className={`${last ? '' : 'border-b pb-10 mb-10'}`} style={{ borderColor: HAIR }}>
      <div className="mb-6 flex items-center gap-4">
        <span className="font-['Outfit',sans-serif] text-[12px] font-medium tracking-[0.2em] text-[#5F5950]">{n}</span>
        <h2
          className={`font-bold ${
            isAr ? "font-['Alexandria',sans-serif] text-[18px] tracking-normal" : "font-['Outfit',sans-serif] text-[15px] uppercase tracking-[0.18em]"
          }`}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="font-light text-[#4A443C]">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function ReviewLine({ line }: { line: CartView; key?: string }) {
  const { t } = useLook();
  const store = storeOf(line.product.store);
  return (
    <li className="flex items-center gap-4 p-4">
      <img src={line.product.img} alt="" className="h-16 w-14 shrink-0 object-cover" style={{ backgroundColor: TILE }} />
      <div className="min-w-0 flex-1">
        <Link to={productPath(1, line.product.id)} className="block truncate text-[13px] font-bold hover:text-[#5A6B4D]">
          {t(line.product.name.en, line.product.name.ar)}
        </Link>
        <p className="mt-1 text-[11px] font-light text-[#5F5950]">
          {t(store.name.en, store.name.ar)} · {t('Qty', 'الكمية')} {line.qty}
        </p>
      </div>
      <span className="font-['Outfit',sans-serif] text-[13px] font-bold tabular-nums">{formatSAR(line.lineTotal)}</span>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Confirmation                                                        */
/* ------------------------------------------------------------------ */

export function OrderPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { id = '' } = useParams();
  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]';

  let order: OrderSnapshot | null = null;
  try {
    const raw = sessionStorage.getItem(orderKey(id));
    order = raw ? (JSON.parse(raw) as OrderSnapshot) : null;
  } catch {
    order = null;
  }

  return (
    <main className="pt-[72px]">
      <div className="mx-auto max-w-[760px] px-6 py-16 text-center md:px-10 md:py-24">
        <span
          className="mx-auto flex h-16 w-16 items-center justify-center"
          style={{ backgroundColor: OLIVE }}
        >
          <Check size={26} strokeWidth={2} className="text-white" />
        </span>

        <p className={`mt-8 text-[11px] text-[#5F5950] ${caps}`}>{t('Order placed', 'تم استلام الطلب')}</p>
        <h1
          className={`mt-4 font-extrabold ${
            isAr
              ? "font-['Alexandria',sans-serif] text-3xl leading-[1.2] tracking-normal md:text-4xl"
              : "font-['Outfit',sans-serif] text-3xl uppercase leading-[1.05] tracking-tight md:text-5xl"
          }`}
        >
          {t('Thank you', 'شكراً لك')}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] font-light leading-relaxed text-[#4A443C]">
          {t(
            `Order #${id} is confirmed. We will call you to arrange delivery and assembly.`,
            `تم تأكيد الطلب رقم #${id}. سنتواصل معك لتحديد موعد التوصيل والتركيب.`,
          )}
        </p>

        {order && (
          <div className="mt-10 border p-6 text-start" style={{ borderColor: HAIR }}>
            <p className={`text-[10px] text-[#5F5950] ${caps}`}>{t('Summary', 'الملخص')}</p>
            <ul className="mt-4 divide-y" style={{ borderColor: HAIR }}>
              {order.lines.map((l, i) => (
                <li key={i} className="flex items-baseline justify-between gap-4 py-3 text-[13px]">
                  <span className="min-w-0 flex-1 truncate font-light">
                    {l.name} <span className="text-[#5F5950]">× {l.qty}</span>
                  </span>
                  <span className="font-['Outfit',sans-serif] font-bold tabular-nums">{formatSAR(l.total)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-baseline justify-between border-t pt-4" style={{ borderColor: HAIR }}>
              <span className={`text-[11px] ${caps}`}>{t('Paid with', 'طريقة الدفع')}</span>
              <span className="text-[13px] font-medium">{order.payment}</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className={`text-[11px] ${caps}`}>{t('Total', 'الإجمالي')}</span>
              <span className="font-['Outfit',sans-serif] text-[18px] font-bold tabular-nums">
                {formatSAR(order.total)} <span className="text-[11px] font-medium text-[#5F5950]">{t('SAR', 'ر.س')}</span>
              </span>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to={`${lookBase(1)}/account`} className={`px-10 py-4 ${primaryBtnCls(isAr)}`}>
            {t('View Orders', 'عرض الطلبات')}
          </Link>
          <Link
            to={searchPath(1)}
            className={`border-b pb-1.5 text-[11px] font-medium transition-colors hover:text-[#5A6B4D] ${caps}`}
            style={{ borderColor: INK }}
          >
            {t('Continue Shopping', 'مواصلة التسوق')}
          </Link>
        </div>
      </div>
    </main>
  );
}
