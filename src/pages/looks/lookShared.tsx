/**
 * Shared data + bits for the 3 redesign "looks" (client design-direction demos).
 * Each look page (LookOne/LookTwo/LookThree) is a self-contained homepage variant
 * that imports ONLY from this module, so the looks stay content-consistent.
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PenTool, DoorOpen, Armchair, PaintRoller, Layers, Sparkles, PanelTop, ShieldCheck,
} from 'lucide-react';

export interface LookProduct {
  id: number;
  img: string;
  brand: string;
  nameEn: string;
  nameAr: string;
  price: number;
  oldPrice?: number;
  rating: number;
  sale?: boolean;
}

export interface LookCategory {
  img: string;
  en: string;
  ar: string;
}

export interface LookService {
  icon: React.ComponentType<{ size?: number | string; className?: string; strokeWidth?: number }>;
  en: string;
  ar: string;
}

export interface LookStyle {
  img: string;
  en: string;
  ar: string;
  count: number;
}

export interface LookSlide {
  img: string;
  ar: string;
  en: string;
  tag: string;
  tagAr: string;
}

/** Active language of a look page. The site is primarily Arabic. */
export type Lang = 'ar' | 'en';

/** A bilingual string pair. */
export interface Bi {
  en: string;
  ar: string;
}

export const IMG = {
  hero: '/looks/hero-green-sofa.jpg',
  workshop: '/looks/workshop.jpg',
  restaurant: '/looks/restaurant.jpg',
  loungeDark: '/looks/lounge-dark.jpg',
  bedroom: '/looks/bedroom.jpg',
  roomHotspots: '/looks/room-hotspots.jpg',
  catHome: '/looks/cat-home.jpg',
  catOffice: '/looks/cat-office.jpg',
  catLighting: '/looks/cat-lighting.jpg',
  b2bWide: '/looks/b2b-wide.jpg',
} as const;

export const HERO_SLIDES: LookSlide[] = [
  { img: IMG.hero, ar: 'ديـــار لكل دار', en: 'Diyar for Every Home', tag: 'NEW COLLECTION', tagAr: 'تشكيلة جديدة' },
  { img: IMG.workshop, ar: 'نصنع أثاثك كما تتخيله', en: 'Crafted to Your Vision', tag: 'CUSTOM MANUFACTURING', tagAr: 'تصنيع حسب الطلب' },
  { img: IMG.loungeDark, ar: 'حلول متكاملة للشركات والمشاريع', en: 'Turnkey Project Solutions', tag: 'B2B SOLUTIONS', tagAr: 'حلول الشركات' },
];

export const NAV_LINKS = ['Home', 'Design Consultation', 'B2B Solutions', 'Services', 'Shop'] as const;

/** Bilingual nav items (same order as NAV_LINKS). */
export const NAV_ITEMS: Bi[] = [
  { en: 'Home', ar: 'الرئيسية' },
  { en: 'Design Consultation', ar: 'استشارات التصميم' },
  { en: 'B2B Solutions', ar: 'خدمات الشركات' },
  { en: 'Services', ar: 'الخدمات' },
  { en: 'Shop', ar: 'المتجر' },
];

export const FOOTER_QUICK: Bi[] = [
  { en: 'Home', ar: 'الرئيسية' },
  { en: 'Shop', ar: 'المتجر' },
  { en: 'Services', ar: 'الخدمات' },
  { en: 'B2B Solutions', ar: 'خدمات الشركات' },
  { en: 'About Us', ar: 'من نحن' },
  { en: 'Contact Us', ar: 'اتصل بنا' },
];

/** A mega-menu column: a category group with its subcategories. */
export interface MenuGroup {
  title: Bi;
  items: Bi[];
}

