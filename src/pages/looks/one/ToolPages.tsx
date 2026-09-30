/**
 * Look 1 — the tools and the reading: the AI designer (restyle a room, or
 * compose one from real pieces), chat, the rewards page, the journal, and an
 * index of every page for review.
 */
import { useEffect, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, Send, Sparkles, Upload, Trash2, Plus, Minus, ChevronLeft, Heart, ShoppingBag } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useWishlist } from '../../../context/WishlistContext';
import { BLOG_POSTS, CATALOG, LOYALTY, STYLES, formatSAR, lookBase, productPath, searchPath } from '../lookShared';
import { HAIR, INK, MUTED, NIGHT, OLIVE, OLIVE_LT, TILE, primaryBtnCls, tileImg, useLook } from './ui';
import { useShell } from './shellContext';
import { useLookCart } from './cart';
import { BeforeAfter } from './BeforeAfter';
import { CONTAINER, PageHead, Tabs, capsCls, displayCls } from './kit';
import {
  ARTICLE_BODY, CHAT_THREADS, COMPANIES, HELP_TOPICS, LOYALTY_HISTORY, LOYALTY_POINTS, LOYALTY_TIERS, PROVIDERS,
  postBySlug, postSlug, type ChatThread,
} from './data';
import { NotFoundPage } from './InfoPages';

const home = (t: (en: string, ar: string) => string) => ({ label: t('Home', 'الرئيسية'), to: lookBase(1) });

/* ------------------------------------------------------------------ */
/* AI designer                                                         */
/* ------------------------------------------------------------------ */

export function AIDesignerPage() {
  const { t } = useLook();
  const [sp, setSp] = useSearchParams();
  const mode = sp.get('mode') === 'compose' ? 'compose' : 'restyle';
  return (
    <main className="pt-[72px]" data-testid="ai-designer">
      <PageHead
        crumbs={[home(t), { label: t('AI Designer', 'المصمم الذكي') }]}
        eyebrow={t('Diyar AI', 'ديار الذكي')}
        title={t('Design the room before you buy', 'صمّم الغرفة قبل أن تشتري')}
        intro={t('Restyle a photo of your room, or build one from pieces in the shop.', 'أعد تصميم صورة غرفتك، أو ابنِ غرفة من قطع المتجر.')}
      />
      <div className={`${CONTAINER} pt-8`}>
        <Tabs
          testId="ai-tabs"
          value={mode}
          onChange={(k) => setSp(k === 'restyle' ? {} : { mode: k }, { replace: true })}
          items={[
            { key: 'restyle', label: t('Restyle my room', 'أعد تصميم غرفتي') },
            { key: 'compose', label: t('Compose a room', 'ركّب غرفة') },
          ]}
        />
      </div>
      <div className={`${CONTAINER} py-10 md:py-14`}>{mode === 'restyle' ? <Restyle /> : <Composer />}</div>
    </main>
  );
}

