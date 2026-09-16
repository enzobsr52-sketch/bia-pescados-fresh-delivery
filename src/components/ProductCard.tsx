import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { PriceTag, useEffectivePrice } from "./PriceTag";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const eff = useEffectivePrice(product);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-soft">
      <Link to="/produto/$id" params={{ id: product.id }} className="block overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="aspect-square w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to="/produto/$id" params={{ id: product.id }} className="font-display text-sm leading-tight text-navy hover:text-pink">
          {product.name}
        </Link>
        <p className="text-xs text-muted-foreground">{product.weight}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <PriceTag product={product} />
          {!eff.locked && (
            <button
              onClick={() => add(product.id)}
              aria-label="Adicionar ao carrinho"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pink text-pink-foreground transition-transform hover:scale-110"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
