import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { company } from "@/lib/company";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso e Compra | Pescados da Bia" },
      {
        name: "description",
        content:
          "Condições de compra, pagamento via Pix, entrega, trocas e devoluções da loja online Pescados da Bia.",
      },
      { property: "og:title", content: "Termos de Uso e Compra | Pescados da Bia" },
      {
        property: "og:description",
        content: "Condições de compra, pagamento, entrega e trocas na Pescados da Bia.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Termos de Uso e Compra | Pescados da Bia" },
      { name: "twitter:description", content: "Condições de compra e entrega da Pescados da Bia." },
    ],
  }),
  component: Termos,
});

function Termos() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl text-navy sm:text-4xl">Termos de Uso</h1>
        <p className="mt-2 text-sm text-muted-foreground">Última atualização: agosto de 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/85">
          <section>
            <h2 className="font-display text-lg text-navy">1. Sobre a loja</h2>
            <p className="mt-2">
              Este site é operado por {company.legalName} ({company.name}), CNPJ {company.cnpj},
              localizada em {company.address.city}-{company.address.state}. Ao navegar ou comprar,
              você concorda com estes termos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-navy">2. Preços e modalidades</h2>
            <p className="mt-2">
              Trabalhamos com duas modalidades: varejo (consumidor final) e atacado (revenda, com
              cadastro e aprovação). Os preços de atacado são liberados após análise dos dados da
              empresa. Valores podem ser atualizados sem aviso prévio; vale o preço apresentado no
              momento da confirmação do pedido.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-navy">3. Pagamento</h2>
            <p className="mt-2">
              O pagamento é feito via Pix, com QR Code gerado no checkout. O pedido é separado após a
              confirmação do pagamento. O frete é combinado diretamente com nossa equipe pelo
              WhatsApp {company.phone}, conforme a região de entrega.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-navy">4. Entrega</h2>
            <p className="mt-2">
              Entregamos em Minas Gerais com transporte refrigerado. Prazos variam conforme a cidade
              e são informados na confirmação do pedido. É necessário que haja alguém no local para
              receber a mercadoria congelada.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-navy">5. Trocas e devoluções</h2>
            <p className="mt-2">
              Por se tratar de alimento perecível, eventuais divergências ou problemas de qualidade
              devem ser comunicados no ato do recebimento, com registro fotográfico. Nesses casos
              fazemos a troca do produto ou o estorno integral do valor. Conforme o Código de Defesa
              do Consumidor, compras online têm 7 dias de arrependimento, desde que o produto não
              tenha sido descongelado ou aberto.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-navy">6. Contato</h2>
            <p className="mt-2">
              Dúvidas: {company.email} • WhatsApp {company.phone} • {company.hours}.
            </p>
          </section>
        </div>
      </article>
    </PageShell>
  );
}
