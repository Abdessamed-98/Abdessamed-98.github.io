import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, MapPin, Wallet, CheckCircle2, MessageSquare, Palette } from 'lucide-react';
import { REQUESTS, loadSent } from './designerData';

export default function DesignerRequests() {
  const [tab, setTab] = useState<'open' | 'sent'>('open');
  const sent = loadSent();
  const isSent = (id: string, status: string) => status === 'sent' || sent.some((s) => s.requestId === id);
  const list = REQUESTS.filter((r) => (tab === 'sent') === isSent(r.id, r.status));

  return (
    <div className="space-y-6" dir="rtl" data-testid="designer-requests">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-diyar-dark">طلبات العملاء</h1>
        <p className="text-gray-500">عملاء أرسلوا صور غرفهم عبر «استشر مصمم». افتح الطلب لتصمّم الغرفة وتضع عليها المنتجات.</p>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button onClick={() => setTab('open')} className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === 'open' ? 'bg-diyar-brown text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            بانتظار التصميم
          </button>
          <button onClick={() => setTab('sent')} className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === 'sent' ? 'bg-diyar-brown text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            تم إرسال التصميم
          </button>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="ابحث باسم العميل أو الغرفة..." className="w-full rounded-lg border border-gray-100 bg-gray-50 py-2 pl-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-diyar-brown" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <Link to={`/dashboard/designer/studio/${r.id}`} key={r.id} data-testid="designer-request" className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
              <img src={r.photo} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute right-3 top-3 rounded-lg bg-white/90 px-3 py-1 text-xs font-bold text-diyar-dark">صورة العميل</span>
              {r.status === 'working' && tab === 'open' && <span className="absolute left-3 top-3 rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-white">قيد العمل</span>}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-3 flex items-start justify-between">
                <span className="inline-block rounded-lg bg-diyar-cream/30 px-3 py-1 text-xs font-bold text-diyar-brown">{r.room}</span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={12} /> {r.date}
                </span>
              </div>
              <h3 className="mb-2 font-bold text-gray-800 transition-colors group-hover:text-diyar-brown">طلب {r.client}</h3>
              <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-600">{r.note}</p>
              <div className="mb-5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={14} className="text-gray-400" /> {r.city}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Wallet size={14} className="text-gray-400" />
                  <span className="font-medium text-gray-700">الميزانية: {r.budget}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Palette size={14} className="text-gray-400" /> {r.style}
                </div>
              </div>
              <hr className="mb-4 border-gray-50" />
              {tab === 'open' ? (
                <div className="w-full rounded-xl bg-diyar-brown py-2 text-center text-sm font-bold text-white transition-colors group-hover:bg-[#8A6D46]">فتح في استوديو التصميم</div>
              ) : (
                <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 py-2 text-sm font-bold text-green-700">
                  <CheckCircle2 size={16} /> تم إرسال التصميم
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-10 text-center">
          <MessageSquare size={48} className="mb-4 text-gray-200" />
          <h3 className="mb-2 text-lg font-bold text-gray-700">لا توجد طلبات هنا حالياً</h3>
          <p className="max-w-sm text-sm text-gray-500">{tab === 'open' ? 'ستظهر هنا الغرف التي يرسلها العملاء عبر «استشر مصمم».' : 'التصاميم التي ترسلها تنتقل إلى هنا.'}</p>
        </div>
      )}
    </div>
  );
}
