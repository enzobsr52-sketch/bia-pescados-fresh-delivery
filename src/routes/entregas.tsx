import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Truck, Snowflake, MapPin, MessageCircle } from "lucide-react";
import { company } from "@/lib/company";

export const Route = createFileRoute("/entregas")({
  head: () => ({
    meta: [
      { title: "Entregas — Pescados da Bia" },
      { name: "description", content: "Como funcionam as entregas da Pescados da Bia em Minas Gerais: frota própria refrigerada e combinação de frete direto com você." },
    ],
  }),
  component: Entregas,
});

function Entregas() {
  const wa = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de saber sobre entrega para a minha cidade.")}`;
  return (
    <PageShell>
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="font-display text-3xl text-navy sm:text-4xl">Entregas em Minas Gerais</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A gente cuida do seu pedido do congelador até a sua porta. Nossa frota
            própria é refrigerada, então o pescado chega firme, no ponto certo e
            com aquele frescor de quem acabou de sair da indústria.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Snowflake, title: "Cadeia de frio", text: "Transporte 100% refrigerado, do nosso freezer direto ao seu." },
            { icon: Truck, title: "Frota própria", text: "Nossos motoristas conhecem a rota — nada de terceirizar sua encomenda." },
            { icon: MapPin, title: "Atendemos MG", text: "Fazemos entregas em Unaí e várias cidades de Minas Gerais." },
          ].map((b) => (
            <div key={b.title} className="rounded-2xl border border-border bg-card p-6">
              <b.icon className="h-8 w-8 text-pink" />
              <h3 className="mt-3 font-display text-lg text-navy">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-2xl text-navy">Como combinamos o frete</h2>
          <p className="mt-3 text-muted-foreground">
            Cada cidade tem uma logística diferente, então o valor da entrega é
            combinado direto com você depois do pedido. Assim a gente encontra a
            melhor rota, o melhor dia e o menor custo pra sua região.
          </p>
          <ol className="mt-5 space-y-3 text-sm text-foreground/80">
            <li><span className="font-semibold text-navy">1.</span> Você escolhe os produtos e finaliza o pedido pelo site.</li>
            <li><span className="font-semibold text-navy">2.</span> A gente entra em contato pra confirmar sua cidade e combinar o frete.</li>
            <li><span className="font-semibold text-navy">3.</span> Você paga por Pix e a gente agenda a entrega refrigerada.</li>
          </ol>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-pink px-5 py-2.5 text-sm font-semibold text-pink-foreground hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" /> Consultar entrega no WhatsApp
          </a>
        </div>
      </section>
    </PageShell>
  );
}
