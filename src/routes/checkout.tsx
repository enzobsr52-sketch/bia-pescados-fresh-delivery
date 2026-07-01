import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/products";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Copy, QrCode, Clock, Loader2, ShieldCheck } from "lucide-react";
import QRCode from "qrcode";
import { buildPixPayload } from "@/lib/pix";
import { company, waLink } from "@/lib/company";
import { usePriceMode } from "@/lib/price-mode";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Pescados da Bia" }] }),
  component: Checkout,
});

type Status = "form" | "awaiting" | "checking" | "paid";
interface Buyer { name: string; email: string; phone: string; cep: string; address: string; }

const ORDERS_KEY = "pdb-orders-v1";
interface StoredOrder {
  txid: string;
  status: "pending" | "paid";
  amount: number;
  createdAt: number;
  paidAt?: number;
  buyer: Buyer;
  items: Array<{ name: string; qty: number; unit: number; line: number }>;
}

function loadOrders(): Record<string, StoredOrder> {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "{}"); } catch { return {}; }
}
function saveOrders(o: Record<string, StoredOrder>) {
  try { localStorage.setItem(ORDERS_KEY, JSON.stringify(o)); } catch {}
}

function Checkout() {
  const { detailed, subtotal, clear } = useCart();
  const { mode, wholesaleApproved } = usePriceMode();
  const navigate = useNavigate();

  const total = subtotal;
  // Pix tem 5% de desconto no varejo; atacado mantém valor de tabela
  const discount = mode === "varejo" ? total * 0.05 : 0;
  const finalTotal = +(total - discount).toFixed(2);

  const [status, setStatus] = useState<Status>("form");
  const [buyer, setBuyer] = useState<Buyer>({ name: "", email: "", phone: "", cep: "", address: "" });
  const [txid, setTxid] = useState("");
  const [payload, setPayload] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);

  // Bloqueio: atacado sem aprovação não compra online
  if (mode === "atacado" && !wholesaleApproved && detailed.length > 0) {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="font-display text-3xl text-navy">Pedidos de atacado</h1>
          <p className="mt-3 text-muted-foreground">
            Para finalizar pedidos como revendedor, solicite o acesso aos preços de atacado. Após aprovação, você poderá comprar online com valores especiais.
          </p>
          <Link to="/atacado" className="mt-6 inline-block rounded-full bg-pink px-6 py-3 font-semibold text-pink-foreground">
            Solicitar acesso
          </Link>
        </div>
      </PageShell>
    );
  }

  if (status !== "paid" && detailed.length === 0 && status === "form") {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="font-display text-3xl text-navy">Carrinho vazio</h1>
          <p className="mt-2 text-muted-foreground">Adicione produtos antes de finalizar a compra.</p>
          <Link to="/catalogo" className="mt-6 inline-block rounded-full bg-pink px-6 py-3 font-semibold text-pink-foreground">
            Ver catálogo
          </Link>
        </div>
      </PageShell>
    );
  }

  // Cronômetro Pix (15 min)
  useEffect(() => {
    if (status !== "awaiting" && status !== "checking") return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [status]);

  // Polling de confirmação de pagamento
  useEffect(() => {
    if (status !== "awaiting" && status !== "checking") return;
    if (!txid) return;
    const tick = () => {
      const orders = loadOrders();
      const o = orders[txid];
      if (o && o.status === "paid") {
        setStatus("paid");
        clear();
      }
    };
    tick();
    const i = setInterval(tick, 3000);
    // Também escuta eventos de outras abas (admin)
    const onStorage = (e: StorageEvent) => { if (e.key === ORDERS_KEY) tick(); };
    window.addEventListener("storage", onStorage);
    return () => { clearInterval(i); window.removeEventListener("storage", onStorage); };
  }, [status, txid, clear]);

  const startPix = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTxid = "PDB" + Date.now().toString(36).toUpperCase();
    const pl = buildPixPayload({ amount: finalTotal, txid: newTxid });
    const url = await QRCode.toDataURL(pl, { width: 320, margin: 1, color: { dark: "#0B1B3A", light: "#ffffff" } });
    const order: StoredOrder = {
      txid: newTxid,
      status: "pending",
      amount: finalTotal,
      createdAt: Date.now(),
      buyer,
      items: detailed.map((d) => ({ name: d.product.name, qty: d.qty, unit: d.unitPrice, line: d.lineTotal })),
    };
    const orders = loadOrders();
    orders[newTxid] = order;
    saveOrders(orders);
    setTxid(newTxid);
    setPayload(pl);
    setQrUrl(url);
    setSecondsLeft(15 * 60);
    setStatus("awaiting");
  };

  const copyPayload = async () => {
    try { await navigator.clipboard.writeText(payload); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const notifyPayment = () => {
    setStatus("checking");
    const lines = detailed.map((d) => `• ${d.qty}x ${d.product.name} — ${formatBRL(d.lineTotal)}`).join("\n");
    const msg = `Olá! Acabei de pagar via Pix.\n\nPedido: ${txid}\nValor: ${formatBRL(finalTotal)}\n\n${lines}\n\nCliente: ${buyer.name}\nTelefone: ${buyer.phone}\nEntrega: ${buyer.address} (CEP ${buyer.cep})\n\nSegue o comprovante.`;
    window.open(waLink(msg), "_blank");
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  if (status === "paid") {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-whats" />
          <h1 className="mt-4 font-display text-3xl text-navy">Pagamento confirmado!</h1>
          <p className="mt-2 text-muted-foreground">
            Pedido <strong>{txid}</strong> aprovado. Em instantes entraremos em contato pelo WhatsApp para combinar a entrega.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => navigate({ to: "/" })} className="rounded-full bg-pink px-6 py-3 font-semibold text-pink-foreground">
              Voltar à loja
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  if (status === "awaiting" || status === "checking") {
    return (
      <PageShell>
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pink">
              <QrCode className="h-4 w-4" /> Pagamento Pix
            </div>
            <h1 className="mt-2 font-display text-2xl text-navy">Escaneie o QR Code para pagar</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Abra o app do seu banco, escolha pagar via Pix com QR Code e aponte para a imagem abaixo.
            </p>

            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="rounded-2xl border border-border bg-white p-3">
                {qrUrl && <img src={qrUrl} alt="QR Code Pix" className="h-64 w-64" />}
              </div>
              <div className="flex-1 space-y-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Valor</div>
                  <div className="font-display text-2xl text-navy">{formatBRL(finalTotal)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Recebedor</div>
                  <div className="font-semibold text-navy">{company.pixReceiver}</div>
                  <div className="text-xs text-muted-foreground">CNPJ {company.cnpj}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Identificador</div>
                  <div className="font-mono text-sm text-navy">{txid}</div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-xs text-navy">
                  <Clock className="h-3 w-3 text-pink" /> Expira em {mm}:{ss}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs font-semibold text-navy">Pix Copia e Cola</label>
              <div className="mt-1 flex gap-2">
                <textarea readOnly value={payload} className="h-20 flex-1 resize-none rounded-lg border border-border bg-cream/40 p-2 font-mono text-[11px] text-navy" />
                <button onClick={copyPayload} className="inline-flex items-center gap-1 self-start rounded-lg bg-navy px-3 py-2 text-xs font-semibold text-navy-foreground">
                  <Copy className="h-3 w-3" /> {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-pink/30 bg-pink/5 p-4">
              <div className="flex items-start gap-2 text-sm">
                {status === "checking" ? <Loader2 className="mt-0.5 h-4 w-4 animate-spin text-pink" /> : <ShieldCheck className="mt-0.5 h-4 w-4 text-pink" />}
                <div>
                  <div className="font-semibold text-navy">
                    {status === "checking" ? "Aguardando confirmação automática…" : "Após o pagamento"}
                  </div>
                  <p className="text-xs text-foreground/80">
                    O pedido é confirmado automaticamente assim que recebermos a notificação do Pix. Para acelerar,
                    clique abaixo para enviar o comprovante pelo WhatsApp.
                  </p>
                </div>
              </div>
              <button
                onClick={notifyPayment}
                className="mt-3 w-full rounded-full bg-whats py-2.5 text-sm font-semibold text-white"
              >
                Já paguei — enviar comprovante
              </button>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-lg text-navy">Resumo</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {detailed.map((d) => (
                <li key={d.product.id} className="flex justify-between gap-2">
                  <span className="text-foreground/80">{d.qty}× {d.product.name}</span>
                  <span className="text-navy">{formatBRL(d.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatBRL(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Entrega</dt><dd>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</dd></div>
              {discount > 0 && (
                <div className="flex justify-between text-whats"><dt>Desconto Pix (5%)</dt><dd>-{formatBRL(discount)}</dd></div>
              )}
              <div className="flex justify-between border-t border-border pt-2 font-display text-base text-navy">
                <dt>Total</dt><dd>{formatBRL(finalTotal)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </PageShell>
    );
  }

  // Formulário
  return (
    <PageShell>
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={startPix} className="space-y-5 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h1 className="font-display text-2xl text-navy">Finalizar pedido</h1>
          <p className="text-sm text-muted-foreground">
            Preencha seus dados para gerar o Pix. O pagamento é confirmado automaticamente após a transferência.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome completo" value={buyer.name} onChange={(v) => setBuyer({ ...buyer, name: v })} required />
            <Field label="E-mail" type="email" value={buyer.email} onChange={(v) => setBuyer({ ...buyer, email: v })} required />
            <Field label="Telefone (WhatsApp)" value={buyer.phone} onChange={(v) => setBuyer({ ...buyer, phone: v })} required />
            <Field label="CEP" value={buyer.cep} onChange={(v) => setBuyer({ ...buyer, cep: v })} required />
            <div className="sm:col-span-2">
              <Field label="Endereço completo" value={buyer.address} onChange={(v) => setBuyer({ ...buyer, address: v })} required />
            </div>
          </div>

          <div className="rounded-2xl bg-cream p-4 text-sm">
            <div className="flex items-center gap-2 font-semibold text-navy">
              <QrCode className="h-4 w-4 text-pink" /> Pagamento via Pix {mode === "varejo" && "(5% de desconto)"}
            </div>
            <p className="mt-1 text-xs text-foreground/70">
              QR Code gerado direto para a chave Pix CNPJ {company.cnpj}. Confirmação automática após pagamento.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-pink py-3.5 font-semibold text-pink-foreground shadow-pink"
          >
            Gerar QR Code Pix — {formatBRL(finalTotal)}
          </button>
        </form>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-lg text-navy">Resumo</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detailed.map((d) => (
              <li key={d.product.id} className="flex justify-between gap-2">
                <span className="text-foreground/80">{d.qty}× {d.product.name}</span>
                <span className="text-navy">{formatBRL(d.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatBRL(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Entrega</dt><dd>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</dd></div>
            {discount > 0 && (
              <div className="flex justify-between text-whats"><dt>Desconto Pix (5%)</dt><dd>-{formatBRL(discount)}</dd></div>
            )}
            <div className="flex justify-between border-t border-border pt-2 font-display text-base text-navy">
              <dt>Total</dt><dd>{formatBRL(finalTotal)}</dd>
            </div>
          </dl>
          <Link to="/admin/pedidos" className="mt-4 block text-center text-[11px] text-muted-foreground hover:text-pink">
            Sou o lojista — abrir painel de pedidos
          </Link>
        </aside>
      </div>
    </PageShell>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-navy">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-pink"
      />
    </label>
  );
}