function Restyle() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const [style, setStyle] = useState(STYLES[0].key);
  const [photo, setPhoto] = useState<string | null>(null);
  const [stage, setStage] = useState<'pick' | 'working' | 'done'>('pick');
  const file = useRef<HTMLInputElement>(null);
  const timer = useRef<number | null>(null);
  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const run = () => {
    setStage('working');
    timer.current = window.setTimeout(() => setStage('done'), 1800);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-8">
        {stage === 'done' && !photo ? (
          <div data-testid="restyle-result">
            <BeforeAfter
              before="/before.png"
              after="/after.png"
              beforeLabel={t('As it is', 'كما هي')}
              afterLabel={t(`${STYLES.find((s) => s.key === style)?.en}`, `${STYLES.find((s) => s.key === style)?.ar}`)}
              alt={t('The room before and after', 'الغرفة قبل وبعد')}
              className="aspect-[4/3] w-full"
            />
          </div>
        ) : (
          <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: TILE }}>
            <img
              src={photo ?? '/before.png'}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 ${stage === 'working' ? 'blur-[3px] brightness-90' : ''}`}
            />
            {stage === 'working' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#171512]/30 text-white">
                <Sparkles size={24} strokeWidth={1.4} className="animate-pulse" />
                <span className={`text-[11px] font-medium ${caps}`}>{t('Designing…', 'جاري التصميم…')}</span>
              </div>
            )}
            {stage === 'done' && photo && (
              <div className="absolute inset-x-4 bottom-4 bg-white/95 p-4 text-[13px]" data-testid="restyle-result">
                {t('Your photo is saved to this session. Styled results for your own photos arrive with the app — the sample room shows the full effect.', 'حُفظت صورتك لهذه الجلسة. نتائج صورك الخاصة تأتي مع التطبيق — الغرفة النموذجية تعرض النتيجة كاملة.')}
              </div>
            )}
            <span className={`absolute start-4 top-4 bg-white/90 px-2.5 py-1 text-[10px] font-semibold ${caps}`}>
              {photo ? t('Your photo', 'صورتك') : t('Sample room', 'غرفة نموذجية')}
            </span>
          </div>
        )}
      </div>

      <div className="lg:col-span-4">
        <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('1 · The room', '1 · الغرفة')}</p>
        <input
          ref={file}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setPhoto(URL.createObjectURL(f));
            setStage('pick');
          }}
        />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setPhoto(null);
              setStage('pick');
            }}
            className="border px-3 py-3 text-[12px] font-medium transition-colors"
            style={{ borderColor: photo ? HAIR : INK, backgroundColor: photo ? '#FFFFFF' : TILE }}
          >
            {t('Sample room', 'غرفة نموذجية')}
          </button>
          <button
            type="button"
            onClick={() => file.current?.click()}
            className="inline-flex items-center justify-center gap-2 border px-3 py-3 text-[12px] font-medium"
            style={{ borderColor: photo ? INK : HAIR, backgroundColor: photo ? TILE : '#FFFFFF' }}
          >
            <Upload size={13} strokeWidth={1.5} />
            {t('My photo', 'صورتي')}
          </button>
        </div>

        <p className={`mt-8 text-[10px] ${caps}`} style={{ color: MUTED }}>{t('2 · The style', '2 · الأسلوب')}</p>
        <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup">
          {STYLES.map((s) => {
            const on = s.key === style;
            return (
              <button
                key={s.key}
                type="button"
                role="radio"
                aria-checked={on}
                data-testid={`style-${s.key}`}
                onClick={() => {
                  setStyle(s.key);
                  if (stage === 'done') setStage('pick');
                }}
                className="group text-start"
              >
                <span className="block aspect-square overflow-hidden border-2 transition-colors" style={{ borderColor: on ? INK : 'transparent' }}>
                  <img src={s.img} alt="" className="h-full w-full object-cover" />
                </span>
                <span className={`mt-1.5 block text-[11px] ${on ? 'font-bold' : 'font-medium'}`}>{t(s.en, s.ar)}</span>
              </button>
            );
          })}
        </div>

        <button type="button" data-testid="restyle-run" disabled={stage === 'working'} onClick={run} className={`mt-8 inline-flex w-full items-center justify-center gap-2 py-4 disabled:opacity-60 ${primaryBtnCls(isAr)}`}>
          <Sparkles size={14} strokeWidth={1.5} />
          {stage === 'done' ? t('Design again', 'صمّم مجدداً') : t('Design it', 'صمّمها')}
        </button>
        <Link to={searchPath(1, { style })} className={`mt-4 flex items-center justify-center gap-2 text-[11px] font-medium ${caps}`} style={{ color: MUTED }}>
          {t('Shop this style', 'تسوّق هذا الأسلوب')}
          <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
        </Link>
      </div>
    </div>
  );
}

/** Pieces with a cut-out photo: those are the ones that can stand in a room. */
const COMPOSABLE = new Set(CATALOG.filter((p) => p.id <= 9).map((p) => p.id));

/** Where the pieces on the shelf come from: the visitor's own wishlist or cart. */
type Source = 'wishlist' | 'cart';

interface Placed {
  uid: number;
  id: number;
  x: number; // centre, % of the stage
  y: number;
  w: number; // width, % of the stage
}

function Composer() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const { add, items: cartItems } = useLookCart();
  const wishlist = useWishlist();
  const { toast, openCart } = useShell();
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ uid: number; dx: number; dy: number } | null>(null);

  /* The shelf holds the visitor's own pieces — what they have saved, or what
     is already in their cart — so the room is built from things they chose,
     not from the whole catalogue. */
  const [source, setSource] = useState<Source>('wishlist');
  const cartIds = [...new Set(cartItems.map((i) => i.productId))];
  const idsOf = (s: Source) => (s === 'wishlist' ? wishlist.ids : cartIds);
  const shelf = idsOf(source)
    .map((id) => CATALOG.find((c) => c.id === id))
    .filter((p): p is (typeof CATALOG)[number] => Boolean(p));
  const unplaceable = shelf.filter((p) => !COMPOSABLE.has(p.id)).length;

  // the room opens with the first piece the visitor saved, if one can stand in it
  const firstId = [...wishlist.ids, ...cartIds].find((id) => COMPOSABLE.has(id));
  const [placed, setPlaced] = useState<Placed[]>(() => (firstId ? [{ uid: 1, id: firstId, x: 50, y: 70, w: 44 }] : []));
  const [sel, setSel] = useState<number | null>(firstId ? 1 : null);
  const nextUid = useRef(2);

  const put = (id: number) => {
    const uid = nextUid.current++;
    setPlaced((l) => [...l, { uid, id, x: 50 + ((l.length * 7) % 30) - 15, y: 62, w: 30 }]);
    setSel(uid);
  };
  const patch = (uid: number, p: Partial<Placed>) => setPlaced((l) => l.map((x) => (x.uid === uid ? { ...x, ...p } : x)));

  const pct = (e: { clientX: number; clientY: number }) => {
    const r = stage.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
  };
  const onDown = (e: ReactPointerEvent, it: Placed) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const p = pct(e);
    drag.current = { uid: it.uid, dx: p.x - it.x, dy: p.y - it.y };
    setSel(it.uid);
    // bring to front
    setPlaced((l) => [...l.filter((x) => x.uid !== it.uid), it]);
  };
  const onMove = (e: ReactPointerEvent) => {
    if (!drag.current) return;
    const p = pct(e);
    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    patch(drag.current.uid, { x: clamp(p.x - drag.current.dx), y: clamp(p.y - drag.current.dy) });
  };

  const selected = placed.find((p) => p.uid === sel);
  const products = placed.map((p) => CATALOG.find((c) => c.id === p.id)!).filter(Boolean);
  const total = products.reduce((s, p) => s + p.price, 0);
  /* Pieces placed from the cart are already in it: adding the room again would
     only raise their quantities. So the button adds just what is missing, and
     when nothing is, it becomes a way into the cart instead. */
  const inCart = new Set(cartIds);
  const missing = products.filter((p) => !inCart.has(p.id));

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-8">
        <div
          ref={stage}
          data-testid="composer-stage"
          className="relative aspect-[4/3] touch-none select-none overflow-hidden"
          style={{ backgroundColor: TILE }}
          onPointerMove={onMove}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          onPointerDown={() => setSel(null)}
        >
          <img src="/before.png" alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
          {placed.map((it) => {
            const p = CATALOG.find((c) => c.id === it.id)!;
            const on = it.uid === sel;
            return (
              <img
                key={it.uid}
                src={tileImg(p.id, p.img)}
                alt={t(p.name.en, p.name.ar)}
                draggable={false}
                data-testid="composer-item"
                onPointerDown={(e) => onDown(e, it)}
                className="absolute cursor-grab drop-shadow-[0_18px_18px_rgba(0,0,0,0.28)] active:cursor-grabbing"
                style={{
                  left: `${it.x}%`,
                  top: `${it.y}%`,
                  width: `${it.w}%`,
                  transform: 'translate(-50%, -50%)',
                  outline: on ? '1px dashed rgba(23,21,18,0.6)' : 'none',
                  outlineOffset: 6,
                }}
              />
            );
          })}
          <span className={`pointer-events-none absolute start-4 top-4 bg-white/90 px-2.5 py-1 text-[10px] font-semibold ${caps}`}>
            {t('Drag to arrange', 'اسحب للترتيب')}
          </span>
        </div>

        {selected && (
          <div className="mt-3 flex flex-wrap items-center gap-3 border p-3" style={{ borderColor: HAIR }} data-testid="composer-controls">
            <span className="min-w-0 flex-1 truncate text-[13px] font-bold">{t(CATALOG.find((c) => c.id === selected.id)!.name.en, CATALOG.find((c) => c.id === selected.id)!.name.ar)}</span>
            <button type="button" aria-label={t('Smaller', 'أصغر')} onClick={() => patch(selected.uid, { w: Math.max(10, selected.w - 4) })} className="flex h-9 w-9 items-center justify-center border" style={{ borderColor: HAIR }}>
              <Minus size={14} strokeWidth={1.5} />
            </button>
            <button type="button" aria-label={t('Larger', 'أكبر')} onClick={() => patch(selected.uid, { w: Math.min(80, selected.w + 4) })} className="flex h-9 w-9 items-center justify-center border" style={{ borderColor: HAIR }}>
              <Plus size={14} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label={t('Remove', 'إزالة')}
              onClick={() => {
                setPlaced((l) => l.filter((x) => x.uid !== selected.uid));
                setSel(null);
              }}
              className="flex h-9 w-9 items-center justify-center border transition-colors hover:text-[#B03A2E]"
              style={{ borderColor: HAIR }}
            >
              <Trash2 size={14} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      <div className="lg:col-span-4">
        <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('Pieces from', 'القطع من')}</p>

        {/* where the shelf's pieces come from */}
        <div
          role="tablist"
          aria-label={t('Pieces from', 'القطع من')}
          data-testid="composer-source"
          className="mt-3 grid grid-cols-2 border p-1"
          style={{ borderColor: HAIR }}
        >
          {(
            [
              { key: 'wishlist', icon: Heart, label: t('Wishlist', 'المفضلة') },
              { key: 'cart', icon: ShoppingBag, label: t('Cart', 'السلة') },
            ] as const
          ).map(({ key, icon: Icon, label }) => {
            const on = key === source;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={on}
                data-testid={`composer-source-${key}`}
                onClick={() => setSource(key)}
                className="relative flex h-10 items-center justify-center"
              >
                {on && (
                  <motion.span
                    layoutId="composer-source"
                    aria-hidden
                    className="absolute inset-0"
                    style={{ backgroundColor: INK }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 42 }}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center gap-2 text-[12.5px] font-semibold transition-colors duration-200 ${
                    on ? 'text-white' : 'text-[#171512]'
                  }`}
                >
                  <Icon size={15} strokeWidth={1.6} className={on && key === 'wishlist' ? 'fill-current' : ''} />
                  {label}
                  <span dir="ltr" className={`tabular-nums text-[11px] font-medium ${on ? 'text-white/60' : ''}`} style={on ? undefined : { color: MUTED }}>
                    {idsOf(key).length}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {shelf.length ? (
          <ul className="mt-3 grid grid-cols-3 gap-2" data-testid="composer-shelf">
            {shelf.map((p) => {
              const ok = COMPOSABLE.has(p.id);
              const name = t(p.name.en, p.name.ar);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    data-testid="composer-add"
                    data-placeable={ok}
                    disabled={!ok}
                    onClick={() => put(p.id)}
                    title={ok ? name : t(`${p.name.en} — can't be placed in the room yet`, `${p.name.ar} — لا يمكن وضعها في الغرفة بعد`)}
                    className="group relative block aspect-square w-full border transition-colors enabled:hover:border-[#171512] disabled:cursor-not-allowed"
                    style={{ borderColor: HAIR, backgroundColor: TILE }}
                  >
                    <img
                      src={tileImg(p.id, p.img)}
                      alt={name}
                      className={`h-full w-full object-contain p-2 ${ok ? '' : 'opacity-35 grayscale'}`}
                    />
                    {ok && (
                      <span className="absolute end-1 top-1 flex h-5 w-5 items-center justify-center bg-white opacity-0 transition-opacity group-hover:opacity-100">
                        <Plus size={11} strokeWidth={2} />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          /* nothing saved here yet — say so, and say where the pieces come from */
          <div data-testid="composer-empty" className="mt-3 border border-dashed px-5 py-8 text-center" style={{ borderColor: HAIR }}>
            {source === 'wishlist' ? (
              <Heart size={22} strokeWidth={1.3} className="mx-auto" style={{ color: MUTED }} />
            ) : (
              <ShoppingBag size={22} strokeWidth={1.3} className="mx-auto" style={{ color: MUTED }} />
            )}
            <p className="mt-3 text-[13px] font-bold">
              {source === 'wishlist' ? t('Nothing saved yet', 'لا شيء في المفضلة بعد') : t('Your cart is empty', 'سلتك فارغة')}
            </p>
            <p className="mx-auto mt-1.5 max-w-[26ch] text-[12px] leading-relaxed" style={{ color: MUTED }}>
              {source === 'wishlist'
                ? t('Tap the heart on any piece in the shop and it appears here.', 'اضغط القلب على أي قطعة في المتجر لتظهر هنا.')
                : t('Add pieces to your cart to place them in the room.', 'أضف قطعاً إلى سلتك لتضعها في الغرفة.')}
            </p>
            <Link to={searchPath(1)} className={`mt-4 inline-block border-b pb-1 text-[11px] ${caps}`} style={{ borderColor: INK }}>
              {t('Browse the shop', 'تصفّح المتجر')}
            </Link>
          </div>
        )}

        {unplaceable > 0 && (
          <p data-testid="composer-unplaceable" className="mt-2.5 text-[11.5px] leading-relaxed" style={{ color: MUTED }}>
            {isAr
              ? unplaceable === 1
                ? 'قطعة واحدة هنا لا يمكن وضعها في الغرفة بعد.'
                : `${unplaceable} قطع هنا لا يمكن وضعها في الغرفة بعد.`
              : `${unplaceable} ${unplaceable === 1 ? 'piece' : 'pieces'} here can't be placed in the room yet.`}
          </p>
        )}

        <div className="mt-8 border-t pt-6" style={{ borderColor: HAIR }}>
          <div className="flex items-baseline justify-between gap-4">
            <span className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t(`In the room · ${products.length}`, `في الغرفة · ${products.length}`)}</span>
            <span className="font-['Outfit',sans-serif] text-[20px] font-bold tabular-nums">
              {formatSAR(total)} <span className="text-[11px] font-medium" style={{ color: MUTED }}>{t('SAR', 'ر.س')}</span>
            </span>
          </div>
          <button
            type="button"
            data-testid="composer-to-cart"
            disabled={!products.length}
            onClick={() => {
              if (missing.length) {
                missing.forEach((p) => add(p.id));
                toast(t('The room is in your cart.', 'الغرفة في سلتك.'));
              }
              openCart();
            }}
            className={`mt-5 w-full py-4 disabled:opacity-50 ${primaryBtnCls(isAr)}`}
          >
            {products.length && !missing.length
              ? t('Everything is in your cart · View cart', 'كل القطع في سلتك · عرض السلة')
              : t('Add the room to cart', 'أضف الغرفة إلى السلة')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chat                                                                */
/* ------------------------------------------------------------------ */

type Msg = ChatThread['messages'][number];

export function ChatPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const [sp, setSp] = useSearchParams();
  const want = sp.get('with');

  // a provider you have not written to yet gets a fresh thread
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const list = [...CHAT_THREADS];
    const pv = PROVIDERS.find((p) => p.id === want);
    if (want && pv && !list.some((x) => x.id === want)) {
      list.unshift({ id: pv.id, name: pv.name, initials: pv.initials, role: { en: 'Service provider', ar: 'مقدم خدمة' }, messages: [] });
    }
    return list;
  });
  const active = threads.find((x) => x.id === want) ?? (want ? undefined : threads[0]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' });
  }, [active?.messages.length, typing]);

  const push = (id: string, m: Msg) => setThreads((l) => l.map((x) => (x.id === id ? { ...x, messages: [...x.messages, m] } : x)));
  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!active || !draft.trim()) return;
    const text = draft.trim();
    const now = new Date().toTimeString().slice(0, 5);
    push(active.id, { from: 'me', at: now, text: { en: text, ar: text } });
    setDraft('');
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      push(active.id, { from: 'them', at: now, text: { en: 'Thanks — let me check and come right back to you.', ar: 'شكراً لك — دعني أتحقق وأعود إليك حالاً.' } });
    }, 1400);
  };

  const isProvider = active ? PROVIDERS.some((p) => p.id === active.id) : false;
  const open = !!(active && want);

  return (
    <main className="pt-[72px]" data-testid="chat-page">
      {/* a tinted band holds the white panel, so the conversation reads as one object */}
      <div className="md:py-10" style={{ backgroundColor: '#EFEBE3' }}>
        <div className={`${CONTAINER} max-md:!px-0`}>
          <div className={`${open ? 'hidden md:flex' : 'flex'} flex-wrap items-end justify-between gap-4 px-6 pb-6 pt-8 md:px-0 md:pt-0`}>
            <div>
              <p className={`text-[10px] ${caps}`} style={{ color: OLIVE }}>{t('Messages', 'الرسائل')}</p>
              <h1 className={`mt-2 ${displayCls(isAr, 'md')}`}>{t('Conversations', 'المحادثات')}</h1>
              <p className="mt-2 text-[13px] font-light" style={{ color: '#4A443C' }}>
                {t('Support replies within minutes, 9 am – 11 pm.', 'فريق الدعم يرد خلال دقائق، من 9 صباحاً حتى 11 مساءً.')}
              </p>
            </div>
            <Link to={`${lookBase(1)}/help`} className={`border-b pb-1 text-[11px] font-medium ${caps}`} style={{ borderColor: INK }}>
              {t('Help centre', 'مركز المساعدة')}
            </Link>
          </div>

          <div
            className={`grid overflow-hidden bg-white md:grid-cols-[320px_minmax(0,1fr)] md:border md:shadow-[0_24px_60px_rgba(23,21,18,0.08)] ${
              open ? 'h-[calc(100svh-72px)]' : 'min-h-[60svh]'
            } md:h-[calc(100vh-72px-12rem)] md:min-h-[560px]`}
            style={{ borderColor: '#DDD6CA' }}
          >
            {/* threads */}
            <aside className={`${open ? 'hidden md:flex' : 'flex'} min-h-0 flex-col border-e`} style={{ borderColor: HAIR }}>
              <p className={`flex h-[73px] shrink-0 items-center justify-between border-b px-5 text-[11px] font-bold ${caps}`} style={{ borderColor: HAIR }}>
                {t('Inbox', 'البريد')}
                <span className="font-['Outfit',sans-serif] text-[10px] font-medium" style={{ color: MUTED }}>{threads.length}</span>
              </p>
              <ul className="min-h-0 flex-1 overflow-y-auto">
                {threads.map((th) => {
                  const last = th.messages[th.messages.length - 1];
                  const on = th.id === active?.id;
                  return (
                    <li key={th.id}>
                      <button
                        type="button"
                        data-testid="chat-thread"
                        onClick={() => setSp({ with: th.id }, { replace: true })}
                        className="relative flex w-full items-center gap-3 border-b px-5 py-4 text-start transition-colors hover:bg-[#FAF8F3]"
                        style={{ borderColor: HAIR, backgroundColor: on ? TILE : undefined }}
                      >
                        {on && <span aria-hidden className="absolute inset-y-0 start-0 w-[3px] bg-[#171512]" />}
                        <span dir="ltr" className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#171512] font-['Outfit',sans-serif] text-[11px] font-bold text-white">{th.initials}</span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className="truncate text-[13.5px] font-bold">{t(th.name.en, th.name.ar)}</span>
                            {last && <span className="shrink-0 text-[10px]" style={{ color: MUTED }} dir="ltr">{last.at}</span>}
                          </span>
                          <span className="mt-0.5 block text-[10px] font-medium" style={{ color: OLIVE }}>{t(th.role.en, th.role.ar)}</span>
                          <span className="mt-1 block truncate text-[12px]" style={{ color: '#4A443C' }}>
                            {last ? t(last.text.en, last.text.ar) : t('No messages yet', 'لا توجد رسائل بعد')}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* conversation */}
            {active ? (
              <section className={`${want ? 'flex' : 'hidden md:flex'} min-h-0 flex-col`}>
                <header className="flex h-[73px] shrink-0 items-center gap-3 border-b bg-white px-5" style={{ borderColor: HAIR }}>
                  <button type="button" onClick={() => setSp({}, { replace: true })} aria-label={t('Back', 'رجوع')} className="-ms-1 flex h-8 w-8 items-center justify-center md:hidden">
                    <ChevronLeft size={18} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                  </button>
                  <span dir="ltr" className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#171512] font-['Outfit',sans-serif] text-[11px] font-bold text-white">{active.initials}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold">{t(active.name.en, active.name.ar)}</span>
                    <span className="flex items-center gap-1.5 text-[11px]" style={{ color: MUTED }}>
                      <span className="h-1.5 w-1.5" style={{ backgroundColor: OLIVE }} />
                      {t('Online', 'متصل')} · {t(active.role.en, active.role.ar)}
                    </span>
                  </span>
                  {isProvider && (
                    <Link to={`${lookBase(1)}/provider/${active.id}`} className={`hidden shrink-0 border px-4 py-2 text-[10.5px] font-medium transition-colors hover:border-[#171512] sm:block ${caps}`} style={{ borderColor: '#C9C2B4' }}>
                      {t('View profile', 'عرض الملف')}
                    </Link>
                  )}
                </header>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-6 md:px-8" style={{ backgroundColor: TILE }} data-testid="chat-log">
                  <p className="flex items-center gap-3 pb-2 text-[10px]" style={{ color: MUTED }}>
                    <span className="h-px flex-1" style={{ backgroundColor: '#DDD6CA' }} />
                    <span className={caps}>{t('Today', 'اليوم')}</span>
                    <span className="h-px flex-1" style={{ backgroundColor: '#DDD6CA' }} />
                  </p>
                  {active.messages.length === 0 && (
                    <p className="py-10 text-center text-[13px]" style={{ color: '#4A443C' }}>
                      {t('Say hello — they usually reply within the hour.', 'ابدأ المحادثة — يردون عادة خلال ساعة.')}
                    </p>
                  )}
                  {active.messages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[78%] px-4 py-3 text-[13.5px] leading-relaxed md:max-w-[62%] ${
                          m.from === 'me' ? 'bg-[#171512] text-white' : 'border bg-white text-[#171512] shadow-[0_1px_2px_rgba(23,21,18,0.06)]'
                        }`}
                        style={m.from === 'me' ? undefined : { borderColor: '#E2DCD1' }}
                      >
                        {t(m.text.en, m.text.ar)}
                        <span className={`mt-1 block text-[10px] ${m.from === 'me' ? 'text-white/60' : ''}`} style={m.from === 'me' ? undefined : { color: MUTED }} dir="ltr">
                          {m.at}
                        </span>
                      </div>
                    </div>
                  ))}
                  {typing && (
                    <div className="flex justify-start">
                      <span className="flex gap-1 border bg-white px-4 py-3.5" style={{ borderColor: '#E2DCD1' }} data-testid="chat-typing">
                        {[0, 1, 2].map((d) => (
                          <span key={d} className="h-1.5 w-1.5 animate-bounce bg-[#8A8478]" style={{ animationDelay: `${d * 120}ms` }} />
                        ))}
                      </span>
                    </div>
                  )}
                  <div ref={end} />
                </div>
                <form onSubmit={send} className="flex items-center gap-2 border-t bg-white p-3 md:p-4" style={{ borderColor: HAIR }}>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    data-testid="chat-input"
                    placeholder={t('Write a message', 'اكتب رسالة')}
                    aria-label={t('Message', 'الرسالة')}
                    className="h-12 min-w-0 flex-1 border bg-white px-4 text-[13.5px] outline-none placeholder:text-[#8C857A] focus:border-[#171512]"
                    style={{ borderColor: '#C9C2B4' }}
                  />
                  <button type="submit" data-testid="chat-send" aria-label={t('Send', 'إرسال')} className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#171512] text-white transition-colors hover:bg-[#5A6B4D]">
                    <Send size={16} strokeWidth={1.5} className={isAr ? '-scale-x-100' : ''} />
                  </button>
                </form>
              </section>
            ) : (
              <div className="hidden items-center justify-center text-[13px] md:flex" style={{ color: MUTED, backgroundColor: TILE }}>{t('Choose a conversation', 'اختر محادثة')}</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */

export function LoyaltyPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const [tab, setTab] = useState<'all' | 'earned' | 'used'>('all');
  const tier = [...LOYALTY_TIERS].reverse().find((x) => LOYALTY_POINTS >= x.from) ?? LOYALTY_TIERS[0];
  const next = LOYALTY_TIERS.find((x) => x.from > LOYALTY_POINTS);
  const progress = next ? (LOYALTY_POINTS - tier.from) / (next.from - tier.from) : 1;
  const rows = LOYALTY_HISTORY.filter((h) => tab === 'all' || h.kind === tab);

  return (
    <main className="pt-[72px]" data-testid="loyalty-page">
      <div style={{ backgroundColor: NIGHT }}>
        <div className={`${CONTAINER} grid gap-10 py-14 md:py-20 lg:grid-cols-12`}>
          <div className="lg:col-span-7">
            <p className={`text-[11px] ${caps}`} style={{ color: OLIVE_LT }}>{t(LOYALTY.eyebrow.en, LOYALTY.eyebrow.ar)}</p>
            <h1 className={`mt-4 text-white ${displayCls(isAr, 'xl')}`}>{t(LOYALTY.title.en, LOYALTY.title.ar)}</h1>
            <p className="mt-5 max-w-lg text-[15px] font-light leading-relaxed text-white/70">{t(LOYALTY.body.en, LOYALTY.body.ar)}</p>
          </div>
          <div className="border p-7 lg:col-span-5" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
            <p className={`text-[10px] ${caps}`} style={{ color: 'rgba(246,243,236,0.6)' }}>{t('Your balance', 'رصيدك')}</p>
            <p className="mt-2 font-['Outfit',sans-serif] text-[52px] font-bold leading-none tabular-nums text-white" data-testid="loyalty-points">{formatSAR(LOYALTY_POINTS)}</p>
            <p className="mt-2 text-[13px] text-white/70">
              {t(`${tier.name.en} member · worth ${formatSAR(LOYALTY_POINTS / 10)} SAR`, `عضو ${tier.name.ar} · بقيمة ${formatSAR(LOYALTY_POINTS / 10)} ر.س`)}
            </p>
            {next && (
              <>
                <div className="mt-6 h-1 w-full bg-white/15">
                  <div className="h-full" style={{ width: `${progress * 100}%`, backgroundColor: OLIVE_LT }} />
                </div>
                <p className="mt-2 text-[11px] text-white/60">
                  {t(`${formatSAR(next.from - LOYALTY_POINTS)} points to ${next.name.en}`, `${formatSAR(next.from - LOYALTY_POINTS)} نقطة للمستوى ${next.name.ar}`)}
                </p>
              </>
            )}
            <Link to={searchPath(1)} className={`mt-7 block py-4 text-center ${primaryBtnCls(isAr)} !bg-white !text-[#171512] hover:!bg-[#5A6B4D] hover:!text-white`}>
              {t('Spend at checkout', 'استخدمها عند الدفع')}
            </Link>
          </div>
        </div>
      </div>

      <section className={`${CONTAINER} py-14 md:py-16`}>
        <ul className="grid gap-8 sm:grid-cols-3">
          {LOYALTY.perks.map((pk) => (
            <li key={pk.title.en}>
              <pk.icon size={20} strokeWidth={1.4} style={{ color: OLIVE }} />
              <p className="mt-4 text-[15px] font-bold">{t(pk.title.en, pk.title.ar)}</p>
              <p className="mt-2 text-[13px] font-light leading-relaxed" style={{ color: '#4A443C' }}>{t(pk.body.en, pk.body.ar)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t py-14 md:py-16" style={{ borderColor: HAIR }}>
        <div className={CONTAINER}>
          <div className="lg:max-w-4xl">
          <Tabs
            testId="loyalty-tabs"
            value={tab}
            onChange={setTab}
            items={[
              { key: 'all', label: t('All', 'الكل') },
              { key: 'earned', label: t('Earned', 'المكتسبة') },
              { key: 'used', label: t('Used', 'المستخدمة') },
            ]}
          />
          <ul className="mt-2">
            {rows.map((h) => (
              <li key={h.label.en + h.date.en} className="flex items-center justify-between gap-4 border-b py-4" style={{ borderColor: HAIR }} data-testid="loyalty-row">
                <span>
                  <span className="block text-[14px] font-medium">{t(h.label.en, h.label.ar)}</span>
                  <span className="mt-0.5 block text-[11px]" style={{ color: MUTED }}>{t(h.date.en, h.date.ar)}</span>
                </span>
                <span className="font-['Outfit',sans-serif] text-[15px] font-bold tabular-nums" dir="ltr" style={{ color: h.points > 0 ? OLIVE : '#B03A2E' }}>
                  {h.points > 0 ? '+' : ''}
                  {formatSAR(h.points)}
                </span>
              </li>
            ))}
          </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Journal                                                             */
/* ------------------------------------------------------------------ */

export function BlogIndexPage() {
  const { lang, t } = useLook();
  const caps = capsCls(lang === 'ar');
  return (
    <main className="pt-[72px]" data-testid="blog-index">
      <PageHead crumbs={[home(t), { label: t('Journal', 'المدونة') }]} eyebrow={t('Journal', 'المدونة')} title={t('Notes on living well', 'ملاحظات عن العيش الجميل')} />
      <div className={`${CONTAINER} grid gap-x-6 gap-y-14 py-12 md:grid-cols-2 md:py-16 lg:grid-cols-3`}>
        {BLOG_POSTS.map((p, i) => (
          <article key={p.title.en} className={i === 0 ? 'md:col-span-2 lg:col-span-3 lg:grid lg:grid-cols-12 lg:items-end lg:gap-12' : ''}>
            <Link to={`${lookBase(1)}/blog/${postSlug(p)}`} className={`group block overflow-hidden ${i === 0 ? 'lg:col-span-8' : ''}`} data-testid="blog-card">
              <img src={p.img} alt="" loading="lazy" className={`w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04] ${i === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`} />
            </Link>
            <div className={i === 0 ? 'lg:col-span-4' : ''}>
              <p className={`mt-5 text-[10px] ${caps}`} style={{ color: OLIVE }}>{t(p.category.en, p.category.ar)} · {t(`${p.readMins} min`, `${p.readMins} د`)}</p>
              <h2 className={`mt-3 font-bold leading-snug ${i === 0 ? 'text-[26px] md:text-[32px]' : 'text-[20px]'}`}>
                <Link to={`${lookBase(1)}/blog/${postSlug(p)}`} className="decoration-[#5A6B4D] underline-offset-[6px] hover:underline">{t(p.title.en, p.title.ar)}</Link>
              </h2>
              <p className="mt-3 text-[14px] font-light leading-relaxed" style={{ color: '#4A443C' }}>{t(p.excerpt.en, p.excerpt.ar)}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export function ArticlePage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const { slug = '' } = useParams();
  const post = postBySlug(slug);
  if (!post) return <NotFoundPage />;
  const more = BLOG_POSTS.filter((p) => p !== post).slice(0, 3);

  return (
    <main className="pt-[72px]" data-testid="article-page">
      <PageHead
        crumbs={[home(t), { label: t('Journal', 'المدونة'), to: `${lookBase(1)}/blog` }, { label: t(post.category.en, post.category.ar) }]}
        eyebrow={`${t(post.category.en, post.category.ar)} · ${t(`${post.readMins} min read`, `قراءة ${post.readMins} دقائق`)}`}
        title={t(post.title.en, post.title.ar)}
        intro={t(post.excerpt.en, post.excerpt.ar)}
      />
      <div className={`${CONTAINER} pt-10`}>
        <img src={post.img} alt="" className="aspect-[21/9] w-full object-cover" />
      </div>
      <article className="mx-auto max-w-[720px] px-6 py-12 md:py-16">
        {ARTICLE_BODY.map((b, i) => (
          <div key={i} className={i ? 'mt-8' : ''}>
            {b.heading && <h2 className="mb-3 text-[22px] font-bold leading-snug">{t(b.heading.en, b.heading.ar)}</h2>}
            <p className={`font-light leading-[1.85] ${i === 0 ? 'text-[19px]' : 'text-[16px]'}`} style={{ color: i === 0 ? INK : '#3F3A33' }}>{t(b.text.en, b.text.ar)}</p>
          </div>
        ))}
        <div className="mt-12 flex flex-wrap items-center gap-6 border-t pt-8" style={{ borderColor: HAIR }}>
          <Link to={searchPath(1, { category: 'lighting' })} className={`px-8 py-4 ${primaryBtnCls(isAr)}`}>{t('Shop the edit', 'تسوّق المختارات')}</Link>
          <Link to={`${lookBase(1)}/blog`} className={`text-[11px] font-medium ${caps}`} style={{ color: MUTED }}>{t('All articles', 'كل المقالات')}</Link>
        </div>
      </article>
      <section className="border-t py-12 md:py-16" style={{ borderColor: HAIR }}>
        <div className={CONTAINER}>
          <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('Keep reading', 'تابع القراءة')}</p>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {more.map((p) => (
              <li key={p.title.en}>
                <Link to={`${lookBase(1)}/blog/${postSlug(p)}`} className="group block">
                  <img src={p.img} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <p className="mt-4 text-[16px] font-bold leading-snug group-hover:text-[#5A6B4D]">{t(p.title.en, p.title.ar)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Review index — every page and overlay in Look 1                     */
/* ------------------------------------------------------------------ */

export function PagesIndex() {
  const { lang, t } = useLook();
  const caps = capsCls(lang === 'ar');
  const shell = useShell();
  const b = lookBase(1);
  const groups: { title: string; items: { label: string; to?: string; run?: () => void }[] }[] = [
    {
      title: t('Shop', 'التسوق'),
      items: [
        { label: t('Home', 'الرئيسية'), to: b },
        { label: t('Search — all tabs', 'البحث — كل التبويبات'), to: searchPath(1) },
        { label: t('Search — stores', 'البحث — المتاجر'), to: `${searchPath(1)}?tab=stores` },
        { label: t('Product', 'المنتج'), to: productPath(1, 1) },
        { label: t('Store', 'المتجر'), to: `${b}/store/bk` },
        { label: t('Store — reviews', 'المتجر — التقييمات'), to: `${b}/store/bk?tab=reviews` },
        { label: t('Wishlist page', 'صفحة المفضلة'), to: `${b}/wishlist` },
        { label: t('Checkout', 'الدفع'), to: `${b}/checkout` },
      ],
    },
    {
      title: t('Account', 'الحساب'),
      items: [
        { label: t('Orders & tracking', 'الطلبات والتتبع'), to: `${b}/account/orders` },
        { label: t('Service requests', 'طلبات الخدمات'), to: `${b}/account/requests` },
        { label: t('Reviews', 'التقييمات'), to: `${b}/account/reviews` },
        { label: t('Notifications', 'الإشعارات'), to: `${b}/account/notifications` },
        { label: t('Details', 'البيانات'), to: `${b}/account/details` },
        { label: t('Addresses', 'العناوين'), to: `${b}/account/addresses` },
        { label: t('Security', 'الأمان'), to: `${b}/account/security` },
        { label: t('Language', 'اللغة'), to: `${b}/account/language` },
        { label: t('Alerts', 'التنبيهات'), to: `${b}/account/settings` },
        { label: t('Rewards', 'نقاط الولاء'), to: `${b}/loyalty` },
        { label: t('Chat', 'المحادثات'), to: `${b}/chat` },
      ],
    },
    {
      title: t('Services & business', 'الخدمات والشركات'),
      items: [
        { label: t('All services', 'كل الخدمات'), to: `${b}/services` },
        { label: t('A service', 'خدمة'), to: `${b}/service/interior-design` },
        { label: t('A provider', 'مقدم خدمة'), to: `${b}/provider/${PROVIDERS[0].id}` },
        { label: 'B2B', to: `${b}/b2b` },
        { label: t('A fit-out company', 'شركة تجهيز'), to: `${b}/b2b/${COMPANIES[0].id}` },
        { label: t('Projects', 'المشاريع'), to: `${b}/projects` },
        { label: t('AI designer — restyle', 'المصمم الذكي — إعادة التصميم'), to: `${b}/ai-designer` },
        { label: t('AI designer — compose', 'المصمم الذكي — التركيب'), to: `${b}/ai-designer?mode=compose` },
      ],
    },
    {
      title: t('Company & help', 'الشركة والمساعدة'),
      items: [
        { label: t('About', 'من نحن'), to: `${b}/about` },
        { label: t('Contact', 'اتصل بنا'), to: `${b}/contact` },
        { label: t('Journal', 'المدونة'), to: `${b}/blog` },
        { label: t('Article', 'مقال'), to: `${b}/blog/${postSlug(BLOG_POSTS[0])}` },
        ...HELP_TOPICS.map((h) => ({ label: t(h.title.en, h.title.ar), to: `${b}/help/${h.key}` })),
        { label: t('404', '404'), to: `${b}/no-such-page` },
      ],
    },
    {
      title: t('Overlays', 'النوافذ'),
      items: [
        { label: t('Cart', 'السلة'), run: shell.openCart },
        { label: t('Wishlist', 'المفضلة'), run: shell.openWishlist },
        { label: t('Sign in', 'تسجيل الدخول'), run: () => shell.openAuth() },
        { label: t('Register as a store', 'التسجيل كتاجر'), run: () => shell.openAuth({ view: 'up', role: 'store' }) },
        { label: t('Request a service', 'طلب خدمة'), run: () => shell.openService() },
        { label: t('Search by photo', 'البحث بالصورة'), run: shell.openImageSearch },
        {
          label: t('Home promo pop-up', 'نافذة العرض في الرئيسية'),
          run: () => {
            try {
              sessionStorage.removeItem('diyar-look1-promo');
            } catch {
              /* storage blocked — the pop-up simply shows */
            }
            window.location.assign(b);
          },
        },
      ],
    },
  ];

  return (
    <main className="pt-[72px]" data-testid="pages-index">
      <PageHead crumbs={[home(t), { label: t('All pages', 'كل الصفحات') }]} eyebrow={t('For review', 'للمراجعة')} title={t('Every page in this design', 'كل صفحات هذا التصميم')} />
      <div className={`${CONTAINER} grid gap-10 py-12 md:grid-cols-2 md:py-16 lg:grid-cols-3`}>
        {groups.map((g) => (
          <section key={g.title}>
            <p className={`border-b pb-3 text-[11px] font-bold ${caps}`} style={{ borderColor: INK }}>{g.title}</p>
            <ul>
              {g.items.map((it) => {
                const cls = 'flex w-full items-center justify-between gap-4 border-b py-3.5 text-start text-[14px] font-medium transition-colors hover:text-[#5A6B4D]';
                const arrow = <ArrowRight size={13} strokeWidth={1.5} className={lang === 'ar' ? 'rotate-180' : ''} style={{ color: MUTED }} />;
                return (
                  <li key={it.label}>
                    {it.to ? (
                      <Link to={it.to} className={cls} style={{ borderColor: HAIR }}>{it.label}{arrow}</Link>
                    ) : (
                      <button type="button" onClick={it.run} className={cls} style={{ borderColor: HAIR }}>{it.label}{arrow}</button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
