/**
 * The services catalogue — every service a partner offers, named by the partner
 * and filed under a category and subcategory, the way a product belongs to a
 * store and sits under a category and subcategory. Two partners may use the
 * same name; the pair (provider, name) is what the visitor books.
 */
import { IMG, SERVICE_SUBS, SERVICES, type Bi } from '../lookShared';
import { PROVIDERS, SERVICE_GALLERY, type Provider } from './data';

export interface ServiceItem {
  id: string;
  providerId: string;
  /** SERVICES[i].en */
  category: string;
  /** SERVICE_SUBS[category] key */
  sub: string;
  name: Bi;
  img: string;
  gallery: string[];
  /** no price: quoted after a visit */
  priceFrom?: number;
  unit?: Bi;
  lead: Bi;
  rating: number;
  reviews: number;
  description: Bi;
  included: Bi[];
  isNew?: boolean;
  popular?: boolean;
}

const U = {
  visit: { en: 'per visit', ar: 'للزيارة' },
  room: { en: 'per room', ar: 'للغرفة' },
  m2: { en: 'per m²', ar: 'للمتر المربع' },
  door: { en: 'per door', ar: 'للباب' },
  piece: { en: 'per piece', ar: 'للقطعة' },
  point: { en: 'per point', ar: 'للنقطة' },
  project: { en: 'per project', ar: 'للمشروع' },
  lm: { en: 'per linear metre', ar: 'للمتر الطولي' },
};
const L = {
  d3: { en: 'Visit within 3 days', ar: 'زيارة خلال 3 أيام' },
  w1: { en: 'Starts within a week', ar: 'يبدأ خلال أسبوع' },
  w2: { en: '2–3 weeks', ar: '2 – 3 أسابيع' },
  w4: { en: '4–6 weeks', ar: '4 – 6 أسابيع' },
  d1: { en: 'Next business day', ar: 'يوم العمل التالي' },
};

const F = '/categories/featured';

let seq = 0;
function svc(
  providerId: string,
  category: string,
  sub: string,
  name: Bi,
  priceFrom: number | undefined,
  unit: Bi | undefined,
  lead: Bi,
  description: Bi,
  included: Bi[],
  flags: { isNew?: boolean; popular?: boolean; img?: string } = {},
): ServiceItem {
  const shots = SERVICE_GALLERY[category] ?? [];
  const k = seq++;
  const img = flags.img ?? shots[k % Math.max(1, shots.length)]?.img ?? IMG.workshop;
  const provider = PROVIDERS.find((p) => p.id === providerId);
  return {
    id: `${providerId}-${sub}`,
    providerId,
    category,
    sub,
    name,
    img,
    gallery: [img, ...(provider?.portfolio ?? []).filter((x) => x !== img).slice(0, 3)],
    priceFrom,
    unit,
    lead,
    rating: Math.round((4.5 + ((k * 7) % 5) / 10) * 10) / 10,
    reviews: 12 + ((k * 29) % 160),
    description,
    included,
    isNew: flags.isNew,
    popular: flags.popular,
  };
}

const ID = 'Interior Design';
const DS = 'Door Solutions';
const CF = 'Custom Furniture';
const PW = 'Painting & Wall Finishes';
const FS = 'Flooring Solutions';
const FD = 'Finishing & Decorative';
const GS = 'Glass & Skylight Facades';
const SE = 'Safety Equipment & Systems';