/** Shop mega-menu — groups and sub-items from the client's structure PDF. */
export const SHOP_MENU: MenuGroup[] = [
  {
    title: { en: 'Home Furniture', ar: 'الأثاث المنزلي' },
    items: [
      { en: 'Bedrooms', ar: 'غرف النوم' },
      { en: 'Living Rooms', ar: 'غرف المعيشة' },
      { en: 'Dining Rooms', ar: 'غرف الطعام' },
      { en: 'Entryway Furniture', ar: 'مداخل المنزل' },
      { en: 'Walk-In Closets', ar: 'غرف الملابس' },
      { en: 'Outdoor Seating', ar: 'الجلسات الخارجية' },
      { en: 'Laundry Rooms', ar: 'غرف الغسيل' },
    ],
  },
  {
    title: { en: 'Office Furniture', ar: 'الأثاث المكتبي' },
    items: [
      { en: 'Office Desks', ar: 'المكاتب' },
      { en: 'Office Chairs', ar: 'الكراسي المكتبية' },
      { en: 'Meeting Room Furniture', ar: 'أثاث غرف الاجتماعات' },
      { en: 'Storage Cabinets', ar: 'الخزائن' },
      { en: 'Reception Furniture', ar: 'أثاث الاستقبال' },
      { en: 'Workstations', ar: 'محطات العمل' },
    ],
  },
  {
    title: { en: 'Lighting', ar: 'الإنارات' },
    items: [
      { en: 'Chandeliers', ar: 'الثريات' },
      { en: 'Pendant Lights', ar: 'الإنارات المعلقة' },
      { en: 'Wall Lights', ar: 'الإنارات الجدارية' },
      { en: 'Floor Lamps', ar: 'الإنارات الأرضية' },
      { en: 'Table Lamps', ar: 'الأباجورات' },
      { en: 'Outdoor Lighting', ar: 'الإنارات الخارجية' },
      { en: 'Smart Lighting', ar: 'الإنارات الذكية' },
    ],
  },
  {
    title: { en: 'Rugs & Carpets', ar: 'السجاد' },
    items: [
      { en: 'Area Rugs', ar: 'السجاد' },
      { en: 'Runner Rugs', ar: 'سجاد الممرات' },
      { en: 'Bedroom Rugs', ar: 'سجاد غرف النوم' },
      { en: 'Living Room Rugs', ar: 'سجاد الصالونات' },
      { en: 'Outdoor Rugs', ar: 'السجاد الخارجي' },
    ],
  },
  {
    title: { en: 'Bathroom Solutions', ar: 'دورات المياه' },
    items: [
      { en: 'Wash Basins', ar: 'المغاسل' },
      { en: 'Faucets', ar: 'الصنابير' },
      { en: 'Shower Systems', ar: 'أنظمة الاستحمام' },
      { en: 'Bathroom Cabinets', ar: 'خزائن الحمام' },
      { en: 'Mirrors', ar: 'المرايا' },
      { en: 'Smart Bathroom Solutions', ar: 'حلول الحمامات الذكية' },
    ],
  },
  {
    title: { en: 'Accessories & Decor', ar: 'الإكسسوارات والديكور' },
    items: [
      { en: 'Wall Art', ar: 'اللوحات' },
      { en: 'Mirrors', ar: 'المرايا' },
      { en: 'Vases & Decorative Pieces', ar: 'التحف والفازات' },
      { en: 'Cushions', ar: 'الوسائد' },
      { en: 'Throws & Blankets', ar: 'البطانيات' },
      { en: 'Home Fragrances', ar: 'العطور المنزلية' },
    ],
  },
];

