import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Sofa, CookingPot, MonitorSmartphone, Paintbrush, Wrench, PackageSearch, Lamp, Blinds, UtensilsCrossed, Trees, Bath, PaintRoller, Truck } from 'lucide-react';

const categories = [
  { id: "bedroom", name: "غرف النوم", icon: BedDouble, img: "/categories/%D8%BA%D8%B1%D9%81%20%D8%A7%D9%84%D9%86%D9%88%D9%85.png" },
  { id: "living-room", name: "الصالونات", icon: Sofa, img: "/categories/%D8%A7%D9%84%D8%B5%D8%A7%D9%84%D9%88%D9%86%D8%A7%D8%AA.png" },
  { id: "kitchen", name: "المطابخ", icon: CookingPot, img: "/categories/%D8%A7%D9%84%D9%85%D8%B7%D8%A7%D8%A8%D8%AE.png" },
  { id: "dining", name: "غرف الطعام", icon: UtensilsCrossed, img: "/categories/غرف الطعام.png" },
  { id: "office", name: "المكاتب", icon: MonitorSmartphone, img: "/categories/%D8%A7%D9%84%D9%85%D9%83%D8%A7%D8%AA%D8%A8.png" },
  { id: "decor", name: "ديكورات", icon: PackageSearch, img: "/categories/%D8%AF%D9%8A%D9%83%D9%88%D8%B1%D8%A7%D8%AA.png" },
  { id: "lighting", name: "الإضاءة", icon: Lamp, img: "/categories/الإضاءة.png" },
  { id: "curtains", name: "الستائر", icon: Blinds, img: "/categories/الستائر.png" },
  { id: "outdoor", name: "أثاث خارجي", icon: Trees, img: "/categories/أثاث خارجي.png" },
  { id: "bathroom", name: "الحمامات", icon: Bath, img: "/categories/الحمامات.png" },
  { id: "interior-design", name: "تصميم داخلي", icon: Paintbrush, isService: true, img: "/categories/%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D8%AF%D8%A7%D8%AE%D9%84%D9%8A.png" },
  { id: "maintenance", name: "تركيب وصيانة", icon: Wrench, isService: true, img: "/categories/%D8%AA%D8%B1%D9%83%D9%8A%D8%A8%20%D9%88%D8%B5%D9%8A%D8%A7%D9%86%D8%A9.png" },
  { id: "painting", name: "دهانات", icon: PaintRoller, isService: true, img: "/categories/دهانات.png" },
  { id: "moving", name: "نقل وتغليف", icon: Truck, isService: true, img: "/categories/نقل وتغليف.png" },
];

export default function CategoriesStrip() {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  return (
    <div className="max-w-7xl mx-auto py-8 md:py-12 px-4">
      <div className="grid grid-rows-2 grid-flow-col auto-cols-max justify-start gap-x-2 gap-y-3 overflow-x-auto scrollbar-hide snap-x px-4 -mx-4 md:grid-flow-row md:grid-cols-7 md:overflow-visible md:gap-x-4 md:gap-y-5 md:px-0 md:mx-0">
        {categories.map((cat, i) => (
          <Link to={`/category/${cat.id}`} key={i} className="flex flex-col items-center cursor-pointer group snap-start shrink-0 w-24 sm:w-28 md:w-full">
            <div className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-full md:h-auto md:aspect-square rounded-xl mb-3 overflow-hidden transition duration-300 group-hover:-translate-y-2 group-hover:shadow-md flex items-center justify-center ${cat.isService ? 'bg-diyar-brown text-diyar-cream border-2 border-diyar-dark' : 'bg-diyar-cream text-diyar-dark border-2 border-diyar-cream'}`}>
              <img 
                src={cat.img} 
                alt={cat.name} 
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${loadedImages[cat.name] ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setLoadedImages(prev => ({...prev, [cat.name]: true}))}
                onError={() => setLoadedImages(prev => ({...prev, [cat.name]: false}))}
              />
              <div className={`absolute inset-0 flex items-center justify-center bg-inherit transition-opacity duration-300 ${loadedImages[cat.name] ? 'opacity-0' : 'opacity-100'}`}>
                <cat.icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex flex-col items-center text-center min-h-[34px] md:min-h-[38px]">
              <span className="font-medium text-diyar-dark group-hover:text-diyar-brown transition text-xs md:text-sm leading-tight">{cat.name}</span>
              {cat.isService && <span className="text-[10px] text-diyar-brown mt-1 font-bold">خدمات</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
