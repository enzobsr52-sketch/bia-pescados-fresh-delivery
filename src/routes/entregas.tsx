import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Truck, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/entregas")({
  head: () => ({
    meta: [
      { title: "Entregas — Pescados da Bia" },
      { name: "description", content: "Regiões atendidas, prazos e condições de entrega da Pescados da Bia." },
    ],
  }),
  component: Entregas,
});

const regioes = [
  { area: "Centro", prazo: "Mesmo dia", taxa: "R$ 10" },
  { area: "Zona Sul", prazo: "Mesmo dia", taxa: "R$ 12" },
  { area: "Zona Norte", prazo: "Até 24h", taxa: "R$ 15" },
  { area: "Zona Leste", prazo: "Até 24h", taxa: "R$ 15" },
  { area: "Zona Oeste", prazo: "Até 24h", taxa: "R$ 18" },
  { area: "Região Metropolitana", prazo: "Até 48h", taxa: "R$ 25" },
];

function Entregas() {
  return (
    <PageShell>
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="font-display text-3xl text-navy sm:text-4xl">Entregas</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Entregamos em veículos refrigerados para garantir o frescor do começo ao fim.
            Frete grátis em compras acima de R$ 150.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Truck, title: "Veículo refrigerado", text: "Cadeia de frio mantida em toda a rota." },
            { icon: Clock, title: "Prazos rápidos", text: "Entregas no mesmo dia para algumas regiões." },
            { icon: MapPin, title: "Cobertura ampla", text: "Atendemos toda a região metropolitana." },
          ].map((b) => (
            <div key={b.title} className="rounded-2xl border border-border bg-card p-6">
              <b.icon className="h-8 w-8 text-pink" />
              <h3 className="mt-3 font-display text-lg text-navy">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-navy text-navy-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-display tracking-wider">Região</th>
                <th className="px-4 py-3 text-left font-display tracking-wider">Prazo</th>
                <th className="px-4 py-3 text-left font-display tracking-wider">Taxa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {regioes.map((r) => (
                <tr key={r.area}>
                  <td className="px-4 py-3 font-medium text-navy">{r.area}</td>
                  <td className="px-4 py-3 text-foreground/80">{r.prazo}</td>
                  <td className="px-4 py-3 text-foreground/80">{r.taxa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
