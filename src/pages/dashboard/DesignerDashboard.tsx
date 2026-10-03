import React from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Images, ShoppingBag, DollarSign, Clock, ArrowLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { COMMISSION, PAST_DESIGNS, REQUESTS, loadSent, sar } from './designerData';

export default function DesignerDashboard() {
  const data = [
    { name: 'السبت', sales: 2400 },
    { name: 'الأحد', sales: 0 },
    { name: 'الإثنين', sales: 9130 },
    { name: 'الثلاثاء', sales: 3100 },
    { name: 'الأربعاء', sales: 0 },
    { name: 'الخميس', sales: 8870 },
    { name: 'الجمعة', sales: 5200 },
  ];
  const sentNow = loadSent();
  const waiting = REQUESTS.filter((r) => r.status !== 'sent' && !sentNow.some((s) => s.requestId === r.id));
  const sold = PAST_DESIGNS.reduce((n, d) => n + d.bought, 0);

  const stats = [
    { label: 'طلبات بانتظارك', value: String(waiting.length), icon: Inbox, tone: 'bg-purple-50 text-purple-600' },
    { label: 'تصاميم أُرسلت هذا الشهر', value: String(PAST_DESIGNS.length + sentNow.length), icon: Images, tone: 'bg-blue-50 text-blue-600' },
    { label: 'مبيعات من تصاميمك', value: sar(sold), unit: 'ر.س', icon: ShoppingBag, tone: 'bg-amber-50 text-amber-600' },
    { label: 'عمولتك هذا الشهر', value: sar(Math.round(sold * COMMISSION)), unit: 'ر.س', icon: DollarSign, tone: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="space-y-6" data-testid="designer-dashboard">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-gray-500">{s.label}</h3>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.tone}`}>
                <s.icon size={20} />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-diyar-dark">{s.value}</span>
              {s.unit && <span className="mb-1 text-sm font-bold text-diyar-dark">{s.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-6 font-bold text-diyar-dark">مشتريات العملاء من تصاميمك خلال 7 أيام</h3>
          <div className="h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorDesignSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="sales" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#colorDesignSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-bold text-diyar-dark">غرف بانتظار تصميمك</h3>
            <Link to="/dashboard/designer/requests" className="text-sm font-medium text-diyar-brown hover:underline">
              عرض الكل
            </Link>
          </div>
          <div className="space-y-4">
            {waiting.map((r) => (
              <Link key={r.id} to={`/dashboard/designer/studio/${r.id}`} className="group flex items-center gap-3">
                <img src={r.photo} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-bold text-diyar-dark transition-colors group-hover:text-diyar-brown">
                    {r.room} — {r.client}
                  </h4>
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} /> {r.date}
                  </p>
                </div>
                <ArrowLeft size={16} className="shrink-0 text-gray-300 group-hover:text-diyar-brown" />
              </Link>
            ))}
            {waiting.length === 0 && <p className="text-sm text-gray-400">لا توجد طلبات بانتظارك الآن.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