export const SERVICE_CATALOG: ServiceItem[] = [
  /* ---- interior design: three studios, overlapping names on purpose ---- */
  svc('iwan-design', ID, 'residential-design', { en: 'Interior design', ar: 'تصميم داخلي' }, 4500, U.room, L.d3,
    { en: 'A full room designed around how you live: layout, furniture, lighting and finishes, with a shopping list you can buy from Diyar in one order.', ar: 'غرفة كاملة تُصمم حول طريقة عيشك: المخطط والأثاث والإنارة والتشطيبات، مع قائمة مشتريات تشتريها من ديار في طلب واحد.' },
    [{ en: 'Site visit and measurements', ar: 'زيارة الموقع وأخذ القياسات' }, { en: 'Two layout options', ar: 'خياران للمخطط' }, { en: 'Furniture and finish schedule', ar: 'جدول الأثاث والتشطيبات' }, { en: 'Two rounds of revisions', ar: 'جولتا تعديل' }], { popular: true, img: '/looks/campaign-living.webp' }),
  svc('iwan-design', ID, '3d-visualization', { en: '3D visualization', ar: 'تصاميم ثلاثية الأبعاد' }, 1200, U.room, L.w1,
    { en: 'Photoreal 3D views of your room before anything is bought, from your plan or ours.', ar: 'مشاهد ثلاثية الأبعاد واقعية لغرفتك قبل شراء أي شيء، من مخططك أو مخططنا.' },
    [{ en: 'Three camera views per room', ar: 'ثلاث زوايا لكل غرفة' }, { en: 'Day and night lighting', ar: 'إضاءة نهارية وليلية' }, { en: 'One round of changes', ar: 'جولة تعديل واحدة' }]),
  svc('iwan-design', ID, 'design-consultation', { en: 'Design consultation', ar: 'استشارة تصميم' }, 299, U.visit, L.d3,
    { en: 'Two hours with a designer at your home: what to keep, what to change, and in what order.', ar: 'ساعتان مع مصمم في منزلك: ما تبقيه وما تغيّره وبأي ترتيب.' },
    [{ en: 'Walk-through of every room', ar: 'جولة في كل الغرف' }, { en: 'Written recommendations', ar: 'توصيات مكتوبة' }, { en: 'Fee deducted from a full design', ar: 'تُخصم الرسوم من التصميم الكامل' }]),
  svc('mada-studio', ID, 'residential-design', { en: 'Interior design', ar: 'تصميم داخلي' }, 3800, U.room, L.w1,
    { en: 'Apartments and townhouses planned room by room, with the furniture drawn to scale so it fits before it arrives.', ar: 'شقق وتاون هاوس تُخطط غرفة غرفة، والأثاث مرسوم بمقياسه ليناسب المكان قبل وصوله.' },
    [{ en: 'Measured plan', ar: 'مخطط بالقياسات' }, { en: 'Mood board and palette', ar: 'لوحة إلهام وألوان' }, { en: 'Shopping list from Diyar stores', ar: 'قائمة مشتريات من متاجر ديار' }]),
  svc('mada-studio', ID, 'space-planning', { en: 'Space planning', ar: 'تخطيط المساحات' }, 900, U.room, L.d3,
    { en: 'The right layout for a difficult room: circulation, zones and furniture sizes, drawn to scale.', ar: 'المخطط الصحيح للغرفة الصعبة: الحركة والمناطق ومقاسات الأثاث، مرسومة بالمقياس.' },
    [{ en: 'Two layout options', ar: 'خياران للمخطط' }, { en: 'Furniture size guide', ar: 'دليل مقاسات الأثاث' }, { en: 'Electrical point suggestions', ar: 'مقترحات نقاط الكهرباء' }]),
  svc('mada-studio', ID, '3d-visualization', { en: '3D renders', ar: 'رندرات ثلاثية الأبعاد' }, 950, U.room, L.w1,
    { en: 'Renders of the finished room from the agreed plan, so decisions are made on screen rather than on site.', ar: 'رندرات للغرفة النهائية من المخطط المتفق عليه، لتُتخذ القرارات على الشاشة لا في الموقع.' },
    [{ en: 'Two views per room', ar: 'زاويتان لكل غرفة' }, { en: 'Material close-ups', ar: 'لقطات قريبة للخامات' }], { isNew: true }),
  svc('noor-interiors', ID, 'commercial-design', { en: 'Commercial interior design', ar: 'تصميم داخلي تجاري' }, 180, U.m2, L.w1,
    { en: 'Cafés, clinics and offices: a layout that works for staff and customers, with fit-out drawings a contractor can price.', ar: 'مقاهٍ وعيادات ومكاتب: مخطط يعمل للموظفين والعملاء، مع رسومات تنفيذ يستطيع المقاول تسعيرها.' },
    [{ en: 'Concept and layout', ar: 'الفكرة والمخطط' }, { en: 'Fit-out drawing set', ar: 'مجموعة رسومات التنفيذ' }, { en: 'Materials and lighting schedule', ar: 'جدول الخامات والإنارة' }], { popular: true }),
  svc('noor-interiors', ID, 'space-planning', { en: 'Office space planning', ar: 'تخطيط المكاتب' }, 120, U.m2, L.d3,
    { en: 'Seats, meeting rooms and storage sized to the team, with growth left in the plan.', ar: 'المقاعد وغرف الاجتماعات والتخزين بمقاس الفريق، مع مساحة للنمو في المخطط.' },
    [{ en: 'Headcount study', ar: 'دراسة عدد الموظفين' }, { en: 'Two layouts', ar: 'مخططان' }, { en: 'Furniture list', ar: 'قائمة الأثاث' }]),
  svc('noor-interiors', ID, 'design-consultation', { en: 'Design consultation', ar: 'استشارة تصميم' }, 450, U.visit, L.d3,
    { en: 'A site visit for a business owner: what the space needs before you sign with a contractor.', ar: 'زيارة موقع لصاحب العمل: ما يحتاجه المكان قبل التوقيع مع المقاول.' },
    [{ en: 'Ninety-minute visit', ar: 'زيارة تسعين دقيقة' }, { en: 'Written summary', ar: 'ملخص مكتوب' }]),

  /* ---- doors ---- */
  svc('nukhba-doors', DS, 'wooden-doors', { en: 'Solid wood interior doors', ar: 'أبواب داخلية خشب صلب' }, 1850, U.door, L.w2,
    { en: 'Interior doors in beech or oak from our workshop, with frame, architrave and hardware, hung by the same team.', ar: 'أبواب داخلية من الزان أو البلوط من ورشتنا، مع الإطار والكسوة والمقابض، يركّبها الفريق نفسه.' },
    [{ en: 'Measurement visit', ar: 'زيارة قياس' }, { en: 'Door, frame and hardware', ar: 'الباب والإطار والمقابض' }, { en: 'Installation and finishing', ar: 'التركيب والتشطيب' }], { popular: true, img: IMG.loungeDark }),
  svc('nukhba-doors', DS, 'wpc-doors', { en: 'WPC doors', ar: 'أبواب WPC' }, 950, U.door, L.w1,
    { en: 'Water-resistant WPC doors for bathrooms and kitchens, in wood-look or plain finishes.', ar: 'أبواب WPC مقاومة للماء للحمامات والمطابخ، بتشطيب خشبي أو سادة.' },
    [{ en: 'Door and frame', ar: 'الباب والإطار' }, { en: 'Installation', ar: 'التركيب' }, { en: 'Five-year warranty', ar: 'ضمان خمس سنوات' }]),
  svc('nukhba-doors', DS, 'sliding-doors', { en: 'Sliding and pocket doors', ar: 'أبواب منزلقة ومخفية' }, 2900, U.door, L.w2,
    { en: 'Sliding and pocket systems for tight rooms and wide openings, with soft-close tracks.', ar: 'أنظمة منزلقة ومخفية للغرف الضيقة والفتحات الواسعة، مع مسارات إغلاق ناعم.' },
    [{ en: 'Track and hardware', ar: 'المسار والملحقات' }, { en: 'Wall preparation', ar: 'تجهيز الجدار' }, { en: 'Installation', ar: 'التركيب' }]),
  svc('nukhba-doors', DS, 'custom-doors', { en: 'Made-to-order doors', ar: 'أبواب حسب الطلب' }, undefined, undefined, L.w4,
    { en: 'Entrance and feature doors to your drawing or ours: size, timber, panelling and finish.', ar: 'أبواب مداخل ومميزة حسب رسمك أو رسمنا: المقاس والخشب والتفصيل والتشطيب.' },
    [{ en: 'Design drawing', ar: 'رسم تصميمي' }, { en: 'Sample of the finish', ar: 'عينة التشطيب' }, { en: 'Delivery and installation', ar: 'التوصيل والتركيب' }]),

  /* ---- custom furniture ---- */
  svc('bayt-joinery', CF, 'residential-furniture', { en: 'Furniture to measure', ar: 'أثاث حسب المقاس' }, undefined, undefined, L.w4,
    { en: 'Tables, beds, consoles and TV units in solid wood, made to your sizes and finished in our workshop.', ar: 'طاولات وأسرّة وكونسولات ووحدات تلفاز من الخشب الصلب، بمقاساتك وتشطيب ورشتنا.' },
    [{ en: 'Shop drawing to approve', ar: 'رسم تنفيذي للموافقة' }, { en: 'Wood and finish samples', ar: 'عينات الخشب والتشطيب' }, { en: 'Delivery and assembly', ar: 'التوصيل والتركيب' }], { popular: true, img: '/looks/promo/custom-furniture.webp' }),
  svc('bayt-joinery', CF, 'built-in-furniture', { en: 'Built-in storage', ar: 'خزائن مدمجة' }, 1400, U.lm, L.w4,
    { en: 'Wardrobes, dressing rooms and under-stair storage built into the wall, with lighting and fittings.', ar: 'خزائن وغرف ملابس وتخزين تحت الدرج مدمجة في الجدار، مع الإنارة والملحقات.' },
    [{ en: 'Measured design', ar: 'تصميم بالقياس' }, { en: 'Internal fittings', ar: 'التقسيمات الداخلية' }, { en: 'Installation', ar: 'التركيب' }]),
  svc('bayt-joinery', CF, 'wardrobes-closets', { en: 'Walk-in closets', ar: 'غرف الملابس' }, 2100, U.lm, L.w4,
    { en: 'A dressing room planned around what you own: hanging, drawers, shoe walls and an island if the room allows.', ar: 'غرفة ملابس تُخطط حول ما تملكه: تعليق وأدراج وجدار للأحذية وجزيرة إن سمحت المساحة.' },
    [{ en: 'Inventory of what is stored', ar: 'جرد لما سيُخزن' }, { en: 'Lighting plan', ar: 'مخطط الإنارة' }, { en: 'Soft-close hardware', ar: 'ملحقات إغلاق ناعم' }]),
  svc('bayt-joinery', CF, 'custom-joinery', { en: 'Doors and panelling', ar: 'الأبواب والتكسيات الخشبية' }, 650, U.m2, L.w2,
    { en: 'Wall panelling, wainscoting and solid interior doors in the same timber, so the room reads as one.', ar: 'تكسيات جدران وألواح وأبواب داخلية صلبة من الخشب نفسه، لتبدو الغرفة قطعة واحدة.' },
    [{ en: 'Timber matched to your furniture', ar: 'خشب مطابق لأثاثك' }, { en: 'On-site fitting', ar: 'تركيب في الموقع' }]),
  svc('bayt-joinery', CF, 'hospitality-furniture', { en: 'Hotel and café furniture', ar: 'أثاث الفنادق والمقاهي' }, undefined, undefined, L.w4,
    { en: 'Tables, banquettes and reception desks in commercial grades, produced in runs with a signed sample first.', ar: 'طاولات وجلسات ومكاتب استقبال بدرجات تجارية، تُنتج بكميات بعد توقيع العينة.' },
    [{ en: 'Signed-off prototype', ar: 'نموذج أولي معتمد' }, { en: 'Production schedule', ar: 'جدول إنتاج' }, { en: 'Site installation', ar: 'تركيب في الموقع' }]),

  /* ---- painting and walls ---- */
  svc('sahl-painting', PW, 'interior-painting', { en: 'Interior painting', ar: 'دهان داخلي' }, 28, U.m2, L.d3,
    { en: 'Walls and ceilings prepared, primed and painted in washable Jotun paints; furniture covered and the room left clean.', ar: 'تجهيز الجدران والأسقف وتأسيسها ودهانها بدهانات جوتن قابلة للغسل؛ مع تغطية الأثاث وترك الغرفة نظيفة.' },
    [{ en: 'Filling and sanding', ar: 'المعجون والصنفرة' }, { en: 'Primer and two coats', ar: 'أساس وطبقتان' }, { en: 'Colour consultation', ar: 'استشارة ألوان' }], { popular: true, img: IMG.roomHotspots }),
  svc('sahl-painting', PW, 'exterior-painting', { en: 'Exterior painting', ar: 'دهان خارجي' }, 38, U.m2, L.w1,
    { en: 'Facades washed, cracks repaired and painted with weather-resistant coatings, scaffolding included.', ar: 'غسل الواجهات وإصلاح الشقوق ودهانها بطلاءات مقاومة للطقس، مع السقالات.' },
    [{ en: 'Pressure wash', ar: 'غسيل بالضغط' }, { en: 'Crack repair', ar: 'إصلاح الشقوق' }, { en: 'Two coats', ar: 'طبقتان' }]),
  svc('sahl-painting', PW, 'wallpaper', { en: 'Wallpaper hanging', ar: 'تركيب ورق الجدران' }, 45, U.m2, L.d3,
    { en: 'Measured, matched and hung without visible seams; your roll or one from our books.', ar: 'قياس ومطابقة وتركيب دون وصلات ظاهرة؛ من لفّتك أو من كتالوجاتنا.' },
    [{ en: 'Wall preparation', ar: 'تجهيز الجدار' }, { en: 'Pattern matching', ar: 'مطابقة النقش' }]),
  svc('sahl-painting', PW, 'decorative-finishes', { en: 'Lime plaster and microcement', ar: 'الجير والمايكروسمنت' }, 160, U.m2, L.w1,
    { en: 'Tadelakt, lime plaster and microcement on walls, floors and bathrooms, sealed for daily use.', ar: 'تادلاكت وجير ومايكروسمنت للجدران والأرضيات والحمامات، مع طبقة حماية للاستخدام اليومي.' },
    [{ en: 'Sample board first', ar: 'لوحة عينة أولاً' }, { en: 'Sealing', ar: 'طبقة الحماية' }]),
  svc('sahl-painting', PW, 'wall-panels', { en: 'Wall panels and mouldings', ar: 'ألواح الجدران والكرانيش' }, 220, U.m2, L.w1,
    { en: 'MDF panelling, slat walls and mouldings fitted and painted in the same visit.', ar: 'ألواح MDF وجدران شرائحية وكرانيش تُركّب وتُدهن في الزيارة نفسها.' },
    [{ en: 'Design drawing', ar: 'رسم تصميمي' }, { en: 'Fitting and painting', ar: 'التركيب والدهان' }], { isNew: true }),

  /* ---- flooring ---- */
  svc('rukn-floors', FS, 'porcelain-ceramic', { en: 'Porcelain tiling', ar: 'تركيب بورسلان' }, 65, U.m2, L.w1,
    { en: 'Porcelain and ceramic laid level on a prepared screed, with skirting and grouting included.', ar: 'بورسلان وسيراميك يُركّب مستوياً على لياسة مجهزة، مع النعلات والترويب.' },
    [{ en: 'Levelling', ar: 'التسوية' }, { en: 'Skirting', ar: 'النعلات' }, { en: 'Grouting and clean', ar: 'الترويب والتنظيف' }], { popular: true, img: `${F}/bath.webp` }),
  svc('rukn-floors', FS, 'marble', { en: 'Marble flooring', ar: 'أرضيات رخام' }, 240, U.m2, L.w2,
    { en: 'Supply and laying of natural marble, book-matched where the slab allows, polished in place.', ar: 'توريد وتركيب رخام طبيعي، بتطابق العروق حيث تسمح البلاطة، مع جلي في الموقع.' },
    [{ en: 'Slab selection with you', ar: 'اختيار البلاطات معك' }, { en: 'Laying and polishing', ar: 'التركيب والجلي' }]),
  svc('rukn-floors', FS, 'spc-flooring', { en: 'SPC click flooring', ar: 'أرضيات SPC' }, 85, U.m2, L.d3,
    { en: 'Waterproof SPC planks over the existing floor in a day or two, no demolition.', ar: 'ألواح SPC مقاومة للماء فوق الأرضية الحالية في يوم أو يومين، دون هدم.' },
    [{ en: 'Underlay', ar: 'الطبقة السفلية' }, { en: 'Skirting and profiles', ar: 'النعلات والبروفايلات' }]),
  svc('rukn-floors', FS, 'wooden-flooring', { en: 'Engineered wood flooring', ar: 'أرضيات خشب هندسي' }, 190, U.m2, L.w2,
    { en: 'Engineered oak and walnut boards, glued or floated, finished with a hard-wax oil.', ar: 'ألواح بلوط وجوز هندسية، لاصقة أو عائمة، بتشطيب زيت شمعي صلب.' },
    [{ en: 'Moisture check', ar: 'فحص الرطوبة' }, { en: 'Laying and finishing', ar: 'التركيب والتشطيب' }]),
  svc('rukn-floors', FS, 'carpet', { en: 'Wall-to-wall carpet', ar: 'موكيت' }, 55, U.m2, L.d3,
    { en: 'Carpet for bedrooms, majlis and offices, with underlay and seams placed out of sight.', ar: 'موكيت لغرف النوم والمجالس والمكاتب، مع اللباد والوصلات بعيداً عن النظر.' },
    [{ en: 'Underlay', ar: 'اللباد' }, { en: 'Fitting', ar: 'التركيب' }]),

  /* ---- finishing and decorative ---- */
  svc('lumen-lighting', FD, 'ceilings-gypsum', { en: 'Gypsum ceilings with lighting', ar: 'أسقف جبس مع إنارة' }, 180, U.m2, L.w2,
    { en: 'Gypsum ceilings designed around the lighting: coves, downlights and tracks, wired and fitted.', ar: 'أسقف جبس تُصمم حول الإنارة: أكواف وسبوتات ومسارات، بالتمديد والتركيب.' },
    [{ en: 'Ceiling and lighting drawing', ar: 'رسم السقف والإنارة' }, { en: 'Wiring and fittings', ar: 'التمديد والتركيبات' }, { en: 'Painting', ar: 'الدهان' }], { popular: true, img: `${F}/lighting.webp` }),
  svc('lumen-lighting', FD, 'architectural-details', { en: 'Lighting plan and installation', ar: 'مخطط الإنارة وتركيبها' }, 120, U.point, L.w1,
    { en: 'Ambient, task and accent light drawn for each room, then fitted by our electricians.', ar: 'إنارة عامة ووظيفية ومركزة تُرسم لكل غرفة، ثم يركّبها كهربائيونا.' },
    [{ en: 'Lighting plan', ar: 'مخطط الإنارة' }, { en: 'Fixture list from Diyar stores', ar: 'قائمة وحدات من متاجر ديار' }, { en: 'Installation and testing', ar: 'التركيب والاختبار' }]),
  svc('lumen-lighting', FD, 'turnkey-finishing', { en: 'Smart home lighting', ar: 'إنارة المنزل الذكي' }, undefined, undefined, L.w2,
    { en: 'Scenes, schedules and dimming for the whole house on one app, with the switches to match.', ar: 'مشاهد وجداول وتعتيم للمنزل كله في تطبيق واحد، مع المفاتيح المناسبة.' },
    [{ en: 'System design', ar: 'تصميم النظام' }, { en: 'Programming and handover', ar: 'البرمجة والتسليم' }], { isNew: true }),

  /* ---- glass ---- */
  svc('zujaj-pro', GS, 'glass-partitions', { en: 'Glass partitions', ar: 'قواطع زجاجية' }, 420, U.m2, L.w2,
    { en: 'Framed and frameless tempered-glass partitions for offices and homes, with doors and film.', ar: 'قواطع زجاج مقسّى بإطار أو بدونه للمكاتب والمنازل، مع الأبواب والأفلام.' },
    [{ en: 'Engineered drawing', ar: 'رسم هندسي' }, { en: 'Tempered glass and hardware', ar: 'زجاج مقسّى وملحقات' }, { en: 'One-visit installation', ar: 'تركيب في زيارة واحدة' }], { popular: true, img: IMG.hero }),
  svc('zujaj-pro', GS, 'skylights', { en: 'Skylights', ar: 'سكاي لايت' }, undefined, undefined, L.w4,
    { en: 'Fixed and opening skylights with insulated glass, flashed and sealed against the Saudi summer.', ar: 'سكاي لايت ثابت أو قابل للفتح بزجاج عازل، بعزل وإحكام يناسب صيف المملكة.' },
    [{ en: 'Structural check', ar: 'فحص إنشائي' }, { en: 'Insulated glazing', ar: 'زجاج عازل' }, { en: 'Waterproofing', ar: 'العزل المائي' }]),
  svc('zujaj-pro', GS, 'skurit-systems', { en: 'Skurit doors and showers', ar: 'أبواب وكبائن سكوريت' }, 1600, U.piece, L.w1,
    { en: 'Tempered-glass doors and shower enclosures, measured after tiling and fitted in a morning.', ar: 'أبواب وكبائن استحمام من السكوريت، تُقاس بعد التبليط وتُركّب في صباح واحد.' },
    [{ en: 'Measurement after tiling', ar: 'قياس بعد التبليط' }, { en: 'Hardware and seals', ar: 'الملحقات والعوازل' }]),
  svc('zujaj-pro', GS, 'storefronts', { en: 'Shop fronts', ar: 'واجهات المحلات' }, undefined, undefined, L.w4,
    { en: 'Aluminium and glass storefronts with signage zones and automatic doors, to the mall or municipality spec.', ar: 'واجهات ألمنيوم وزجاج للمحلات مع مناطق اللوحات والأبواب الأوتوماتيكية، حسب اشتراطات المول أو البلدية.' },
    [{ en: 'Drawings for approval', ar: 'رسومات للاعتماد' }, { en: 'Fabrication and installation', ar: 'التصنيع والتركيب' }]),
  svc('zujaj-pro', GS, 'glass-facades', { en: 'Glass facades', ar: 'واجهات زجاجية' }, undefined, undefined, L.w4,
    { en: 'Curtain-wall and structural glazing for villas and small buildings, engineered and installed.', ar: 'واجهات ستائرية وزجاج إنشائي للفلل والمباني الصغيرة، بالتصميم الهندسي والتركيب.' },
    [{ en: 'Engineering package', ar: 'الحزمة الهندسية' }, { en: 'Installation', ar: 'التركيب' }]),

  /* ---- safety ---- */
  svc('aman-systems', SE, 'fire-alarm', { en: 'Fire alarm system', ar: 'نظام إنذار حريق' }, 180, U.point, L.w1,
    { en: 'Detectors, panel and sounders installed to Civil Defence requirements, with the certificate handled.', ar: 'كواشف ولوحة وصفارات تُركّب حسب اشتراطات الدفاع المدني، مع إنهاء الشهادة.' },
    [{ en: 'Design to code', ar: 'تصميم حسب الكود' }, { en: 'Installation and commissioning', ar: 'التركيب والتشغيل' }, { en: 'Civil Defence paperwork', ar: 'أوراق الدفاع المدني' }], { popular: true, img: IMG.restaurant }),
  svc('aman-systems', SE, 'cctv', { en: 'CCTV cameras', ar: 'كاميرات مراقبة' }, 350, U.point, L.d3,
    { en: 'Indoor and outdoor cameras with recording and phone access, cabled neatly.', ar: 'كاميرات داخلية وخارجية مع تسجيل ووصول من الجوال، بتمديد مرتب.' },
    [{ en: 'Camera plan', ar: 'مخطط الكاميرات' }, { en: 'Recorder and app', ar: 'جهاز التسجيل والتطبيق' }]),
  svc('aman-systems', SE, 'access-control', { en: 'Access control', ar: 'التحكم بالدخول' }, 1200, U.door, L.w1,
    { en: 'Card, code and fingerprint access for offices and buildings, with visitor logs.', ar: 'دخول بالبطاقة والرمز والبصمة للمكاتب والمباني، مع سجلات الزوار.' },
    [{ en: 'Readers and locks', ar: 'القارئات والأقفال' }, { en: 'Software setup', ar: 'إعداد البرنامج' }]),
  svc('aman-systems', SE, 'safety-signage', { en: 'Safety signage', ar: 'لوحات السلامة الإرشادية' }, 45, U.piece, L.d1,
    { en: 'Exit, fire and evacuation signage to the required sizes and positions, supplied and fixed.', ar: 'لوحات الخروج والحريق والإخلاء بالمقاسات والمواقع المطلوبة، توريداً وتركيباً.' },
    [{ en: 'Site survey', ar: 'مسح الموقع' }, { en: 'Photoluminescent signs', ar: 'لوحات مضيئة' }]),
];

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

