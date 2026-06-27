import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, products, formatBRL } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import { ShoppingCart, Minus, Plus, Snowflake, ShieldCheck, Truck, ChevronRight, Lock } from "lucide-react";
import { useEffectivePrice } from "@/components/PriceTag";

export const Route = createFileRoute("/produto/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Pescados da Bia` },
          { name: "description", content: loaderData.product.description.slice(0, 155) },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.description.slice(0, 155) },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl p-10 text-center">
        <h1 className="font-display text-2xl text-navy">Produto não encontrado</h1>
        <Link to="/catalogo" className="mt-4 inline-block text-pink hover:underline">Voltar ao catálogo</Link>
      </div>
    </PageShell>
  ),
  errorComponent: () => (
    <PageShell>
      <div className="p-10 text-center text-muted-foreground">Erro ao carregar produto.</div>
    </PageShell>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const eff = useEffectivePrice(product);

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-pink">Início</Link>
        <ChevronRight className="mx-1 inline h-3 w-3" />
        <Link to="/catalogo" className="hover:text-pink">Catálogo</Link>
        <ChevronRight className="mx-1 inline h-3 w-3" />
        <span className="text-navy">{product.name}</span>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-cream p-6">
          <img src={product.image} alt={product.name} className="mx-auto aspect-square w-full max-w-md object-contain" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-pink">{product.category}</span>
          <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">{product.name}</h1>
          <div className="mt-3 text-sm text-muted-foreground">Peso líquido: {product.weight}</div>

          {eff.locked ? (
            <div className="mt-6 rounded-2xl border border-dashed border-pink/40 bg-pink/5 p-5">
              <div className="flex items-center gap-2 font-display text-navy">
                <Lock className="h-5 w-5 text-pink" /> Preço de atacado restrito
              </div>
              <p className="mt-2 text-sm text-foreground/80">
                Solicite acesso aos preços de revenda para visualizar valores especiais para supermercados, peixarias e restaurantes.
              </p>
              <Link to="/atacado" className="mt-4 inline-flex rounded-full bg-pink px-5 py-2.5 text-sm font-semibold text-pink-foreground">
                Solicitar acesso
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-6 flex items-end gap-3">
                {eff.oldPrice && (
                  <span className="text-lg text-muted-foreground line-through">{formatBRL(eff.oldPrice)}</span>
                )}
                <span className="font-display text-4xl text-navy">{formatBRL(eff.price)}</span>
                {eff.mode === "atacado" && (
                  <span className="rounded-full bg-pink/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pink">Atacado</span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">ou 3x de {formatBRL(eff.price / 3)} sem juros</p>
            </>
          )}

          <p className="mt-6 text-sm leading-relaxed text-foreground/80">{product.description}</p>

          {!eff.locked && (
            <div className="mt-8 flex items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 text-navy hover:text-pink" aria-label="Diminuir">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-semibold text-navy">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="p-3 text-navy hover:text-pink" aria-label="Aumentar">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => add(product.id, qty)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-pink px-6 py-3.5 font-semibold text-pink-foreground shadow-pink transition-transform hover:scale-[1.02]"
              >
                <ShoppingCart className="h-5 w-5" /> Adicionar ao carrinho
              </button>
            </div>
          )}

          <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
            {[
              { icon: Snowflake, label: "Congelado a -18°C" },
              { icon: ShieldCheck, label: "100% Natural" },
              { icon: Truck, label: "Entrega refrigerada" },
            ].map((b) => (
              <div key={b.label} className="rounded-xl border border-border bg-card p-3 text-center">
                <b.icon className="mx-auto mb-1 h-5 w-5 text-pink" />
                <div className="font-medium text-navy">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="mb-6 font-display text-2xl text-navy">Você também vai gostar</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </PageShell>
  );
}
