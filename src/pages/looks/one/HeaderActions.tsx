/**
 * The header's account / saved / cart controls, and the same three as rows in
 * the mobile drawer. They live here rather than inline in the layout because
 * they read the shell (cart, saved items, overlays), which the layout itself
 * provides — a component cannot consume the context it renders.
 */
import { Link } from 'react-router-dom';
import { User, Heart, ShoppingBag, Camera } from 'lucide-react';
import { lookBase } from '../lookShared';
import { OLIVE, useLook } from './ui';
import { useShell } from './shell';
import { useLookCart } from './cart';
import { useWishlist } from '../../../context/WishlistContext';

/** Small olive count badge; nothing is shown at zero. */
function Badge({ n, className }: { n: number; className: string }) {
  if (!n) return null;
  return (
    <span
      className={`flex items-center justify-center rounded-full text-[8px] font-semibold text-white ${className}`}
      style={{ backgroundColor: OLIVE }}
    >
      {n > 9 ? '9+' : n}
    </span>
  );
}

export function HeaderActions({ iconBtnCls }: { iconBtnCls: string }) {
  const { t } = useLook();
  const { openCart, openWishlist } = useShell();
  const { count } = useLookCart();
  const { count: saved } = useWishlist();

  return (
    <>
      {/* account & wishlist live in the drawer below lg — the mobile bar
          stays down to logo · cart · hamburger */}
      <Link
        to={`${lookBase(1)}/account`}
        data-testid="header-account"
        aria-label={t('Account', 'الحساب')}
        className={`hidden lg:block ${iconBtnCls}`}
      >
        <User size={20} strokeWidth={1.25} />
      </Link>
      <button
        type="button"
        onClick={openWishlist}
        data-testid="header-wishlist"
        aria-label={t('Wishlist', 'المفضلة')}
        className={`relative hidden lg:block ${iconBtnCls}`}
      >
        <Heart size={20} strokeWidth={1.25} />
        <Badge n={saved} className="absolute -end-1.5 -top-1 h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={openCart}
        data-testid="header-cart"
        aria-label={t('Cart', 'السلة')}
        className={`relative ${iconBtnCls}`}
      >
        <ShoppingBag size={20} strokeWidth={1.25} />
        <Badge n={count} className="absolute -end-1.5 -top-1 h-3.5 w-3.5" />
      </button>
    </>
  );
}

export function DrawerAccountRows({ rowCls, onNavigate }: { rowCls: string; onNavigate: () => void }) {
  const { t } = useLook();
  const { openCart, openWishlist } = useShell();
  const { count } = useLookCart();
  const { count: saved } = useWishlist();

  return (
    <ul className="border-t py-2" style={{ borderColor: '#E8E4DC' }}>
      <li>
        <Link to={`${lookBase(1)}/account`} onClick={onNavigate} className={rowCls}>
          <User size={18} strokeWidth={1.25} style={{ color: OLIVE }} />
          {t('Account', 'الحساب')}
        </Link>
      </li>
      <li>
        <button
          type="button"
          onClick={() => {
            onNavigate();
            openWishlist();
          }}
          className={rowCls}
        >
          <Heart size={18} strokeWidth={1.25} style={{ color: OLIVE }} />
          {t('Wishlist', 'المفضلة')}
          <Badge n={saved} className="ms-auto h-4 w-4" />
        </button>
      </li>
      <li>
        <button
          type="button"
          data-testid="drawer-cart"
          onClick={() => {
            onNavigate();
            openCart();
          }}
          className={rowCls}
        >
          <ShoppingBag size={18} strokeWidth={1.25} style={{ color: OLIVE }} />
          {t('Cart', 'السلة')}
          <Badge n={count} className="ms-auto h-4 w-4" />
        </button>
      </li>
    </ul>
  );
}

/** The camera in the search field — opens search-by-photo. */
export function ImageSearchButton({ className }: { className: string }) {
  const { t } = useLook();
  const { openImageSearch } = useShell();
  return (
    <button
      type="button"
      data-testid="image-search-trigger"
      onClick={openImageSearch}
      aria-label={t('Search by photo', 'البحث بالصورة')}
      className={className}
    >
      <Camera size={15} strokeWidth={1.5} />
    </button>
  );
}
