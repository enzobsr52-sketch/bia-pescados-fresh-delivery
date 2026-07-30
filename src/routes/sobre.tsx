import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Heart, ShieldCheck, Star } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Nossa história — Pescados da Bia" },
      { name: "description", content: "Da paixão pela pesca a uma unidade moderna de beneficiamento: conheça a história da Pescados da Bia e nosso compromisso com qualidade." },
      { property: "og:title", content: "Nossa história — Pescados da Bia" },
      { property: "og:description", content: "Da paixão pela pesca a uma unidade moderna de beneficiamento: conheça a história da Pescados da Bia e nosso compromisso com qualidade." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bia-pescados-fresh-delivery.lovable.app/sobre" }],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <PageShell>
      <section className="bg-navy text-navy-foreground">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-pink">Nossa história</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">A tradição que vem do rio até a sua casa.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 text-foreground/85">
        <p className="text-lg leading-relaxed">
          A <strong className="text-navy">Pescados da Bia</strong> nasceu da paixão pela pesca e da vontade
          de oferecer à nossa região produtos que antes eram difíceis de encontrar com qualidade,
          variedade e segurança.
        </p>
        <p className="mt-4 leading-relaxed">
          Percebemos que muitos consumidores precisavam buscar pescados diferenciados em outras
          cidades ou se contentavam com opções limitadas. Foi dessa necessidade que surgiu o
          propósito de construir uma empresa comprometida com excelência em cada etapa do processo.
        </p>
        <p className="mt-4 leading-relaxed">
          Hoje, contamos com uma moderna unidade de beneficiamento que segue rigorosos padrões de
          qualidade, preservando a cadeia de frio desde a seleção da matéria-prima até a entrega ao
          cliente. Nosso portfólio reúne uma linha completa de pescados selecionados, frutos do mar
          e produtos empanados, desenvolvidos para oferecer praticidade, sabor e segurança
          alimentar, atendendo tanto consumidores finais quanto estabelecimentos comerciais.
        </p>
        <p className="mt-4 leading-relaxed">
          Mais do que vender pescados, queremos desenvolver a cultura do consumo de produtos de
          excelência e nos tornar referência regional em qualidade, inovação e confiança. Esse
          compromisso está presente em cada produto que leva a marca Pescados da Bia, porque
          acreditamos que oferecer qualidade é a melhor forma de conquistar e fidelizar nossos
          clientes.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Heart,
              title: "Paixão pela pesca",
              text: "A paixão pela pesca foi o ponto de partida para transformar uma necessidade da região em uma empresa comprometida com qualidade e excelência.",
            },
            {
              icon: ShieldCheck,
              title: "Qualidade sem concessões",
              text: "Selecionamos matérias-primas de procedência confiável e seguimos rigorosamente a cadeia de frio para preservar sabor e segurança.",
            },
            {
              icon: Star,
              title: "Referência regional",
              text: "Nosso objetivo é oferecer à região produtos diferenciados, elevando o padrão de qualidade dos pescados e congelados disponíveis no mercado.",
            },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card p-6">
              <v.icon className="h-8 w-8 text-pink" />
              <h3 className="mt-3 font-display text-lg text-navy">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
