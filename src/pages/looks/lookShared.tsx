/**
 * Shared data + bits for the 3 redesign "looks" (client design-direction demos).
 * Each look page (LookOne/LookTwo/LookThree) is a self-contained homepage variant
 * that imports ONLY from this module, so the looks stay content-consistent.
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PenTool, DoorOpen, Armchair, PaintRoller, Layers, Sparkles, PanelTop, ShieldCheck,
  Boxes, ScanLine, Truck, CreditCard, Coins, RefreshCw, Gift,
  Camera, Smartphone, Bell, Store, Megaphone, Wrench,
} from 'lucide-react';

/** Icon component shape used across the shared data. */
export type LookIcon = React.ComponentType<{ size?: number | string; className?: string; strokeWidth?: number }>;

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

export type CategoryKey = 'home' | 'office' | 'lighting' | 'rugs' | 'bath' | 'decor';

export interface LookCategory {
  key: CategoryKey;
  img: string;
  en: string;
  ar: string;
}

export interface LookService {
  icon: React.ComponentType<{ size?: number | string; className?: string; strokeWidth?: number }>;
  en: string;
  ar: string;
  /** Preview shown when the service is highlighted in the services index. */
  img: string;
}

export type StyleKey = 'modern' | 'classic' | 'bohemian' | 'neo' | 'luxury';

export interface LookStyle {
  key: StyleKey;
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
} as const;

export const HERO_SLIDES: LookSlide[] = [
  { img: IMG.hero, ar: 'ديـــار لكل دار', en: 'Diyar for Every Home', tag: 'NEW COLLECTION', tagAr: 'تشكيلة جديدة' },
  { img: IMG.workshop, ar: 'نصنع أثاثك كما تتخيله', en: 'Crafted to Your Vision', tag: 'CUSTOM MANUFACTURING', tagAr: 'تصنيع حسب الطلب' },
  { img: IMG.loungeDark, ar: 'حلول متكاملة للشركات والمشاريع', en: 'Turnkey Project Solutions', tag: 'B2B', tagAr: 'B2B' },
];

export const NAV_LINKS = ['Home', 'Self Designer', 'B2B', 'Services', 'Shop'] as const;

/** Bilingual nav items (same order as NAV_LINKS). */
export const NAV_ITEMS: Bi[] = [
  { en: 'Home', ar: 'الرئيسية' },
  { en: 'Self Designer', ar: 'المصمم الذاتي' },
  { en: 'B2B', ar: 'B2B' },
  { en: 'Services', ar: 'الخدمات' },
  { en: 'Shop', ar: 'المتجر' },
];

