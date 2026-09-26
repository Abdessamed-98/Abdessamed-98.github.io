/**
 * Look 1 — demo content for the inner pages (providers, companies, the
 * account's inbox and history, chat, loyalty, help). Bilingual throughout, like
 * lookShared; kept apart from it so the catalogue file stays about the shop.
 */
import { Truck, PenTool, Layers, Ruler, Hammer, Lightbulb, Zap, Scissors, Sparkles, Palette, Gift, type LucideIcon } from 'lucide-react';
import { BLOG_POSTS, IMG, type Bi, type LookPost, type StoreKey } from '../lookShared';

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

export const ORDER_STEPS: Bi[] = [
  { en: 'Preparing', ar: 'قيد التجهيز' },
  { en: 'Shipped', ar: 'شُحنت' },
  { en: 'Out for delivery', ar: 'جاري التوصيل' },
  { en: 'Delivered', ar: 'تم التوصيل' },
];

export interface DemoOrder {
  id: string;
  date: Bi;
  /** index into ORDER_STEPS of the current step; ORDER_STEPS.length = complete */
  step: number;
  productIds: number[];
  total: number;
  rated?: boolean;
}

export const DEMO_ORDERS: DemoOrder[] = [
  { id: '420517', date: { en: '21 Sep 2026', ar: '21 سبتمبر 2026' }, step: 2, productIds: [1, 10], total: 17_837 },
  { id: '418902', date: { en: '14 Aug 2026', ar: '14 أغسطس 2026' }, step: 4, productIds: [4], total: 8_640 },
  { id: '411336', date: { en: '2 Jun 2026', ar: '2 يونيو 2026' }, step: 4, productIds: [7, 12], total: 3_210, rated: true },
];

/* ------------------------------------------------------------------ */
/* Service providers                                                   */
/* ------------------------------------------------------------------ */

export interface Provider {
  id: string;
  name: Bi;
  trade: Bi;
  /** the SERVICES entry they belong to, by its English name */
  service: string;
  city: Bi;
  rating: number;
  jobs: number;
  years: number;
  initials: string;
  cover: string;
  bio: Bi;
  portfolio: string[];
  reviews: { name: Bi; rating: number; text: Bi }[];
}

