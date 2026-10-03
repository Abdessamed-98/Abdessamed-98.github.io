import React, { useState } from 'react';
import { Camera, Save } from 'lucide-react';

const inputCls = 'w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500';

function SaveButton() {
  return (
    <div className="flex justify-end pt-4">
      <button className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-700">
        <Save size={18} />
        حفظ التغييرات
      </button>
    </div>
  );
}

export default function DesignerSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [available, setAvailable] = useState(true);

  return (
    <div className="max-w-4xl space-y-6" data-testid="designer-settings">
      <div>
        <h2 className="text-2xl font-bold text-diyar-dark">إعدادات الحساب</h2>
        <p className="mt-1 text-sm text-gray-500">ملفك كمصمم في فريق ديار، وتوفرك لاستقبال طلبات العملاء.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 pb-2 scrollbar-hide">
        {[
          { id: 'profile', label: 'ملف المصمم' },
          { id: 'account', label: 'الحساب الشخصي' },
          { id: 'notifications', label: 'الإشعارات' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
              <div>
                <h4 className="font-bold text-diyar-dark">متاح لاستقبال الطلبات</h4>
                <p className="mt-1 text-sm text-gray-500">عند الإيقاف لن تصلك غرف جديدة من «استشر مصمم».</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:right-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:-translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>

            <div>
              <h3 className="mb-4 font-bold text-diyar-dark">صورة المصمم</h3>
              <div className="flex items-center gap-6">
                <div className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-purple-50 text-3xl font-bold text-purple-600">
                  ل
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm text-gray-500">الصيغ المدعومة: JPG, PNG. الحد الأقصى للحجم 2MB.</p>
                  <button className="rounded-xl border border-purple-600 px-4 py-2 text-sm font-bold text-purple-600 transition hover:bg-purple-50">تغيير الصورة</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">التخصص</label>
                <input type="text" defaultValue="مصممة داخلية — فريق ديار" className={inputCls} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">الأنماط التي تتقنها</label>
                <input type="text" defaultValue="مودرن، كلاسيك معاصر، بوهيمي" className={inputCls} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">نبذة تعريفية</label>
                <textarea rows={4} defaultValue="خبرة 6 سنوات في تصميم المساحات السكنية وتنسيق الأثاث." className={inputCls}></textarea>
              </div>
            </div>

            <SaveButton />
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">الاسم الكامل</label>
                <input type="text" defaultValue="لمى القحطاني" className={`${inputCls} bg-gray-50/50`} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">البريد الإلكتروني</label>
                <input type="email" defaultValue="lama@example.com" className={`${inputCls} bg-gray-50/50`} dir="ltr" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">رقم الجوال</label>
                <input type="tel" defaultValue="+966 50 123 4567" className={`${inputCls} bg-gray-50/50`} dir="ltr" />
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="mb-4 font-bold text-diyar-dark">كلمة المرور</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">كلمة المرور الحالية</label>
                  <input type="password" placeholder="••••••••" className={`${inputCls} bg-gray-50/50`} dir="ltr" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">كلمة المرور الجديدة</label>
                  <input type="password" placeholder="••••••••" className={`${inputCls} bg-gray-50/50`} dir="ltr" />
                </div>
              </div>
            </div>

            <SaveButton />
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-8">
            <div>
              <h3 className="mb-6 font-bold text-diyar-dark">إعدادات الإشعارات</h3>
              <div className="space-y-4">
                {[
                  { id: 1, title: 'طلبات تصميم جديدة', desc: 'إشعار عند وصول غرفة جديدة من عميل' },
                  { id: 2, title: 'الرسائل والمحادثات', desc: 'إشعارات الرسائل الجديدة من العملاء' },
                  { id: 3, title: 'مشاهدة التصميم', desc: 'إشعار عندما يفتح العميل التصميم الذي أرسلته' },
                  { id: 4, title: 'شراء من تصميمك', desc: 'إشعار عند شراء العميل قطعاً من تصميمك' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition-colors hover:border-gray-200">
                    <div>
                      <h4 className="font-bold text-diyar-dark">{item.title}</h4>
                      <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" defaultChecked={item.id !== 3} />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:right-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:-translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <SaveButton />
          </div>
        )}
      </div>
    </div>
  );
}