export const FOOTER_QUICK: Bi[] = [
  { en: 'Home', ar: 'الرئيسية' },
  { en: 'Shop', ar: 'المتجر' },
  { en: 'Services', ar: 'الخدمات' },
  { en: 'B2B', ar: 'B2B' },
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

/**
 * Shoppable "Shop the Look" hotspots.
 * `top`/`left` are physical percentages tracking real objects inside
 * /looks/room-hotspots.jpg, so they must NOT be mirrored in RTL.
 * `align`/`vAlign` say which way the product card should open so it
 * never runs off the edge of the image.
 */
export interface RoomHotspot {
  id: string;
  /** Catalog product this hotspot opens. */
  productId: number;
  thumb: string;
  name: Bi;
  category: Bi;
  price: number;
  top: string;
  left: string;
  align: 'left' | 'right';
  vAlign: 'top' | 'bottom';
}

export const ROOM_HOTSPOTS: RoomHotspot[] = [
  {
    id: 'lamp',
    productId: 10,
    thumb: '/looks/shop/lamp.jpg',
    name: { en: 'Brass Floor Lamp with Linen Shade', ar: 'مصباح أرضي نحاسي بغطاء كتان' },
    category: { en: 'Lighting', ar: 'الإنارات' },
    price: 1450,
    top: '33%', left: '83%', align: 'left', vAlign: 'bottom',
  },
  {
    id: 'tapestry',
    productId: 11,
    thumb: '/looks/shop/tapestry.jpg',
    name: { en: 'Vintage Woven Wall Tapestry', ar: 'سجادة جدارية منسوجة' },
    category: { en: 'Wall Art', ar: 'اللوحات' },
    price: 2300,
    top: '29%', left: '61%', align: 'left', vAlign: 'bottom',
  },
  {
    id: 'vases',
    productId: 12,
    thumb: '/looks/shop/vases.jpg',
    name: { en: 'Stoneware Vase Set', ar: 'طقم مزهريات حجرية' },
    category: { en: 'Vases & Vessels', ar: 'المزهريات والأواني' },
    price: 480,
    top: '70%', left: '47%', align: 'right', vAlign: 'top',
  },
  {
    id: 'chair',
    productId: 13,
    thumb: '/looks/shop/chair.jpg',
    name: { en: 'Olive Boucle Lounge Chair', ar: 'كرسي استرخاء بقماش البوكليه' },
    category: { en: 'Home Furniture', ar: 'الأثاث المنزلي' },
    price: 3150,
    top: '77%', left: '66%', align: 'left', vAlign: 'top',
  },
  {
    id: 'planter',
    productId: 14,
    thumb: '/looks/shop/planter.jpg',
    name: { en: 'Aged Terracotta Planter', ar: 'أصيص فخاري عتيق' },
    category: { en: 'Accessories & Decor', ar: 'الإكسسوارات والديكور' },
    price: 620,
    top: '74%', left: '28%', align: 'right', vAlign: 'top',
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

/** Own 4:5 photography, one per category (public/categories/featured). */
export const CATEGORIES: LookCategory[] = [
  { key: 'home', img: '/categories/featured/home.webp', en: 'Home Furniture', ar: 'الأثاث المنزلي' },
  { key: 'office', img: '/categories/featured/office.webp', en: 'Office Furniture', ar: 'الأثاث المكتبي' },
  { key: 'lighting', img: '/categories/featured/lighting.webp', en: 'Lighting', ar: 'الإنارات' },
  { key: 'rugs', img: '/categories/featured/rugs.webp', en: 'Rugs & Carpets', ar: 'السجاد' },
  { key: 'bath', img: '/categories/featured/bath.webp', en: 'Bathroom Solutions', ar: 'دورات المياه' },
  { key: 'decor', img: '/categories/featured/decor.webp', en: 'Accessories & Decor', ar: 'الإكسسوارات والديكور' },
];

export const SERVICES: LookService[] = [
  { icon: PenTool, en: 'Interior Design', ar: 'التصميم الداخلي', img: IMG.catHome },
  { icon: DoorOpen, en: 'Door Solutions', ar: 'حلول الأبواب', img: IMG.loungeDark },
  { icon: Armchair, en: 'Custom Furniture', ar: 'تنفيذ الأثاث', img: IMG.workshop },
  { icon: PaintRoller, en: 'Painting & Wall Finishes', ar: 'الدهانات والجداريات', img: IMG.roomHotspots },
  { icon: Layers, en: 'Flooring Solutions', ar: 'الأرضيات', img: IMG.catOffice },
  { icon: Sparkles, en: 'Finishing & Decorative', ar: 'التشطيبات والديكورات', img: IMG.bedroom },
  { icon: PanelTop, en: 'Glass & Skylight Facades', ar: 'واجهات الزجاج والسكوريت', img: IMG.hero },
  { icon: ShieldCheck, en: 'Safety Equipment & Systems', ar: 'أدوات وأنظمة السلامة', img: IMG.restaurant },
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
  { key: 'modern', img: IMG.catHome, en: 'Modern', ar: 'مودرن', count: 3983 },
  { key: 'classic', img: IMG.catLighting, en: 'Classic', ar: 'كلاسيك', count: 835 },
  { key: 'bohemian', img: IMG.roomHotspots, en: 'Bohemian', ar: 'بوهيمي', count: 1270 },
  { key: 'neo', img: IMG.bedroom, en: 'Neo Classic', ar: 'نيو كلاسيك', count: 347 },
  { key: 'luxury', img: IMG.hero, en: 'Luxury', ar: 'فاخر', count: 591 },
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
  quick: ['Home', 'Shop', 'Services', 'B2B', 'About Us', 'Contact Us'],
  support: ['FAQ', 'Shipping & Delivery', 'Returns & Exchanges', 'Warranty', 'Track Order'],
  phone: '+966 54 576 5409',
  email: 'info@diyarteams.com',
  about: 'Diyar is your destination for furniture, interior design, and integrated solutions that bring comfort, functionality, and style to every space.',
  aboutAr: 'ديار وجهتك للأثاث والتصميم الداخلي والحلول المتكاملة التي تضيف الراحة والأناقة لكل مساحة.',
} as const;

/* ------------------------------------------------------------------ */
/* Sections carried over from the original marketplace site            */
/* ------------------------------------------------------------------ */

/** Shop by room — complements "Find Your Style" (which shops by aesthetic). */
export type RoomKey = 'living' | 'bedroom' | 'dining' | 'majlis' | 'office' | 'outdoor';

export interface LookRoom { key: RoomKey; img: string; en: string; ar: string; count: number }

export const ROOMS: LookRoom[] = [
  { key: 'living', img: IMG.catHome, en: 'Living Rooms', ar: 'غرف المعيشة', count: 1284 },
  { key: 'bedroom', img: IMG.bedroom, en: 'Bedrooms', ar: 'غرف النوم', count: 962 },
  { key: 'dining', img: IMG.restaurant, en: 'Dining Rooms', ar: 'غرف الطعام', count: 738 },
  { key: 'majlis', img: IMG.loungeDark, en: 'Majlis', ar: 'المجالس', count: 611 },
  { key: 'office', img: IMG.catOffice, en: 'Home Office', ar: 'المكاتب المنزلية', count: 455 },
  { key: 'outdoor', img: IMG.hero, en: 'Outdoor', ar: 'الجلسات الخارجية', count: 327 },
];

/** Trust row — answers "why buy here" before the customer has to ask. */
export interface LookUsp { icon: LookIcon; title: Bi; body: Bi }

export const WHY_DIYAR: LookUsp[] = [
  {
    icon: Boxes,
    title: { en: 'Unlimited Choice', ar: 'خيارات لا محدودة' },
    body: {
      en: 'Thousands of pieces from Diyar and its partner stores, in one place.',
      ar: 'آلاف القطع من ديار ومتاجرها الشريكة، في مكان واحد.',
    },
  },
  {
    icon: ScanLine,
    title: { en: 'See It In Your Room', ar: 'جرّبه في غرفتك' },
    body: {
      en: 'Augmented reality and AI let you place any piece before you buy.',
      ar: 'الواقع المعزز والذكاء الاصطناعي يضعان أي قطعة في مساحتك قبل الشراء.',
    },
  },
  {
    icon: Truck,
    title: { en: 'Delivery & Installation', ar: 'توصيل وتركيب' },
    body: {
      en: 'Kingdom-wide delivery with professional assembly by our own crews.',
      ar: 'توصيل لكل مناطق المملكة مع تركيب احترافي على يد فرقنا.',
    },
  },
  {
    icon: CreditCard,
    title: { en: 'Secure, Flexible Payment', ar: 'دفع آمن ومرن' },
    body: {
      en: 'Mada, Apple Pay and split payments — with a warranty on every order.',
      ar: 'مدى وأبل باي والتقسيط — مع ضمان على كل طلب.',
    },
  },
];

/** Customer testimonials. */
export interface LookReview { name: Bi; city: Bi; rating: number; text: Bi }

export const REVIEWS: LookReview[] = [
  {
    name: { en: 'Noura Al-Otaibi', ar: 'نورة العتيبي' },
    city: { en: 'Riyadh', ar: 'الرياض' },
    rating: 5,
    text: {
      en: 'I furnished the whole majlis through Diyar. The designer helped me pick everything and the installation crew finished in one afternoon.',
      ar: 'أثثت المجلس بالكامل عبر ديار. المصممة ساعدتني في اختيار كل قطعة، وفريق التركيب أنهى العمل في عصر واحد.',
    },
  },
  {
    name: { en: 'Abdullah Al-Shammari', ar: 'عبدالله الشمري' },
    city: { en: 'Jeddah', ar: 'جدة' },
    rating: 5,
    text: {
      en: 'The AI room preview saved me from a mistake — the sofa I wanted was far too large for the space. Ordered the right one instead.',
      ar: 'معاينة الغرفة بالذكاء الاصطناعي جنّبتني خطأ كبير — الأريكة التي أردتها كانت أكبر من المساحة. طلبت المقاس المناسب بدلاً منها.',
    },
  },
  {
    name: { en: 'Sara Al-Qahtani', ar: 'سارة القحطاني' },
    city: { en: 'Dammam', ar: 'الدمام' },
    rating: 4.8,
    text: {
      en: 'Custom wardrobes built to my measurements, delivered in three weeks. The finish matches the samples exactly.',
      ar: 'خزائن مفصلة على مقاساتي، وصلت خلال ثلاثة أسابيع. التشطيب مطابق تماماً للعينات.',
    },
  },
  {
    name: { en: 'Fahad Al-Dosari', ar: 'فهد الدوسري' },
    city: { en: 'Khobar', ar: 'الخبر' },
    rating: 5,
    text: {
      en: 'We fitted out our café through Diyar Business. One team handled design, manufacturing and installation.',
      ar: 'جهزنا المقهى عبر خدمات الشركات من ديار. فريق واحد تولى التصميم والتصنيع والتركيب.',
    },
  },
];

/** AI room designer — the feature behind the "جرب AI" link on product cards. */
export const AI_STUDIO = {
  eyebrow: { en: 'Diyar AI Studio', ar: 'استوديو ديار الذكي' },
  title: { en: 'Design Your Room in One Tap', ar: 'صمم غرفتك بلمسة خيال' },
  body: {
    en: 'Upload a photo of your space, choose a style, and see it refurnished with pieces you can actually buy — then order the whole room in one click.',
    ar: 'ارفع صورة لمساحتك، اختر الأسلوب، وشاهدها مؤثثة بقطع يمكنك شراؤها فعلاً — ثم اطلب الغرفة كاملة بضغطة واحدة.',
  },
  cta: { en: 'Try Your Room Now', ar: 'جرب غرفتك الآن' },
  steps: [
    { en: 'Upload your room photo', ar: 'ارفع صورة غرفتك' },
    { en: 'Pick a style you love', ar: 'اختر الأسلوب الذي يعجبك' },
    { en: 'Shop the result instantly', ar: 'تسوق النتيجة فوراً' },
  ] as Bi[],
  img: IMG.roomHotspots,
};

/** Editorial content — pairs with Design Consultation in the nav. */
export interface LookPost { img: string; category: Bi; title: Bi; excerpt: Bi; readMins: number }

export const BLOG_POSTS: LookPost[] = [
  {
    img: IMG.catLighting,
    category: { en: 'Lighting', ar: 'الإنارة' },
    title: { en: 'How to Layer Light in Three Levels', ar: 'كيف تنسق الإضاءة على ثلاث طبقات' },
    excerpt: {
      en: 'Ambient, task and accent — the simple rule that makes a room feel finished after dark.',
      ar: 'إضاءة عامة ووظيفية ومركزة — القاعدة البسيطة التي تجعل الغرفة مكتملة بعد الغروب.',
    },
    readMins: 4,
  },
  {
    img: IMG.roomHotspots,
    category: { en: 'Styling', ar: 'التنسيق' },
    title: { en: 'Five Rules for Choosing a Living Room Rug', ar: 'خمس قواعد لاختيار سجادة غرفة المعيشة' },
    excerpt: {
      en: 'Size first, texture second, colour last — why most rugs are bought a size too small.',
      ar: 'المقاس أولاً، ثم الملمس، واللون أخيراً — لماذا تُشترى معظم السجاد بمقاس أصغر مما يجب.',
    },
    readMins: 3,
  },
  {
    img: IMG.loungeDark,
    category: { en: 'Interiors', ar: 'التصميم الداخلي' },
    title: { en: 'The Majlis Guide: Heritage Meets Modern', ar: 'دليل المجالس: بين الأصالة والحداثة' },
    excerpt: {
      en: 'Keeping the warmth of a traditional majlis while letting contemporary furniture breathe.',
      ar: 'كيف تحافظ على دفء المجلس التقليدي وتترك للأثاث المعاصر مساحته.',
    },
    readMins: 6,
  },
];

/** Featured partner stores — Diyar is a multi-vendor marketplace. */
export type StoreKey = 'diyar' | 'bk' | 'ld' | 'dw' | 'ns' | 'zk' | 'mk';

export interface LookStore {
  key: StoreKey; name: Bi; specialty: Bi; initials: string; rating: number; products: number; cover: string;
  /** The brand's wide lockup (mark and name), in public/looks/brands. Until one is
   *  supplied the name is set in type instead. */
  logo?: string;
  /** The square mark alone, for small places; `initials` stand in without it. */
  mark?: string;
}

export const STORES: LookStore[] = [
  {
    key: 'bk',
    name: { en: 'Bayt Al-Khashab', ar: 'بيت الخشب' },
    specialty: { en: 'Solid wood & custom joinery', ar: 'الخشب الصلب والنجارة المخصصة' },
    mark: '/looks/brands/bk-mark.webp', logo: '/looks/brands/bk.webp',
    initials: 'BK', rating: 4.9, products: 412, cover: IMG.workshop,
  },
  {
    key: 'ld',
    name: { en: 'Lamsat Daw', ar: 'لمسة ضوء' },
    specialty: { en: 'Designer lighting', ar: 'إنارات مصممة' },
    mark: '/looks/brands/ld-mark.webp',
    initials: 'LD', rating: 4.8, products: 268, cover: IMG.catLighting,
  },
  {
    key: 'dw',
    name: { en: 'Diwan', ar: 'ديوان' },
    specialty: { en: 'Majlis & seating', ar: 'المجالس والجلسات' },
    mark: '/looks/brands/dw-mark.webp', logo: '/looks/brands/dw.webp',
    initials: 'DW', rating: 4.7, products: 531, cover: IMG.loungeDark,
  },
  {
    key: 'ns',
    name: { en: 'Naseej', ar: 'نسيج' },
    specialty: { en: 'Rugs & textiles', ar: 'السجاد والمنسوجات' },
    mark: '/looks/brands/ns-mark.webp',
    initials: 'NS', rating: 4.9, products: 349, cover: IMG.bedroom,
  },
  {
    key: 'zk',
    name: { en: 'Zukhruf', ar: 'زخرف' },
    specialty: { en: 'Decor & accessories', ar: 'الديكور والإكسسوارات' },
    mark: '/looks/brands/zk-mark.webp', logo: '/looks/brands/zk.webp',
    initials: 'ZK', rating: 4.8, products: 604, cover: IMG.roomHotspots,
  },
  {
    key: 'mk',
    name: { en: 'Maktabi', ar: 'مكتبي' },
    specialty: { en: 'Office & workspace', ar: 'الأثاث المكتبي' },
    mark: '/looks/brands/mk-mark.webp', logo: '/looks/brands/mk.webp',
    initials: 'MK', rating: 4.6, products: 187, cover: IMG.catOffice,
  },
];

/** Loyalty programme. */
export const LOYALTY = {
  eyebrow: { en: 'Diyar Rewards', ar: 'برنامج ولاء ديار' },
  title: { en: 'Every Purchase Earns You More', ar: 'كل عملية شراء تكسبك أكثر' },
  body: {
    en: 'Collect points on everything you buy, on services and on design consultations — then spend them however you like.',
    ar: 'اجمع نقاطاً على كل ما تشتريه، وعلى الخدمات والاستشارات التصميمية — ثم استبدلها كما تشاء.',
  },
  cta: { en: 'Explore Rewards', ar: 'استكشف عروض الولاء' },
  perks: [
    {
      icon: Coins,
      title: { en: 'Shop & Earn', ar: 'تسوق واربح' },
      body: { en: 'One point for every 10 SAR you spend across the marketplace.', ar: 'نقطة واحدة على كل 10 ر.س تنفقها في المتجر.' },
    },
    {
      icon: RefreshCw,
      title: { en: 'Flexible Redemption', ar: 'استبدال مرن' },
      body: { en: 'Turn points into discounts, free delivery or an installation visit.', ar: 'حوّل نقاطك إلى خصومات أو توصيل مجاني أو زيارة تركيب.' },
    },
    {
      icon: Gift,
      title: { en: 'Member Privileges', ar: 'مزايا الأعضاء' },
      body: { en: 'Early access to new collections and members-only offers.', ar: 'أسبقية في التشكيلات الجديدة وعروض خاصة بالأعضاء.' },
    },
  ] as LookUsp[],
};

/** Mobile app. */
export const APP_PROMO = {
  eyebrow: { en: 'The Diyar App', ar: 'تطبيق ديار' },
  title: { en: 'Your Home, In Your Pocket', ar: 'منزلك في جيبك' },
  body: {
    en: 'Everything on the site, plus the tools that only work with a camera in your hand.',
    ar: 'كل ما في الموقع، إضافة إلى أدوات لا تعمل إلا وبيدك كاميرا.',
  },
  img: IMG.catHome,
  features: [
    { icon: ScanLine, title: { en: 'Augmented Reality', ar: 'الواقع المعزز' }, body: { en: 'Place any piece in your room to scale.', ar: 'ضع أي قطعة في غرفتك بمقاسها الحقيقي.' } },
    { icon: Camera, title: { en: 'Search by Photo', ar: 'البحث بالصور' }, body: { en: 'Point the camera at a piece you like.', ar: 'وجّه الكاميرا نحو أي قطعة تعجبك.' } },
    { icon: Bell, title: { en: 'Order Tracking', ar: 'تتبع الطلبات' }, body: { en: 'Live delivery and installation updates.', ar: 'تحديثات مباشرة للتوصيل والتركيب.' } },
    { icon: Smartphone, title: { en: 'App-Only Offers', ar: 'عروض التطبيق' }, body: { en: 'Deals released to app users first.', ar: 'عروض تصل مستخدمي التطبيق أولاً.' } },
  ] as LookUsp[],
};

/** Partner recruitment — the marketplace supply side. */
export const PARTNER = {
  eyebrow: { en: 'Grow With Diyar', ar: 'انمُ مع ديار' },
  title: { en: 'Join the Marketplace', ar: 'انضم إلى المنصة' },
  body: {
    en: 'Sell your products, refer customers, or offer your trade to thousands of homeowners across the Kingdom.',
    ar: 'بع منتجاتك، أو رشّح عملاء، أو قدّم حرفتك لآلاف الأسر في جميع أنحاء المملكة.',
  },
  roles: [
    {
      icon: Store,
      title: { en: 'Sell as a Store', ar: 'سجل كتاجر' },
      body: { en: 'List your catalogue and reach buyers already shopping for furniture.', ar: 'اعرض منتجاتك وصل إلى مشترين يبحثون عن الأثاث فعلاً.' },
      cta: { en: 'Register a Store', ar: 'سجل متجرك' },
    },
    {
      icon: Megaphone,
      title: { en: 'Earn as an Affiliate', ar: 'مسوق بالعمولة' },
      body: { en: 'Share what you love and take a commission on every sale.', ar: 'شارك ما يعجبك واحصل على عمولة عن كل عملية بيع.' },
      cta: { en: 'Join the Programme', ar: 'انضم كمسوق' },
    },
    {
      icon: Wrench,
      title: { en: 'Offer a Service', ar: 'مقدم خدمات' },
      body: { en: 'Carpenters, painters, installers — get matched with nearby jobs.', ar: 'نجارون ودهانون وفنيو تركيب — استقبل طلبات قريبة منك.' },
      cta: { en: 'Register Your Trade', ar: 'سجل مهنتك' },
    },
  ],
  dashboard: {
    title: { en: 'A Full Dashboard, Included', ar: 'لوحة تحكم متكاملة' },
    body: { en: 'Orders, inventory, payouts and performance — in one place.', ar: 'الطلبات والمخزون والمستحقات والأداء — في مكان واحد.' },
    cta: { en: 'See the Demo', ar: 'شاهد العرض التجريبي' },
  },
};

/* ------------------------------------------------------------------ */
/* Catalog — the product data behind the search page and product page */
/* ------------------------------------------------------------------ */

export type Availability = 'in_stock' | 'low_stock' | 'made_to_order';

export interface CatalogColor { name: Bi; hex: string }

export interface CatalogProduct {
  id: number;
  img: string;
  gallery: string[];
  name: Bi;
  store: StoreKey;
  category: CategoryKey;
  room: RoomKey;
  style: StyleKey;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  sku: string;
  colors: CatalogColor[];
  dimensions: Bi;
  materials: Bi;
  care: Bi;
  description: Bi;
  availability: Availability;
  leadTime: Bi;
  isNew?: boolean;
  bestSeller?: boolean;
}

const C = {
  olive: { name: { en: 'Olive', ar: 'زيتوني' }, hex: '#5E6B3F' },
  wine: { name: { en: 'Wine', ar: 'نبيذي' }, hex: '#7A2E33' },
  sand: { name: { en: 'Sand', ar: 'رملي' }, hex: '#D9CBB4' },
  ivory: { name: { en: 'Ivory', ar: 'عاجي' }, hex: '#EFE9DD' },
  taupe: { name: { en: 'Taupe', ar: 'رمادي دافئ' }, hex: '#A8988A' },
  walnut: { name: { en: 'Walnut', ar: 'جوزي' }, hex: '#5B3A29' },
  charcoal: { name: { en: 'Charcoal', ar: 'فحمي' }, hex: '#2B2A28' },
  brass: { name: { en: 'Brass', ar: 'نحاسي' }, hex: '#B08D57' },
  terracotta: { name: { en: 'Terracotta', ar: 'طيني' }, hex: '#B5654A' },
  cream: { name: { en: 'Cream', ar: 'كريمي' }, hex: '#F3EAD8' },
} as const satisfies Record<string, CatalogColor>;

const VELVET_CARE: Bi = { en: 'Vacuum weekly with a soft brush; blot spills immediately; professional clean only.', ar: 'نظّف بالمكنسة أسبوعياً بفرشاة ناعمة، وجفّف الانسكابات فوراً، وتنظيف احترافي فقط.' };
const LINEN_CARE: Bi = { en: 'Removable covers, machine-washable cold; line dry; iron on low while slightly damp.', ar: 'أغطية قابلة للفك، تُغسل بالغسالة على البارد، وتُجفف بالهواء، وتُكوى على حرارة منخفضة.' };
const WOOD_CARE: Bi = { en: 'Dust with a dry cloth; avoid direct sunlight; re-oil the wood once a year.', ar: 'امسح بقماشة جافة، وتجنب أشعة الشمس المباشرة، وأعد تزييت الخشب مرة في السنة.' };
const SOFA_DIMS: Bi = { en: 'W 228 × D 98 × H 76 cm · Seat H 44 cm', ar: 'العرض 228 × العمق 98 × الارتفاع 76 سم · ارتفاع المقعد 44 سم' };
const VELVET_MATERIALS: Bi = { en: 'Kiln-dried beech frame, high-resilience foam, cotton-velvet upholstery, solid oak feet.', ar: 'هيكل من خشب الزان المجفف، إسفنج عالي المرونة، تنجيد قطيفة قطنية، أرجل من البلوط الصلب.' };
const LINEN_MATERIALS: Bi = { en: 'Solid pine frame, removable Belgian-linen slipcover, down-blend cushions.', ar: 'هيكل من الصنوبر الصلب، غطاء كتان بلجيكي قابل للفك، وسائد بخليط الريش.' };
const D57: Bi = { en: 'Delivered in 5–7 days', ar: 'التوصيل خلال 5–7 أيام' };
const D35: Bi = { en: 'Delivered in 3–5 days', ar: 'التوصيل خلال 3–5 أيام' };
const D24: Bi = { en: 'Delivered in 2–4 days', ar: 'التوصيل خلال 2–4 أيام' };

export const CATALOG: CatalogProduct[] = [
  {
    id: 1, img: '/looks/product-01.jpg', gallery: ['/looks/product-01.jpg', IMG.catHome, IMG.hero],
    name: { en: 'Olive 3-Seater Sofa with Armrest', ar: 'أريكة أوليف ثلاثية المقاعد' },
    store: 'dw', category: 'home', room: 'living', style: 'modern',
    price: 14937, rating: 5, reviews: 128, sku: 'DW-SF-1001',
    colors: [C.olive, C.wine, C.sand], dimensions: SOFA_DIMS, materials: VELVET_MATERIALS, care: VELVET_CARE,
    description: { en: 'A deep, low-slung three-seater with softly rolled arms and feather-wrapped cushions. The olive velvet reads warm in daylight and rich in the evening — built to anchor a living room for years.', ar: 'أريكة ثلاثية عميقة ومنخفضة بأذرع مستديرة ووسائد محشوة بالريش. القطيفة الزيتونية تبدو دافئة في ضوء النهار وغنية في المساء — صُممت لتكون محور غرفة المعيشة لسنوات.' },
    availability: 'in_stock', leadTime: D57, isNew: true, bestSeller: true,
  },
  {
    id: 2, img: '/looks/product-02.jpg', gallery: ['/looks/product-02.jpg', IMG.loungeDark],
    name: { en: 'Wine 3-Seater Sofa with Armrest', ar: 'أريكة واين ثلاثية المقاعد' },
    store: 'dw', category: 'home', room: 'majlis', style: 'luxury',
    price: 14937, oldPrice: 16490, rating: 4.8, reviews: 74, sku: 'DW-SF-1002',
    colors: [C.wine, C.olive, C.charcoal], dimensions: SOFA_DIMS, materials: VELVET_MATERIALS, care: VELVET_CARE,
    description: { en: 'The same generous silhouette in a deep wine velvet that suits formal majlis seating. Pairs naturally with brass lighting and dark wood.', ar: 'الصورة الظلية السخية نفسها بقطيفة نبيذية عميقة تناسب جلسات المجالس الرسمية. تتناغم طبيعياً مع الإنارة النحاسية والخشب الداكن.' },
    availability: 'low_stock', leadTime: { en: 'Only 3 left · Delivered in 5–7 days', ar: 'متبقي 3 فقط · التوصيل خلال 5–7 أيام' },
  },
  {
    id: 3, img: '/looks/product-03.jpg', gallery: ['/looks/product-03.jpg', IMG.workshop],
    name: { en: 'Archer Walnut Wood 4-Seater Sofa', ar: 'أريكة آرتشر بخشب الجوز' },
    store: 'bk', category: 'home', room: 'living', style: 'classic',
    price: 14685, rating: 4.9, reviews: 56, sku: 'BK-SF-2040',
    colors: [C.walnut],
    dimensions: { en: 'W 246 × D 92 × H 82 cm', ar: 'العرض 246 × العمق 92 × الارتفاع 82 سم' },
    materials: { en: 'Solid American walnut frame, jacquard tapestry upholstery, brass-capped feet.', ar: 'هيكل من خشب الجوز الأمريكي الصلب، تنجيد جاكار منسوج، أرجل بأطراف نحاسية.' },
    care: WOOD_CARE,
    description: { en: 'An exposed-frame sofa in oiled walnut with a hand-loomed tapestry seat. Made to order in our partner workshop; every frame is signed by the maker.', ar: 'أريكة بهيكل ظاهر من الجوز المزيت ومقعد منسوج يدوياً. تُصنع حسب الطلب في ورشة شريكنا، وكل هيكل يحمل توقيع صانعه.' },
    availability: 'made_to_order', leadTime: { en: 'Made to order · 3–4 weeks', ar: 'يُصنع حسب الطلب · 3–4 أسابيع' },
  },
  {
    id: 4, img: '/looks/product-04.jpg', gallery: ['/looks/product-04.jpg', IMG.catHome],
    name: { en: 'Artesia Right Curved Sofa', ar: 'أريكة أرتيسيا المنحنية' },
    store: 'dw', category: 'home', room: 'living', style: 'luxury',
    price: 19821, rating: 5, reviews: 41, sku: 'DW-SF-1087',
    colors: [C.taupe, C.ivory, C.sand],
    dimensions: { en: 'W 310 × D 150 × H 72 cm (right-hand chaise)', ar: 'العرض 310 × العمق 150 × الارتفاع 72 سم (شيزلونغ يمين)' },
    materials: { en: 'Engineered hardwood frame, sinuous springs, bouclé wool blend, hidden glides.', ar: 'هيكل من الخشب الهندسي، نوابض متعرجة، خليط صوف بوكليه، قواعد مخفية.' },
    care: VELVET_CARE,
    description: { en: 'A sculptural curve that turns a corner into the room\'s centre of gravity. The bouclé is dense and forgiving; the low back keeps sightlines open.', ar: 'انحناءة نحتية تحوّل الزاوية إلى مركز ثقل الغرفة. البوكليه كثيف ومتسامح، والظهر المنخفض يبقي خطوط النظر مفتوحة.' },
    availability: 'in_stock', leadTime: { en: 'Delivered in 7–10 days', ar: 'التوصيل خلال 7–10 أيام' }, isNew: true,
  },
  {
    id: 5, img: '/looks/product-05.jpg', gallery: ['/looks/product-05.jpg', IMG.bedroom],
    name: { en: 'Vesta Sherpa Lounge Chair', ar: 'كرسي فيستا شيربا' },
    store: 'bk', category: 'home', room: 'bedroom', style: 'modern',
    price: 3149, rating: 4.7, reviews: 203, sku: 'BK-CH-3310',
    colors: [C.cream, C.taupe],
    dimensions: { en: 'W 78 × D 84 × H 96 cm', ar: 'العرض 78 × العمق 84 × الارتفاع 96 سم' },
    materials: { en: 'Solid ash legs, sherpa fleece upholstery, webbed seat support.', ar: 'أرجل من خشب الدردار الصلب، تنجيد صوف شيربا، دعامة مقعد شبكية.' },
    care: LINEN_CARE,
    description: { en: 'A high-backed reading chair in cloud-soft sherpa on turned ash legs. Light enough to move between rooms.', ar: 'كرسي قراءة بظهر مرتفع من الشيربا الناعم على أرجل دردار مخروطة. خفيف بما يكفي لنقله بين الغرف.' },
    availability: 'in_stock', leadTime: D35, bestSeller: true,
  },
  {
    id: 6, img: '/looks/product-06.jpg', gallery: ['/looks/product-06.jpg', IMG.hero],
    name: { en: 'Coastal 3-Seater Linen Sofa', ar: 'أريكة كوستال كتان ثلاثية' },
    store: 'diyar', category: 'home', room: 'living', style: 'bohemian',
    price: 8455, oldPrice: 9200, rating: 4.8, reviews: 167, sku: 'DH-SF-0450',
    colors: [C.ivory, C.sand],
    dimensions: { en: 'W 220 × D 96 × H 84 cm', ar: 'العرض 220 × العمق 96 × الارتفاع 84 سم' },
    materials: LINEN_MATERIALS, care: LINEN_CARE,
    description: { en: 'Relaxed, slipcovered and washable — the sofa for a house that is actually lived in. Covers come off in minutes.', ar: 'مريحة ومغطاة وقابلة للغسل — الأريكة المناسبة لبيت يُعاش فيه فعلاً. الأغطية تُفك في دقائق.' },
    availability: 'in_stock', leadTime: D57, bestSeller: true,
  },
  {
    id: 7, img: '/looks/product-07.jpg', gallery: ['/looks/product-07.jpg', IMG.hero],
    name: { en: 'Coastal 2-Seater Linen Sofa', ar: 'أريكة كوستال كتان مقعدين' },
    store: 'diyar', category: 'home', room: 'living', style: 'bohemian',
    price: 6930, rating: 4.6, reviews: 92, sku: 'DH-SF-0451',
    colors: [C.ivory, C.sand],
    dimensions: { en: 'W 172 × D 96 × H 84 cm', ar: 'العرض 172 × العمق 96 × الارتفاع 84 سم' },
    materials: LINEN_MATERIALS, care: LINEN_CARE,
    description: { en: 'The two-seat Coastal for smaller rooms and reading corners. Same washable cover, same feather-soft sit.', ar: 'نسخة المقعدين من كوستال للغرف الأصغر وزوايا القراءة. الغطاء القابل للغسل نفسه، والجلسة الناعمة نفسها.' },
    availability: 'in_stock', leadTime: D57,
  },
  {
    id: 8, img: '/looks/product-08.jpg', gallery: ['/looks/product-08.jpg', IMG.roomHotspots],
    name: { en: 'Haven Slipcover Armchair', ar: 'كرسي هيفن المنجد' },
    store: 'diyar', category: 'home', room: 'bedroom', style: 'bohemian',
    price: 4120, rating: 4.9, reviews: 88, sku: 'DH-CH-0470',
    colors: [C.ivory, C.sand, C.olive],
    dimensions: { en: 'W 96 × D 98 × H 84 cm', ar: 'العرض 96 × العمق 98 × الارتفاع 84 سم' },
    materials: { en: 'Solid pine frame, removable linen slipcover, down-blend seat cushion.', ar: 'هيكل من الصنوبر الصلب، غطاء كتان قابل للفك، وسادة مقعد بخليط الريش.' },
    care: LINEN_CARE,
    description: { en: 'A generous armchair that matches the Coastal sofas or stands alone by a window. Deep enough to curl into.', ar: 'كرسي واسع يتناسق مع أرائك كوستال أو يقف وحده بجوار النافذة. عميق بما يكفي للاسترخاء فيه.' },
    availability: 'in_stock', leadTime: D35,
  },
  {
    id: 9, img: '/looks/product-09.jpg', gallery: ['/looks/product-09.jpg', IMG.bedroom],
    name: { en: 'Arlberg Sheepskin Lounge Chair', ar: 'كرسي أرلبرغ من الصوف' },
    store: 'bk', category: 'home', room: 'bedroom', style: 'neo',
    price: 2899, rating: 5, reviews: 61, sku: 'BK-CH-3355',
    colors: [C.taupe, C.cream],
    dimensions: { en: 'W 70 × D 80 × H 78 cm', ar: 'العرض 70 × العمق 80 × الارتفاع 78 سم' },
    materials: { en: 'Solid oak frame, long-pile sheepskin, brass fixings.', ar: 'هيكل من البلوط الصلب، صوف غنم طويل الوبر، مثبتات نحاسية.' },
    care: WOOD_CARE,
    description: { en: 'A low-slung lounge chair wrapped in long-pile sheepskin on an angled oak frame — Scandinavian bones, Najdi warmth.', ar: 'كرسي استرخاء منخفض مغلف بصوف غنم طويل الوبر على هيكل بلوط مائل — بنية إسكندنافية بدفء نجدي.' },
    availability: 'made_to_order', leadTime: { en: 'Made to order · 2–3 weeks', ar: 'يُصنع حسب الطلب · 2–3 أسابيع' },
  },
  {
    id: 10, img: '/looks/shop/lamp.jpg', gallery: ['/looks/shop/lamp.jpg', IMG.roomHotspots, IMG.catLighting],
    name: { en: 'Brass Floor Lamp with Linen Shade', ar: 'مصباح أرضي نحاسي بغطاء كتان' },
    store: 'ld', category: 'lighting', room: 'living', style: 'neo',
    price: 1450, rating: 4.8, reviews: 143, sku: 'LD-FL-0210',
    colors: [C.brass, C.charcoal],
    dimensions: { en: 'H 160 cm · Shade Ø 45 cm', ar: 'الارتفاع 160 سم · قطر الغطاء 45 سم' },
    materials: { en: 'Solid brass stem with a lacquered finish, natural linen shade, weighted marble base.', ar: 'عمود نحاسي صلب بطلاء لامع، غطاء كتان طبيعي، قاعدة رخامية ثقيلة.' },
    care: { en: 'Dust the shade with a lint roller; polish brass with a dry cloth only.', ar: 'نظّف الغطاء بأسطوانة الوبر، ولمّع النحاس بقماشة جافة فقط.' },
    description: { en: 'A tall, slim reading lamp that throws a warm pool of light exactly where you sit. The linen shade diffuses without glare.', ar: 'مصباح قراءة طويل ونحيف يلقي بركة ضوء دافئة حيث تجلس تماماً. غطاء الكتان يوزّع الضوء دون وهج.' },
    availability: 'in_stock', leadTime: D24, bestSeller: true,
  },
  {
    id: 11, img: '/looks/shop/tapestry.jpg', gallery: ['/looks/shop/tapestry.jpg', IMG.roomHotspots],
    name: { en: 'Vintage Woven Wall Tapestry', ar: 'سجادة جدارية منسوجة' },
    store: 'ns', category: 'decor', room: 'majlis', style: 'bohemian',
    price: 2300, rating: 4.9, reviews: 37, sku: 'NS-WT-0088',
    colors: [C.terracotta, C.sand],
    dimensions: { en: '120 × 180 cm', ar: '120 × 180 سم' },
    materials: { en: 'Hand-knotted wool on a cotton warp, vegetable-dyed, with a hidden hanging sleeve.', ar: 'صوف معقود يدوياً على سدى قطني، مصبوغ بأصباغ نباتية، مع جيب تعليق مخفي.' },
    care: { en: 'Shake out gently; spot clean only; keep out of direct sun to preserve the dyes.', ar: 'انفضها برفق، ونظّف البقع موضعياً فقط، وأبعدها عن الشمس المباشرة للحفاظ على الألوان.' },
    description: { en: 'A one-of-a-kind piece from Naseej\'s archive — faded terracotta medallions on a sand ground. Each tapestry is photographed individually.', ar: 'قطعة فريدة من أرشيف نسيج — ميداليات طينية باهتة على أرضية رملية. تُصوَّر كل سجادة على حدة.' },
    availability: 'low_stock', leadTime: { en: 'One piece · Delivered in 2–4 days', ar: 'قطعة واحدة · التوصيل خلال 2–4 أيام' },
  },
  {
    id: 12, img: '/looks/shop/vases.jpg', gallery: ['/looks/shop/vases.jpg', IMG.roomHotspots],
    name: { en: 'Stoneware Vase Set', ar: 'طقم مزهريات حجرية' },
    store: 'zk', category: 'decor', room: 'dining', style: 'modern',
    price: 480, rating: 4.7, reviews: 219, sku: 'DH-VS-0902',
    colors: [C.sand, C.charcoal],
    dimensions: { en: 'Set of 2 · H 28 cm and H 22 cm', ar: 'طقم من قطعتين · الارتفاع 28 سم و22 سم' },
    materials: { en: 'Reactive-glaze stoneware, watertight interior.', ar: 'حجر خزفي بطلاء تفاعلي، داخل مقاوم للماء.' },
    care: { en: 'Hand wash; not dishwasher safe.', ar: 'يُغسل يدوياً، غير مناسب لغسالة الأطباق.' },
    description: { en: 'Two hand-thrown vessels in a speckled sand glaze — sized for dried stems and a single branch. Slight variations are part of the piece.', ar: 'وعاءان مشكّلان يدوياً بطلاء رملي مرقّط — بحجم يناسب السيقان المجففة والغصن الواحد. الاختلافات الطفيفة جزء من القطعة.' },
    availability: 'in_stock', leadTime: D24, isNew: true,
  },
  {
    id: 13, img: '/looks/shop/chair.jpg', gallery: ['/looks/shop/chair.jpg', IMG.roomHotspots, IMG.catHome],
    name: { en: 'Olive Bouclé Lounge Chair', ar: 'كرسي استرخاء بقماش البوكليه' },
    store: 'mk', category: 'home', room: 'living', style: 'modern',
    price: 3150, rating: 4.9, reviews: 112, sku: 'DW-CH-1150',
    colors: [C.olive, C.cream, C.taupe],
    dimensions: { en: 'W 84 × D 86 × H 72 cm', ar: 'العرض 84 × العمق 86 × الارتفاع 72 سم' },
    materials: { en: 'Moulded plywood shell, dense bouclé wool, swivel base in blackened steel.', ar: 'هيكل من الخشب الرقائقي المقولب، صوف بوكليه كثيف، قاعدة دوارة من الفولاذ المسوّد.' },
    care: VELVET_CARE,
    description: { en: 'A barrel-back swivel chair that hugs you in. The olive bouclé is the exact shade from our hero room — the piece most people ask about.', ar: 'كرسي دوّار بظهر برميلي يحتضنك. البوكليه الزيتوني هو الدرجة نفسها من غرفتنا الرئيسية — القطعة التي يسأل عنها معظم الزوار.' },
    availability: 'in_stock', leadTime: D35, bestSeller: true,
  },
  {
    id: 14, img: '/looks/shop/planter.jpg', gallery: ['/looks/shop/planter.jpg', IMG.roomHotspots],
    name: { en: 'Aged Terracotta Planter', ar: 'أصيص فخاري عتيق' },
    store: 'zk', category: 'decor', room: 'outdoor', style: 'bohemian',
    price: 620, rating: 4.8, reviews: 64, sku: 'DH-PL-0330',
    colors: [C.terracotta],
    dimensions: { en: 'Ø 52 × H 60 cm · drainage hole', ar: 'القطر 52 × الارتفاع 60 سم · فتحة تصريف' },
    materials: { en: 'Frost-resistant terracotta with a hand-applied aged patina.', ar: 'فخار مقاوم للصقيع بطبقة عتيقة مطبقة يدوياً.' },
    care: { en: 'Suitable indoors and out; raise on feet outdoors to protect the surface beneath.', ar: 'مناسب للداخل والخارج، وارفعه على قواعد في الخارج لحماية السطح تحته.' },
    description: { en: 'Big enough for an olive tree, weathered enough to look like it has always been there.', ar: 'كبير بما يكفي لشجرة زيتون، ومعتّق بما يكفي ليبدو كأنه موجود منذ الأزل.' },
    availability: 'in_stock', leadTime: D35,
  },
];

/* ------------------------------------------------------------------ */
/* Shop the Look — five rooms, each with its own shoppable pieces      */
/* ------------------------------------------------------------------ */

/** A room in the Shop the Look selector: one 2:1 photograph and the points on it. */
export interface ShopRoom {
  key: RoomKey;
  name: Bi;
  img: string;
  spots: RoomHotspot[];
}

/** One piece in a room photo: enough to make both its catalogue entry and its point. */
interface RoomPiece {
  id: number;
  room: RoomKey;
  slug: string;
  name: Bi;
  /** the small label on the point's card */
  label: Bi;
  category: CategoryKey;
  store: StoreKey;
  price: number;
  colors: CatalogColor[];
  dimensions: Bi;
  materials: Bi;
  care: Bi;
  /** where the point sits, in % of the photograph */
  left: number;
  top: number;
}

const L_FURNITURE: Bi = { en: 'Home Furniture', ar: 'الأثاث المنزلي' };
const L_OFFICE: Bi = { en: 'Office Furniture', ar: 'الأثاث المكتبي' };
const L_LIGHT: Bi = { en: 'Lighting', ar: 'الإنارات' };
const L_RUG: Bi = { en: 'Rugs', ar: 'السجاد' };
const L_ART: Bi = { en: 'Wall Art', ar: 'اللوحات' };
const L_DECOR: Bi = { en: 'Accessories & Decor', ar: 'الإكسسوارات والديكور' };
const FABRIC_CARE: Bi = { en: 'Vacuum with a soft brush; blot spills at once; covers are dry-clean only.', ar: 'نظّف بالمكنسة بفرشاة ناعمة، وجفّف الانسكابات فوراً، والأغطية تُنظف تنظيفاً جافاً فقط.' };
const RUG_CARE: Bi = { en: 'Vacuum without a beater bar; rotate twice a year; spot clean with mild soap.', ar: 'نظّف بالمكنسة دون فرشاة دوّارة، ودوّرها مرتين سنوياً، ونظّف البقع بصابون لطيف.' };
const LAMP_CARE: Bi = { en: 'Dust with a dry cloth; switch off before changing the bulb.', ar: 'امسح بقماشة جافة، وأطفئ المصباح قبل تغيير اللمبة.' };
const PRINT_CARE: Bi = { en: 'Dust the frame with a dry cloth; keep out of direct sunlight.', ar: 'امسح الإطار بقماشة جافة، وأبعد اللوحة عن الشمس المباشرة.' };
const PRINT_DIMS: Bi = { en: '90 × 70 cm, framed', ar: '90 × 70 سم مع الإطار' };
const PRINT_MAT: Bi = { en: 'Giclée print on cotton paper, solid oak frame, glass front.', ar: 'طباعة فنية على ورق قطني، إطار من البلوط الصلب، واجهة زجاجية.' };
const OAK: Bi = { en: 'Solid oak with a clear matt lacquer.', ar: 'بلوط صلب بطلاء شفاف مطفي.' };

const ROOM_PIECES: RoomPiece[] = [
  // living room (the olive sofa is catalogue piece 1)
  { id: 15, room: 'living', slug: 'armchair', name: { en: 'Linen Armchair', ar: 'كرسي بذراعين من الكتان' }, label: L_FURNITURE, category: 'home', store: 'diyar', price: 2450, colors: [C.sand, C.olive, C.taupe], dimensions: { en: 'W 88 × D 90 × H 82 cm', ar: 'العرض 88 × العمق 90 × الارتفاع 82 سم' }, materials: { en: 'Solid beech frame, foam and fibre cushions, linen-blend upholstery, oak feet.', ar: 'هيكل من الزان الصلب، وسائد إسفنج وألياف، تنجيد كتان مخلوط، أرجل من البلوط.' }, care: FABRIC_CARE, left: 19, top: 60 },
  { id: 16, room: 'living', slug: 'coffee-table', name: { en: 'Oak Coffee Table', ar: 'طاولة قهوة من البلوط' }, label: L_FURNITURE, category: 'home', store: 'bk', price: 1350, colors: [C.sand, C.walnut], dimensions: { en: 'W 120 × D 60 × H 45 cm', ar: 'العرض 120 × العمق 60 × الارتفاع 45 سم' }, materials: OAK, care: WOOD_CARE, left: 59, top: 68 },
  { id: 17, room: 'living', slug: 'floor-lamp', name: { en: 'Wooden Floor Lamp with Linen Shade', ar: 'مصباح أرضي خشبي بغطاء كتان' }, label: L_LIGHT, category: 'lighting', store: 'ld', price: 890, colors: [C.sand, C.charcoal], dimensions: { en: 'H 155 cm · Shade Ø 42 cm', ar: 'الارتفاع 155 سم · قطر الغطاء 42 سم' }, materials: { en: 'Oak stem, linen drum shade, weighted steel base.', ar: 'عمود من البلوط، غطاء كتان أسطواني، قاعدة فولاذية ثقيلة.' }, care: LAMP_CARE, left: 28, top: 30 },
  { id: 18, room: 'living', slug: 'rug', name: { en: 'Flat-Weave Wool Rug', ar: 'سجادة صوف منسوجة' }, label: L_RUG, category: 'rugs', store: 'ns', price: 1900, colors: [C.sand, C.taupe], dimensions: { en: '200 × 300 cm', ar: '200 × 300 سم' }, materials: { en: 'Hand-woven wool on a cotton warp.', ar: 'صوف منسوج يدوياً على سدى قطني.' }, care: RUG_CARE, left: 78, top: 86 },
  { id: 19, room: 'living', slug: 'print', name: { en: 'Framed Landscape Print — Hills', ar: 'لوحة منظر طبيعي بإطار — التلال' }, label: L_ART, category: 'decor', store: 'zk', price: 420, colors: [C.sand], dimensions: PRINT_DIMS, materials: PRINT_MAT, care: PRINT_CARE, left: 64, top: 24 },
  // bedroom
  { id: 20, room: 'bedroom', slug: 'bed', name: { en: 'Upholstered Bed Frame', ar: 'سرير منجّد' }, label: L_FURNITURE, category: 'home', store: 'diyar', price: 4200, colors: [C.taupe, C.sand, C.olive], dimensions: { en: 'For a 180 × 200 cm mattress · Headboard H 110 cm', ar: 'لمرتبة 180 × 200 سم · ارتفاع اللوح 110 سم' }, materials: { en: 'Solid pine frame, slatted base, linen-blend upholstery.', ar: 'هيكل من الصنوبر الصلب، قاعدة شرائح، تنجيد كتان مخلوط.' }, care: FABRIC_CARE, left: 56, top: 45 },
  { id: 21, room: 'bedroom', slug: 'throw', name: { en: 'Olive Linen Throw', ar: 'بطانية كتان زيتونية' }, label: L_DECOR, category: 'decor', store: 'ns', price: 380, colors: [C.olive, C.sand], dimensions: { en: '140 × 220 cm', ar: '140 × 220 سم' }, materials: { en: 'Washed linen with a fringed edge.', ar: 'كتان مغسول بحافة مهدّبة.' }, care: LINEN_CARE, left: 39.5, top: 68 },
  { id: 22, room: 'bedroom', slug: 'bedside', name: { en: 'Oak Bedside Table', ar: 'طاولة سرير من البلوط' }, label: L_FURNITURE, category: 'home', store: 'bk', price: 690, colors: [C.sand, C.walnut], dimensions: { en: 'W 50 × D 40 × H 52 cm · two drawers', ar: 'العرض 50 × العمق 40 × الارتفاع 52 سم · درجان' }, materials: OAK, care: WOOD_CARE, left: 27, top: 60 },
  { id: 23, room: 'bedroom', slug: 'wardrobe', name: { en: 'Three-Door Wardrobe', ar: 'خزانة ملابس بثلاثة أبواب' }, label: L_FURNITURE, category: 'home', store: 'bk', price: 3600, colors: [C.ivory, C.sand], dimensions: { en: 'W 150 × D 60 × H 220 cm', ar: 'العرض 150 × العمق 60 × الارتفاع 220 سم' }, materials: { en: 'Lacquered MDF fronts, oak-veneer interior, soft-close hinges.', ar: 'واجهات MDF مطلية، داخل بقشرة البلوط، مفصلات إغلاق هادئ.' }, care: WOOD_CARE, left: 81, top: 43 },
  { id: 24, room: 'bedroom', slug: 'rug', name: { en: 'Jute Bedroom Rug', ar: 'سجادة جوت لغرفة النوم' }, label: L_RUG, category: 'rugs', store: 'ns', price: 1250, colors: [C.sand], dimensions: { en: '240 × 340 cm', ar: '240 × 340 سم' }, materials: { en: 'Braided natural jute.', ar: 'جوت طبيعي مجدول.' }, care: RUG_CARE, left: 76, top: 88 },
  { id: 25, room: 'bedroom', slug: 'print', name: { en: 'Framed Landscape Print — Lake', ar: 'لوحة منظر طبيعي بإطار — البحيرة' }, label: L_ART, category: 'decor', store: 'zk', price: 390, colors: [C.sand], dimensions: PRINT_DIMS, materials: PRINT_MAT, care: PRINT_CARE, left: 47, top: 26 },
  // dining room
  { id: 26, room: 'dining', slug: 'table', name: { en: 'Oak Dining Table for Six', ar: 'طاولة طعام بلوط لستة أشخاص' }, label: L_FURNITURE, category: 'home', store: 'bk', price: 4800, colors: [C.sand, C.walnut], dimensions: { en: 'W 180 × D 95 × H 76 cm', ar: 'العرض 180 × العمق 95 × الارتفاع 76 سم' }, materials: OAK, care: WOOD_CARE, left: 39.5, top: 55 },
  { id: 27, room: 'dining', slug: 'chair', name: { en: 'Upholstered Dining Chair', ar: 'كرسي طعام منجّد' }, label: L_FURNITURE, category: 'home', store: 'diyar', price: 650, colors: [C.sand, C.taupe, C.olive], dimensions: { en: 'W 48 × D 56 × H 86 cm', ar: 'العرض 48 × العمق 56 × الارتفاع 86 سم' }, materials: { en: 'Oak legs, moulded foam seat, woven fabric.', ar: 'أرجل من البلوط، مقعد إسفنج مقولب، قماش منسوج.' }, care: FABRIC_CARE, left: 56, top: 68 },
  { id: 28, room: 'dining', slug: 'pendant', name: { en: 'Linen Drum Pendant', ar: 'إنارة معلقة بغطاء كتان' }, label: L_LIGHT, category: 'lighting', store: 'ld', price: 780, colors: [C.sand, C.brass], dimensions: { en: 'Shade Ø 60 × H 25 cm · adjustable drop', ar: 'قطر الغطاء 60 × الارتفاع 25 سم · تعليق قابل للتعديل' }, materials: { en: 'Linen shade, brass stem and ceiling plate.', ar: 'غطاء كتان، عمود وقاعدة سقف من النحاس.' }, care: LAMP_CARE, left: 46, top: 18 },
  { id: 29, room: 'dining', slug: 'sideboard', name: { en: 'White Sideboard', ar: 'بوفيه أبيض' }, label: L_FURNITURE, category: 'home', store: 'bk', price: 2900, colors: [C.ivory, C.sand], dimensions: { en: 'W 180 × D 45 × H 75 cm', ar: 'العرض 180 × العمق 45 × الارتفاع 75 سم' }, materials: { en: 'Lacquered MDF, push-to-open doors, oak legs.', ar: 'MDF مطلي، أبواب تفتح بالضغط، أرجل من البلوط.' }, care: WOOD_CARE, left: 78, top: 57 },
  { id: 30, room: 'dining', slug: 'print', name: { en: 'Framed Landscape Print — Meadow', ar: 'لوحة منظر طبيعي بإطار — المرج' }, label: L_ART, category: 'decor', store: 'zk', price: 520, colors: [C.sand], dimensions: { en: '100 × 100 cm, framed', ar: '100 × 100 سم مع الإطار' }, materials: PRINT_MAT, care: PRINT_CARE, left: 79, top: 28 },
  // majlis
  { id: 31, room: 'majlis', slug: 'sofa', name: { en: 'Corner Majlis Sofa', ar: 'أريكة مجلس زاوية' }, label: L_FURNITURE, category: 'home', store: 'dw', price: 9800, colors: [C.sand, C.taupe, C.olive], dimensions: { en: '420 × 260 cm · Seat H 42 cm', ar: '420 × 260 سم · ارتفاع المقعد 42 سم' }, materials: { en: 'Solid beech frame, high-resilience foam, woven fabric, removable back cushions.', ar: 'هيكل من الزان الصلب، إسفنج عالي المرونة، قماش منسوج، وسائد ظهر قابلة للفك.' }, care: FABRIC_CARE, left: 59, top: 53 },
  { id: 32, room: 'majlis', slug: 'coffee-table', name: { en: 'Walnut Coffee Table', ar: 'طاولة قهوة من الجوز' }, label: L_FURNITURE, category: 'home', store: 'bk', price: 1650, colors: [C.walnut], dimensions: { en: 'W 130 × D 70 × H 40 cm', ar: 'العرض 130 × العمق 70 × الارتفاع 40 سم' }, materials: { en: 'Solid walnut with an oiled finish.', ar: 'جوز صلب بتشطيب زيتي.' }, care: WOOD_CARE, left: 52, top: 66 },
  { id: 33, room: 'majlis', slug: 'rug', name: { en: 'Textured Area Rug', ar: 'سجادة بنسيج بارز' }, label: L_RUG, category: 'rugs', store: 'ns', price: 2400, colors: [C.sand, C.taupe], dimensions: { en: '300 × 400 cm', ar: '300 × 400 سم' }, materials: { en: 'Wool and viscose loop pile.', ar: 'وبر حلقي من الصوف والفسكوز.' }, care: RUG_CARE, left: 79, top: 86 },
  { id: 34, room: 'majlis', slug: 'cushions', name: { en: 'Cushion Set — Olive & Cream', ar: 'طقم وسائد — زيتوني وكريمي' }, label: L_DECOR, category: 'decor', store: 'zk', price: 320, colors: [C.olive, C.cream], dimensions: { en: 'Set of 2 · 50 × 50 cm', ar: 'طقم من قطعتين · 50 × 50 سم' }, materials: { en: 'Linen covers with feather inserts.', ar: 'أغطية كتان بحشوة ريش.' }, care: LINEN_CARE, left: 27, top: 51 },
  { id: 35, room: 'majlis', slug: 'print', name: { en: 'Framed Landscape Print — Dunes', ar: 'لوحة منظر طبيعي بإطار — الكثبان' }, label: L_ART, category: 'decor', store: 'zk', price: 450, colors: [C.sand], dimensions: PRINT_DIMS, materials: PRINT_MAT, care: PRINT_CARE, left: 64, top: 26.5 },
  // home office
  { id: 36, room: 'office', slug: 'desk', name: { en: 'Oak Writing Desk', ar: 'مكتب كتابة من البلوط' }, label: L_OFFICE, category: 'office', store: 'mk', price: 2200, colors: [C.sand, C.walnut], dimensions: { en: 'W 140 × D 65 × H 75 cm · one drawer', ar: 'العرض 140 × العمق 65 × الارتفاع 75 سم · درج واحد' }, materials: OAK, care: WOOD_CARE, left: 41, top: 55 },
  { id: 37, room: 'office', slug: 'chair', name: { en: 'Fabric Office Chair', ar: 'كرسي مكتب قماشي' }, label: L_OFFICE, category: 'office', store: 'mk', price: 1450, colors: [C.taupe, C.charcoal], dimensions: { en: 'W 64 × D 62 × H 92–102 cm', ar: 'العرض 64 × العمق 62 × الارتفاع 92–102 سم' }, materials: { en: 'Woven fabric, moulded foam, aluminium five-star base, soft castors.', ar: 'قماش منسوج، إسفنج مقولب، قاعدة ألمنيوم خماسية، عجلات ناعمة.' }, care: FABRIC_CARE, left: 57.5, top: 59 },
  { id: 38, room: 'office', slug: 'desk-lamp', name: { en: 'Olive Desk Lamp', ar: 'مصباح مكتب زيتوني' }, label: L_LIGHT, category: 'lighting', store: 'ld', price: 340, colors: [C.olive, C.charcoal], dimensions: { en: 'H 48 cm · adjustable arm', ar: 'الارتفاع 48 سم · ذراع قابلة للتعديل' }, materials: { en: 'Powder-coated steel.', ar: 'فولاذ مطلي بالبودرة.' }, care: LAMP_CARE, left: 45, top: 37 },
  { id: 39, room: 'office', slug: 'bookshelf', name: { en: 'Open Bookshelf', ar: 'مكتبة برفوف مفتوحة' }, label: L_OFFICE, category: 'office', store: 'mk', price: 1750, colors: [C.ivory, C.sand], dimensions: { en: 'W 90 × D 32 × H 200 cm · five shelves', ar: 'العرض 90 × العمق 32 × الارتفاع 200 سم · خمسة رفوف' }, materials: { en: 'Lacquered MDF with a fixed back panel.', ar: 'MDF مطلي بلوح خلفي ثابت.' }, care: WOOD_CARE, left: 81, top: 37 },
  { id: 40, room: 'office', slug: 'rug', name: { en: 'Woven Office Rug', ar: 'سجادة مكتب منسوجة' }, label: L_RUG, category: 'rugs', store: 'ns', price: 980, colors: [C.sand], dimensions: { en: '160 × 230 cm', ar: '160 × 230 سم' }, materials: { en: 'Flat-woven wool and jute.', ar: 'صوف وجوت بنسج مسطّح.' }, care: RUG_CARE, left: 34, top: 88 },
  { id: 41, room: 'office', slug: 'plant', name: { en: 'Olive Tree in Ceramic Pot', ar: 'شجرة زيتون في أصيص خزفي' }, label: L_DECOR, category: 'decor', store: 'zk', price: 540, colors: [C.ivory], dimensions: { en: 'H 150 cm · Pot Ø 35 cm', ar: 'الارتفاع 150 سم · قطر الأصيص 35 سم' }, materials: { en: 'Preserved olive tree in a glazed ceramic pot.', ar: 'شجرة زيتون محفوظة في أصيص خزفي مزجج.' }, care: { en: 'Dust the leaves with a soft brush; keep away from heat.', ar: 'انفض الأوراق بفرشاة ناعمة، وأبعدها عن الحرارة.' }, left: 26, top: 45 },
];

const ROOM_NAMES: Record<string, Bi> = {
  living: { en: 'Living Room', ar: 'غرفة المعيشة' },
  bedroom: { en: 'Bedroom', ar: 'غرفة النوم' },
  dining: { en: 'Dining Room', ar: 'غرفة الطعام' },
  majlis: { en: 'Majlis', ar: 'المجلس' },
  office: { en: 'Home Office', ar: 'المكتب المنزلي' },
};
const roomImg = (room: string) => `/looks/rooms/${room}.webp`;
const pieceImg = (p: RoomPiece) => `/looks/rooms/items/${p.room}-${p.slug}.webp`;

// the pieces are real catalogue entries, so a point's "view product" and "add to cart" work
CATALOG.push(
  ...ROOM_PIECES.map((p): CatalogProduct => ({
    id: p.id,
    img: pieceImg(p),
    gallery: [pieceImg(p), roomImg(p.room)],
    name: p.name,
    store: p.store,
    category: p.category,
    room: p.room,
    style: 'modern',
    price: p.price,
    rating: 4.6 + ((p.id * 3) % 4) / 10,
    reviews: 18 + ((p.id * 37) % 140),
    sku: `SL-${p.room.slice(0, 2).toUpperCase()}-${String(p.id).padStart(4, '0')}`,
    colors: p.colors,
    dimensions: p.dimensions,
    materials: p.materials,
    care: p.care,
    description: {
      en: `${p.name.en}, as shown in the ${ROOM_NAMES[p.room].en.toLowerCase()} on the home page. Every piece in that room can be bought on its own or together.`,
      ar: `${p.name.ar}، كما يظهر في ${ROOM_NAMES[p.room].ar} في الصفحة الرئيسية. يمكن شراء كل قطعة في تلك الغرفة منفردة أو مع بقية القطع.`,
    },
    availability: 'in_stock',
    leadTime: D57,
  })),
);

/** a point opens its card away from the nearest edge of the photograph */
const spotOf = (id: string, productId: number, thumb: string, name: Bi, category: Bi, price: number, left: number, top: number): RoomHotspot => ({
  id, productId, thumb, name, category, price,
  left: `${left}%`, top: `${top}%`,
  align: left > 50 ? 'left' : 'right',
  vAlign: top > 50 ? 'top' : 'bottom',
});

export const SHOP_ROOMS: ShopRoom[] = (['living', 'bedroom', 'dining', 'majlis', 'office'] as const).map((key) => ({
  key,
  name: ROOM_NAMES[key],
  img: roomImg(key),
  spots: [
    // the living room's sofa is the olive three-seater already in the catalogue
    ...(key === 'living' ? [spotOf('living-sofa', 1, '/looks/cutout/p01.webp', CATALOG[0].name, L_FURNITURE, CATALOG[0].price, 79, 53)] : []),
    ...ROOM_PIECES.filter((p) => p.room === key).map((p) => spotOf(`${p.room}-${p.slug}`, p.id, pieceImg(p), p.name, p.label, p.price, p.left, p.top)),
  ],
}));

/** Diyar's own storefront — not in STORES (those are partner vendors). */
export const DIYAR_STORE: LookStore = {
  key: 'diyar', name: { en: 'Diyar Home', ar: 'ديار هوم' },
  specialty: { en: 'Diyar\'s own collection', ar: 'تشكيلة ديار الخاصة' },
  mark: '/looks/brands/diyar-mark.webp', logo: '/looks/brands/diyar.webp',
  initials: 'DH', rating: 4.9, products: 5, cover: IMG.hero,
};

export const ALL_STORES: LookStore[] = [DIYAR_STORE, ...STORES];

export const storeOf = (key: StoreKey): LookStore => ALL_STORES.find((s) => s.key === key) ?? DIYAR_STORE;

/* ------------------------------------------------------------------ */
/* Store locations — Jeddah                                            */
/* District points geocoded from OpenStreetMap (Nominatim). Street-    */
/* level addresses are deliberately not invented.                     */
/* ------------------------------------------------------------------ */

export interface StoreLocation {
  id: string;
  store: StoreKey;
  district: Bi;
  lat: number;
  lng: number;
  /** Opening hours in Saudi (Riyadh) time on a 24h clock; 24 means midnight. */
  opens: number;
  closes: number;
  /** Day the location is closed, 0 = Sunday … 6 = Saturday. */
  closedOn?: number;
}

/** Where the nearby-stores map starts: central Jeddah. */
export const MAP_ORIGIN = {
  lat: 21.55044,
  lng: 39.17424,
  label: { en: 'Jeddah, Saudi Arabia', ar: 'جدة، السعودية' } as Bi,
};

export const STORE_LOCATIONS: StoreLocation[] = [
  { id: 'diyar-tahlia', store: 'diyar', district: { en: 'Tahlia Street, Al Khalidiyah', ar: 'شارع التحلية، الخالدية' }, lat: 21.54768, lng: 39.136, opens: 10, closes: 23 },
  { id: 'dw-rawdah', store: 'dw', district: { en: 'Al Rawdah', ar: 'حي الروضة' }, lat: 21.55193, lng: 39.14359, opens: 10, closes: 23 },
  { id: 'ld-hamra', store: 'ld', district: { en: 'Al Hamra', ar: 'حي الحمراء' }, lat: 21.52822, lng: 39.16257, opens: 10, closes: 22 },
  { id: 'bk-salamah', store: 'bk', district: { en: 'Al Salamah', ar: 'حي السلامة' }, lat: 21.594, lng: 39.15236, opens: 9, closes: 18, closedOn: 5 },
  { id: 'ns-balad', store: 'ns', district: { en: 'Al Balad, Historic Jeddah', ar: 'البلد، جدة التاريخية' }, lat: 21.48604, lng: 39.1877, opens: 16, closes: 24 },
  { id: 'diyar-obhur', store: 'diyar', district: { en: 'South Obhur, Corniche Road', ar: 'أبحر الجنوبية، طريق الكورنيش' }, lat: 21.73562, lng: 39.12275, opens: 10, closes: 24 },
];

/** Great-circle distance in kilometres. */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Whether a location is open right now, judged in Saudi (Riyadh) time. */
export function isOpenNow(loc: StoreLocation, now: Date = new Date()): boolean {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Riyadh', hour: 'numeric', hourCycle: 'h23', weekday: 'short',
  }).formatToParts(now);
  const hour = Number(parts.find((x) => x.type === 'hour')?.value ?? 0);
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.find((x) => x.type === 'weekday')?.value ?? 'Sun');
  if (loc.closedOn === day) return false;
  return hour >= loc.opens && hour < loc.closes;
}

