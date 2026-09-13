/**
 * Look 1's shell: the state every page and the header share — cart, saved
 * items, the overlays they open, and the confirmation line that follows an
 * action ("added to cart").
 *
 * Pages call useShell() rather than owning overlay state, so a product card, a
 * hotspot and the header all open the same cart drawer.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import { HAIR, useLook } from './ui';
import { LookCartProvider, useLookCart } from './cart';
import { WishlistProvider } from '../../../context/WishlistContext';
import { ShellContext, type ShellApi } from './shellContext';

export { useShell } from './shellContext';
import { CartSheet } from './CartSheet';
import { WishlistSheet } from './WishlistSheet';
import { RequestServiceSheet } from './RequestServiceSheet';
import { AuthSheet } from './AuthSheet';
import { ImageSearchSheet } from './ImageSearchSheet';

export function LookShell({ children }: { children: React.ReactNode }) {
  return (
    <LookCartProvider>
      <WishlistProvider>
        <ShellInner>{children}</ShellInner>
      </WishlistProvider>
    </LookCartProvider>
  );
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [service, setService] = useState<{ open: boolean; name?: string }>({ open: false });
  const [auth, setAuth] = useState(false);
  const [imageSearch, setImageSearch] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [note, setNote] = useState<{ id: number; message: string } | null>(null);
  const { add } = useLookCart();

  const toast = useCallback((message: string) => {
    setNote({ id: Date.now(), message });
    window.setTimeout(() => setNote((n) => (n && Date.now() - n.id >= 2400 ? null : n)), 2600);
  }, []);

  const value = useMemo<ShellApi>(
    () => ({
      openCart: () => setCart(true),
      openWishlist: () => setWishlist(true),
      openService: (name?: string) => setService({ open: true, name }),
      openAuth: () => setAuth(true),
      openImageSearch: () => setImageSearch(true),
      user,
      signIn: (name: string) => setUser(name),
      signOut: () => setUser(null),
      addToCart: (productId, name, opts) => {
        add(productId, opts);
        toast(name);
      },
      toast,
    }),
    [add, toast, user],
  );

  return (
    <ShellContext.Provider value={value}>
      {children}
      <CartSheet open={cart} onClose={() => setCart(false)} />
      <WishlistSheet open={wishlist} onClose={() => setWishlist(false)} onAdded={(name) => toast(name)} />
      <RequestServiceSheet open={service.open} onClose={() => setService({ open: false })} service={service.name} />
      <AuthSheet open={auth} onClose={() => setAuth(false)} onSignIn={(name) => setUser(name)} />
      <ImageSearchSheet open={imageSearch} onClose={() => setImageSearch(false)} />
      <Toast note={note} onOpenCart={() => setCart(true)} />
    </ShellContext.Provider>
  );
}

/** The line that confirms an action, with the one link worth offering after it. */
function Toast({ note, onOpenCart }: { note: { id: number; message: string } | null; onOpenCart: () => void }) {
  const { t } = useLook();
  return (
    <AnimatePresence>
      {note && (
        <motion.div
          key={note.id}
          role="status"
          aria-live="polite"
          data-testid="shell-toast"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-6 z-[75] mx-auto flex max-w-[440px] items-center gap-3 border bg-[#FDFCF9] px-5 py-4 shadow-[0_20px_50px_rgba(23,21,18,0.18)]"
          style={{ borderColor: HAIR }}
        >
          <Check size={16} strokeWidth={1.5} className="shrink-0" style={{ color: '#5A6B4D' }} />
          <p className="min-w-0 flex-1 truncate text-[12px] font-medium">{note.message}</p>
          <button
            type="button"
            onClick={onOpenCart}
            className="shrink-0 border-b border-[#171512] pb-0.5 text-[11px] font-medium transition-colors hover:text-[#5A6B4D]"
          >
            {t('View Cart', 'عرض السلة')}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
