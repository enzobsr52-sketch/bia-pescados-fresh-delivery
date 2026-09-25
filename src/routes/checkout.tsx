import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Copy, Loader2, QrCode, ShieldCheck } from "lucide-react";
import QRCode from "qrcode";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { createCheckout, getCheckoutStatus } from "@/lib/checkout.functions";
import { deliveryBlockedMessage } from "@/lib/checkout.shared";
import { formatBRL } from "@/lib/products";
import { usePriceMode } from "@/lib/price-mode";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [
    { title: "Finalizar pedido com Pix | Pescados da Bia" },
    { name: "description", content: "Pagamento Pix seguro para pedidos com entrega exclusiva em Unaí, Minas Gerais." },
    { property: "og:title", content: "Finalizar pedido com Pix | Pescados da Bia" },
    { property: "og:description", content: "Pagamento Pix seguro com confirmação automática." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Checkout,
});

type Status = "form" | "creating" | "awaiting" | "paid";
type Buyer = { name: string; email: string; phone: string; cpf: string };
type Address = { cep: string; street: string; number: string; complement: string; neighborhood: string; city: string; state: string; country: string };
type Payment = { orderId: string; orderNumber: string; statusToken: string; qrCodeText: string; expiresAt: string; subtotalCents: number; discountCents: number; totalCents: number };

