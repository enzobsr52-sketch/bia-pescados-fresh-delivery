import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/products";
import { useState } from "react";
import { CreditCard, QrCode, Wallet, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Pescados da Bia" }] }),
  component: Checkout,
});

type Method = "pix" | "credito" | "debito";

function Checkout() {
  const { detailed, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("pix");
  const [done, setDone] = useState(false);

  const shipping = subtotal === 0 ? 0 : subtotal >= 150 ? 0 : 15;
  const total = subtotal + shipping;
  const discount = method === "pix" ? total * 0.05 : 0;
  const finalTotal = total - discount;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    clear();
  };

  if (done) {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-whats" />
          <h1 className="mt-4 font-display text-3xl text-navy">Pedido confirmado!</h1>
          <p className="mt-2 text-muted-foreground">
            Em instantes você receberá um WhatsApp com os detalhes da entrega.
          </p>
          <button onClick={() => navigate({ to: "/" })} className="mt-6 rounded-full bg-pink px-6 py-3 font-semibold text-pink-foreground">
            Voltar à loja
          </button>
        </div>
      </PageShell>
    );
  }

  if (detailed.length === 0) {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="font-display text-2xl text-navy">Seu carrinho está vazio</h1>
          <Link to="/catalogo" className="mt-4 inline-block text-pink hover:underline">Ver produtos</Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl text-navy sm:text-4xl">Checkout</h1>

        <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg text-navy">Seus dados</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field label="Nome completo" name="nome" required />
                <Field label="Telefone / WhatsApp" name="telefone" required />
                <Field label="E-mail" name="email" type="email" required className="sm:col-span-2" />
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg text-navy">Endereço de entrega</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Field label="CEP" name="cep" required />
                <Field label="Rua" name="rua" required className="sm:col-span-2" />
                <Field label="Número" name="num" required />
                <Field label="Bairro" name="bairro" required />
                <Field label="Cidade" name="cidade" required />
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg text-navy">Forma de pagamento</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <PayOption icon={QrCode} label="Pix" sub="5% OFF" active={method === "pix"} onClick={() => setMethod("pix")} />
                <PayOption icon={CreditCard} label="Crédito" sub="Em até 3x" active={method === "credito"} onClick={() => setMethod("credito")} />
                <PayOption icon={Wallet} label="Débito" active={method === "debito"} onClick={() => setMethod("debito")} />
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg text-navy">Seu pedido</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {detailed.map(({ product, qty, lineTotal }) => (
                <li key={product.id} className="flex justify-between gap-2">
                  <span className="text-foreground/80">{qty}× {product.name}</span>
                  <span>{formatBRL(lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatBRL(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Entrega</dt><dd>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</dd></div>
              {discount > 0 && (
                <div className="flex justify-between text-whats"><dt>Desconto Pix</dt><dd>-{formatBRL(discount)}</dd></div>
              )}
              <div className="mt-2 flex justify-between border-t border-border pt-2 font-display text-lg text-navy">
                <dt>Total</dt><dd>{formatBRL(finalTotal)}</dd>
              </div>
            </dl>
            <button type="submit" className="mt-5 w-full rounded-full bg-pink py-3 font-semibold text-pink-foreground shadow-pink hover:scale-[1.02] transition-transform">
              Confirmar pedido
            </button>
          </aside>
        </form>
      </div>
    </PageShell>
  );
}

function Field({ label, name, type = "text", required, className = "" }: { label: string; name: string; type?: string; required?: boolean; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-navy">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-pink"
      />
    </label>
  );
}

function PayOption({ icon: Icon, label, sub, active, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; sub?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-xl border p-4 text-sm transition ${
        active ? "border-pink bg-pink/5 text-pink" : "border-border text-navy hover:border-pink"
      }`}
    >
      <Icon className="h-6 w-6" />
      <span className="font-semibold">{label}</span>
      {sub && <span className="text-[10px] uppercase tracking-wider opacity-80">{sub}</span>}
    </button>
  );
}
