import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Saved items, kept by product id.
 *
 * The cart holds denormalised lines because a cart line is a decision (this
 * colour, this quantity); a wishlist is just a set of products, so ids are
 * enough and the catalogue stays the single source of truth for price and name.
 */
type WishlistCtx = {
  ids: number[];
  has: (id: number) => boolean;
  toggle: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  count: number;
};

const WishlistContext = createContext<WishlistCtx | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);

  const toggle = useCallback((id: number) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  }, []);
  const remove = useCallback((id: number) => setIds((prev) => prev.filter((x) => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<WishlistCtx>(
    () => ({ ids, has: (id) => ids.includes(id), toggle, remove, clear, count: ids.length }),
    [ids, toggle, remove, clear],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistCtx {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
