import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Truck, Snowflake, MapPin, MessageCircle } from "lucide-react";
import { company } from "@/lib/company";

export const Route = createFileRoute("/entregas")({
  head: () => ({
    meta: [
      { title: "Entregas — Pescados da Bia" },
      { name: "description", content: "Entregas da Pescados da Bia somente em Unaí, MG. Frete combinado após o pedido." },
      { property: "og:title", content: "Entregas em Unaí | Pescados da Bia" },
      { property: "og:description", content: "Entregas somente em Unaí, MG, com frete combinado após o pedido." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Entregas,
});

function Entregas() {
  const wa = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de saber sobre entrega em Unaí.")}`;
  return (
    <PageShell>
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="font-display text-3xl text-navy sm:text-4xl">Entregas em Unaí, MG</h1>
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
            { icon: MapPin, title: "Atendemos Unaí", text: "No momento, entregamos somente em Unaí, Minas Gerais." },
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
            O valor da entrega é combinado diretamente com você depois do pedido.
            Assim, alinhamos o dia e a rota para receber seus produtos em Unaí.
          </p>
          <ol className="mt-5 space-y-3 text-sm text-foreground/80">
            <li><span className="font-semibold text-navy">1.</span> Você escolhe os produtos e finaliza o pedido pelo site.</li>
            <li><span className="font-semibold text-navy">2.</span> Você paga por Pix e aguarda a confirmação do pagamento.</li>
            <li><span className="font-semibold text-navy">3.</span> A gente entra em contato para combinar o frete e agendar a entrega refrigerada.</li>
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