export const findProduct = (id: string | number | undefined): CatalogProduct | undefined =>
  CATALOG.find((p) => p.id === Number(id));

/** Products a shopper is likely to want next: same category first, then same room. */
export const relatedProducts = (p: CatalogProduct, n = 4): CatalogProduct[] => {
  const others = CATALOG.filter((x) => x.id !== p.id);
  const same = others.filter((x) => x.category === p.category);
  const room = others.filter((x) => x.category !== p.category && x.room === p.room);
  return [...same, ...room, ...others].filter((x, i, a) => a.indexOf(x) === i).slice(0, n);
};

/* ------------------------------------------------------------------ */
/* Search / listing                                                    */
/* ------------------------------------------------------------------ */

export type SortKey = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';

export const SORT_OPTIONS: { key: SortKey; label: Bi }[] = [
  { key: 'relevance', label: { en: 'Recommended', ar: 'الأكثر ملاءمة' } },
  { key: 'newest', label: { en: 'Newest', ar: 'الأحدث' } },
  { key: 'price_asc', label: { en: 'Price: Low to High', ar: 'السعر: من الأقل للأعلى' } },
  { key: 'price_desc', label: { en: 'Price: High to Low', ar: 'السعر: من الأعلى للأقل' } },
  { key: 'rating', label: { en: 'Top Rated', ar: 'الأعلى تقييماً' } },
];

