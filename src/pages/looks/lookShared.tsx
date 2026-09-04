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

/**
 * Shoppable "Shop the Look" hotspots.
 * `top`/`left` are physical percentages tracking real objects inside
 * /looks/room-hotspots.jpg, so they must NOT be mirrored in RTL.
 * `align`/`vAlign` say which way the product card should open so it
 * never runs off the edge of the image.
 */
export interface RoomHotspot {
  id: string;
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
    thumb: '/looks/shop/lamp.jpg',
    name: { en: 'Brass Floor Lamp with Linen Shade', ar: 'مصباح أرضي نحاسي بغطاء كتان' },
    category: { en: 'Lighting', ar: 'الإنارات' },
    price: 1450,
    top: '33%', left: '83%', align: 'left', vAlign: 'bottom',
  },
  {
    id: 'tapestry',
    thumb: '/looks/shop/tapestry.jpg',
    name: { en: 'Vintage Woven Wall Tapestry', ar: 'سجادة جدارية منسوجة' },
    category: { en: 'Wall Art', ar: 'اللوحات' },
    price: 2300,
    top: '29%', left: '61%', align: 'left', vAlign: 'bottom',
  },
  {
    id: 'vases',
    thumb: '/looks/shop/vases.jpg',
    name: { en: 'Stoneware Vase Set', ar: 'طقم مزهريات حجرية' },
    category: { en: 'Vases & Vessels', ar: 'المزهريات والأواني' },
    price: 480,
    top: '70%', left: '47%', align: 'right', vAlign: 'top',
  },
  {
    id: 'chair',
    thumb: '/looks/shop/chair.jpg',
    name: { en: 'Olive Boucle Lounge Chair', ar: 'كرسي استرخاء بقماش البوكليه' },
    category: { en: 'Home Furniture', ar: 'الأثاث المنزلي' },
    price: 3150,
    top: '77%', left: '66%', align: 'left', vAlign: 'top',
  },
  {
    id: 'planter',
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

/* ------------------------------------------------------------------ */
/* Sections carried over from the original marketplace site            */
/* ------------------------------------------------------------------ */

/** Shop by room — complements "Find Your Style" (which shops by aesthetic). */
export interface LookRoom { img: string; en: string; ar: string; count: number }

export const ROOMS: LookRoom[] = [
  { img: IMG.catHome, en: 'Living Rooms', ar: 'غرف المعيشة', count: 1284 },
  { img: IMG.bedroom, en: 'Bedrooms', ar: 'غرف النوم', count: 962 },
  { img: IMG.restaurant, en: 'Dining Rooms', ar: 'غرف الطعام', count: 738 },
  { img: IMG.loungeDark, en: 'Majlis', ar: 'المجالس', count: 611 },
  { img: IMG.catOffice, en: 'Home Office', ar: 'المكاتب المنزلية', count: 455 },
  { img: IMG.hero, en: 'Outdoor', ar: 'الجلسات الخارجية', count: 327 },
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
export interface LookStore { name: Bi; specialty: Bi; initials: string; rating: number; products: number; cover: string }

export const STORES: LookStore[] = [
  {
    name: { en: 'Bayt Al-Khashab', ar: 'بيت الخشب' },
    specialty: { en: 'Solid wood & custom joinery', ar: 'الخشب الصلب والنجارة المخصصة' },
    initials: 'BK', rating: 4.9, products: 412, cover: IMG.workshop,
  },
  {
    name: { en: 'Lamsat Daw', ar: 'لمسة ضوء' },
    specialty: { en: 'Designer lighting', ar: 'إنارات مصممة' },
    initials: 'LD', rating: 4.8, products: 268, cover: IMG.catLighting,
  },
  {
    name: { en: 'Diwan', ar: 'ديوان' },
    specialty: { en: 'Majlis & seating', ar: 'المجالس والجلسات' },
    initials: 'DW', rating: 4.7, products: 531, cover: IMG.loungeDark,
  },
  {
    name: { en: 'Naseej', ar: 'نسيج' },
    specialty: { en: 'Rugs & textiles', ar: 'السجاد والمنسوجات' },
    initials: 'NS', rating: 4.9, products: 349, cover: IMG.bedroom,
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

export const formatSAR = (n: number) => n.toLocaleString('en-US');

/** Floating switcher shown on every look page (and the original site) so the client can flip between directions. */
export function LookSwitcher({ raiseOnMobile = false }: { raiseOnMobile?: boolean } = {}) {
  const { pathname } = useLocation();
  const looks = [
    { to: '/look/1', label: '1' },
    { to: '/look/2', label: '2' },
    { to: '/look/3', label: '3' },
    { to: '/', label: '4' },
  ];
  return (
    <div dir="ltr" className={`fixed left-1/2 -translate-x-1/2 z-[90] flex items-center gap-1 rounded-full bg-black/80 backdrop-blur-md px-2 py-1.5 shadow-2xl border border-white/10 ${raiseOnMobile ? 'bottom-[86px] md:bottom-5' : 'bottom-5'}`}>
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