/** Services mega-menu — groups and sub-items from the client's structure PDF. */
export const SERVICES_MENU: MenuGroup[] = [
  {
    title: { en: 'Interior Design', ar: 'التصميم الداخلي' },
    items: [
      { en: 'Residential Design', ar: 'التصميم السكني' },
      { en: 'Commercial Design', ar: 'التصميم التجاري' },
      { en: 'Space Planning', ar: 'تخطيط المساحات' },
      { en: '3D Visualization', ar: 'التصاميم ثلاثية الأبعاد' },
      { en: 'Design Consultation', ar: 'الاستشارات التصميمية' },
    ],
  },
  {
    title: { en: 'Door Solutions', ar: 'حلول الأبواب' },
    items: [
      { en: 'Wooden Doors', ar: 'الأبواب الخشبية' },
      { en: 'WPC Doors', ar: 'أبواب WPC' },
      { en: 'Sliding Doors', ar: 'الأبواب المنزلقة' },
      { en: 'Glass Doors', ar: 'الأبواب الزجاجية' },
      { en: 'Custom Door Manufacturing', ar: 'أبواب حسب الطلب' },
    ],
  },
  {
    title: { en: 'Custom Furniture', ar: 'تنفيذ الأثاث' },
    items: [
      { en: 'Residential Furniture', ar: 'الأثاث السكني' },
      { en: 'Hotel Furniture', ar: 'أثاث الفنادق' },
      { en: 'Custom Joinery', ar: 'الأعمال الخشبية المخصصة' },
      { en: 'Built-In Furniture', ar: 'الأثاث الثابت' },
      { en: 'Wardrobes & Closets', ar: 'الخزائن وغرف الملابس' },
    ],
  },
  {
    title: { en: 'Painting & Wall Finishes', ar: 'الدهانات والجداريات' },
    items: [
      { en: 'Interior Painting', ar: 'الدهانات الداخلية' },
      { en: 'Exterior Painting', ar: 'الدهانات الخارجية' },
      { en: 'Wallpaper Installation', ar: 'تركيب ورق الجدران' },
      { en: 'Wall Panels', ar: 'ألواح الجدران' },
      { en: 'Decorative Finishes', ar: 'التشطيبات الديكورية' },
    ],
  },
  {
    title: { en: 'Flooring Solutions', ar: 'الأرضيات' },
    items: [
      { en: 'Porcelain Flooring', ar: 'أرضيات البورسلان' },
      { en: 'Marble Flooring', ar: 'الأرضيات الرخامية' },
      { en: 'SPC Flooring', ar: 'أرضيات SPC' },
      { en: 'Wooden Flooring', ar: 'الأرضيات الخشبية' },
      { en: 'Carpet Flooring', ar: 'الأرضيات الموكيت' },
    ],
  },
  {
    title: { en: 'Finishing & Decorative Works', ar: 'التشطيبات والديكورات' },
    items: [
      { en: 'Wall Cladding', ar: 'تشطيبات الواجهات' },
      { en: 'Architectural Details', ar: 'التشطيبات المعمارية' },
      { en: 'Decorative Finishes', ar: 'التشطيبات الديكورية' },
      { en: 'Turnkey Finishing', ar: 'التشطيبات المتكاملة' },
    ],
  },
  {
    title: { en: 'Glass & Skylight Facades', ar: 'واجهات الزجاج والسكوريت' },
    items: [
      { en: 'Glass Facades', ar: 'الواجهات الزجاجية' },
      { en: 'Skurit Systems', ar: 'أنظمة السكوريت' },
      { en: 'Skylights', ar: 'السكاي لايت' },
      { en: 'Glass Partitions', ar: 'القواطع الزجاجية' },
      { en: 'Storefront Systems', ar: 'واجهات المعارض والمحلات' },
    ],
  },
  {
    title: { en: 'Safety Equipment & Systems', ar: 'أدوات وأنظمة السلامة' },
    items: [
      { en: 'Fire Alarm Systems', ar: 'أنظمة إنذار الحريق' },
      { en: 'CCTV Systems', ar: 'أنظمة المراقبة' },
      { en: 'Access Control Systems', ar: 'أنظمة التحكم بالدخول' },
      { en: 'Safety Signage', ar: 'اللوحات الإرشادية' },
      { en: 'Safety Compliance', ar: 'حلول ومعايير السلامة' },
    ],
  },
];

