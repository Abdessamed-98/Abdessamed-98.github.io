import React, { useState } from 'react';
import { Plus, Megaphone, Eye, MousePointerClick, Calendar, X, Image as ImageIcon, Pause, Play } from 'lucide-react';

/** Where a banner can run; the storefront reads the same slot names (AD_BANNERS). */
const SLOTS = [
  { key: 'home-slider', label: 'الرئيسية — شريط البانرات (بعد العلامات التجارية)', price: 1200 },
];

type Ad = { id: number; title: string; slot: string; img: string; link: string; from: string; to: string; status: 'active' | 'scheduled' | 'paused' | 'ended'; views: number; clicks: number };

const STATUS = {
  active: { label: 'نشط', cls: 'bg-green-50 text-green-700' },
  scheduled: { label: 'مجدول', cls: 'bg-blue-50 text-blue-600' },
  paused: { label: 'متوقف', cls: 'bg-amber-50 text-amber-700' },
  ended: { label: 'منتهي', cls: 'bg-gray-100 text-gray-500' },
} as const;

const slotLabel = (key: string) => SLOTS.find((s) => s.key === key)?.label ?? key;

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([
    { id: 1, title: 'باقات غرف النوم من 7,900 ر.س', slot: 'home-slider', img: '/looks/promo/bedroom-packages.webp', link: '/look/1/products?room=bedroom', from: '2026-10-01', to: '2026-10-31', status: 'active', views: 18420, clicks: 612 },
    { id: 2, title: 'أطقم المجالس — خصم 25%', slot: 'home-slider', img: '/looks/campaign-majlis.webp', link: '/look/1/products?store=dw', from: '2026-10-10', to: '2026-10-31', status: 'active', views: 7310, clicks: 284 },
    { id: 3, title: 'تشكيلة الشتاء', slot: 'home-slider', img: '/looks/campaign-living.webp', link: '/look/1/products?sort=newest', from: '2026-11-01', to: '2026-11-30', status: 'scheduled', views: 0, clicks: 0 },
    { id: 4, title: 'عروض الصيف', slot: 'home-slider', img: '/looks/campaign-living.webp', link: '/look/1/products?sale=1', from: '2026-07-01', to: '2026-08-31', status: 'ended', views: 41200, clicks: 1530 },
  ]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [slot, setSlot] = useState(SLOTS[0].key);
  const [link, setLink] = useState('');
  const [img, setImg] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const live = ads.filter((a) => a.status === 'active');
  const views = live.reduce((n, a) => n + a.views, 0);
  const clicks = live.reduce((n, a) => n + a.clicks, 0);
  const ctr = views ? ((clicks / views) * 100).toFixed(1) : '0.0';

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !from || !to) return;
    const today = new Date().toISOString().slice(0, 10);
    setAds((l) => [
      { id: Date.now(), title: title.trim(), slot, img: img || '/looks/promo/design-session.webp', link: link || '/look/1', from, to, status: from > today ? 'scheduled' : 'active', views: 0, clicks: 0 },
      ...l,
    ]);
    setOpen(false);
    setTitle('');
    setLink('');
    setImg('');
    setFrom('');
    setTo('');
  };
  const toggle = (id: number) =>
    setAds((l) => l.map((a) => (a.id === id ? { ...a, status: a.status === 'paused' ? 'active' : a.status === 'active' ? 'paused' : a.status } : a)));

  return (
    <div className="space-y-6" dir="rtl" data-testid="ads-page">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-diyar-dark">الإعلانات</h2>
          <p className="mt-1 text-sm text-gray-500">بانرات مدفوعة في شريط البانرات بالصفحة الرئيسية، بعد العلامات التجارية وقبل الأقسام.</p>
        </div>
        <button onClick={() => setOpen(true)} data-testid="ads-new" className="flex items-center gap-2 rounded-xl bg-diyar-brown px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#8A6D46]">
          <Plus size={18} /> إعلان جديد
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: 'إعلانات نشطة', value: String(live.length), icon: Megaphone, tone: 'bg-amber-50 text-amber-600' },
          { label: 'مشاهدات هذا الشهر', value: views.toLocaleString('en-US'), icon: Eye, tone: 'bg-blue-50 text-blue-600' },
          { label: 'نقرات · نسبة النقر', value: `${clicks.toLocaleString('en-US')} · ${ctr}%`, icon: MousePointerClick, tone: 'bg-green-50 text-green-600' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-gray-500">{s.label}</h3>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.tone}`}>
                <s.icon size={20} />
              </div>
            </div>
            <span className="text-3xl font-bold text-diyar-dark">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">الإعلان</th>
                <th className="px-6 py-4 font-medium">الموضع</th>
                <th className="px-6 py-4 font-medium">الفترة</th>
                <th className="px-6 py-4 font-medium">المشاهدات</th>
                <th className="px-6 py-4 font-medium">النقرات</th>
                <th className="px-6 py-4 font-medium">الحالة</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ads.map((a) => (
                <tr key={a.id} className="transition hover:bg-gray-50" data-testid="ad-row">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={a.img} alt="" className="h-12 w-20 shrink-0 rounded-lg object-cover" />
                      <div>
                        <div className="font-bold text-diyar-dark">{a.title}</div>
                        <div className="text-xs text-gray-400" dir="ltr">{a.link}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{slotLabel(a.slot)}</td>
                  <td className="px-6 py-4 text-gray-500" dir="ltr">{a.from} → {a.to}</td>
                  <td className="px-6 py-4 text-gray-700">{a.views.toLocaleString('en-US')}</td>
                  <td className="px-6 py-4 text-gray-700">{a.clicks.toLocaleString('en-US')}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-lg px-3 py-1 text-xs font-bold ${STATUS[a.status].cls}`}>{STATUS[a.status].label}</span>
                  </td>
                  <td className="px-6 py-4">
                    {(a.status === 'active' || a.status === 'paused') && (
                      <button onClick={() => toggle(a.id)} title={a.status === 'active' ? 'إيقاف' : 'تشغيل'} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-diyar-dark">
                        {a.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <form onSubmit={create} onClick={(e) => e.stopPropagation()} className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" data-testid="ads-form">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <h3 className="text-xl font-bold text-diyar-dark">إعلان جديد</h3>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto p-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">عنوان الإعلان</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} data-testid="ads-title" className="w-full rounded-lg border border-gray-200 p-2.5 focus:border-diyar-brown focus:outline-none" placeholder="مثال: خصم 20% على غرف النوم" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">الموضع</label>
                <select value={slot} onChange={(e) => setSlot(e.target.value)} className="w-full appearance-none rounded-lg border border-gray-200 bg-white p-2.5 focus:border-diyar-brown focus:outline-none">
                  {SLOTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label} — {s.price.toLocaleString('en-US')} ر.س/أسبوع
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">من</label>
                  <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} data-testid="ads-from" className="w-full rounded-lg border border-gray-200 p-2.5 focus:border-diyar-brown focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">إلى</label>
                  <input type="date" value={to} onChange={(e) => setTo(e.target.value)} data-testid="ads-to" className="w-full rounded-lg border border-gray-200 p-2.5 focus:border-diyar-brown focus:outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">رابط الإعلان</label>
                <input value={link} onChange={(e) => setLink(e.target.value)} dir="ltr" className="w-full rounded-lg border border-gray-200 p-2.5 focus:border-diyar-brown focus:outline-none" placeholder="/look/1/products?store=..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">صورة البانر — 2400×700 للكمبيوتر، و1200×900 للجوال (اختياري)</label>
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-200 bg-gray-50 text-gray-400">
                    {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <ImageIcon size={20} />}
                  </div>
                  <input value={img} onChange={(e) => setImg(e.target.value)} dir="ltr" className="w-full rounded-lg border border-gray-200 p-2.5 focus:border-diyar-brown focus:outline-none" placeholder="رابط الصورة" />
                </div>
              </div>
              <p className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={13} /> يُراجع الإعلان من فريق ديار خلال يوم عمل قبل نشره.
              </p>
            </div>
            <div className="flex shrink-0 justify-end gap-3 border-t border-gray-100 bg-gray-50 p-6">
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl px-5 py-2.5 font-bold text-gray-600 transition hover:bg-gray-200">
                إلغاء
              </button>
              <button type="submit" data-testid="ads-submit" className="rounded-xl bg-diyar-brown px-5 py-2.5 font-bold text-white transition hover:bg-[#8A6D46]">
                إرسال للمراجعة
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