export const PRICE_BANDS: { key: string; label: Bi; min: number; max: number }[] = [
  { key: 'u1k', label: { en: 'Under 1,000 SAR', ar: 'أقل من 1,000 ر.س' }, min: 0, max: 999 },
  { key: '1k-5k', label: { en: '1,000 – 5,000 SAR', ar: '1,000 – 5,000 ر.س' }, min: 1000, max: 4999 },
  { key: '5k-10k', label: { en: '5,000 – 10,000 SAR', ar: '5,000 – 10,000 ر.س' }, min: 5000, max: 9999 },
  { key: '10k-20k', label: { en: '10,000 – 20,000 SAR', ar: '10,000 – 20,000 ر.س' }, min: 10000, max: 19999 },
  { key: 'o20k', label: { en: 'Over 20,000 SAR', ar: 'أكثر من 20,000 ر.س' }, min: 20000, max: Infinity },
];

export const AVAILABILITY_LABEL: Record<Availability, Bi> = {
  in_stock: { en: 'In stock', ar: 'متوفر' },
  low_stock: { en: 'Low stock', ar: 'كمية محدودة' },
  made_to_order: { en: 'Made to order', ar: 'يُصنع حسب الطلب' },
};

export interface SearchQuery {
  q?: string;
  category?: CategoryKey | '';
  room?: RoomKey | '';
  style?: StyleKey | '';
  store?: StoreKey | '';
  price?: string;          // PRICE_BANDS key
  sale?: boolean;
  sort?: SortKey;
}

