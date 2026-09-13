/**
 * Look 1's cart.
 *
 * The original site's CartContext stores denormalised Arabic strings, which
 * would print Arabic product names in the English view — the one rule this look
 * does not break. Here a line is just a catalogue id, a colour and a quantity;
 * names, prices and images are read from CATALOG at render time, so every line
 * follows the active language.
 */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CATALOG, type CatalogProduct } from '../lookShared';

export interface CartLine {
  uid: string;
  productId: number;
  /** the colour's English name — CatalogColor has no id of its own */
  colorKey?: string;
  qty: number;
}

export interface CartView extends CartLine {
  product: CatalogProduct;
  lineTotal: number;
}

interface AddOptions {
  colorKey?: string;
  qty?: number;
}

type CartCtx = {
  items: CartView[];
  add: (productId: number, opts?: AddOptions) => void;
  remove: (uid: string) => void;
  setQty: (uid: string, delta: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);
const lineId = (productId: number, colorKey?: string) => `${productId}:${colorKey ?? '-'}`;

/** The demo opens with a cart in it, so the drawer and checkout have something to show. */
const SEED: CartLine[] = [
  { uid: '1:Olive', productId: 1, colorKey: 'Olive', qty: 1 },
  { uid: '10:-', productId: 10, qty: 2 },
];

export function LookCartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(SEED);

  const add = useCallback((productId: number, opts: AddOptions = {}) => {
    const uid = lineId(productId, opts.colorKey);
    const qty = Math.max(1, opts.qty ?? 1);
    setLines((prev) => {
      const found = prev.find((l) => l.uid === uid);
      // same product in the same colour is one line, as everywhere else in retail
      if (found) return prev.map((l) => (l.uid === uid ? { ...l, qty: l.qty + qty } : l));
      return [{ uid, productId, colorKey: opts.colorKey, qty }, ...prev];
    });
  }, []);

  const remove = useCallback((uid: string) => setLines((prev) => prev.filter((l) => l.uid !== uid)), []);

  const setQty = useCallback((uid: string, delta: number) => {
    setLines((prev) =>
      prev.flatMap((l) => {
        if (l.uid !== uid) return [l];
        const qty = l.qty + delta;
        return qty <= 0 ? [] : [{ ...l, qty }];
      }),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    const items = lines.flatMap<CartView>((l) => {
      const product = CATALOG.find((p) => p.id === l.productId);
      return product ? [{ ...l, product, lineTotal: product.price * l.qty }] : [];
    });
    return {
      items,
      add,
      remove,
      setQty,
      clear,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.lineTotal, 0),
    };
  }, [lines, add, remove, setQty, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLookCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLookCart must be used inside LookCartProvider');
  return ctx;
}