export const serviceById = (id: string) => SERVICE_CATALOG.find((s) => s.id === id);
export const providerOfService = (s: ServiceItem): Provider | undefined => PROVIDERS.find((p) => p.id === s.providerId);
export const servicesOfProvider = (providerId: string) => SERVICE_CATALOG.filter((s) => s.providerId === providerId);
export const categoryOfService = (s: ServiceItem) => SERVICES.find((c) => c.en === s.category);
export const subOfService = (s: ServiceItem) => SERVICE_SUBS[s.category]?.find((x) => x.key === s.sub);

export type ServiceSortKey = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
export interface ServiceQuery {
  q?: string;
  /** category slug, as the URL carries it */
  category?: string;
  sub?: string;
  provider?: string;
  city?: string;
  sort?: ServiceSortKey;
}

const norm = (x: string) =>
  x
    .toLowerCase()
    .replace(/[ً-ْ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');

export function filterServices(qy: ServiceQuery, categorySlug: (en: string) => string): ServiceItem[] {
  const q = norm((qy.q ?? '').trim());
  let out = SERVICE_CATALOG.filter((s) => {
    if (qy.category && categorySlug(s.category) !== qy.category) return false;
    if (qy.sub && s.sub !== qy.sub) return false;
    if (qy.provider && s.providerId !== qy.provider) return false;
    const p = providerOfService(s);
    if (qy.city && p?.city.en !== qy.city) return false;
    if (q) {
      const sub = subOfService(s);
      const cat = categoryOfService(s);
      const hay = norm([s.name.en, s.name.ar, sub?.en, sub?.ar, cat?.en, cat?.ar, p?.name.en, p?.name.ar].filter(Boolean).join(' '));
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  const price = (s: ServiceItem) => s.priceFrom ?? Number.MAX_SAFE_INTEGER;
  switch (qy.sort) {
    case 'price_asc': out = [...out].sort((a, b) => price(a) - price(b)); break;
    case 'price_desc': out = [...out].sort((a, b) => (b.priceFrom ?? 0) - (a.priceFrom ?? 0)); break;
    case 'rating': out = [...out].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
    case 'newest': out = [...out].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew)); break;
    default: out = [...out].sort((a, b) => Number(!!b.popular) - Number(!!a.popular) || b.reviews - a.reviews);
  }
  return out;
}

/** The cities partners work from, for the filter. */
export const SERVICE_CITIES: Bi[] = PROVIDERS.map((p) => p.city).filter((c, i, l) => l.findIndex((x) => x.en === c.en) === i);
