import React, { useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight, Sparkles, Upload, Search, Plus, Minus, Trash2, Send, Eye, CheckCircle2, RotateCcw, MapPin, Wallet, X, ImageIcon, MessageSquare,
} from 'lucide-react';
import { CATALOG, CATEGORIES, storeOf } from '../looks/lookShared';
import { REQUESTS, hasCutout, productImg, productOf, sar, saveSent, type DesignPin, type SentDesign } from './designerData';

const STYLES = ['مودرن', 'كلاسيك', 'نيوكلاسيك', 'بوهيمي', 'فاخر'];

/** Shrink an uploaded picture so it can travel with the design. */
function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, 1400 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/** The design as the client will receive it: the picture, the numbered points, the list. */
export function DesignPreview({ image, rendered, pins, active, onPick }: { image: string; rendered: boolean; pins: DesignPin[]; active?: number | null; onPick?: (i: number) => void }) {
  return (
    <div className="relative select-none overflow-hidden rounded-xl bg-gray-100" dir="ltr">
      <img src={image} alt="" className="block w-full" draggable={false} />
      {!rendered &&
        pins.map((p, i) =>
          p.w ? (
            <img
              key={`c${i}`}
              src={productImg(p.productId)}
              alt=""
              draggable={false}
              className="pointer-events-none absolute drop-shadow-[0_14px_14px_rgba(0,0,0,0.3)]"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, transform: 'translate(-50%, -50%)' }}
            />
          ) : null,
        )}
      {pins.map((p, i) => (
        <button
          key={`p${i}`}
          type="button"
          onClick={() => onPick?.(i)}
          className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-lg transition-transform ${
            active === i ? 'scale-125 bg-diyar-brown' : 'bg-diyar-dark'
          }`}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

export default function DesignerStudio() {
  const { id } = useParams();
  const req = REQUESTS.find((r) => r.id === id) ?? REQUESTS[0];

  const [pins, setPins] = useState<DesignPin[]>([]);
  /** an edited picture replacing the client's photo: the AI render or the designer's upload */
  const [render, setRender] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [style, setStyle] = useState(STYLES[0]);
  const [showOriginal, setShowOriginal] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [note, setNote] = useState(`أهلاً ${req.client.split(' ')[0]}، هذا اقتراحي لـ${req.room}. اضغط على أي رقم في الصورة لرؤية القطعة، ويمكنك إضافتها كلها إلى السلة مرة واحدة.`);
  const [preview, setPreview] = useState(false);
  const [sent, setSent] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ i: number; dx: number; dy: number } | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const image = render ?? req.photo;
  const total = pins.reduce((n, p) => n + (productOf(p.productId)?.price ?? 0), 0);

  const list = useMemo(() => {
    const needle = q.trim();
    return CATALOG.filter((p) => (cat === 'all' || p.category === cat) && (!needle || p.name.ar.includes(needle) || p.name.en.toLowerCase().includes(needle.toLowerCase())));
  }, [q, cat]);

  const add = (productId: number) => {
    if (pins.some((p) => p.productId === productId)) return;
    const n = pins.length;
    // onto the photo as a cut-out when the piece has one and the picture is still the client's own
    const cut = !render && hasCutout(productId);
    setPins([...pins, { productId, x: 28 + ((n * 17) % 46), y: cut ? 72 : 40 + ((n * 11) % 30), w: cut ? 26 : undefined }]);
    setSel(n);
  };
  const remove = (i: number) => {
    setPins(pins.filter((_, k) => k !== i));
    setSel(null);
  };
  const patch = (i: number, p: Partial<DesignPin>) => setPins((l) => l.map((x, k) => (k === i ? { ...x, ...p } : x)));

  /* dragging a point (or the cut-out under it) across the picture */
  const pct = (e: React.PointerEvent) => {
    const r = stage.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
  };
  const onDown = (e: React.PointerEvent, i: number) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const p = pct(e);
    drag.current = { i, dx: p.x - pins[i].x, dy: p.y - pins[i].y };
    setSel(i);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const p = pct(e);
    const c = (v: number) => Math.max(2, Math.min(98, v));
    patch(drag.current.i, { x: c(p.x - drag.current.dx), y: c(p.y - drag.current.dy) });
  };

  /* AI: proposes the pieces and places them. This request has a ready render;
     the others get the proposed pieces arranged on the client's own photo. */
  const runAI = () => {
    setAiBusy(true);
    setSel(null);
    window.setTimeout(() => {
      if (req.aiResult && req.aiPins) {
        setRender(req.aiResult);
        setPins(req.aiPins);
      } else {
        setRender(null);
        const cuts = req.suggest.filter(hasCutout);
        const rest = req.suggest.filter((x) => !hasCutout(x));
        setPins([
          ...cuts.map((productId, k) => ({ productId, x: 26 + (k * 48) / Math.max(1, cuts.length - 1 || 1), y: 74, w: 22 })),
          ...rest.map((productId, k) => ({ productId, x: 62 + k * 14, y: 44 + k * 8 })),
        ]);
      }
      setAiBusy(false);
    }, 1900);
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setRender(await readImage(f));
    // the furniture is in the picture now: cut-outs become plain points
    setPins((l) => l.map((p) => ({ ...p, w: undefined })));
  };

  const reset = () => {
    setRender(null);
    setPins([]);
    setSel(null);
  };

  const send = () => {
    const d: SentDesign = {
      id: `DS-${Date.now().toString().slice(-4)}`,
      requestId: req.id,
      client: req.client,
      room: req.room,
      photo: req.photo,
      image,
      rendered: !!render,
      pins,
      note: note.trim(),
      total,
      sentAt: new Date().toTimeString().slice(0, 5),
    };
    saveSent(d);
    setPreview(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm" dir="rtl" data-testid="studio-sent">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle2 size={34} />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-diyar-dark">تم إرسال التصميم إلى {req.client}</h2>
        <p className="mx-auto mb-8 max-w-md text-gray-500">
          وصل التصميم إلى محادثة العميل مع {pins.length} منتجات بقيمة {sar(total)} ر.س. ستصلك إشعارات عند مشاهدته وعند الشراء منه.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/dashboard/designer/designs" className="rounded-xl bg-diyar-brown px-6 py-3 text-sm font-bold text-white transition hover:bg-[#8A6D46]">
            عرض تصاميمي المرسلة
          </Link>
          <Link to="/look/1/chat?with=diyar-designer" data-testid="studio-open-chat" className="flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-bold text-diyar-dark transition hover:bg-gray-50">
            <MessageSquare size={16} /> كما يراه العميل في المحادثة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl" data-testid="designer-studio">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/designer/requests" className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50">
            <ArrowRight size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-diyar-dark">استوديو التصميم</h1>
            <p className="mt-1 text-sm text-gray-500">
              {req.room} — {req.client} · {req.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} disabled={!pins.length && !render} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-40">
            <RotateCcw size={16} /> البدء من جديد
          </button>
          <button
            onClick={() => setPreview(true)}
            disabled={!pins.length}
            data-testid="studio-preview"
            className="flex items-center gap-2 rounded-xl bg-diyar-brown px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#8A6D46] disabled:opacity-40"
          >
            <Eye size={16} /> معاينة وإرسال
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ---------------- the picture ---------------- */}
        <div className="space-y-4 xl:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className={`rounded-lg px-3 py-1.5 font-bold ${render ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                  {render ? (render === req.aiResult ? 'تصميم بالذكاء الاصطناعي' : 'تصميم مرفوع') : 'صورة العميل'}
                </span>
                {render && (
                  <button
                    onPointerDown={() => setShowOriginal(true)}
                    onPointerUp={() => setShowOriginal(false)}
                    onPointerLeave={() => setShowOriginal(false)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 transition hover:bg-gray-50"
                  >
                    اضغط مطولاً لرؤية الأصل
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400">اسحب أي رقم لتحريكه إلى مكان القطعة في الصورة</p>
            </div>

            <div
              ref={stage}
              dir="ltr"
              data-testid="studio-stage"
              className="relative touch-none select-none overflow-hidden rounded-xl bg-gray-100"
              onPointerMove={onMove}
              onPointerUp={() => (drag.current = null)}
              onPointerCancel={() => (drag.current = null)}
              onPointerDown={() => setSel(null)}
            >
              <img src={showOriginal ? req.photo : image} alt="" draggable={false} className={`block w-full transition-[filter] duration-500 ${aiBusy ? 'blur-[3px] brightness-90' : ''}`} />

              {!showOriginal &&
                !render &&
                pins.map((p, i) =>
                  p.w ? (
                    <img
                      key={`c${p.productId}`}
                      src={productImg(p.productId)}
                      alt=""
                      draggable={false}
                      onPointerDown={(e) => onDown(e, i)}
                      className="absolute cursor-grab drop-shadow-[0_14px_14px_rgba(0,0,0,0.3)] active:cursor-grabbing"
                      style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, transform: 'translate(-50%, -50%)', outline: sel === i ? '2px dashed rgba(148,121,97,0.9)' : 'none', outlineOffset: 4 }}
                    />
                  ) : null,
                )}

              {!showOriginal &&
                pins.map((p, i) => (
                  <button
                    key={`p${p.productId}`}
                    type="button"
                    data-testid="studio-pin"
                    onPointerDown={(e) => onDown(e, i)}
                    className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white shadow-lg active:cursor-grabbing ${
                      sel === i ? 'scale-110 bg-diyar-brown' : 'bg-diyar-dark'
                    }`}
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  >
                    {i + 1}
                  </button>
                ))}

              {aiBusy && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30 text-white" dir="rtl">
                  <Sparkles size={28} className="animate-pulse" />
                  <span className="text-sm font-bold">يجهّز الذكاء الاصطناعي التصميم بنمط {style}…</span>
                </div>
              )}
              {!pins.length && !aiBusy && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-12 text-center text-sm text-white" dir="rtl">
                  أضف منتجات من القائمة، أو دع الذكاء الاصطناعي يقترح تصميماً كاملاً
                </div>
              )}
            </div>

            {/* the selected piece */}
            {sel !== null && pins[sel] && (
              <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-gray-50 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-diyar-brown text-xs font-bold text-white">{sel + 1}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-bold text-diyar-dark">{productOf(pins[sel].productId)?.name.ar}</span>
                {pins[sel].w && !render && (
                  <>
                    <span className="text-xs text-gray-400">الحجم</span>
                    <button onClick={() => patch(sel, { w: Math.max(8, (pins[sel].w ?? 20) - 3) })} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-100">
                      <Minus size={14} />
                    </button>
                    <button onClick={() => patch(sel, { w: Math.min(70, (pins[sel].w ?? 20) + 3) })} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-100">
                      <Plus size={14} />
                    </button>
                  </>
                )}
                <button onClick={() => remove(sel)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-red-500 hover:bg-red-50">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* how the picture is made */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 font-bold text-diyar-dark">
                <Sparkles size={18} className="text-purple-600" /> تصميم بالذكاء الاصطناعي
              </div>
              <p className="mb-4 text-sm text-gray-500">يقترح القطع المناسبة للغرفة والميزانية ويضعها في صورة العميل.</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button key={s} onClick={() => setStyle(s)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${style === s ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {s}
                  </button>
                ))}
              </div>
              <button onClick={runAI} disabled={aiBusy} data-testid="studio-ai" className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 text-sm font-bold text-white transition hover:bg-purple-700 disabled:opacity-60">
                <Sparkles size={16} /> {aiBusy ? 'جاري التصميم…' : 'اقترح تصميماً'}
              </button>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 font-bold text-diyar-dark">
                <ImageIcon size={18} className="text-diyar-brown" /> تصميم يدوي
              </div>
              <p className="mb-4 text-sm text-gray-500">
                أضف القطع من القائمة فتظهر فوق صورة العميل لتحرّكها وتغيّر حجمها، أو ارفع صورة عدّلتها في برنامجك ثم ضع الأرقام على القطع.
              </p>
              <input ref={file} type="file" accept="image/*" className="hidden" onChange={onUpload} data-testid="studio-file" />
              <button onClick={() => file.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-diyar-dark transition hover:bg-gray-50">
                <Upload size={16} /> رفع صورة معدّلة
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- the request, the pieces, the catalogue ---------------- */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-bold text-diyar-dark">طلب العميل</h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">{req.note}</p>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" /> {req.city}
              </div>
              <div className="flex items-center gap-2">
                <Wallet size={14} className="text-gray-400" /> الميزانية: <span className="font-bold text-gray-700">{req.budget}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-gray-400" /> النمط المفضل: <span className="font-bold text-gray-700">{req.style}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm" data-testid="studio-selected">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-diyar-dark">منتجات التصميم ({pins.length})</h3>
              <span className="text-sm font-bold text-diyar-dark">{sar(total)} ر.س</span>
            </div>
            {pins.length === 0 ? (
              <p className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-400">لم تُضف منتجات بعد</p>
            ) : (
              <ul className="space-y-2">
                {pins.map((p, i) => {
                  const pr = productOf(p.productId);
                  if (!pr) return null;
                  return (
                    <li key={p.productId} onClick={() => setSel(i)} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-2 transition ${sel === i ? 'border-diyar-brown bg-diyar-cream/30' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-diyar-dark text-[11px] font-bold text-white">{i + 1}</span>
                      <img src={productImg(pr.id)} alt="" className="h-11 w-11 shrink-0 rounded-lg bg-gray-50 object-contain" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-gray-800">{pr.name.ar}</span>
                        <span className="block text-xs text-gray-500">
                          {storeOf(pr.store).name.ar} · {sar(pr.price)} ر.س
                        </span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(i);
                        }}
                        className="shrink-0 p-1.5 text-gray-400 hover:text-red-500"
                      >
                        <X size={15} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-bold text-diyar-dark">إضافة منتجات</h3>
            <div className="relative mb-3">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث في منتجات ديار…" data-testid="studio-search" className="w-full rounded-lg border border-gray-100 bg-gray-50 py-2 pl-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-diyar-brown" />
            </div>
            <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
              {[{ key: 'all', ar: 'الكل' }, ...CATEGORIES].map((c) => (
                <button key={c.key} onClick={() => setCat(c.key)} className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${cat === c.key ? 'bg-diyar-brown text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {c.ar}
                </button>
              ))}
            </div>
            <ul className="grid max-h-[420px] grid-cols-2 gap-2 overflow-y-auto pl-1" data-testid="studio-catalogue">
              {list.map((p) => {
                const on = pins.some((x) => x.productId === p.id);
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => (on ? remove(pins.findIndex((x) => x.productId === p.id)) : add(p.id))}
                      data-testid="studio-add"
                      className={`relative block w-full rounded-xl border p-2 text-right transition ${on ? 'border-diyar-brown bg-diyar-cream/30' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <span className="block aspect-square overflow-hidden rounded-lg bg-gray-50">
                        <img src={productImg(p.id)} alt="" loading="lazy" className={`h-full w-full ${hasCutout(p.id) ? 'object-contain p-2' : 'object-cover'}`} />
                      </span>
                      <span className="mt-2 block truncate text-xs font-bold text-gray-800">{p.name.ar}</span>
                      <span className="block text-[11px] text-gray-500">{sar(p.price)} ر.س</span>
                      <span className={`absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white ${on ? 'bg-diyar-brown' : 'bg-diyar-dark/70'}`}>
                        {on ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                      </span>
                    </button>
                  </li>
                );
              })}
              {list.length === 0 && <li className="col-span-2 p-6 text-center text-sm text-gray-400">لا توجد منتجات مطابقة</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* ---------------- preview: what the client receives ---------------- */}
      {preview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setPreview(false)}>
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()} data-testid="studio-preview-modal">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h3 className="text-lg font-bold text-diyar-dark">معاينة ما سيصل إلى {req.client}</h3>
                <p className="mt-0.5 text-sm text-gray-500">الصورة مع المنتجات وروابطها، كما ستظهر في محادثته.</p>
              </div>
              <button onClick={() => setPreview(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-5 md:grid-cols-2">
              <DesignPreview image={image} rendered={!!render} pins={pins} />
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">رسالتك للعميل</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="mb-4 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-diyar-brown" />
                <ul className="space-y-2">
                  {pins.map((p, i) => {
                    const pr = productOf(p.productId);
                    return pr ? (
                      <li key={p.productId} className="flex items-center gap-3 text-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-diyar-dark text-[11px] font-bold text-white">{i + 1}</span>
                        <span className="min-w-0 flex-1 truncate text-gray-700">{pr.name.ar}</span>
                        <span className="shrink-0 font-bold text-diyar-dark">{sar(pr.price)} ر.س</span>
                      </li>
                    ) : null;
                  })}
                </ul>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 font-bold text-diyar-dark">
                  <span>إجمالي التصميم</span>
                  <span>{sar(total)} ر.س</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 p-4">
              <button onClick={() => setPreview(false)} className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50">
                متابعة التعديل
              </button>
              <button onClick={send} data-testid="studio-send" className="flex items-center gap-2 rounded-xl bg-diyar-brown px-6 py-2.5 text-sm font-bold text-white hover:bg-[#8A6D46]">
                <Send size={16} className="-scale-x-100" /> إرسال إلى العميل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