/** Read a SearchQuery out of URL search params (the listing page keeps its state in the URL). */
export function parseSearch(sp: URLSearchParams): SearchQuery {
  return {
    q: sp.get('q') ?? '',
    category: (sp.get('category') as CategoryKey | null) ?? '',
    room: (sp.get('room') as RoomKey | null) ?? '',
    style: (sp.get('style') as StyleKey | null) ?? '',
    store: (sp.get('store') as StoreKey | null) ?? '',
    price: sp.get('price') ?? '',
    sale: sp.get('sale') === '1',
    sort: (sp.get('sort') as SortKey | null) ?? 'relevance',
  };
}

/** Write a SearchQuery back to URL search params, dropping defaults. */
export function serializeSearch(qy: SearchQuery): URLSearchParams {
  const sp = new URLSearchParams();
  if (qy.q) sp.set('q', qy.q);
  if (qy.category) sp.set('category', qy.category);
  if (qy.room) sp.set('room', qy.room);
  if (qy.style) sp.set('style', qy.style);
  if (qy.store) sp.set('store', qy.store);
  if (qy.price) sp.set('price', qy.price);
  if (qy.sale) sp.set('sale', '1');
  if (qy.sort && qy.sort !== 'relevance') sp.set('sort', qy.sort);
  return sp;
}

