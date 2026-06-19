import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Building2, ChevronDown, Briefcase, Factory } from 'lucide-react';

const B2B_COMPANIES = [
  {
    id: '1',
    name: 'مصنع الأخشاب الحديثة',
    logo: 'https://ui-avatars.com/api/?name=م+أ&background=F3F4F6&color=4B5563&size=100',
    type: 'تصنيع أثاث',
    rating: 4.8,
    reviews: 124,
    location: 'الرياض، الصناعية الثانية',
    description: 'متخصصون في تصنيع الكنب والمجالس العربية بأعلى معايير الجودة للشركات والفنادق.',
    tags: ['كنب', 'مجالس', 'جملة'],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    name: 'مؤسسة رواد الديكور',
    logo: 'https://ui-avatars.com/api/?name=ر+د&background=F3F4F6&color=4B5563&size=100',
    type: 'تصميم داخلي',
    rating: 4.9,
    reviews: 86,
    location: 'جدة، شارع التحلية',
    description: 'نقدم خدمات التصميم الداخلي المبتكر للمكاتب والمطاعم والمعارض التجارية.',
    tags: ['تصميم مكاتب', 'مطاعم', 'تنفيذ ديكور'],
    coverImage: 'https://images.unsplash.com/photo-1600585154526-990dced4ea0d?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '3',
    name: 'الشركة العالمية للأقمشة',
    logo: 'https://ui-avatars.com/api/?name=ش+ع&background=F3F4F6&color=4B5563&size=100',
    type: 'توريد مواد خام',
    rating: 4.7,
    reviews: 210,
    location: 'الدمام، الخالدية',
    description: 'موردون معتمدون لأرقى أنواع الأقمشة والإسفنج لمصانع الأثاث في المملكة.',
    tags: ['أقمشة', 'إسفنج', 'موردين جملة'],
    coverImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '4',
    name: 'مصنع الصلب للأثاث المكتبي',
    logo: 'https://ui-avatars.com/api/?name=م+ص&background=F3F4F6&color=4B5563&size=100',
    type: 'تصنيع أثاث',
    rating: 4.6,
    reviews: 156,
    location: 'الرياض، السلي',
    description: 'تصنيع الأثاث المكتبي المتين والعصري: مكاتب، دواليب، كراسي مريحة للشركات.',
    tags: ['أثاث مكتبي', 'كراسي', 'دواليب'],
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
  }
];

export default function B2BPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('الكل');

  const types = ['الكل', 'تصنيع أثاث', 'تصميم داخلي', 'توريد مواد خام'];

  const filteredCompanies = B2B_COMPANIES.filter(company => {
    const matchesSearch = company.name.includes(searchTerm) || company.description.includes(searchTerm);
    const matchesType = selectedType === 'الكل' || company.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-diyar-dark mb-4">بوابة الأعمال (B2B)</h1>
          <p className="text-gray-600 max-w-3xl text-lg">
            دليلك الشامل لأفضل المصانع، شركات التصميم، وموردي المواد الخام. تواصل مباشرة مع شركاء النجاح واطلب عروض أسعار لمشاريعك.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="ابحث عن شركة، مصنع، أو تخصص..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-diyar-brown outline-none"
            />
          </div>
          <div className="relative md:w-64 shrink-0">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-diyar-brown outline-none appearance-none font-medium text-gray-700"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(company => (
             <div key={company.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
               <div className="h-40 relative overflow-hidden">
                 <img 
                   src={company.coverImage} 
                   alt={company.name} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 <div className="absolute bottom-4 left-4 bg-white px-2 py-1 rounded text-xs font-bold text-diyar-dark flex items-center gap-1 shadow">
                   {company.type === 'تصنيع أثاث' ? <Factory size={14} /> : company.type === 'تصميم داخلي' ? <Briefcase size={14} /> : <Building2 size={14} />}
                   {company.type}
                 </div>
               </div>
               
               <div className="p-5 relative flex-1 flex flex-col">
                 <div className="w-16 h-16 rounded-xl bg-white shadow-md border border-gray-100 absolute -top-8 right-5 overflow-hidden flex items-center justify-center p-1">
                    <img src={company.logo} alt={company.logo} className="w-full h-full object-contain rounded-lg" />
                 </div>
                 
                 <div className="mt-8 flex justify-between items-start mb-2">
                   <h3 className="font-bold text-lg text-diyar-dark line-clamp-1">{company.name}</h3>
                   <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-xs shrink-0">
                     <Star size={12} className="text-yellow-500 fill-yellow-500" />
                     <span className="font-bold">{company.rating}</span>
                     <span className="text-gray-500">({company.reviews})</span>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                   <MapPin size={14} />
                   <span>{company.location}</span>
                 </div>
                 
                 <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                   {company.description}
                 </p>
                 
                 <div className="flex flex-wrap gap-2 mb-6">
                   {company.tags.map(tag => (
                     <span key={tag} className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-md border border-gray-100">
                       {tag}
                     </span>
                   ))}
                 </div>
                 
                 <div className="mt-auto pt-4 border-t border-gray-50">
                    <Link 
                      to={`/b2b/${company.id}`}
                      className="block w-full text-center bg-diyar-cream/10 text-diyar-brown border border-diyar-brown hover:bg-diyar-brown hover:text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
                    >
                      زيارة ملف الشركة
                    </Link>
                 </div>
               </div>
             </div>
          ))}
        </div>
        
        {filteredCompanies.length === 0 && (
          <div className="text-center py-20">
            <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">لم يتم العثور على شركات تطابق بحثك</p>
          </div>
        )}

      </div>
    </div>
  );
}
