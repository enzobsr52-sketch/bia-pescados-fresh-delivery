import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { formatBRL } from "@/lib/products";

const ORDERS_KEY = "pdb-orders-v1";
interface StoredOrder {
  txid: string;
  status: "pending" | "paid";
  amount: number;
  createdAt: number;
  paidAt?: number;
  buyer: { name: string; email: string; phone: string; cep: string; address: string };
  items: Array<{ name: string; qty: number; unit: number; line: number }>;
}

export const Route = createFileRoute("/admin/pedidos")({
  head: () => ({ meta: [{ title: "Pedidos — Painel" }] }),
  component: AdminOrders,
});

function loadOrders(): Record<string, StoredOrder> {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "{}"); } catch { return {}; }
}
function saveOrders(o: Record<string, StoredOrder>) {
  try { localStorage.setItem(ORDERS_KEY, JSON.stringify(o)); } catch {}
}

function AdminOrders() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  const refresh = () => {
    const o = loadOrders();
    setOrders(Object.values(o).sort((a, b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    refresh();
    const i = setInterval(refresh, 2000);
    return () => clearInterval(i);
  }, []);

  const confirm = (txid: string) => {
    const o = loadOrders();
    if (o[txid]) {
      o[txid].status = "paid";
      o[txid].paidAt = Date.now();
      saveOrders(o);
      refresh();
    }
  };

  const remove = (txid: string) => {
    const o = loadOrders();
    delete o[txid];
    saveOrders(o);
    refresh();
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-navy">Painel de pedidos</h1>
            <p className="text-sm text-muted-foreground">
              Confirme manualmente pagamentos Pix. O status atualiza em tempo real no checkout do cliente.
            </p>
          </div>
          <Link to="/" className="text-xs text-muted-foreground hover:text-pink">← Voltar à loja</Link>
        </div>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Nenhum pedido registrado ainda.
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {orders.map((o) => (
              <li key={o.txid} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">{o.txid}</div>
                    <div className="font-display text-base text-navy">{o.buyer.name || "Sem nome"} — {formatBRL(o.amount)}</div>
                    <div className="text-xs text-muted-foreground">{o.buyer.phone} • {o.buyer.email}</div>
                    <div className="text-xs text-muted-foreground">{o.buyer.address} (CEP {o.buyer.cep})</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {o.status === "paid" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-whats/10 px-3 py-1 text-xs font-semibold text-whats">
                        <CheckCircle2 className="h-3 w-3" /> Pago
                      </span>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1 rounded-full bg-pink/10 px-3 py-1 text-xs font-semibold text-pink">
                          <Clock className="h-3 w-3" /> Aguardando
                        </span>
                        <button onClick={() => confirm(o.txid)} className="rounded-full bg-pink px-3 py-1 text-xs font-semibold text-pink-foreground">
                          Confirmar pagamento
                        </button>
                      </>
                    )}
                    <button onClick={() => remove(o.txid)} className="text-xs text-muted-foreground hover:text-destructive">Remover</button>
                  </div>
                </div>
                <ul className="mt-3 border-t border-border pt-2 text-xs text-foreground/70">
                  {o.items.map((it, i) => (
                    <li key={i}>{it.qty}× {it.name} — {formatBRL(it.line)}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 rounded-2xl bg-cream p-4 text-xs text-navy">
          <div className="flex items-center gap-2 font-semibold">
            <Loader2 className="h-3 w-3" /> Como funciona
          </div>
          <p className="mt-1">
            Esta versão usa armazenamento local do navegador para registrar pedidos e confirmar manualmente. Para
            confirmação 100% automática integramos com Mercado Pago / Stripe (webhook Pix) quando você ativar uma conta.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