/** Loose Arabic/Latin normalisation so "اريكه" still finds "أريكة". */
const norm = (s: string) =>
  s.toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');

/** The one filtering implementation every look's search page uses, so results always agree. */
export function filterCatalog(qy: SearchQuery, lang: Lang): CatalogProduct[] {
  const q = norm((qy.q ?? '').trim());
  const band = PRICE_BANDS.find((b) => b.key === qy.price);
  let out = CATALOG.filter((p) => {
    if (qy.category && p.category !== qy.category) return false;
    if (qy.room && p.room !== qy.room) return false;
    if (qy.style && p.style !== qy.style) return false;
    if (qy.store && p.store !== qy.store) return false;
    if (qy.sale && !p.oldPrice) return false;
    if (band && (p.price < band.min || p.price > band.max)) return false;
    if (q) {
      const store = storeOf(p.store);
      const cat = CATEGORIES.find((c) => c.key === p.category);
      const hay = norm([p.name.en, p.name.ar, p.sku, store.name.en, store.name.ar, cat?.[lang] ?? ''].join(' '));
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  switch (qy.sort) {
    case 'price_asc': out = [...out].sort((a, b) => a.price - b.price); break;
    case 'price_desc': out = [...out].sort((a, b) => b.price - a.price); break;
    case 'rating': out = [...out].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
    case 'newest': out = [...out].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew) || b.id - a.id); break;
    default: out = [...out].sort((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller) || b.reviews - a.reviews);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Route helpers — every look lives under /look/:n                     */
/* ------------------------------------------------------------------ */

export type LookNo = 1 | 2 | 3;
export const lookBase = (n: LookNo) => `/look/${n}`;
export const searchPath = (n: LookNo, qy?: SearchQuery) => {
  const sp = qy ? serializeSearch(qy).toString() : '';
  // Look 1: browsing (a category, a room, a store…) is the catalogue; only typed words are a search
  const page = n === 1 && !qy?.q ? 'products' : 'search';
  return `${lookBase(n)}/${page}${sp ? `?${sp}` : ''}`;
};
export const productPath = (n: LookNo, id: number) => `${lookBase(n)}/product/${id}`;

/* ------------------------------------------------------------------ */
/* Homepage sections carried over from the original site (Look 4)      */
/* so the chosen look can mirror its structure section for section.    */
/* ------------------------------------------------------------------ */

/** Quick-nav strip under the hero: 10 shop categories + 10 services, using the client's own icons. */
export interface QuickCategory {
  en: string; ar: string; icon: string;
  kind: 'shop' | 'service';
  /** Ground baked into the artwork — decides whether the label prints ink or cream. */
  tone: 'light' | 'dark';
  category?: CategoryKey; room?: RoomKey;
}

export const QUICK_CATEGORIES: QuickCategory[] = [
  { en: 'Bedrooms', ar: 'غرف النوم', icon: '/categories/tiles/غرف النوم.jpg', kind: 'shop', tone: 'light', category: 'home', room: 'bedroom' },
  { en: 'Living Rooms', ar: 'الصالونات', icon: '/categories/tiles/الصالونات.jpg', kind: 'shop', tone: 'light', category: 'home', room: 'living' },
  { en: 'Kitchens', ar: 'المطابخ', icon: '/categories/tiles/المطابخ.jpg', kind: 'shop', tone: 'light', category: 'home' },
  { en: 'Dining Rooms', ar: 'غرف الطعام', icon: '/categories/tiles/غرف الطعام.jpg', kind: 'shop', tone: 'light', category: 'home', room: 'dining' },
  { en: 'Offices', ar: 'المكاتب', icon: '/categories/tiles/المكاتب.jpg', kind: 'shop', tone: 'light', category: 'office' },
  { en: 'Decor', ar: 'ديكورات', icon: '/categories/tiles/ديكورات.jpg', kind: 'shop', tone: 'light', category: 'decor' },
  { en: 'Lighting', ar: 'الإضاءة', icon: '/categories/tiles/الإضاءة.jpg', kind: 'shop', tone: 'light', category: 'lighting' },
  { en: 'Curtains', ar: 'الستائر', icon: '/categories/tiles/الستائر.jpg', kind: 'shop', tone: 'light', category: 'decor' },
  { en: 'Outdoor', ar: 'أثاث خارجي', icon: '/categories/tiles/أثاث خارجي.jpg', kind: 'shop', tone: 'light', category: 'home', room: 'outdoor' },
  { en: 'Bathrooms', ar: 'الحمامات', icon: '/categories/tiles/الحمامات.jpg', kind: 'shop', tone: 'light', category: 'bath' },
  { en: 'Interior Design', ar: 'تصميم داخلي', icon: '/categories/tiles/تصميم داخلي.jpg', kind: 'service', tone: 'dark' },
  { en: 'Installation & Maintenance', ar: 'تركيب وصيانة', icon: '/categories/tiles/تركيب وصيانة.jpg', kind: 'service', tone: 'dark' },
  { en: 'Painting', ar: 'دهانات', icon: '/categories/tiles/دهانات.jpg', kind: 'service', tone: 'dark' },
  { en: 'Upholstery & Renewal', ar: 'تنجيد وتجديد', icon: '/categories/tiles/تنجيد وتجديد.jpg', kind: 'service', tone: 'dark' },
  { en: 'Custom Carpentry', ar: 'نجارة مخصصة', icon: '/categories/tiles/نجارة مخصصة.jpg', kind: 'service', tone: 'dark' },
  { en: 'Design Consultation', ar: 'استشارات تصميم', icon: '/categories/tiles/استشارات تصميم.jpg', kind: 'service', tone: 'dark' },
  { en: 'Moving & Packing', ar: 'نقل وتغليف', icon: '/categories/tiles/نقل وتغليف.jpg', kind: 'service', tone: 'dark' },
  { en: 'Cleaning & Polishing', ar: 'تنظيف وتلميع', icon: '/categories/tiles/تنظيف وتلميع.jpg', kind: 'service', tone: 'dark' },
  { en: 'Lighting & Electrical', ar: 'إضاءة وكهرباء', icon: '/categories/tiles/إضاءة وكهرباء.jpg', kind: 'service', tone: 'dark' },
  { en: 'Curtain Installation', ar: 'تركيب الستائر', icon: '/categories/tiles/تركيب الستائر.jpg', kind: 'service', tone: 'dark' },
];

/** Promo mosaic (the original's five-panel offers grid). `span` is out of a 6-column grid. */
export interface PromoPanel { img: string; eyebrow: Bi; title: Bi; cta: Bi; span: 2 | 3; query?: SearchQuery; /** a page instead of a search */ to?: string }

/** Own banner photography, shot minimal so the wall reads as one set. */
export const PROMO_PANELS: PromoPanel[] = [
  { img: '/looks/promo/lead-summer.webp', span: 3, eyebrow: { en: 'Limited Time', ar: 'لفترة محدودة' }, title: { en: 'Summer Sale — up to 40% off sofas', ar: 'عروض الصيف — خصم حتى 40% على الأرائك' }, cta: { en: 'Shop the Sale', ar: 'تسوق العروض' }, query: { sale: true } },
  { img: '/looks/promo/design-session.webp', span: 3, eyebrow: { en: 'Free Service', ar: 'خدمة مجانية' }, title: { en: 'Free design session with any order over 5,000 SAR', ar: 'جلسة تصميم مجانية مع كل طلب فوق 5,000 ر.س' }, cta: { en: 'Book Now', ar: 'احجز الآن' }, to: '/look/1/service/interior-design' },
  { img: '/looks/promo/lighting.webp', span: 2, eyebrow: { en: 'New Arrivals', ar: 'وصل حديثاً' }, title: { en: 'Lighting edit', ar: 'مختارات الإنارة' }, cta: { en: 'Discover', ar: 'اكتشف' }, query: { category: 'lighting' } },
  { img: '/looks/promo/bedroom-packages.webp', span: 2, eyebrow: { en: 'Bundles', ar: 'باقات' }, title: { en: 'Bedroom sets from 6,900 SAR', ar: 'باقات غرف النوم من 6,900 ر.س' }, cta: { en: 'View Sets', ar: 'شاهد الباقات' }, query: { room: 'bedroom' } },
  { img: '/looks/promo/custom-furniture.webp', span: 2, eyebrow: { en: 'Made to Order', ar: 'حسب الطلب' }, title: { en: 'Custom furniture, 3–4 weeks', ar: 'أثاث مخصص خلال 3–4 أسابيع' }, cta: { en: 'Start a Project', ar: 'ابدأ مشروعك' }, to: '/look/1/service/custom-furniture' },
];

/** "Most interactive" rail — live shopper activity on catalog items. */
export interface TrendingItem { productId: number; views: number; likes: number; saves: number; hot?: boolean }

export const TRENDING: TrendingItem[] = [
  { productId: 5, views: 1842, likes: 312, saves: 148, hot: true },
  { productId: 1, views: 1530, likes: 276, saves: 121, hot: true },
  { productId: 3, views: 1207, likes: 198, saves: 96 },
  { productId: 6, views: 1114, likes: 240, saves: 88, hot: true },
  { productId: 4, views: 968, likes: 154, saves: 77 },
  { productId: 9, views: 902, likes: 221, saves: 64 },
];

/** "Featured deals" — a countdown that ends at local midnight, over the discounted items. */
export const FEATURED_DEALS = {
  productIds: [2, 6, 4, 7, 8, 9] as number[],
  /** Extra deal applied on top of the catalogue price for items without an oldPrice (percent). */
  fallbackDiscount: 15,
};

/** Two campaign banners (the original's summer banners), typographic instead of baked images. */
export interface Campaign {
  img: string; eyebrow: Bi; title: Bi; body: Bi; cta: Bi; query?: SearchQuery;
  tone: 'light' | 'dark';
  /** 'soft' for a photograph already shot with the reading side left empty —
   *  the full scrim exists to carve room out of a busy picture, and laying it
   *  over one that does not need it only drains the colour. */
  scrim?: 'soft';
}

export const CAMPAIGNS: Campaign[] = [
  {
    // shot wide with the wall left empty on the reading side, so the copy sits
    // on the room rather than on top of the sofa
    // white type
    img: '/looks/campaign-living.webp', tone: 'dark', scrim: 'soft',
    eyebrow: { en: 'Summer Offers', ar: 'عروض الصيف' },
    title: { en: 'Up to 40% off living room seating', ar: 'خصم حتى 40% على جلسات المعيشة' },
    body: { en: 'Sofas, armchairs and majlis sets from Diyar and its partner stores — while stock lasts.', ar: 'أرائك وكراسي وأطقم مجالس من ديار ومتاجرها الشريكة — حتى نفاد الكمية.' },
    cta: { en: 'Shop the Offers', ar: 'تسوق العروض' }, query: { sale: true },
  },
  {
    // shot wide with the wall left empty on the reading side, like the summer
    // banner, so the copy sits on the room rather than over the seating
    // black type
    img: '/looks/campaign-majlis.webp', tone: 'light', scrim: 'soft',
    eyebrow: { en: 'Majlis Season', ar: 'موسم المجالس' },
    title: { en: 'Furnish the whole majlis — delivered and installed', ar: 'جهّز مجلسك كاملاً — توصيل وتركيب' },
    body: { en: 'Seating, lighting, rugs and curtains coordinated by our designers, installed by our crews.', ar: 'جلسات وإنارة وسجاد وستائر ينسقها مصممونا وتركّبها فرقنا.' },
    cta: { en: 'Explore Majlis', ar: 'استكشف المجالس' }, query: { room: 'majlis' },
  },
];

/** "Suggested for you" — personalised picks (static for the demo). */
export const SUGGESTED_IDS: number[] = [8, 5, 3, 7, 2];

/** Brand wordmarks strip (the original listed these brands). Rendered as type, no logos. */
/** The brands strip under the hero: the marketplace's stores first, then other
 *  brands sold on it. `store` links the chip to that store's page and gives it
 *  its offer badge; `logo` is a transparent lockup in public/looks/brands — a
 *  brand without one is set as a plain wordmark until its logo arrives. */
export interface StripBrand { name: Bi; logo?: string; mark?: string; store?: StoreKey }
const brandLogo = (k: string) => `/looks/brands/${k}.webp`;
const brandMark = (k: string) => `/looks/brands/${k}-mark.webp`;
export const BRANDS: StripBrand[] = [
  { store: 'diyar', name: { en: 'Diyar Home', ar: 'ديار هوم' }, logo: brandLogo('diyar'), mark: brandMark('diyar') },
  { store: 'bk', name: { en: 'Bayt Al-Khashab', ar: 'بيت الخشب' }, logo: brandLogo('bk'), mark: brandMark('bk') },
  { store: 'ld', name: { en: 'Lamsat Daw', ar: 'لمسة ضوء' }, mark: brandMark('ld') },
  { store: 'dw', name: { en: 'Diwan', ar: 'ديوان' }, logo: brandLogo('dw'), mark: brandMark('dw') },
  { store: 'ns', name: { en: 'Naseej', ar: 'نسيج' }, mark: brandMark('ns') },
  { store: 'zk', name: { en: 'Zukhruf', ar: 'زخرف' }, logo: brandLogo('zk'), mark: brandMark('zk') },
  { store: 'mk', name: { en: 'Maktabi', ar: 'مكتبي' }, logo: brandLogo('mk'), mark: brandMark('mk') },
  { name: { en: 'Almajlis', ar: 'المجلس' }, logo: brandLogo('almajlis'), mark: brandMark('almajlis') },
  { name: { en: 'Atheer Almanzil', ar: 'أثير المنزل' }, logo: brandLogo('atheer'), mark: brandMark('atheer') },
  { name: { en: 'Masaken', ar: 'مساكن' }, logo: brandLogo('masaken'), mark: brandMark('masaken') },
  { name: { en: 'Wahat Almanzil', ar: 'واحة المنزل' }, logo: brandLogo('wahat'), mark: brandMark('wahat') },
];

/** Standalone newsletter section (the original's closing section). */
export const NEWSLETTER = {
  title: { en: 'Subscribe to our newsletter', ar: 'اشترك في نشرتنا البريدية' } as Bi,
  body: { en: 'The latest offers, decor tips and new arrivals — straight to your inbox.', ar: 'احصل على أحدث العروض، ونصائح الديكور، والمنتجات الجديدة مباشرة في صندوق الوارد الخاص بك.' } as Bi,
  placeholder: { en: 'Enter your email', ar: 'أدخل بريدك الإلكتروني' } as Bi,
  cta: { en: 'Subscribe', ar: 'اشتراك' } as Bi,
  success: { en: 'You are on the list.', ar: 'تم اشتراكك بنجاح.' } as Bi,
};

/** Milliseconds until the next local midnight — shared by the deal countdowns. */
export const msUntilMidnight = (now = new Date()) => {
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return end.getTime() - now.getTime();
};

export const formatSAR = (n: number) => n.toLocaleString('en-US');

/**
 * Floating switcher shown on every look page (and the original site) so the
 * client can flip between directions. A slim vertical rail on the left edge:
 * the end of the reading line in Arabic, and clear of the original site's
 * contact buttons, which sit bottom-right. z-[45] is deliberate: one look
 * renders its mobile drawer inside the fixed z-50 header, whose stacking
 * context caps that whole drawer at 50 — so the rail must sit below 50 for
 * every open menu to cover it. Nothing else on these pages stacks above ~z-20.
 */
export function LookSwitcher() {
  const { pathname } = useLocation();
  // looks 2 and 3 are archived (src/pages/looks/_archive), leaving the chosen
  // direction and the current site to compare it against
  const looks = [
    { to: '/look/1', label: '1' },
    { to: '/', label: '2' },
  ];
  // a look's search and product pages still belong to that look
  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);
  return (
    <nav
      dir="ltr"
      aria-label="Design looks"
      data-testid="look-switcher"
      className="fixed left-3 top-1/2 z-[45] flex -translate-y-1/2 flex-col items-center gap-1 rounded-full border border-white/10 bg-black/80 px-1.5 py-2 shadow-2xl backdrop-blur-md md:left-4"
    >
      <Link
        to="/looks"
        className="rotate-180 px-1 py-2 text-[10px] uppercase tracking-[0.18em] text-white/60 transition-colors [writing-mode:vertical-rl] hover:text-white"
      >
        Looks
      </Link>
      {looks.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          aria-current={isActive(l.to) ? 'page' : undefined}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold transition-colors ${
            isActive(l.to) ? 'bg-white text-black' : 'text-white/70 hover:bg-white/15 hover:text-white'
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
