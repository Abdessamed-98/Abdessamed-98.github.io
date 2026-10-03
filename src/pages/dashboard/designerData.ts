/**
 * The designer's portal — shared data.
 *
 * A client sends a photo of their own room; the designer answers with a
 * "shoppable design": that room, redesigned (by hand, by upload, or by AI), with
 * the products pinned on it. The same object is what the client receives in the
 * chat, so its shape lives here and both sides import it.
 */
import { CATALOG } from '../looks/lookShared';

/** One product on a design. `x`/`y` are the pin's centre in % of the image. */
export interface DesignPin {
  productId: number;
  x: number;
  y: number;
  /** when the product is laid onto the photo as a cut-out: its width in % of the image */
  w?: number;
}

export interface SentDesign {
  id: string;
  requestId: string;
  client: string;
  room: string;
  /** the client's own photo */
  photo: string;
  /** what the client is shown: the photo itself, an uploaded edit, or an AI render */
  image: string;
  /** true when `image` already contains the furniture (upload / AI), so no cut-outs are drawn over it */
  rendered: boolean;
  pins: DesignPin[];
  note: string;
  total: number;
  sentAt: string;
}

export interface DesignRequest {
  id: string;
  client: string;
  city: string;
  room: string;
  style: string;
  budget: string;
  note: string;
  photo: string;
  date: string;
  status: 'new' | 'working' | 'sent';
  /** what the AI proposes for this room */
  suggest: number[];
  /** a ready AI render of this photo, and where its products sit on it */
  aiResult?: string;
  aiPins?: DesignPin[];
}

export const REQUESTS: DesignRequest[] = [
  {
    id: 'DR-3041',
    client: 'عبدالله الحربي',
    city: 'جدة، حي الروضة',
    room: 'صالة المعيشة',
    style: 'مودرن هادئ',
    budget: '15,000 – 25,000 ر.س',
    note: 'الصالة فارغة تماماً بعد التشطيب. أريد جلسة زاوية مريحة للعائلة، وسجادة، وإنارة دافئة. أفضّل الألوان الفاتحة.',
    photo: '/before.png',
    date: 'قبل ساعتين',
    status: 'new',
    suggest: [31, 10, 33, 32, 19],
    aiResult: '/after.png',
    aiPins: [
      { productId: 31, x: 40, y: 65 },
      { productId: 10, x: 24, y: 44 },
      { productId: 33, x: 72, y: 86 },
      { productId: 32, x: 55, y: 71 },
      { productId: 19, x: 50, y: 46 },
    ],
  },
  {
    id: 'DR-3038',
    client: 'نورة العتيبي',
    city: 'الرياض، حي الملقا',
    room: 'المجلس',
    style: 'كلاسيك معاصر',
    budget: '8,000 – 12,000 ر.س',
    note: 'المجلس مؤثث لكن ينقصه كرسيان منفردان وطاولة جانبية. أريد قطعاً تتماشى مع الأريكة الحالية.',
    photo: '/looks/rooms/majlis.webp',
    date: 'قبل 5 ساعات',
    status: 'new',
    suggest: [5, 9, 12],
  },
  {
    id: 'DR-3032',
    client: 'خالد السديري',
    city: 'الدمام، حي الشاطئ',
    room: 'المكتب المنزلي',
    style: 'عملي بسيط',
    budget: '4,000 – 6,000 ر.س',
    note: 'أعمل من المنزل وأحتاج كرسياً مريحاً للقراءة بجانب المكتب، وإنارة أفضل.',
    photo: '/looks/rooms/office.webp',
    date: 'أمس',
    status: 'working',
    suggest: [8, 10, 12],
  },
];

/** Designs sent before today, so the list and the money pages have a history. */
export const PAST_DESIGNS: { id: string; client: string; room: string; image: string; products: number; total: number; date: string; status: 'sent' | 'viewed' | 'bought'; bought: number }[] = [
  { id: 'DS-2291', client: 'منى الدوسري', room: 'غرفة النوم', image: '/looks/rooms/bedroom.webp', products: 5, total: 10120, date: '28 سبتمبر', status: 'bought', bought: 8870 },
  { id: 'DS-2284', client: 'ريم خالد', room: 'غرفة الطعام', image: '/looks/rooms/dining.webp', products: 4, total: 9130, date: '25 سبتمبر', status: 'bought', bought: 9130 },
  { id: 'DS-2270', client: 'محمد الشهراني', room: 'صالة المعيشة', image: '/looks/rooms/living.webp', products: 6, total: 21947, date: '21 سبتمبر', status: 'viewed', bought: 0 },
  { id: 'DS-2263', client: 'سارة العتيبي', room: 'المكتب المنزلي', image: '/looks/rooms/office.webp', products: 4, total: 5740, date: '17 سبتمبر', status: 'sent', bought: 0 },
];

/** The designer's share of what a client buys from a design. */
export const COMMISSION = 0.08;

/** Pieces 1–9 have a background-free photo and can be laid onto a room. */
export const hasCutout = (id: number) => id >= 1 && id <= 9;
export const productImg = (id: number) => {
  if (hasCutout(id)) return `/looks/cutout/p${String(id).padStart(2, '0')}.webp`;
  return CATALOG.find((p) => p.id === id)?.img ?? '';
};
export const productOf = (id: number) => CATALOG.find((p) => p.id === id);
export const sar = (n: number) => n.toLocaleString('en-US');

/* ------------------------------------------------------------------ */
/* What has been sent — kept for the session so the client's chat sees it */
/* ------------------------------------------------------------------ */

const KEY = 'diyar-designer-sent';

export function loadSent(): SentDesign[] {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? '[]') as SentDesign[];
  } catch {
    return [];
  }
}

export function saveSent(d: SentDesign) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify([...loadSent().filter((x) => x.requestId !== d.requestId), d]));
    return true;
  } catch {
    // storage full or blocked: the design is still shown as sent on this screen
    return false;
  }
}