function Checkout() {
  const { detailed, subtotal, clear } = useCart();
  const { mode, wholesaleApproved } = usePriceMode();
  const navigate = useNavigate();
  const startCheckout = useServerFn(createCheckout);
  const fetchStatus = useServerFn(getCheckoutStatus);
  const [status, setStatus] = useState<Status>("form");
  const [buyer, setBuyer] = useState<Buyer>({ name: "", email: "", phone: "", cpf: "" });
  const [address, setAddress] = useState<Address>({ cep: "", street: "", number: "", complement: "", neighborhood: "", city: "Unaí", state: "MG", country: "BR" });
  const [payment, setPayment] = useState<Payment | null>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const discount = 0;
  const displayedTotal = subtotal - discount;

  useEffect(() => {
    if (!payment || status !== "awaiting") return;
    const tick = async () => {
      const remaining = Math.max(0, Math.floor((new Date(payment.expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(remaining);
      try {
        const result = await fetchStatus({ data: { orderId: payment.orderId, statusToken: payment.statusToken } });
        if (result.payment_status === "PAID") {
          setStatus("paid");
          clear();
        } else if (["DECLINED", "CANCELED", "EXPIRED"].includes(result.payment_status)) {
          setError("O pagamento não foi aprovado. Tente novamente.");
          setStatus("form");
          setPayment(null);
        }
      } catch { /* a próxima consulta tenta novamente */ }
    };
    void tick();
    const timer = window.setInterval(() => void tick(), 4000);
    return () => window.clearInterval(timer);
  }, [payment, status, fetchStatus, clear]);

  if (mode === "atacado" && !wholesaleApproved && detailed.length > 0) return <PageShell><Empty title="Pedidos de atacado" text="Para finalizar pedidos como revendedor, solicite acesso aos preços de atacado." to="/atacado" action="Solicitar acesso" /></PageShell>;
  if (!detailed.length && status === "form") return <PageShell><Empty title="Carrinho vazio" text="Adicione produtos antes de finalizar a compra." to="/catalogo" action="Ver catálogo" /></PageShell>;

  async function startPix(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setStatus("creating");
    try {
      const result = await startCheckout({ data: { customer: buyer, address, items: detailed.map((item) => ({ id: item.product.id, quantity: item.qty })), priceMode: mode, wholesaleApproved, paymentMethod: "PIX" } });
      const qr = await QRCode.toDataURL(result.qrCodeText, { width: 320, margin: 1 });
      setPayment(result);
      setQrUrl(qr);
      setSecondsLeft(Math.max(0, Math.floor((new Date(result.expiresAt).getTime() - Date.now()) / 1000)));
      setStatus("awaiting");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Não foi possível iniciar o pagamento.";
      setError(message.includes("entregas somente") ? deliveryBlockedMessage : message.includes("PAGBANK_NOT_CONFIGURED") ? "O pagamento ainda está em configuração. Tente novamente mais tarde." : message.includes("PAYMENT_PROVIDER_UNAVAILABLE") ? "O PagBank não conseguiu iniciar o pagamento. Confira seus dados e tente novamente." : message);
      setStatus("form");
    }
  }

  async function copyPayload() {
    if (!payment) return;
    try { await navigator.clipboard.writeText(payment.qrCodeText); setCopied(true); window.setTimeout(() => setCopied(false), 2000); } catch { setError("Não foi possível copiar. Selecione o código manualmente."); }
  }

  if (status === "paid" && payment) return <PageShell><div className="mx-auto max-w-xl px-4 py-20 text-center"><CheckCircle2 className="mx-auto h-16 w-16 text-whats" /><h1 className="mt-4 font-display text-3xl text-navy">✅ Pedido realizado com sucesso!</h1><p className="mt-2 text-muted-foreground">Pedido <strong>#{payment.orderNumber}</strong> aprovado. Entraremos em contato pelo WhatsApp para combinar a entrega.</p><Button onClick={() => navigate({ to: "/" })} className="mt-6">Voltar à loja</Button></div></PageShell>;

  if (status === "awaiting" && payment) {
    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const ss = String(secondsLeft % 60).padStart(2, "0");
    return <PageShell><div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]"><div className="rounded-lg border border-border bg-card p-6 sm:p-8"><div className="flex items-center gap-2 text-xs font-semibold uppercase text-pink"><QrCode className="h-4 w-4" /> Pagamento Pix</div><h1 className="mt-2 font-display text-2xl text-navy">Escaneie o QR Code para pagar</h1><p className="mt-1 text-sm text-muted-foreground">A aprovação acontece somente após a confirmação oficial do pagamento.</p><div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start"><div className="rounded-lg border border-border bg-background p-3">{qrUrl && <img src={qrUrl} alt="QR Code Pix do pedido" className="h-64 w-64" />}</div><div className="space-y-3 text-sm"><div><div className="text-xs text-muted-foreground">Valor</div><div className="font-display text-2xl text-navy">{formatBRL(payment.totalCents / 100)}</div></div><div><div className="text-xs text-muted-foreground">Pedido</div><div className="font-mono text-sm text-navy">#{payment.orderNumber}</div></div><div className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-xs text-navy"><Clock className="h-3 w-3 text-pink" /> Expira em {mm}:{ss}</div></div></div><div className="mt-6"><label className="text-xs font-semibold text-navy">Pix Copia e Cola</label><div className="mt-1 flex gap-2"><textarea readOnly value={payment.qrCodeText} className="h-20 flex-1 resize-none rounded-lg border border-border bg-cream/40 p-2 font-mono text-[11px] text-navy" /><Button type="button" size="sm" variant="secondary" onClick={copyPayload}><Copy /> {copied ? "Copiado!" : "Copiar"}</Button></div></div><div className="mt-6 rounded-lg border border-pink/30 bg-pink/5 p-4"><div className="flex items-start gap-2 text-sm"><ShieldCheck className="mt-0.5 h-4 w-4 text-pink" /><div><div className="font-semibold text-navy">Aguardando confirmação automática…</div><p className="text-xs text-foreground/80">Não é necessário enviar comprovante. Esta página atualizará após a confirmação oficial.</p></div></div></div></div><Summary detailed={detailed} subtotal={payment.subtotalCents / 100} discount={payment.discountCents / 100} total={payment.totalCents / 100} /></div></PageShell>;
  }

  return <PageShell><div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]"><form onSubmit={startPix} className="space-y-5 rounded-lg border border-border bg-card p-6 sm:p-8"><h1 className="font-display text-2xl text-navy">Finalizar pedido</h1><p className="text-sm text-muted-foreground">Entrega exclusiva em Unaí - MG. O frete será combinado após o pedido.</p>{error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<div className="grid gap-4 sm:grid-cols-2"><Field label="Nome completo" value={buyer.name} onChange={(value) => setBuyer({ ...buyer, name: value })} required /><Field label="E-mail" type="email" value={buyer.email} onChange={(value) => setBuyer({ ...buyer, email: value })} required /><Field label="Telefone (WhatsApp)" value={buyer.phone} onChange={(value) => setBuyer({ ...buyer, phone: value })} required /><Field label="CPF" value={buyer.cpf} onChange={(value) => setBuyer({ ...buyer, cpf: value })} required /><Field label="CEP" value={address.cep} onChange={(value) => setAddress({ ...address, cep: value })} required /><Field label="Rua" value={address.street} onChange={(value) => setAddress({ ...address, street: value })} required /><Field label="Número" value={address.number} onChange={(value) => setAddress({ ...address, number: value })} required /><Field label="Complemento" value={address.complement} onChange={(value) => setAddress({ ...address, complement: value })} /><Field label="Bairro" value={address.neighborhood} onChange={(value) => setAddress({ ...address, neighborhood: value })} required /><Field label="Cidade" value={address.city} onChange={() => undefined} readOnly required /><Field label="Estado" value={address.state} onChange={() => undefined} readOnly required /><Field label="País" value="Brasil" onChange={() => undefined} readOnly required /></div><div className="rounded-lg bg-cream p-4 text-sm"><div className="flex items-center gap-2 font-semibold text-navy"><QrCode className="h-4 w-4 text-pink" /> Pagamento via Pix</div><p className="mt-1 text-xs text-foreground/70">O valor e os produtos são conferidos novamente antes da cobrança.</p></div><Button type="submit" size="lg" className="w-full" disabled={status === "creating"}>{status === "creating" ? <><Loader2 className="animate-spin" /> Preparando pagamento…</> : `Pagar com Pix — ${formatBRL(displayedTotal)}`}</Button></form><Summary detailed={detailed} subtotal={subtotal} discount={discount} total={displayedTotal} /></div></PageShell>;
}

function Empty({ title, text, to, action }: { title: string; text: string; to: "/atacado" | "/catalogo"; action: string }) { return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="font-display text-3xl text-navy">{title}</h1><p className="mt-3 text-muted-foreground">{text}</p><Button asChild className="mt-6"><Link to={to}>{action}</Link></Button></div>; }

function Summary({ detailed, subtotal, discount, total }: { detailed: ReturnType<typeof useCart>["detailed"]; subtotal: number; discount: number; total: number }) { return <aside className="h-fit rounded-lg border border-border bg-card p-6"><h2 className="font-display text-lg text-navy">Resumo</h2><ul className="mt-3 space-y-2 text-sm">{detailed.map((item) => <li key={item.product.id} className="flex justify-between gap-2"><span className="text-foreground/80">{item.qty}× {item.product.name}</span><span className="text-navy">{formatBRL(item.lineTotal)}</span></li>)}</ul><dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatBRL(subtotal)}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Entrega</dt><dd>a combinar</dd></div>{discount > 0 && <div className="flex justify-between text-whats"><dt>Desconto Pix (5%)</dt><dd>-{formatBRL(discount)}</dd></div>}<div className="flex justify-between border-t border-border pt-2 font-display text-base text-navy"><dt>Total</dt><dd>{formatBRL(total)}</dd></div></dl></aside>; }

function Field({ label, value, onChange, type = "text", required, readOnly = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; readOnly?: boolean }) { return <label className="block"><span className="text-xs font-semibold text-navy">{label}</span><input type={type} required={required} readOnly={readOnly} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-pink read-only:bg-muted" /></label>; }