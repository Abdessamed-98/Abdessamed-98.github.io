/**
 * The shell's context only — kept apart from shell.tsx (which renders the
 * drawers) so shared primitives like ProductCard can read it without importing
 * the sheets that import them back.
 */
import { createContext, useContext } from 'react';

export type ShellApi = {
  openCart: () => void;
  openWishlist: () => void;
  /** request a service, optionally pre-filled with which one */
  openService: (service?: string) => void;
  openAuth: () => void;
  openImageSearch: () => void;
  /** the signed-in visitor's name, or null */
  user: string | null;
  signIn: (name: string) => void;
  signOut: () => void;
  /** add to cart and confirm it, from anywhere */
  addToCart: (productId: number, name: string, opts?: { colorKey?: string; qty?: number }) => void;
  toast: (message: string) => void;
};

export const ShellContext = createContext<ShellApi | null>(null);

export function useShell(): ShellApi {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error('useShell must be used inside LookShell');
  return ctx;
}
