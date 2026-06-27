import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useState } from "react";
import { Building2, CheckCircle2, Send } from "lucide-react";
import { company, waLink } from "@/lib/company";
import { usePriceMode } from "@/lib/price-mode";

export const Route = createFileRoute("/atacado")({
  head: () => ({ meta: [{ title: "Atacado / Revenda — Pescados da Bia" }] }),
  component: Atacado,
});

function Atacado() {
  const { setMode, setWholesaleApproved, wholesaleApproved } = usePriceMode();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ empresa: "", cnpj: "", cidade: "", telefone: "", segmento: "Supermercado" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `Olá! Quero solicitar acesso aos preços de atacado da Pescados da Bia.\n\n` +
      `Empresa: ${form.empresa}\nCNPJ: ${form.cnpj}\nCidade: ${form.cidade}\n` +
      `Telefone: ${form.telefone}\nSegmento: ${form.segmento}`;
    window.open(waLink(msg), "_blank");
    setMode("atacado");
    setSent(true);
  };

  return (
    <PageShell>
      <section className="border-b border-border bg-cream">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-pink/10 px-3 py-1 text-xs font-semibold text-pink">
            <Building2 className="h-3.5 w-3.5" /> Atacado / Revenda
          </span>
          <h1 className="mt-4 font-display text-3xl text-navy sm:text-5xl">
            Solicite acesso aos preços de revenda
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-foreground/80">
            Supermercados, peixarias, restaurantes e distribuidores: preencha os dados abaixo para liberar a tabela de
            atacado. Nossa equipe valida o CNPJ e libera o acesso aos preços de distribuidor.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 lg:grid-cols-[1fr_320px]">
        <form onSubmit={submit} className="space-y-5 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome da empresa" value={form.empresa} onChange={(v) => setForm({ ...form, empresa: v })} required />
            <Field label="CNPJ" value={form.cnpj} onChange={(v) => setForm({ ...form, cnpj: v })} required />
            <Field label="Cidade / UF" value={form.cidade} onChange={(v) => setForm({ ...form, cidade: v })} required />
            <Field label="Telefone / WhatsApp" value={form.telefone} onChange={(v) => setForm({ ...form, telefone: v })} required />
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-navy">Segmento</span>
              <select
                value={form.segmento}
                onChange={(e) => setForm({ ...form, segmento: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option>Supermercado</option>
                <option>Peixaria</option>
                <option>Restaurante</option>
                <option>Distribuidor</option>
                <option>Outro</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-pink py-3.5 font-semibold text-pink-foreground shadow-pink"
          >
            <Send className="h-4 w-4" /> Enviar solicitação
          </button>

          {sent && (
            <div className="rounded-2xl border border-whats/40 bg-whats/5 p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold text-navy">
                <CheckCircle2 className="h-4 w-4 text-whats" /> Solicitação enviada!
              </div>
              <p className="mt-1 text-xs text-foreground/80">
                Em até 1 dia útil avaliaremos seu cadastro. Após aprovação, marque a opção abaixo para liberar os preços
                de atacado neste dispositivo.
              </p>
              <label className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-navy">
                <input
                  type="checkbox"
                  checked={wholesaleApproved}
                  onChange={(e) => setWholesaleApproved(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-pink"
                />
                Já recebi a aprovação — liberar preços de atacado
              </label>
            </div>
          )}
        </form>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-display text-base text-navy">Por que comprar da Pescados da Bia?</h3>
            <ul className="mt-3 space-y-2 text-sm text-foreground/80">
              <li>• Linha completa: pescados in natura e empanados prontos.</li>
              <li>• Produto inspecionado — registro S.I.M.</li>
              <li>• Entregas refrigeradas em Unaí e região.</li>
              <li>• Preços diferenciados por volume.</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-navy p-6 text-navy-foreground">
            <h3 className="font-display text-base">Fale direto com a equipe</h3>
            <p className="mt-1 text-xs text-white/70">{company.phone}</p>
            <Link to="/catalogo" className="mt-3 inline-block text-xs text-pink hover:underline">
              Ver catálogo →
            </Link>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-navy">{label}</span>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-pink"
      />
    </label>
  );
}
