import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Building2, Phone, Mail, Globe, ArrowRight, CheckCircle2, MessageSquare, Briefcase, Users, LayoutDashboard, Send } from 'lucide-react';

const B2B_COMPANIES = {
  '1': {
    id: '1',
    name: 'مصنع الأخشاب الحديثة',
    logo: 'https://ui-avatars.com/api/?name=م+أ&background=F3F4F6&color=4B5563&size=200',
    type: 'تصنيع أثاث',
    rating: 4.8,
    reviews: 124,
    location: 'الرياض، الصناعية الثانية',
    description: 'متخصصون في تصنيع الكنب والمجالس العربية بأعلى معايير الجودة للشركات والفنادق والمشاريع الكبرى. نعتمد على أحدث التقنيات وأفضل أنواع الأخشاب والإسفنج لضمان المتانة والراحة.',
    tags: ['كنب', 'مجالس', 'جملة', 'تأثيث فنادق', 'طاولات خشبية'],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    stats: { years: 12, employees: '50-100', projects: 300 },
    contact: {
      phone: '+966 50 123 4567',
      email: 'info@modernwood.sa',
      website: 'www.modernwood.sa'
    },
    services: [
      'تفصيل أثاث حسب الطلب',
      'تأثيث الفنادق والمنتجعات',
      'بيع بالجملة للمعارض',
      'صيانة وتجديد الأثاث'
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=400'
    ]
  },
  // Add fallback for others if needed
};

export default function B2BCompanyPage() {
  const { id } = useParams();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  
  // Use company 1 as fallback for demo
  const company = B2B_COMPANIES[id as keyof typeof B2B_COMPANIES] || B2B_COMPANIES['1'];

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSent(true);
    setTimeout(() => {
      setIsQuoteModalOpen(false);
      setQuoteSent(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Cover Image */}
      <div className="h-64 md:h-80 w-full relative">
        <img src={company.coverImage} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
        <Link to="/b2b" className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-diyar-dark transition p-0 z-10">
          <ArrowRight size={20} />
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative -mt-24 z-10">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-end">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white shadow-lg border-4 border-white overflow-hidden shrink-0 mt-[-80px] relative z-20">
             <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-diyar-brown font-bold mb-2">
              <Building2 size={16} />
              <span>{company.type}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-diyar-dark mb-2">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
               <span className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" /> {company.location}</span>
               <span className="flex items-center gap-1.5 text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-md">
                 <Star size={16} className="fill-yellow-500" /> {company.rating} ({company.reviews} تقييم)
               </span>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex flex-col gap-3">
             <button
               onClick={() => setIsQuoteModalOpen(true)}
               className="w-full md:w-auto bg-diyar-brown text-white px-8 py-3 rounded-xl font-bold hover:bg-[#8A6D46] transition-colors shadow-lg shadow-diyar-brown/20 flex items-center justify-center gap-2"
             >
               <MessageSquare size={18} />
               طلب عرض سعر
             </button>
             <div className="flex justify-center gap-2">
                <a href={`tel:${company.contact.phone}`} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:text-diyar-brown hover:bg-diyar-cream/10 transition">
                  <Phone size={18} />
                </a>
                <a href={`mailto:${company.contact.email}`} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:text-diyar-brown hover:bg-diyar-cream/10 transition">
                  <Mail size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:text-diyar-brown hover:bg-diyar-cream/10 transition">
                  <Globe size={18} />
                </a>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-diyar-dark mb-4">عن الشركة</h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {company.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-6">
                 {company.tags.map(tag => (
                   <span key={tag} className="bg-gray-50 text-gray-600 text-sm px-3 py-1.5 rounded-lg border border-gray-100">
                     {tag}
                   </span>
                 ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-diyar-dark mb-6">معرض الأعمال</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 {company.portfolio.map((img, idx) => (
                   <div key={idx} className="aspect-square rounded-2xl overflow-hidden group relative">
                     <img src={img} alt={`Portolio ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-diyar-dark mb-4">نبذة سريعة</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <LayoutDashboard size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">الخبرة</p>
                    <p className="font-bold text-diyar-dark">+{company.stats.years} سنوات</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">حجم الفريق</p>
                    <p className="font-bold text-diyar-dark">{company.stats.employees} موظف</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">المشاريع المنجزة</p>
                    <p className="font-bold text-diyar-dark">+{company.stats.projects} مشروع</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-diyar-dark mb-4">الخدمات المقدمة</h3>
              <ul className="flex flex-col gap-3">
                {company.services.map((service, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Quote Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 animate-in zoom-in-95 duration-200">
            {quoteSent ? (
               <div className="text-center py-10">
                 <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Send size={32} />
                 </div>
                 <h2 className="text-2xl font-bold text-diyar-dark mb-2">تم الإرسال بنجاح!</h2>
                 <p className="text-gray-500">سيتم التواصل معك من قبل الشركة في أقرب وقت ممكن.</p>
               </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-diyar-dark">طلب عرض سعر</h2>
                  <button onClick={() => setIsQuoteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleQuoteSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع المشروع / الطلب</label>
                    <input type="text" required placeholder="مثال: تأثيث فندق، شراء جملة..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-diyar-brown focus:ring-1 focus:ring-diyar-brown" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الكمية المقدرة</label>
                    <input type="text" placeholder="مثال: 50 طقم كنب" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-diyar-brown focus:ring-1 focus:ring-diyar-brown" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">التفاصيل الكاملة</label>
                    <textarea rows={4} required placeholder="اشرح احتياجاتك بالتفصيل ليتمكن المورد من تقديم عرض دقيق..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-diyar-brown focus:ring-1 focus:ring-diyar-brown resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الميزانية التقديرية (اختياري)</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-diyar-brown focus:ring-1 focus:ring-diyar-brown">
                      <option value="">غير محدد</option>
                      <option value="1">أقل من 10,000 ريال</option>
                      <option value="2">10,000 - 50,000 ريال</option>
                      <option value="3">50,000 - 200,000 ريال</option>
                      <option value="4">أكثر من 200,000 ريال</option>
                    </select>
                  </div>
                  
                  <div className="mt-4 flex gap-3">
                    <button type="submit" className="flex-1 bg-diyar-brown text-white py-3 rounded-xl font-bold hover:bg-[#8A6D46] transition-colors">
                      إرسال الطلب
                    </button>
                    <button type="button" onClick={() => setIsQuoteModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                      إلغاء
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
