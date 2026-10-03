/**
 * A design sent by a Diyar designer, as the client sees it in the chat: their
 * own room with the pieces numbered on it, each one a link to its product page
 * (the client's note: «المصمم يرسل صورة عليها منتجات بروابطها للعميل»).
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingBag } from 'lucide-react';
import { CATALOG, formatSAR, productPath } from '../lookShared';
import { productImg, type SentDesign } from '../../dashboard/designerData';
import { HAIR, INK, MUTED, OLIVE, TILE, tileImg, useLook } from './ui';
import { useShell } from './shellContext';

export function ChatDesign({ design }: { design: SentDesign }) {
  const { lang, t } = useLook();
  const { addToCart, toast } = useShell();
  const [active, setActive] = useState<number | null>(null);
  const items = design.pins.flatMap((p) => {
    const pr = CATALOG.find((x) => x.id === p.productId);
    return pr ? [{ pin: p, pr }] : [];
  });
  const total = items.reduce((n, x) => n + x.pr.price, 0);

  const addAll = () => {
    for (const x of items) addToCart(x.pr.id, x.pr.name[lang]);
    toast(t(`${items.length} pieces added to your cart`, `أضيفت ${items.length} قطع إلى سلتك`));
  };

  return (
    <div data-testid="chat-design" className="mb-1 bg-white text-[#171512]">
      <div className="relative select-none overflow-hidden" dir="ltr" style={{ backgroundColor: TILE }}>
        <img src={design.image} alt={t('Your room, designed', 'غرفتك بعد التصميم')} className="block w-full" draggable={false} />
        {!design.rendered &&
          items.map(({ pin }, i) =>
            pin.w ? (
              <img
                key={`c${i}`}
                src={productImg(pin.productId)}
                alt=""
                draggable={false}
                className="pointer-events-none absolute drop-shadow-[0_14px_14px_rgba(0,0,0,0.3)]"
                style={{ left: `${pin.x}%`, top: `${pin.y}%`, width: `${pin.w}%`, transform: 'translate(-50%, -50%)' }}
              />
            ) : null,
          )}
        {items.map(({ pin, pr }, i) => (
          <Link
            key={`p${i}`}
            to={productPath(1, pr.id)}
            data-testid="chat-design-pin"
            aria-label={pr.name[lang]}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white font-['Outfit',sans-serif] text-[12px] font-semibold text-white shadow-lg transition-transform ${active === i ? 'scale-125' : ''}`}
              style={{ backgroundColor: active === i ? OLIVE : INK }}
            >
              {i + 1}
            </span>
          </Link>
        ))}
      </div>

      <ul>
        {items.map(({ pr }, i) => (
          <li
            key={pr.id}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className="flex items-center gap-3 border-b px-2 py-2.5"
            style={{ borderColor: HAIR, backgroundColor: active === i ? TILE : undefined }}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-['Outfit',sans-serif] text-[11px] font-semibold text-white" style={{ backgroundColor: INK }}>
              {i + 1}
            </span>
            <Link to={productPath(1, pr.id)} data-testid="chat-design-product" className="flex min-w-0 flex-1 items-center gap-3">
              <img src={tileImg(pr.id, pr.img)} alt="" className="h-12 w-12 shrink-0 object-contain" style={{ backgroundColor: TILE }} />
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-bold">{pr.name[lang]}</span>
                <span className="mt-0.5 block font-['Outfit',sans-serif] text-[12.5px] tabular-nums">
                  {formatSAR(pr.price)} <span style={{ color: MUTED }}>{t('SAR', 'ر.س')}</span>
                </span>
              </span>
            </Link>
            <button
              type="button"
              data-testid="chat-design-add"
              aria-label={t('Add to cart', 'أضف إلى السلة')}
              onClick={() => addToCart(pr.id, pr.name[lang])}
              className="flex h-9 w-9 shrink-0 items-center justify-center border transition-colors hover:bg-[#171512] hover:text-white"
              style={{ borderColor: HAIR }}
            >
              <Plus size={16} strokeWidth={1.8} />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-3 px-2 py-3">
        <span className="text-[13px]" style={{ color: MUTED }}>
          {t('Total', 'الإجمالي')}{' '}
          <span className="font-['Outfit',sans-serif] text-[15px] font-semibold tabular-nums text-[#171512]">{formatSAR(total)}</span> {t('SAR', 'ر.س')}
        </span>
        <button type="button" data-testid="chat-design-add-all" onClick={addAll} className="flex h-10 items-center gap-2 bg-[#171512] px-4 text-[13.5px] font-bold text-white transition-opacity hover:opacity-85">
          <ShoppingBag size={15} strokeWidth={1.8} />
          {t('Add all to cart', 'أضف الكل إلى السلة')}
        </button>
      </div>
    </div>
  );
}
