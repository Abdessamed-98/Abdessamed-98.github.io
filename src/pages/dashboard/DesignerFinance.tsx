import React, { useState } from 'react';
import { ArrowUpRight, Download, Clock, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { COMMISSION, PAST_DESIGNS, sar } from './designerData';

export default function DesignerFinance() {
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const data = [
    { name: '1 سبتمبر', net: 310 },
    { name: '5 سبتمبر', net: 520 },
    { name: '10 سبتمبر', net: 0 },
    { name: '15 سبتمبر', net: 460 },
    { name: '20 سبتمبر', net: 280 },
    { name: '25 سبتمبر', net: 730 },
    { name: '30 سبتمبر', net: 710 },
  ];
  const paid = PAST_DESIGNS.filter((d) => d.bought > 0);
  const earned = paid.reduce((n, d) => n + Math.round(d.bought * COMMISSION), 0);
  const pending = PAST_DESIGNS.filter((d) => d.bought === 0).reduce((n, d) => n + Math.round(d.total * COMMISSION), 0);

  return (
    <div className="space-y-6" data-testid="designer-finance">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-diyar-dark">المالية</h2>
          <p className="mt-1 text-sm text-gray-500">عمولتك عن كل ما يشتريه العملاء من تصاميمك.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 shadow-sm transition hover:bg-gray-50">
          <Download size={18} />
          تصدير كشف حساب
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl bg-purple-600 p-6 text-white shadow-sm">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-white/10"></div>
          <div className="relative z-10">
            <h3 className="mb-2 font-medium text-white/80">رصيد قابل للسحب</h3>
            <div className="mb-6 flex items-end gap-2">
              <span className="text-4xl font-bold">{sar(earned)}</span>
              <span className="text-lg text-white/80">ر.س</span>
            </div>
            <button onClick={() => setIsPayoutModalOpen(true)} className="w-full rounded-xl bg-white py-2.5 font-bold text-purple-600 shadow-sm transition hover:bg-gray-50">
              طلب سحب رصيد
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-gray-500">عمولات هذا الشهر</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-diyar-dark">{sar(earned)}</span>
            <span className="mb-1 text-sm font-bold text-gray-500">ر.س</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">{COMMISSION * 100}% من مشتريات العملاء من تصاميمك</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-gray-500">عمولات متوقعة</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock size={20} />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-diyar-dark">{sar(pending)}</span>
            <span className="mb-1 text-sm font-bold text-gray-500">ر.س</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">تصاميم أُرسلت ولم يشترِ العميل منها بعد</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-6 font-bold text-diyar-dark">العمولات خلال الشهر</h3>
        <div className="h-72" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Line type="monotone" dataKey="net" stroke="#9333ea" strokeWidth={3} dot={{ r: 4, fill: '#9333ea', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h3 className="font-bold text-diyar-dark">عمولات التصاميم</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">التصميم</th>
                <th className="px-6 py-4 font-medium">العميل</th>
                <th className="px-6 py-4 font-medium">التاريخ</th>
                <th className="px-6 py-4 font-medium">مشتريات العميل</th>
                <th className="px-6 py-4 font-medium">عمولتك</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paid.map((d) => (
                <tr key={d.id} className="transition hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-diyar-dark">
                    {d.room} <span className="font-normal text-gray-400">· {d.id}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{d.client}</td>
                  <td className="px-6 py-4 text-gray-500">{d.date}</td>
                  <td className="px-6 py-4 text-gray-700">{sar(d.bought)} ر.س</td>
                  <td className="px-6 py-4 font-bold text-green-600">+ {sar(Math.round(d.bought * COMMISSION))} ر.س</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4 duration-300 animate-in fade-in">
          <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-300 animate-in zoom-in-95 md:rounded-3xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <h3 className="text-xl font-bold text-diyar-dark">طلب سحب رصيد</h3>
              <button onClick={() => setIsPayoutModalOpen(false)} className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4">
                <span className="text-sm text-gray-500">الرصيد المتاح للسحب</span>
                <span className="text-lg font-bold text-purple-600">{sar(earned)} ر.س</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">المبلغ المطلوب سحبه</label>
                  <input type="number" placeholder="0.00" className="w-full rounded-lg border border-gray-200 p-2.5 focus:border-purple-500 focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">الحساب البنكي</label>
                  <select className="w-full appearance-none rounded-lg border border-gray-200 bg-white p-2.5 focus:border-purple-500 focus:outline-none">
                    <option>البنك الأهلي السعودي - ينتهي بـ 4567</option>
                    <option>مصرف الراجحي - ينتهي بـ 1234</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-400">يستغرق التحويل من 1-3 أيام عمل</p>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 justify-end gap-3 border-t border-gray-100 bg-gray-50 p-6">
              <button onClick={() => setIsPayoutModalOpen(false)} className="rounded-xl px-5 py-2.5 font-bold text-gray-600 transition hover:bg-gray-200">إلغاء</button>
              <button onClick={() => setIsPayoutModalOpen(false)} className="rounded-xl bg-purple-600 px-5 py-2.5 font-bold text-white transition hover:bg-purple-700">تقديم الطلب</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