/** Featured promo tiles for the rich mega-menu panels. */
export const MENU_FEATURED = {
  shop: [
    { img: IMG.hero, title: { en: 'New Collection', ar: 'التشكيلة الجديدة' } as Bi, cta: { en: 'Shop Now', ar: 'تسوق الآن' } as Bi },
    { img: IMG.catLighting, title: { en: 'Lighting Edit', ar: 'مختارات الإنارة' } as Bi, cta: { en: 'Discover', ar: 'اكتشف' } as Bi },
  ],
  services: [
    { img: IMG.roomHotspots, title: { en: 'Free Design Assistance', ar: 'مساعدة تصميم مجانية' } as Bi, cta: { en: 'Book a Session', ar: 'احجز جلسة' } as Bi },
    { img: IMG.workshop, title: { en: 'Custom Manufacturing', ar: 'تصنيع حسب الطلب' } as Bi, cta: { en: 'Start Your Project', ar: 'ابدأ مشروعك' } as Bi },
  ],
} as const;

export const FOOTER_SUPPORT: Bi[] = [
  { en: 'FAQ', ar: 'الأسئلة الشائعة' },
  { en: 'Shipping & Delivery', ar: 'الشحن والتوصيل' },
  { en: 'Returns & Exchanges', ar: 'الاسترجاع والاستبدال' },
  { en: 'Warranty', ar: 'الضمان' },
  { en: 'Track Order', ar: 'تتبع الطلب' },
];

export const CATEGORIES: LookCategory[] = [
  { img: IMG.catHome, en: 'Home Furniture', ar: 'الأثاث المنزلي' },
  { img: IMG.catOffice, en: 'Office Furniture', ar: 'الأثاث المكتبي' },
  { img: IMG.catLighting, en: 'Lighting', ar: 'الإنارات' },
  { img: IMG.bedroom, en: 'Rugs & Carpets', ar: 'السجاد' },
  { img: IMG.loungeDark, en: 'Bathroom Solutions', ar: 'دورات المياه' },
  { img: IMG.roomHotspots, en: 'Accessories & Decor', ar: 'الإكسسوارات والديكور' },
];

export const SERVICES: LookService[] = [
  { icon: PenTool, en: 'Interior Design', ar: 'التصميم الداخلي' },
  { icon: DoorOpen, en: 'Door Solutions', ar: 'حلول الأبواب' },
  { icon: Armchair, en: 'Custom Furniture', ar: 'تنفيذ الأثاث' },
  { icon: PaintRoller, en: 'Painting & Wall Finishes', ar: 'الدهانات والجداريات' },
  { icon: Layers, en: 'Flooring Solutions', ar: 'الأرضيات' },
  { icon: Sparkles, en: 'Finishing & Decorative', ar: 'التشطيبات والديكورات' },
  { icon: PanelTop, en: 'Glass & Skylight Facades', ar: 'واجهات الزجاج والسكوريت' },
  { icon: ShieldCheck, en: 'Safety Equipment & Systems', ar: 'أدوات وأنظمة السلامة' },
];

