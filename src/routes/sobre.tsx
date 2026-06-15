import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Heart, Award, Users } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre nós — Pescados da Bia" },
      { name: "description", content: "Conheça a história da Pescados da Bia e nosso compromisso com qualidade, frescor e atendimento humano." },
    ],
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
          A <strong className="text-navy">Pescados da Bia</strong> nasceu da paixão de uma família por trazer
          o melhor da pesca direto para a mesa dos brasileiros. O que começou pequeno, com a Bia
          atendendo pessoalmente cada cliente, hoje é uma referência regional em qualidade,
          frescor e atendimento humano.
        </p>
        <p className="mt-4 leading-relaxed">
          Trabalhamos com produtores locais e seguimos rigorosos padrões de cadeia de frio para
          garantir que cada peixe, filé ou fruto do mar chegue até você com a mesma qualidade
          de quando saiu da água. "Sabor que conquista, qualidade que permanece" — esse é o nosso
          compromisso diário.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Heart, title: "Atendimento humano", text: "Cada cliente é tratado com carinho e atenção, como na primeira venda." },
            { icon: Award, title: "Qualidade certificada", text: "Produtos selecionados e cadeia de frio rigorosa, do produtor à sua casa." },
            { icon: Users, title: "Tradição familiar", text: "Mais de uma década atendendo famílias com pescados de confiança." },
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
