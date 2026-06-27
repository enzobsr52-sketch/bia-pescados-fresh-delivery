import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { formatBRL, type Product } from "@/lib/products";
import { usePriceMode } from "@/lib/price-mode";

/**
 * Resolve o preço efetivo conforme o modo (varejo/atacado).
 * Atacado só libera preços quando wholesaleApproved = true.
 */
export function useEffectivePrice(product: Product) {
  const { mode, wholesaleApproved } = usePriceMode();
  if (mode === "atacado") {
    return {
      mode: "atacado" as const,
      locked: !wholesaleApproved,
      price: product.priceWholesale,
      oldPrice: undefined as number | undefined,
    };
  }
  return {
    mode: "varejo" as const,
    locked: false,
    price: product.priceRetail,
    oldPrice: product.oldPrice,
  };
}

export function PriceTag({ product, size = "md" }: { product: Product; size?: "sm" | "md" | "lg" }) {
  const eff = useEffectivePrice(product);
  const sizes = {
    sm: { price: "text-base", old: "text-xs" },
    md: { price: "text-lg", old: "text-xs" },
    lg: { price: "text-4xl", old: "text-lg" },
  }[size];

  if (eff.locked) {
    return (
      <Link
        to="/atacado"
        className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-pink hover:text-pink-foreground"
      >
        <Lock className="h-3 w-3" /> Solicite acesso
      </Link>
    );
  }
  return (
    <div>
      {eff.oldPrice && (
        <div className={`text-muted-foreground line-through ${sizes.old}`}>{formatBRL(eff.oldPrice)}</div>
      )}
      <div className={`font-display text-navy ${sizes.price}`}>{formatBRL(eff.price)}</div>
      {eff.mode === "atacado" && (
        <div className="text-[10px] font-semibold uppercase tracking-wider text-pink">Preço atacado</div>
      )}
    </div>
  );
}
