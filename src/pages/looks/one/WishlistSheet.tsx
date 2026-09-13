/** Look 1 — saved items drawer. */
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { CATALOG, formatSAR, productPath, searchPath, storeOf } from '../lookShared';
import { HAIR, INK, TILE, primaryBtnCls, useLook } from './ui';
import { Sheet } from './Sheet';
import { useLookCart } from './cart';
import { useWishlist } from '../../../context/WishlistContext';

export function WishlistSheet({ open, onClose, onAdded }: { open: boolean; onClose: () => void; onAdded: (name: string) => void }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { ids, remove, count } = useWishlist();
  const { add } = useLookCart();
  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]';
  const items = ids.flatMap((id) => CATALOG.filter((p) => p.id === id));

  return (
    <Sheet
      open={open}
      onClose={onClose}
      side="end"
      testId="wishlist-sheet"
      eyebrow={t('Saved', 'المحفوظات')}
      title={count ? t(`Wishlist · ${count}`, `المفضلة · ${count}`) : t('Wishlist', 'المفضلة')}
    >
      {items.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className={`text-[11px] text-neutral-400 ${caps}`}>{t('Empty', 'فارغة')}</p>
          <p className="mt-3 text-[15px] font-light text-neutral-600">
            {t('Tap the heart on a product to save it here.', 'اضغط القلب على أي منتج ليُحفظ هنا.')}
          </p>
          <Link to={searchPath(1)} onClick={onClose} className={`mt-8 inline-block px-10 py-4 ${primaryBtnCls(isAr)}`}>
            {t('Browse the Catalogue', 'تصفّح الكتالوج')}
          </Link>
        </div>
      ) : (
        <ul className="divide-y" style={{ borderColor: HAIR }}>
          {items.map((p) => {
            const name = t(p.name.en, p.name.ar);
            const store = storeOf(p.store);
            return (
              <li key={p.id} data-testid="wishlist-line" className="flex gap-4 px-6 py-5">
                <Link to={productPath(1, p.id)} onClick={onClose} className="shrink-0">
                  <img src={p.img} alt="" className="h-[92px] w-[76px] object-cover" style={{ backgroundColor: TILE }} />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    to={productPath(1, p.id)}
                    onClick={onClose}
                    className="text-[13px] font-bold leading-snug transition-colors hover:text-[#5A6B4D]"
                  >
                    {name}
                  </Link>
                  <p className="mt-1 text-[11px] font-light text-neutral-500">{t(store.name.en, store.name.ar)}</p>
                  <span className="mt-1 font-['Outfit',sans-serif] text-[14px] font-bold tabular-nums" style={{ color: INK }}>
                    {formatSAR(p.price)}
                  </span>

                  <button
                    type="button"
                    data-testid="wishlist-move"
                    onClick={() => {
                      add(p.id);
                      remove(p.id);
                      onAdded(name);
                    }}
                    className={`mt-3 self-start border-b pb-1 text-[11px] font-medium transition-colors hover:text-[#5A6B4D] ${caps}`}
                    style={{ borderColor: INK }}
                  >
                    {t('Move to Cart', 'نقل إلى السلة')}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  aria-label={t(`Remove ${name}`, `إزالة ${name}`)}
                  className="h-8 w-8 shrink-0 text-neutral-400 transition-colors hover:text-[#B03A2E]"
                >
                  <Trash2 size={15} strokeWidth={1.5} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Sheet>
  );
}
