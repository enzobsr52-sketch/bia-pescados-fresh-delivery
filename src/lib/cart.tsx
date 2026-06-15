import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type Product } from "./products";

interface CartItem { id: string; qty: number; }
interface CartCtx {
  items: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  detailed: Array<{ product: Product; qty: number; lineTotal: number }>;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "pdb-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const api = useMemo<CartCtx>(() => {
    const detailed = items
      .map((i) => {
        const p = products.find((p) => p.id === i.id);
        if (!p) return null;
        return { product: p, qty: i.qty, lineTotal: p.price * i.qty };
      })
      .filter(Boolean) as CartCtx["detailed"];
    return {
      items,
      add: (id, qty = 1) =>
        setItems((cur) => {
          const found = cur.find((i) => i.id === id);
          if (found) return cur.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
          return [...cur, { id, qty }];
        }),
      remove: (id) => setItems((cur) => cur.filter((i) => i.id !== id)),
      setQty: (id, qty) =>
        setItems((cur) =>
          qty <= 0 ? cur.filter((i) => i.id !== id) : cur.map((i) => (i.id === id ? { ...i, qty } : i)),
        ),
      clear: () => setItems([]),
      count: items.reduce((a, b) => a + b.qty, 0),
      subtotal: detailed.reduce((a, b) => a + b.lineTotal, 0),
      detailed,
    };
  }, [items]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside CartProvider");
  return v;
}
