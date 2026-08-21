import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/products";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Seu carrinho | Pescados da Bia" },
      { name: "description", content: "Revise os pescados e congelados escolhidos e finalize seu pedido com pagamento via Pix." },
      { property: "og:title", content: "Seu carrinho | Pescados da Bia" },
      { property: "og:description", content: "Revise seus itens e finalize o pedido com pagamento via Pix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Seu carrinho | Pescados da Bia" },
      { name: "twitter:description", content: "Revise seus itens e finalize o pedido." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Carrinho,
});

function Carrinho() {
  const { detailed, setQty, remove, subtotal, count } = useCart();
  const total = subtotal;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl text-navy sm:text-4xl">Seu carrinho</h1>
        <p className="mt-1 text-sm text-muted-foreground">{count} item(ns)</p>

        {detailed.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
            <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-pink" />
            <p className="text-navy">Seu carrinho está vazio.</p>
            <Link to="/catalogo" className="mt-4 inline-block rounded-full bg-pink px-5 py-2.5 text-sm font-semibold text-pink-foreground">
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <ul className="space-y-3">
              {detailed.map(({ product, qty, lineTotal }) => (
                <li key={product.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                  <img src={product.image} alt={product.name} className="h-24 w-24 rounded-xl bg-cream object-contain p-2" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to="/produto/$id" params={{ id: product.id }} className="font-display text-sm text-navy hover:text-pink">
                          {product.name}
                        </Link>
                        <div className="text-xs text-muted-foreground">{product.weight}</div>
                      </div>
                      <button onClick={() => remove(product.id)} aria-label="Remover" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button onClick={() => setQty(product.id, qty - 1)} className="p-2 text-navy" aria-label="-"><Minus className="h-3 w-3" /></button>
                        <span className="w-7 text-center text-sm font-semibold">{qty}</span>
                        <button onClick={() => setQty(product.id, qty + 1)} className="p-2 text-navy" aria-label="+"><Plus className="h-3 w-3" /></button>
                      </div>
                      <div className="font-display text-base text-navy">{formatBRL(lineTotal)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg text-navy">Resumo</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatBRL(subtotal)}</dd></div>
                <div className="border-t border-border pt-3 flex justify-between font-display text-lg text-navy">
                  <dt>Total</dt><dd>{formatBRL(total)}</dd>
                </div>
              </dl>
              <p className="mt-3 rounded-lg bg-cream p-3 text-xs text-navy">
                O valor da entrega é combinado após o pedido, conforme sua região.
              </p>
              <Link
                to="/checkout"
                className="mt-5 block rounded-full bg-pink py-3 text-center font-semibold text-pink-foreground shadow-pink"
              >
                Finalizar compra
              </Link>
              <Link to="/catalogo" className="mt-2 block text-center text-xs text-muted-foreground hover:text-pink">
                Continuar comprando
              </Link>
            </aside>
          </div>
        )}
      </div>
    </PageShell>
  );
}
