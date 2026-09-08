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

export const CATEGORIES: LookCategory[] = [
  { key: 'home', img: IMG.catHome, en: 'Home Furniture', ar: 'الأثاث المنزلي' },
  { key: 'office', img: IMG.catOffice, en: 'Office Furniture', ar: 'الأثاث المكتبي' },
  { key: 'lighting', img: IMG.catLighting, en: 'Lighting', ar: 'الإنارات' },
  { key: 'rugs', img: IMG.bedroom, en: 'Rugs & Carpets', ar: 'السجاد' },
  { key: 'bath', img: IMG.loungeDark, en: 'Bathroom Solutions', ar: 'دورات المياه' },
  { key: 'decor', img: IMG.roomHotspots, en: 'Accessories & Decor', ar: 'الإكسسوارات والديكور' },
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
export type StoreKey = 'diyar' | 'bk' | 'ld' | 'dw' | 'ns';

export interface LookStore { key: StoreKey; name: Bi; specialty: Bi; initials: string; rating: number; products: number; cover: string }

export const STORES: LookStore[] = [
  {
    key: 'bk',
    name: { en: 'Bayt Al-Khashab', ar: 'بيت الخشب' },
    specialty: { en: 'Solid wood & custom joinery', ar: 'الخشب الصلب والنجارة المخصصة' },
    initials: 'BK', rating: 4.9, products: 412, cover: IMG.workshop,
  },
  {
    key: 'ld',
    name: { en: 'Lamsat Daw', ar: 'لمسة ضوء' },
    specialty: { en: 'Designer lighting', ar: 'إنارات مصممة' },
    initials: 'LD', rating: 4.8, products: 268, cover: IMG.catLighting,
  },
  {
    key: 'dw',
    name: { en: 'Diwan', ar: 'ديوان' },
    specialty: { en: 'Majlis & seating', ar: 'المجالس والجلسات' },
    initials: 'DW', rating: 4.7, products: 531, cover: IMG.loungeDark,
  },
  {
    key: 'ns',
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
    store: 'diyar', category: 'decor', room: 'dining', style: 'modern',
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
    store: 'dw', category: 'home', room: 'living', style: 'modern',
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
    store: 'diyar', category: 'decor', room: 'outdoor', style: 'bohemian',
    price: 620, rating: 4.8, reviews: 64, sku: 'DH-PL-0330',
    colors: [C.terracotta],
    dimensions: { en: 'Ø 52 × H 60 cm · drainage hole', ar: 'القطر 52 × الارتفاع 60 سم · فتحة تصريف' },
    materials: { en: 'Frost-resistant terracotta with a hand-applied aged patina.', ar: 'فخار مقاوم للصقيع بطبقة عتيقة مطبقة يدوياً.' },
    care: { en: 'Suitable indoors and out; raise on feet outdoors to protect the surface beneath.', ar: 'مناسب للداخل والخارج، وارفعه على قواعد في الخارج لحماية السطح تحته.' },
    description: { en: 'Big enough for an olive tree, weathered enough to look like it has always been there.', ar: 'كبير بما يكفي لشجرة زيتون، ومعتّق بما يكفي ليبدو كأنه موجود منذ الأزل.' },
    availability: 'in_stock', leadTime: D35,
  },
];

/** Diyar's own storefront — not in STORES (those are partner vendors). */
export const DIYAR_STORE: LookStore = {
  key: 'diyar', name: { en: 'Diyar Home', ar: 'ديار هوم' },
  specialty: { en: 'Diyar\'s own collection', ar: 'تشكيلة ديار الخاصة' },
  initials: 'DH', rating: 4.9, products: 5, cover: IMG.hero,
};

export const ALL_STORES: LookStore[] = [DIYAR_STORE, ...STORES];

export const storeOf = (key: StoreKey): LookStore => ALL_STORES.find((s) => s.key === key) ?? DIYAR_STORE;

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
  return `${lookBase(n)}/search${sp ? `?${sp}` : ''}`;
};
export const productPath = (n: LookNo, id: number) => `${lookBase(n)}/product/${id}`;

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