export const PROVIDERS: Provider[] = [
  {
    id: 'iwan-design',
    name: { en: 'Iwan Design Studio', ar: 'استوديو إيوان للتصميم' },
    trade: { en: 'Interior design', ar: 'التصميم الداخلي' },
    service: 'Interior Design',
    city: { en: 'Jeddah', ar: 'جدة' },
    rating: 4.9,
    jobs: 186,
    years: 11,
    initials: 'IW',
    cover: '/categories/featured/home.webp',
    bio: {
      en: 'Residential interiors from the first plan to the last cushion — majlis, living rooms and full villas, designed around how a family actually uses them.',
      ar: 'تصميم داخلي سكني من المخطط الأول حتى آخر وسادة — مجالس وغرف معيشة وفلل كاملة، مصممة على طريقة استخدام العائلة لها فعلاً.',
    },
    portfolio: ['/categories/featured/home.webp', '/categories/featured/decor.webp', IMG.roomHotspots, '/looks/campaign-majlis.webp', '/categories/featured/rugs.webp', IMG.catHome],
    reviews: [
      { name: { en: 'Mona Al-Dosari', ar: 'منى الدوسري' }, rating: 5, text: { en: 'They listened more than they talked. The majlis is exactly us.', ar: 'استمعوا أكثر مما تكلموا. المجلس يشبهنا تماماً.' } },
      { name: { en: 'Khalid Al-Sudairi', ar: 'خالد السديري' }, rating: 5, text: { en: 'On time, on budget, and the site was left spotless.', ar: 'في الموعد وضمن الميزانية، وتركوا الموقع نظيفاً تماماً.' } },
    ],
  },
  {
    id: 'bayt-joinery',
    name: { en: 'Bayt Joinery', ar: 'نجارة البيت' },
    trade: { en: 'Custom furniture', ar: 'تنفيذ الأثاث' },
    service: 'Custom Furniture',
    city: { en: 'Jeddah', ar: 'جدة' },
    rating: 4.8,
    jobs: 312,
    years: 17,
    initials: 'BJ',
    cover: '/looks/promo/custom-furniture.webp',
    bio: {
      en: 'A workshop of eleven craftsmen building solid-wood furniture to measure — tables, wardrobes, doors and built-in storage.',
      ar: 'ورشة من أحد عشر حرفياً تصنع أثاث الخشب الصلب بالمقاس — طاولات وخزائن وأبواب وتخزين مدمج.',
    },
    portfolio: ['/looks/promo/custom-furniture.webp', IMG.workshop, '/categories/featured/office.webp', '/categories/featured/home.webp'],
    reviews: [
      { name: { en: 'Reem Khalid', ar: 'ريم خالد' }, rating: 5, text: { en: 'The dining table is the best thing in the house.', ar: 'طاولة الطعام أجمل ما في البيت.' } },
    ],
  },
  {
    id: 'lumen-lighting',
    name: { en: 'Lumen Lighting Works', ar: 'لومن للإنارة' },
    trade: { en: 'Lighting & electrical', ar: 'الإنارة والكهرباء' },
    service: 'Finishing & Decorative',
    city: { en: 'Riyadh', ar: 'الرياض' },
    rating: 4.7,
    jobs: 144,
    years: 8,
    initials: 'LW',
    cover: '/looks/promo/lighting.webp',
    bio: {
      en: 'Lighting plans, fixture supply and installation — from a single pendant to a whole house on one control.',
      ar: 'مخططات إنارة وتوريد وتركيب — من إنارة معلقة واحدة إلى منزل كامل بتحكم واحد.',
    },
    portfolio: ['/looks/promo/lighting.webp', '/categories/featured/lighting.webp', IMG.catLighting],
    reviews: [
      { name: { en: 'Sarah Al-Otaibi', ar: 'سارة العتيبي' }, rating: 4, text: { en: 'Beautiful result; the survey visit took a week to book.', ar: 'النتيجة جميلة، وموعد المعاينة احتاج أسبوعاً.' } },
    ],
  },
  {
    id: 'sahl-painting',
    name: { en: 'Sahl Paint & Finish', ar: 'سهل للدهانات والتشطيبات' },
    trade: { en: 'Painting & wall finishes', ar: 'الدهانات والجداريات' },
    service: 'Painting & Wall Finishes',
    city: { en: 'Dammam', ar: 'الدمام' },
    rating: 4.8,
    jobs: 402,
    years: 13,
    initials: 'SP',
    cover: '/categories/featured/bath.webp',
    bio: {
      en: 'Lime plaster, microcement and classic paint — walls that look finished in daylight and at night.',
      ar: 'جير ومايكروسمنت ودهانات كلاسيكية — جدران تبدو مكتملة في ضوء النهار والليل.',
    },
    portfolio: ['/categories/featured/bath.webp', '/looks/promo/bedroom-packages.webp', IMG.bedroom],
    reviews: [
      { name: { en: 'Mohammed Al-Shahrani', ar: 'محمد الشهراني' }, rating: 5, text: { en: 'Clean lines, no mess, finished a day early.', ar: 'خطوط نظيفة، بلا فوضى، وانتهوا قبل الموعد بيوم.' } },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* B2B                                                                 */
/* ------------------------------------------------------------------ */

export interface Company {
  id: string;
  name: Bi;
  sector: Bi;
  initials: string;
  cover: string;
  about: Bi;
  stats: { years: number; projects: number; team: number };
  capabilities: Bi[];
  projects: { img: string; title: Bi; place: Bi }[];
}

export const COMPANIES: Company[] = [
  {
    id: 'diyar-hospitality',
    name: { en: 'Diyar Hospitality Projects', ar: 'ديار لمشاريع الضيافة' },
    sector: { en: 'Hotels & restaurants', ar: 'الفنادق والمطاعم' },
    initials: 'DH',
    cover: IMG.restaurant,
    about: {
      en: 'Turnkey fit-out for hotels, restaurants and lounges — design, manufacture, supply and installation under one contract.',
      ar: 'تجهيز متكامل للفنادق والمطاعم والصالات — تصميم وتصنيع وتوريد وتركيب بعقد واحد.',
    },
    stats: { years: 15, projects: 240, team: 85 },
    capabilities: [
      { en: 'FF&E supply', ar: 'توريد الأثاث والتجهيزات' },
      { en: 'Custom joinery', ar: 'نجارة حسب الطلب' },
      { en: 'Project management', ar: 'إدارة المشاريع' },
      { en: 'Installation crews', ar: 'فرق تركيب' },
    ],
    projects: [
      { img: IMG.restaurant, title: { en: 'Al Balad Heritage Restaurant', ar: 'مطعم البلد التراثي' }, place: { en: 'Jeddah', ar: 'جدة' } },
      { img: IMG.loungeDark, title: { en: 'Executive Lounge', ar: 'صالة كبار الزوار' }, place: { en: 'Riyadh', ar: 'الرياض' } },
      { img: '/looks/campaign-majlis.webp', title: { en: 'Royal Majlis Suite', ar: 'جناح المجلس الملكي' }, place: { en: 'Makkah', ar: 'مكة' } },
    ],
  },
  {
    id: 'maktab-workspace',
    name: { en: 'Maktab Workspace Solutions', ar: 'مكتب لحلول بيئات العمل' },
    sector: { en: 'Offices & workspaces', ar: 'المكاتب وبيئات العمل' },
    initials: 'MW',
    cover: IMG.catOffice,
    about: {
      en: 'Office planning and furniture for teams of ten to a thousand, from ergonomic seating to meeting rooms.',
      ar: 'تخطيط وتأثيث المكاتب لفرق من عشرة إلى ألف موظف، من المقاعد المريحة إلى قاعات الاجتماعات.',
    },
    stats: { years: 9, projects: 130, team: 42 },
    capabilities: [
      { en: 'Space planning', ar: 'تخطيط المساحات' },
      { en: 'Ergonomic furniture', ar: 'أثاث مريح' },
      { en: 'Acoustic treatment', ar: 'معالجة صوتية' },
    ],
    projects: [
      { img: IMG.catOffice, title: { en: 'Fintech Headquarters', ar: 'مقر شركة تقنية مالية' }, place: { en: 'Riyadh', ar: 'الرياض' } },
      { img: '/categories/featured/office.webp', title: { en: 'Law Firm Offices', ar: 'مكاتب شركة محاماة' }, place: { en: 'Jeddah', ar: 'جدة' } },
    ],
  },
  {
    id: 'sakan-developments',
    name: { en: 'Sakan Residential Fit-Out', ar: 'سكن لتجهيز المشاريع السكنية' },
    sector: { en: 'Residential developments', ar: 'المشاريع السكنية' },
    initials: 'SK',
    cover: IMG.bedroom,
    about: {
      en: 'Furnished-unit packages for developers: one specification, hundreds of apartments, delivered to schedule.',
      ar: 'باقات وحدات مؤثثة للمطورين: مواصفة واحدة لمئات الشقق، تُسلَّم في موعدها.',
    },
    stats: { years: 7, projects: 38, team: 60 },
    capabilities: [
      { en: 'Model units', ar: 'وحدات نموذجية' },
      { en: 'Bulk procurement', ar: 'توريد بالجملة' },
      { en: 'Handover snagging', ar: 'فحص التسليم' },
    ],
    projects: [
      { img: IMG.bedroom, title: { en: 'Obhur Towers — 320 units', ar: 'أبراج أبحر — 320 وحدة' }, place: { en: 'Jeddah', ar: 'جدة' } },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Account: inbox, reviews, requests, loyalty                          */
/* ------------------------------------------------------------------ */

export type NoteKind = 'order' | 'offer' | 'service' | 'account';

export const NOTIFICATIONS: { id: string; kind: NoteKind; title: Bi; body: Bi; when: Bi; unread: boolean }[] = [
  { id: 'n1', kind: 'order', unread: true, when: { en: '2 hours ago', ar: 'قبل ساعتين' }, title: { en: 'Order #420517 is out for delivery', ar: 'الطلب #420517 في الطريق إليك' }, body: { en: 'Our crew will call 30 minutes before arriving.', ar: 'سيتصل فريقنا قبل الوصول بثلاثين دقيقة.' } },
  { id: 'n2', kind: 'service', unread: true, when: { en: 'Yesterday', ar: 'أمس' }, title: { en: 'A quote is ready for your request', ar: 'عرض السعر جاهز لطلبك' }, body: { en: 'Iwan Design Studio sent a quote for your majlis.', ar: 'أرسل استوديو إيوان عرض سعر لمجلسك.' } },
  { id: 'n3', kind: 'offer', unread: false, when: { en: '3 days ago', ar: 'قبل 3 أيام' }, title: { en: 'Summer offers end tonight', ar: 'عروض الصيف تنتهي الليلة' }, body: { en: 'Up to 40% off sofas, while stock lasts.', ar: 'خصم حتى 40% على الأرائك، حتى نفاد الكمية.' } },
  { id: 'n4', kind: 'account', unread: false, when: { en: 'Last week', ar: 'الأسبوع الماضي' }, title: { en: 'You earned 864 points', ar: 'ربحت 864 نقطة' }, body: { en: 'From order #418902. They are ready to use.', ar: 'من الطلب #418902. جاهزة للاستخدام.' } },
  { id: 'n5', kind: 'order', unread: false, when: { en: 'Aug 14', ar: '14 أغسطس' }, title: { en: 'Order #418902 was delivered', ar: 'تم توصيل الطلب #418902' }, body: { en: 'Tell us how it went — it takes a minute.', ar: 'أخبرنا بتجربتك — تستغرق دقيقة واحدة.' } },
];

export const MY_REVIEWS = {
  /** delivered pieces not yet reviewed */
  pending: [4, 10],
  published: [
    { productId: 7, rating: 5, date: { en: 'Jun 10, 2026', ar: '10 يونيو 2026' }, text: { en: 'Better in person than in the photos. Solid and quiet.', ar: 'أجمل على الحقيقة من الصور. متين وهادئ.' } },
    { productId: 12, rating: 4, date: { en: 'Jun 9, 2026', ar: '9 يونيو 2026' }, text: { en: 'Lovely colour; delivery took one day longer than promised.', ar: 'لون جميل؛ تأخر التوصيل يوماً عن الموعد.' } },
  ],
};

export const REQUEST_STEPS: Bi[] = [
  { en: 'Received', ar: 'تم الاستلام' },
  { en: 'Visit booked', ar: 'تم حجز الزيارة' },
  { en: 'Quote sent', ar: 'تم إرسال العرض' },
  { en: 'In progress', ar: 'قيد التنفيذ' },
];

export const SERVICE_REQUESTS: { id: string; service: Bi; providerId: string; date: Bi; step: number; details: Bi; quote?: number }[] = [
  { id: 'SR-2291', service: { en: 'Interior Design', ar: 'التصميم الداخلي' }, providerId: 'iwan-design', date: { en: '19 Sep 2026', ar: '19 سبتمبر 2026' }, step: 2, quote: 12_500, details: { en: 'Majlis, 6 × 5 m, seating for fourteen, new lighting.', ar: 'مجلس 6 × 5 م، جلسة لأربعة عشر شخصاً، وإنارة جديدة.' } },
  { id: 'SR-2217', service: { en: 'Custom Furniture', ar: 'تنفيذ الأثاث' }, providerId: 'bayt-joinery', date: { en: '2 Sep 2026', ar: '2 سبتمبر 2026' }, step: 3, quote: 6_900, details: { en: 'Walnut dining table for eight, 2.4 m.', ar: 'طاولة طعام من الجوز لثمانية أشخاص، 2.4 م.' } },
  { id: 'SR-2150', service: { en: 'Painting & Wall Finishes', ar: 'الدهانات والجداريات' }, providerId: 'sahl-painting', date: { en: '11 Aug 2026', ar: '11 أغسطس 2026' }, step: 4, quote: 3_400, details: { en: 'Lime plaster, bedroom and corridor.', ar: 'جير لغرفة النوم والممر.' } },
];

export const LOYALTY_TIERS: { name: Bi; from: number; perk: Bi }[] = [
  { name: { en: 'Silver', ar: 'فضي' }, from: 0, perk: { en: '1 point per 10 SAR', ar: 'نقطة لكل 10 ر.س' } },
  { name: { en: 'Gold', ar: 'ذهبي' }, from: 1000, perk: { en: 'Free delivery, 1.25× points', ar: 'توصيل مجاني ونقاط ×1.25' } },
  { name: { en: 'Platinum', ar: 'بلاتيني' }, from: 5000, perk: { en: 'Free installation, 1.5× points', ar: 'تركيب مجاني ونقاط ×1.5' } },
];

export const LOYALTY_POINTS = 1240;

export const LOYALTY_HISTORY: { kind: 'earned' | 'used'; points: number; label: Bi; date: Bi }[] = [
  { kind: 'earned', points: 864, label: { en: 'Order #418902', ar: 'الطلب #418902' }, date: { en: 'Aug 14', ar: '14 أغسطس' } },
  { kind: 'used', points: -300, label: { en: 'Free delivery on #411336', ar: 'توصيل مجاني للطلب #411336' }, date: { en: 'Jun 2', ar: '2 يونيو' } },
  { kind: 'earned', points: 321, label: { en: 'Order #411336', ar: 'الطلب #411336' }, date: { en: 'Jun 2', ar: '2 يونيو' } },
  { kind: 'earned', points: 200, label: { en: 'Design consultation', ar: 'استشارة تصميم' }, date: { en: 'May 18', ar: '18 مايو' } },
  { kind: 'earned', points: 155, label: { en: 'Welcome bonus', ar: 'مكافأة الترحيب' }, date: { en: 'May 1', ar: '1 مايو' } },
];

/* ------------------------------------------------------------------ */
/* Chat                                                                */
/* ------------------------------------------------------------------ */

export interface ChatThread {
  id: string;
  name: Bi;
  initials: string;
  role: Bi;
  messages: { from: 'me' | 'them'; text: Bi; at: string }[];
}

export const CHAT_THREADS: ChatThread[] = [
  {
    id: 'support',
    name: { en: 'Diyar Support', ar: 'دعم ديار' },
    initials: 'DH',
    role: { en: 'Customer care', ar: 'خدمة العملاء' },
    messages: [
      { from: 'them', at: '10:02', text: { en: 'Hello! How can we help today?', ar: 'أهلاً بك! كيف نقدر نساعدك اليوم؟' } },
      { from: 'me', at: '10:04', text: { en: 'Can I change the delivery time for #420517?', ar: 'هل يمكن تغيير موعد توصيل الطلب #420517؟' } },
      { from: 'them', at: '10:05', text: { en: 'Of course — tomorrow between 4 and 8 pm works. Shall I book it?', ar: 'بالتأكيد — غداً بين 4 و8 مساءً متاح. أحجزه لك؟' } },
    ],
  },
  {
    id: 'iwan-design',
    name: { en: 'Iwan Design Studio', ar: 'استوديو إيوان للتصميم' },
    initials: 'IW',
    role: { en: 'Service provider', ar: 'مقدم خدمة' },
    messages: [
      { from: 'them', at: 'Mon', text: { en: 'We have sent the quote for the majlis — happy to walk you through it.', ar: 'أرسلنا عرض السعر للمجلس — يسعدنا شرحه لك.' } },
    ],
  },
  {
    id: 'bk',
    name: { en: 'Bayt Al-Khashab', ar: 'بيت الخشب' },
    initials: 'BK',
    role: { en: 'Store', ar: 'متجر' },
    messages: [
      { from: 'me', at: 'Sep 12', text: { en: 'Is the walnut console available in 180 cm?', ar: 'هل الكونسول الجوز متوفر بطول 180 سم؟' } },
      { from: 'them', at: 'Sep 12', text: { en: 'Yes, made to order in three weeks.', ar: 'نعم، بالطلب خلال ثلاثة أسابيع.' } },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Projects gallery (menu overlay)                                     */
/* ------------------------------------------------------------------ */

export const PROJECTS: { img: string; title: Bi; place: Bi }[] = [
  { img: '/looks/campaign-majlis.webp', title: { en: 'Al Fursan Majlis', ar: 'مجلس الفرسان الفاخر' }, place: { en: 'Riyadh', ar: 'الرياض' } },
  { img: '/looks/campaign-living.webp', title: { en: 'Neoclassic Living Suite', ar: 'صالون نيوكلاسيك متكامل' }, place: { en: 'Jeddah', ar: 'جدة' } },
  { img: IMG.loungeDark, title: { en: 'Wadi Hanifa Guest Wing', ar: 'جناح ضيافة وادي حنيفة' }, place: { en: 'Riyadh', ar: 'الرياض' } },
  { img: IMG.restaurant, title: { en: 'Heritage Restaurant', ar: 'مطعم تراثي' }, place: { en: 'Jeddah', ar: 'جدة' } },
  { img: '/categories/featured/bath.webp', title: { en: 'Spa Bathroom', ar: 'حمام بطابع السبا' }, place: { en: 'Khobar', ar: 'الخبر' } },
  { img: '/categories/featured/office.webp', title: { en: 'Private Study', ar: 'مكتب خاص' }, place: { en: 'Madinah', ar: 'المدينة' } },
];

/* ------------------------------------------------------------------ */
/* Help topics (footer support links)                                  */
/* ------------------------------------------------------------------ */

export const HELP_TOPICS: { key: string; title: Bi; items: { q: Bi; a: Bi }[] }[] = [
  {
    key: 'faq',
    title: { en: 'Questions', ar: 'الأسئلة الشائعة' },
    items: [
      { q: { en: 'Who sells the products on Diyar?', ar: 'من يبيع المنتجات في ديار؟' }, a: { en: 'Diyar and vetted partner stores. Every product page names its seller.', ar: 'ديار ومتاجر شريكة معتمدة. كل صفحة منتج تذكر البائع.' } },
      { q: { en: 'Can I pay in instalments?', ar: 'هل يمكنني الدفع بالتقسيط؟' }, a: { en: 'Yes — split any order over 500 SAR into four payments at checkout.', ar: 'نعم — قسّم أي طلب فوق 500 ر.س على أربع دفعات عند الدفع.' } },
      { q: { en: 'Do you install what you deliver?', ar: 'هل تركبون ما توصلونه؟' }, a: { en: 'Our own crews assemble and install every furniture order at no extra cost.', ar: 'فرقنا تجمع وتركب كل طلبات الأثاث دون تكلفة إضافية.' } },
    ],
  },
  {
    key: 'shipping',
    title: { en: 'Shipping & Delivery', ar: 'الشحن والتوصيل' },
    items: [
      { q: { en: 'Where do you deliver?', ar: 'أين توصلون؟' }, a: { en: 'Across the Kingdom. Major cities within 2–5 days.', ar: 'لكل مناطق المملكة. المدن الرئيسية خلال 2–5 أيام.' } },
      { q: { en: 'How much is delivery?', ar: 'كم تكلفة التوصيل؟' }, a: { en: 'Free over 3,000 SAR; 150 SAR below that.', ar: 'مجاني لما يتجاوز 3,000 ر.س؛ و150 ر.س لما دونها.' } },
    ],
  },
  {
    key: 'returns',
    title: { en: 'Returns & Exchanges', ar: 'الاسترجاع والاستبدال' },
    items: [
      { q: { en: 'How long do I have?', ar: 'كم لدي من الوقت؟' }, a: { en: 'Fourteen days from delivery, for items in their original condition.', ar: 'أربعة عشر يوماً من التوصيل، للقطع بحالتها الأصلية.' } },
      { q: { en: 'Are made-to-order pieces returnable?', ar: 'هل يمكن إرجاع القطع المصنوعة حسب الطلب؟' }, a: { en: 'Not unless they arrive faulty — they are built to your measurements.', ar: 'لا، إلا في حال وصولها بعيب — فهي مصنوعة على مقاساتك.' } },
    ],
  },
  {
    key: 'warranty',
    title: { en: 'Warranty', ar: 'الضمان' },
    items: [
      { q: { en: 'What is covered?', ar: 'ماذا يشمل الضمان؟' }, a: { en: 'Two years on frames and mechanisms, one year on upholstery.', ar: 'سنتان على الهياكل والآليات، وسنة على التنجيد.' } },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

export const postSlug = (p: LookPost) => p.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const postBySlug = (slug: string) => BLOG_POSTS.find((p) => postSlug(p) === slug);

/** The article body — shared prose, set under each post's own title and lede. */
export const ARTICLE_BODY: { heading?: Bi; text: Bi }[] = [
  {
    text: {
      en: 'Most rooms are not wrong, they are unfinished. The furniture is right, the colours are right, and still something reads as temporary. Nine times out of ten it is one of three things: scale, light or layering.',
      ar: 'معظم الغرف ليست خاطئة، بل غير مكتملة. الأثاث مناسب والألوان مناسبة، ومع ذلك يبدو شيء ما مؤقتاً. وفي تسع حالات من عشر يكون السبب واحداً من ثلاثة: المقياس أو الإضاءة أو الطبقات.',
    },
  },
  {
    heading: { en: 'Start with the largest piece', ar: 'ابدأ بأكبر قطعة' },
    text: {
      en: 'Choose the sofa, the bed or the table first and let everything else answer it. A room built around one confident piece holds together; a room of equally sized pieces never settles.',
      ar: 'اختر الأريكة أو السرير أو الطاولة أولاً، ودع كل ما عداها يستجيب لها. الغرفة المبنية حول قطعة واثقة واحدة تتماسك؛ أما غرفة القطع المتساوية فلا تستقر أبداً.',
    },
  },
  {
    heading: { en: 'Light in three levels', ar: 'الإضاءة على ثلاث طبقات' },
    text: {
      en: 'A ceiling light alone flattens a room. Add light at eye level — lamps, sconces — and a little low down, and the same space gains depth after dark.',
      ar: 'الإنارة السقفية وحدها تسطّح الغرفة. أضف إنارة بمستوى النظر — أباجورات وإنارات جدارية — وقليلاً في الأسفل، فتكتسب المساحة نفسها عمقاً بعد الغروب.',
    },
  },
  {
    heading: { en: 'Finish with texture', ar: 'اختم بالملمس' },
    text: {
      en: 'Linen, wool, wood and stone in the same palette do more than any accent colour. Texture is what makes a quiet room look intended rather than empty.',
      ar: 'الكتان والصوف والخشب والحجر في لوحة ألوان واحدة تفعل أكثر من أي لون مميز. الملمس هو ما يجعل الغرفة الهادئة تبدو مقصودة لا فارغة.',
    },
  },
];

/* ------------------------------------------------------------------ */
/* Store services — what each store does beyond selling the piece      */
/* ------------------------------------------------------------------ */

export interface StoreService {
  icon: LucideIcon;
  title: Bi;
  body: Bi;
  price: Bi;
  lead: Bi;
}

const DELIVERY: StoreService = {
  icon: Truck,
  title: { en: 'Delivery & installation', ar: 'التوصيل والتركيب' },
  body: { en: 'Diyar crews deliver, assemble and take the packaging away.', ar: 'فرق ديار توصل وتجمّع وتأخذ مواد التغليف معها.' },
  price: { en: 'Free over 3,000 SAR', ar: 'مجاني فوق 3,000 ر.س' },
  lead: { en: '2–5 days', ar: '2–5 أيام' },
};
const CONSULT: StoreService = {
  icon: PenTool,
  title: { en: 'Design consultation', ar: 'استشارة تصميم' },
  body: { en: 'An hour with a designer to plan the room around the pieces.', ar: 'ساعة مع مصمم لتخطيط الغرفة حول القطع.' },
  price: { en: 'Free with orders over 5,000 SAR', ar: 'مجانية مع الطلبات فوق 5,000 ر.س' },
  lead: { en: 'Online or at home', ar: 'عن بعد أو في المنزل' },
};

export const STORE_SERVICES: Record<StoreKey, StoreService[]> = {
  diyar: [
    DELIVERY,
    CONSULT,
    { icon: Layers, title: { en: 'Full-room packages', ar: 'باقات الغرف الكاملة' }, body: { en: 'A whole room specified, supplied and installed in one visit.', ar: 'غرفة كاملة بمواصفاتها وتوريدها وتركيبها في زيارة واحدة.' }, price: { en: 'From 6,900 SAR', ar: 'من 6,900 ر.س' }, lead: { en: '3 weeks', ar: '3 أسابيع' } },
  ],
  bk: [
    { icon: Ruler, title: { en: 'Made to measure', ar: 'تفصيل حسب المقاس' }, body: { en: 'Any piece in the range built to your dimensions and wood.', ar: 'أي قطعة من التشكيلة تُصنع بمقاساتك ونوع الخشب الذي تختاره.' }, price: { en: 'From 2,500 SAR', ar: 'من 2,500 ر.س' }, lead: { en: '3–4 weeks', ar: '3–4 أسابيع' } },
    { icon: Hammer, title: { en: 'Refinishing & repair', ar: 'التجديد والإصلاح' }, body: { en: 'Sanding, re-oiling and joint repair for solid-wood pieces.', ar: 'صنفرة وإعادة تزييت وإصلاح وصلات قطع الخشب الصلب.' }, price: { en: 'From 350 SAR', ar: 'من 350 ر.س' }, lead: { en: '1 week', ar: 'أسبوع' } },
    DELIVERY,
  ],
  ld: [
    { icon: Lightbulb, title: { en: 'Lighting plan', ar: 'مخطط الإنارة' }, body: { en: 'A layered plan for one room or the whole house, with fixture list.', ar: 'مخطط إنارة متدرّج لغرفة أو للمنزل كاملاً، مع قائمة القطع.' }, price: { en: 'From 900 SAR', ar: 'من 900 ر.س' }, lead: { en: '5 days', ar: '5 أيام' } },
    { icon: Zap, title: { en: 'Installation by electricians', ar: 'التركيب بفنيين كهرباء' }, body: { en: 'Pendants, sconces and dimmers fitted and tested.', ar: 'تركيب الإنارات المعلقة والجدارية ومفاتيح التعتيم واختبارها.' }, price: { en: '150 SAR per point', ar: '150 ر.س لكل نقطة' }, lead: { en: 'Next week', ar: 'الأسبوع القادم' } },
    DELIVERY,
  ],
  dw: [
    { icon: Ruler, title: { en: 'Majlis to size', ar: 'مجلس حسب المقاس' }, body: { en: 'Seating cut to your walls, in the fabric and firmness you choose.', ar: 'جلسات مفصّلة على جدرانك، بالقماش والصلابة التي تختارها.' }, price: { en: 'From 1,800 SAR per metre', ar: 'من 1,800 ر.س للمتر' }, lead: { en: '3 weeks', ar: '3 أسابيع' } },
    { icon: Scissors, title: { en: 'Re-upholstery', ar: 'إعادة التنجيد' }, body: { en: 'New fabric and foam on the frames you already have.', ar: 'قماش وإسفنج جديد على الهياكل التي لديك.' }, price: { en: 'From 450 SAR per seat', ar: 'من 450 ر.س للمقعد' }, lead: { en: '10 days', ar: '10 أيام' } },
    DELIVERY,
  ],
  ns: [
    { icon: Sparkles, title: { en: 'Rug cleaning', ar: 'تنظيف السجاد' }, body: { en: 'Hand-washed and dried flat, collected and returned.', ar: 'غسيل يدوي وتجفيف مسطّح، مع الاستلام والتسليم.' }, price: { en: '35 SAR per m²', ar: '35 ر.س للمتر المربع' }, lead: { en: '5 days', ar: '5 أيام' } },
    { icon: Scissors, title: { en: 'Cut & bound to size', ar: 'قص وتطريف حسب المقاس' }, body: { en: 'Wall-to-wall or any shape, edges bound by hand.', ar: 'من الجدار للجدار أو بأي شكل، مع تطريف الحواف يدوياً.' }, price: { en: 'From 120 SAR per m²', ar: 'من 120 ر.س للمتر المربع' }, lead: { en: '1 week', ar: 'أسبوع' } },
    DELIVERY,
  ],
  zk: [
    { icon: Palette, title: { en: 'Styling session', ar: 'جلسة تنسيق' }, body: { en: 'A stylist dresses shelves, tables and walls with what you own and what you need.', ar: 'منسّق يرتّب الرفوف والطاولات والجدران بما لديك وما تحتاجه.' }, price: { en: 'From 600 SAR', ar: 'من 600 ر.س' }, lead: { en: 'This week', ar: 'هذا الأسبوع' } },
    { icon: Gift, title: { en: 'Gift wrapping', ar: 'تغليف الهدايا' }, body: { en: 'Wrapped, with a card, delivered on the day you pick.', ar: 'مغلّفة مع بطاقة، وتصل في اليوم الذي تختاره.' }, price: { en: '25 SAR', ar: '25 ر.س' }, lead: { en: 'Same day in Jeddah', ar: 'في نفس اليوم في جدة' } },
    DELIVERY,
  ],
  mk: [
    { icon: Layers, title: { en: 'Office space planning', ar: 'تخطيط المساحات المكتبية' }, body: { en: 'Desk layout, meeting rooms and storage drawn to your floor plan.', ar: 'توزيع المكاتب وقاعات الاجتماعات والتخزين على مخطط مساحتك.' }, price: { en: 'Free for 10+ seats', ar: 'مجاني لعشرة مقاعد فأكثر' }, lead: { en: '1 week', ar: 'أسبوع' } },
    { icon: Hammer, title: { en: 'Office move & reinstall', ar: 'نقل وإعادة تركيب المكاتب' }, body: { en: 'Your existing furniture taken down, moved and set up again.', ar: 'فك أثاثك الحالي ونقله وإعادة تركيبه.' }, price: { en: 'From 1,200 SAR', ar: 'من 1,200 ر.س' }, lead: { en: 'Over a weekend', ar: 'خلال عطلة نهاية الأسبوع' } },
    DELIVERY,
  ],
};

/* ------------------------------------------------------------------ */
/* Service galleries — recent work, per service                        */
/* ------------------------------------------------------------------ */

export interface WorkShot {
  img: string;
  title: Bi;
}

const HOMES: Bi[] = [
  { en: 'Family villa, Al Rawdah — Jeddah', ar: 'فيلا عائلية، الروضة — جدة' },
  { en: 'Majlis, Obhur — Jeddah', ar: 'مجلس، أبحر — جدة' },
  { en: 'Apartment, Al Malqa — Riyadh', ar: 'شقة، الملقا — الرياض' },
  { en: 'Guest wing, Al Nakheel — Riyadh', ar: 'جناح ضيافة، النخيل — الرياض' },
  { en: 'Townhouse, Al Olaya — Khobar', ar: 'تاون هاوس، العليا — الخبر' },
  { en: 'Penthouse, Al Shati — Jeddah', ar: 'بنتهاوس، الشاطئ — جدة' },
];
const VENUES: Bi[] = [
  { en: 'Restaurant, Al Balad — Jeddah', ar: 'مطعم، البلد — جدة' },
  { en: 'Office floor, King Fahd Rd — Riyadh', ar: 'طابق مكاتب، طريق الملك فهد — الرياض' },
  { en: 'Executive lounge, Al Olaya — Riyadh', ar: 'صالة كبار الزوار، العليا — الرياض' },
  { en: 'Showroom, Tahlia St — Jeddah', ar: 'صالة عرض، شارع التحلية — جدة' },
  { en: 'Clinic, Al Corniche — Khobar', ar: 'عيادة، الكورنيش — الخبر' },
];

const shots = (imgs: string[], titles: Bi[], shift = 0): WorkShot[] =>
  imgs.map((img, i) => ({ img, title: titles[(i + shift) % titles.length] }));

const F = '/categories/featured';
export const SERVICE_GALLERY: Record<string, WorkShot[]> = {
  'Interior Design': shots(['/looks/campaign-living.webp', '/looks/campaign-majlis.webp', `${F}/home.webp`, IMG.roomHotspots, IMG.catHome, IMG.bedroom], HOMES),
  'Door Solutions': shots([IMG.loungeDark, `${F}/office.webp`, '/looks/campaign-majlis.webp', IMG.catOffice, `${F}/decor.webp`], HOMES, 2),
  'Custom Furniture': shots([IMG.workshop, '/looks/promo/custom-furniture.webp', `${F}/home.webp`, IMG.catHome, '/looks/promo/bedroom-packages.webp'], HOMES, 1),
  'Painting & Wall Finishes': shots([IMG.roomHotspots, `${F}/bath.webp`, '/looks/promo/bedroom-packages.webp', IMG.bedroom, `${F}/decor.webp`], HOMES, 3),
  'Flooring Solutions': shots(['/after.png', `${F}/rugs.webp`, IMG.catOffice, '/looks/campaign-living.webp', IMG.bedroom], HOMES, 4),
  'Finishing & Decorative': shots([IMG.bedroom, `${F}/decor.webp`, IMG.loungeDark, '/looks/campaign-majlis.webp', `${F}/lighting.webp`], HOMES, 5),
  'Glass & Skylight Facades': shots([IMG.hero, '/after.png', `${F}/office.webp`, IMG.restaurant, IMG.catLighting], VENUES, 3),
  'Safety Equipment & Systems': shots([IMG.restaurant, IMG.catOffice, IMG.loungeDark, `${F}/office.webp`, `${F}/bath.webp`], VENUES),
};

/* ------------------------------------------------------------------ */
/* Provider services — what each partner can be booked for             */
/* ------------------------------------------------------------------ */

export const PROVIDER_SERVICES: Record<string, StoreService[]> = {
  'iwan-design': [
    { icon: PenTool, title: { en: 'Single-room design', ar: 'تصميم غرفة واحدة' }, body: { en: 'Layout, palette, furniture list and a 3D view of one room.', ar: 'توزيع ولوحة ألوان وقائمة أثاث ومنظور ثلاثي الأبعاد لغرفة واحدة.' }, price: { en: 'From 3,500 SAR', ar: 'من 3,500 ر.س' }, lead: { en: '2 weeks', ar: 'أسبوعان' } },
    { icon: Layers, title: { en: 'Whole-home design', ar: 'تصميم منزل كامل' }, body: { en: 'Every room planned together, with site supervision to handover.', ar: 'كل الغرف مخططة معاً، مع إشراف على التنفيذ حتى التسليم.' }, price: { en: 'From 12,000 SAR', ar: 'من 12,000 ر.س' }, lead: { en: '6–8 weeks', ar: '6–8 أسابيع' } },
    { icon: Sparkles, title: { en: 'Design consultation', ar: 'استشارة تصميم' }, body: { en: 'Two hours at your home: what to keep, what to change, where to start.', ar: 'ساعتان في منزلك: ما تحتفظ به، وما تغيّره، ومن أين تبدأ.' }, price: { en: '600 SAR', ar: '600 ر.س' }, lead: { en: 'This week', ar: 'هذا الأسبوع' } },
  ],
  'bayt-joinery': [
    { icon: Ruler, title: { en: 'Furniture to measure', ar: 'أثاث حسب المقاس' }, body: { en: 'Tables, beds and cabinets built in solid wood to your drawings.', ar: 'طاولات وأسرّة وخزائن من الخشب الصلب حسب رسوماتك.' }, price: { en: 'From 2,500 SAR', ar: 'من 2,500 ر.س' }, lead: { en: '3–4 weeks', ar: '3–4 أسابيع' } },
    { icon: Layers, title: { en: 'Built-in storage', ar: 'خزائن مدمجة' }, body: { en: 'Wardrobes, dressing rooms and wall units fitted wall to wall.', ar: 'خزائن ملابس وغرف تبديل ووحدات جدارية مركّبة من الجدار للجدار.' }, price: { en: 'From 1,400 SAR per metre', ar: 'من 1,400 ر.س للمتر' }, lead: { en: '4 weeks', ar: '4 أسابيع' } },
    { icon: Hammer, title: { en: 'Doors & panelling', ar: 'الأبواب والتكسيات الخشبية' }, body: { en: 'Solid doors, frames and wall panelling, supplied and hung.', ar: 'أبواب خشب صلب وحلوق وتكسيات جدارية، توريد وتركيب.' }, price: { en: 'From 1,900 SAR per door', ar: 'من 1,900 ر.س للباب' }, lead: { en: '3 weeks', ar: '3 أسابيع' } },
  ],
  'lumen-lighting': [
    { icon: Lightbulb, title: { en: 'Lighting plan', ar: 'مخطط الإنارة' }, body: { en: 'Ambient, task and accent light drawn for each room, with a fixture list.', ar: 'إنارة عامة ووظيفية ومركّزة لكل غرفة، مع قائمة القطع.' }, price: { en: 'From 900 SAR', ar: 'من 900 ر.س' }, lead: { en: '5 days', ar: '5 أيام' } },
    { icon: Zap, title: { en: 'Fixture installation', ar: 'تركيب الإنارات' }, body: { en: 'Pendants, sconces, strips and dimmers fitted and tested.', ar: 'تركيب واختبار الإنارات المعلقة والجدارية والشرائط ومفاتيح التعتيم.' }, price: { en: '150 SAR per point', ar: '150 ر.س لكل نقطة' }, lead: { en: 'Next week', ar: 'الأسبوع القادم' } },
    { icon: Sparkles, title: { en: 'Smart lighting', ar: 'الإنارة الذكية' }, body: { en: 'Scenes and schedules for the whole house on one app.', ar: 'مشاهد وجداول للمنزل كاملاً عبر تطبيق واحد.' }, price: { en: 'From 4,800 SAR', ar: 'من 4,800 ر.س' }, lead: { en: '2 weeks', ar: 'أسبوعان' } },
  ],
  'sahl-painting': [
    { icon: Palette, title: { en: 'Interior painting', ar: 'دهان داخلي' }, body: { en: 'Walls and ceilings prepared, primed and finished in two coats.', ar: 'تجهيز الجدران والأسقف وتأسيسها وطلاؤها بطبقتين.' }, price: { en: 'From 22 SAR per m²', ar: 'من 22 ر.س للمتر المربع' }, lead: { en: '3–5 days', ar: '3–5 أيام' } },
    { icon: Layers, title: { en: 'Lime plaster & microcement', ar: 'الجير والمايكروسمنت' }, body: { en: 'Hand-applied mineral finishes for walls, floors and bathrooms.', ar: 'تشطيبات معدنية يدوية للجدران والأرضيات ودورات المياه.' }, price: { en: 'From 180 SAR per m²', ar: 'من 180 ر.س للمتر المربع' }, lead: { en: '1–2 weeks', ar: '1–2 أسبوع' } },
    { icon: Scissors, title: { en: 'Wallpaper hanging', ar: 'تركيب ورق الجدران' }, body: { en: 'Measured, matched and hung, including feature murals.', ar: 'قياس ومطابقة وتركيب، بما فيها الجداريات المميزة.' }, price: { en: 'From 35 SAR per m²', ar: 'من 35 ر.س للمتر المربع' }, lead: { en: '2 days', ar: 'يومان' } },
  ],
};
