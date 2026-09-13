/** Look 1 — the cart drawer. */
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { formatSAR, lookBase, productPath, searchPath, storeOf } from '../lookShared';
import { HAIR, INK, OLIVE, TILE, primaryBtnCls, useLook } from './ui';
import { Sheet } from './Sheet';
import { useLookCart } from './cart';

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { items, count, subtotal, setQty, remove } = useLookCart();
  const navigate = useNavigate();
  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]';

  const checkout = () => {
    onClose();
    navigate(`${lookBase(1)}/checkout`);
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      side="end"
      testId="cart-sheet"
      eyebrow={t('Your Bag', 'حقيبتك')}
      title={count ? t(`Cart · ${count}`, `السلة · ${count}`) : t('Cart', 'السلة')}
      footer={
        items.length > 0 ? (
          <div>
            <div className="flex items-baseline justify-between">
              <span className={`text-[11px] text-neutral-500 ${caps}`}>{t('Subtotal', 'المجموع')}</span>
              <span className="font-['Outfit',sans-serif] text-[20px] font-bold" style={{ color: INK }}>
                {formatSAR(subtotal)} <span className="text-[11px] font-medium text-neutral-500">{t('SAR', 'ر.س')}</span>
              </span>
            </div>
            <p className="mt-1.5 text-[11px] font-light text-neutral-500">
              {t('Shipping and VAT calculated at checkout.', 'الشحن والضريبة تُحسب عند إتمام الطلب.')}
            </p>
            <button
              type="button"
              onClick={checkout}
              data-testid="cart-checkout"
              className={`mt-4 w-full py-4 ${primaryBtnCls(isAr)}`}
            >
              {t('Checkout', 'إتمام الطلب')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`mt-3 w-full text-[11px] text-neutral-500 underline-offset-4 transition-colors hover:text-[#171512] hover:underline ${caps}`}
            >
              {t('Continue Shopping', 'مواصلة التسوق')}
            </button>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className={`text-[11px] text-neutral-400 ${caps}`}>{t('Empty', 'فارغة')}</p>
          <p className="mt-3 text-[15px] font-light text-neutral-600">
            {t('Nothing in your cart yet.', 'لا توجد منتجات في سلتك بعد.')}
          </p>
          <Link
            to={searchPath(1)}
            onClick={onClose}
            className={`mt-8 inline-block px-10 py-4 ${primaryBtnCls(isAr)}`}
          >
            {t('Browse the Catalogue', 'تصفّح الكتالوج')}
          </Link>
        </div>
      ) : (
        <ul className="divide-y" style={{ borderColor: HAIR }}>
          {items.map((line) => {
            const name = t(line.product.name.en, line.product.name.ar);
            const store = storeOf(line.product.store);
            const colour = line.product.colors.find((c) => c.name.en === line.colorKey);
            return (
              <li key={line.uid} data-testid="cart-line" className="flex gap-4 px-6 py-5">
                <Link to={productPath(1, line.product.id)} onClick={onClose} className="shrink-0">
                  <img
                    src={line.product.img}
                    alt=""
                    className="h-[92px] w-[76px] object-cover"
                    style={{ backgroundColor: TILE }}
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    to={productPath(1, line.product.id)}
                    onClick={onClose}
                    className="text-[13px] font-bold leading-snug transition-colors hover:text-[#5A6B4D]"
                  >
                    {name}
                  </Link>
                  <p className="mt-1 text-[11px] font-light text-neutral-500">{t(store.name.en, store.name.ar)}</p>
                  {colour && (
                    <p className="mt-0.5 text-[11px] font-light text-neutral-500">
                      {t('Colour', 'اللون')}: {t(colour.name.en, colour.name.ar)}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <div className="flex items-center border" style={{ borderColor: HAIR }}>
                      <button
                        type="button"
                        onClick={() => setQty(line.uid, -1)}
                        aria-label={t('Decrease quantity', 'إنقاص الكمية')}
                        className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-[#F6F3EC]"
                      >
                        <Minus size={13} strokeWidth={1.5} />
                      </button>
                      <span className="w-8 text-center font-['Outfit',sans-serif] text-[12px] font-semibold tabular-nums">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(line.uid, 1)}
                        aria-label={t('Increase quantity', 'زيادة الكمية')}
                        className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-[#F6F3EC]"
                      >
                        <Plus size={13} strokeWidth={1.5} />
                      </button>
                    </div>

                    <span className="font-['Outfit',sans-serif] text-[14px] font-bold tabular-nums" style={{ color: INK }}>
                      {formatSAR(line.lineTotal)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => remove(line.uid)}
                  data-testid="cart-remove"
                  aria-label={t(`Remove ${name}`, `إزالة ${name}`)}
                  className="h-8 w-8 shrink-0 text-neutral-400 transition-colors hover:text-[#B03A2E]"
                >
                  <Trash2 size={15} strokeWidth={1.5} />
                </button>
              </li>
            );
          })}

          <li className="px-6 py-5">
            <Link
              to={searchPath(1)}
              onClick={onClose}
              className={`inline-flex items-center gap-2.5 border-b pb-1.5 text-[11px] font-medium transition-colors hover:text-[#5A6B4D] ${caps}`}
              style={{ borderColor: OLIVE }}
            >
              {t('Add More', 'أضف المزيد')}
              <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
            </Link>
          </li>
        </ul>
      )}
    </Sheet>
  );
}
