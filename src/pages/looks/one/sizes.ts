/**
 * Look 1 — sofa sizes.
 *
 * A sofa sold as "3-Seater" is offered in its own size and the two below it,
 * each smaller size 18% less. The seat count is read from the English name, so
 * anything that is not a sofa simply has no sizes. The cart stores the seats
 * chosen and prices the line from here, so the page and the cart always agree.
 */
import type { Bi, CatalogProduct } from '../lookShared';

export interface SizeOption {
  seats: number;
  label: Bi;
  price: number;
  oldPrice?: number;
}

const LABEL: Record<number, Bi> = {
  1: { en: 'Single seat', ar: 'مقعد مفرد' },
  2: { en: '2-seater', ar: 'مقعدين' },
  3: { en: '3-seater', ar: 'ثلاث مقاعد' },
  4: { en: '4-seater', ar: 'أربع مقاعد' },
};

const round10 = (n: number) => Math.round(n / 10) * 10;

export function sizeOptions(p: CatalogProduct): SizeOption[] {
  const m = p.name.en.match(/(\d)-Seater/i);
  if (!m) return [];
  const base = Number(m[1]);
  return [base, base - 1, base - 2]
    .filter((s) => s >= 1 && LABEL[s])
    .map((s) => {
      const f = 1 - 0.18 * (base - s);
      return {
        seats: s,
        label: LABEL[s],
        price: s === base ? p.price : round10(p.price * f),
        oldPrice: p.oldPrice ? (s === base ? p.oldPrice : round10(p.oldPrice * f)) : undefined,
      };
    });
}

/** The price of one piece in the chosen size (the catalogue price when none is chosen). */
export const unitPrice = (p: CatalogProduct, seats?: number) =>
  (seats ? sizeOptions(p).find((o) => o.seats === seats)?.price : undefined) ?? p.price;

export const sizeLabel = (p: CatalogProduct, seats?: number): Bi | undefined =>
  seats ? sizeOptions(p).find((o) => o.seats === seats)?.label : undefined;
