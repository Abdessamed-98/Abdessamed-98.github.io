import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Send, ShoppingBag, X, Plus } from 'lucide-react';
import { DesignPreview } from './DesignerStudio';
import { COMMISSION, PAST_DESIGNS, loadSent, productOf, sar, type SentDesign } from './designerData';

const STATUS = {
  sent: { label: 'أُرسل', cls: 'bg-gray-100 text-gray-600', icon: Send },
  viewed: { label: 'شاهده العميل', cls: 'bg-blue-50 text-blue-600', icon: Eye },
  bought: { label: 'تم الشراء', cls: 'bg-green-50 text-green-700', icon: ShoppingBag },
} as const;

export default function DesignerDesigns() {
  const sentNow = loadSent();
  const [open, setOpen] = useState<SentDesign | null>(null);

  const rows = [
    ...sentNow.map((d) => ({ id: d.id, client: d.client, room: d.room, image: d.image, products: d.pins.length, total: d.total, date: `اليوم ${d.sentAt}`, status: 'sent' as const, bought: 0, full: d })),
    ...PAST_DESIGNS.map((d) => ({ ...d, full: null as SentDesign | null })),
  ];

  return (
    <div className="space-y-6" dir="rtl" data-testid="designer-designs">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-diyar-dark">تصاميمي المرسلة</h2>
          <p className="mt-1 text-sm text-gray-500">كل تصميم أرسلته لعميل، وما اشتراه منه، وعمولتك عنه.</p>
        </div>
        <Link to="/dashboard/designer/requests" className="flex items-center gap-2 rounded-xl bg-diyar-brown px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#8A6D46]">
          <Plus size={18} /> تصميم جديد
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">التصميم</th>
                <th className="px-6 py-4 font-medium">العميل</th>
                <th className="px-6 py-4 font-medium">التاريخ</th>
                <th className="px-6 py-4 font-medium">المنتجات</th>
                <th className="px-6 py-4 font-medium">قيمة التصميم</th>
                <th className="px-6 py-4 font-medium">اشترى العميل</th>
                <th className="px-6 py-4 font-medium">عمولتك</th>
                <th className="px-6 py-4 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((d) => {
                const st = STATUS[d.status];
                return (
                  <tr key={d.id} className="transition hover:bg-gray-50" data-testid="design-row">
                    <td className="px-6 py-4">
                      <button onClick={() => d.full && setOpen(d.full)} className={`flex items-center gap-3 text-right ${d.full ? 'cursor-pointer' : 'cursor-default'}`}>
                        <img src={d.image} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                        <span>
                          <span className="block font-bold text-diyar-dark">{d.room}</span>
                          <span className="block text-xs text-gray-400">{d.id}</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{d.client}</td>
                    <td className="px-6 py-4 text-gray-500">{d.date}</td>
                    <td className="px-6 py-4 text-gray-700">{d.products}</td>
                    <td className="px-6 py-4 font-bold text-diyar-dark">{sar(d.total)} ر.س</td>
                    <td className="px-6 py-4 text-gray-700">{d.bought ? `${sar(d.bought)} ر.س` : '—'}</td>
                    <td className="px-6 py-4 font-bold text-green-600">{d.bought ? `${sar(Math.round(d.bought * COMMISSION))} ر.س` : '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold ${st.cls}`}>
                        <st.icon size={13} /> {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(null)}>
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-diyar-dark">
                {open.room} — {open.client}
              </h3>
              <button onClick={() => setOpen(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <DesignPreview image={open.image} rendered={open.rendered} pins={open.pins} />
            <ul className="mt-4 space-y-2">
              {open.pins.map((p, i) => (
                <li key={p.productId} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-diyar-dark text-[11px] font-bold text-white">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-gray-700">{productOf(p.productId)?.name.ar}</span>
                  <span className="shrink-0 font-bold text-diyar-dark">{sar(productOf(p.productId)?.price ?? 0)} ر.س</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