export const PRODUCTS: LookProduct[] = [
  { id: 1, img: '/looks/product-01.jpg', brand: 'DIYAR HOME', nameEn: 'Olive 3-Seater Sofa with Armrest', nameAr: 'أريكة أوليف ثلاثية المقاعد', price: 14937, rating: 5 },
  { id: 2, img: '/looks/product-02.jpg', brand: 'DIYAR HOME', nameEn: 'Wine 3-Seater Sofa with Armrest', nameAr: 'أريكة واين ثلاثية المقاعد', price: 14937, oldPrice: 16490, rating: 4.8, sale: true },
  { id: 3, img: '/looks/product-03.jpg', brand: 'DIYAR HOME', nameEn: 'Archer Walnut Wood 4-Seater Sofa', nameAr: 'أريكة آرتشر بخشب الجوز', price: 14685, rating: 4.9 },
  { id: 4, img: '/looks/product-04.jpg', brand: 'DIYAR HOME', nameEn: 'Artesia Right Curved Sofa', nameAr: 'أريكة أرتيسيا المنحنية', price: 19821, rating: 5 },
  { id: 5, img: '/looks/product-05.jpg', brand: 'DIYAR HOME', nameEn: 'Vesta Sherpa Lounge Chair', nameAr: 'كرسي فيستا شيربا', price: 3149, rating: 4.7 },
  { id: 6, img: '/looks/product-06.jpg', brand: 'DIYAR HOME', nameEn: 'Coastal 3-Seater Linen Sofa', nameAr: 'أريكة كوستال كتان ثلاثية', price: 8455, oldPrice: 9200, rating: 4.8, sale: true },
  { id: 7, img: '/looks/product-07.jpg', brand: 'DIYAR HOME', nameEn: 'Coastal 2-Seater Linen Sofa', nameAr: 'أريكة كوستال كتان مقعدين', price: 6930, rating: 4.6 },
  { id: 8, img: '/looks/product-08.jpg', brand: 'DIYAR HOME', nameEn: 'Haven Slipcover Armchair', nameAr: 'كرسي هيفن المنجد', price: 4120, rating: 4.9 },
  { id: 9, img: '/looks/product-09.jpg', brand: 'DIYAR HOME', nameEn: 'Arlberg Sheepskin Lounge Chair', nameAr: 'كرسي أرلبرغ من الصوف', price: 2899, rating: 5 },
];

export const STYLES: LookStyle[] = [
  { img: IMG.catHome, en: 'Modern', ar: 'مودرن', count: 3983 },
  { img: IMG.catLighting, en: 'Classic', ar: 'كلاسيك', count: 835 },
  { img: IMG.roomHotspots, en: 'Bohemian', ar: 'بوهيمي', count: 1270 },
  { img: IMG.bedroom, en: 'Neo Classic', ar: 'نيو كلاسيك', count: 347 },
  { img: IMG.hero, en: 'Luxury', ar: 'فاخر', count: 591 },
];

export const DESIGN_ASSIST_ITEMS: { en: string; ar: string }[] = [
  { en: 'Furniture Selection', ar: 'اختيار الأثاث' },
  { en: 'Space Planning', ar: 'تخطيط المساحات' },
  { en: 'Color & Material Selection', ar: 'اختيار الألوان والخامات' },
  { en: 'Decor Coordination', ar: 'تنسيق الديكور' },
  { en: 'Lighting Recommendations', ar: 'اقتراحات الإنارة' },
  { en: 'Virtual or On-Site Consultation', ar: 'استشارة عن بعد أو ميدانية' },
];

export const FOOTER_LINKS = {
  quick: ['Home', 'Shop', 'Services', 'B2B Solutions', 'About Us', 'Contact Us'],
  support: ['FAQ', 'Shipping & Delivery', 'Returns & Exchanges', 'Warranty', 'Track Order'],
  phone: '+966 54 576 5409',
  email: 'info@diyarteams.com',
  about: 'Diyar is your destination for furniture, interior design, and integrated solutions that bring comfort, functionality, and style to every space.',
  aboutAr: 'ديار وجهتك للأثاث والتصميم الداخلي والحلول المتكاملة التي تضيف الراحة والأناقة لكل مساحة.',
} as const;

export const formatSAR = (n: number) => n.toLocaleString('en-US');

/** Floating switcher shown on every look page so the client can flip between directions. */
export function LookSwitcher() {
  const { pathname } = useLocation();
  const looks = [
    { to: '/look/1', label: '1' },
    { to: '/look/2', label: '2' },
    { to: '/look/3', label: '3' },
  ];
  return (
    <div dir="ltr" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-1 rounded-full bg-black/80 backdrop-blur-md px-2 py-1.5 shadow-2xl border border-white/10">
      <Link to="/looks" className="text-white/60 hover:text-white text-[11px] tracking-[0.15em] uppercase px-3 py-1.5 transition-colors">
        Looks
      </Link>
      {looks.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold transition-colors ${
            pathname === l.to ? 'bg-white text-black' : 'text-white/70 hover:bg-white/15 hover:text-white'
          }`}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}
