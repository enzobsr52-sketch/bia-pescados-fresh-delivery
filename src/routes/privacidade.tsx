import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { company } from "@/lib/company";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade e Cookies | Pescados da Bia" },
      {
        name: "description",
        content:
          "Como a Pescados da Bia coleta, usa e protege seus dados pessoais e quais cookies utilizamos na loja online.",
      },
      { property: "og:title", content: "Política de Privacidade e Cookies | Pescados da Bia" },
      {
        property: "og:description",
        content: "Transparência sobre uso de dados e cookies na loja da Pescados da Bia.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Política de Privacidade e Cookies | Pescados da Bia" },
      { name: "twitter:description", content: "Como tratamos seus dados na Pescados da Bia." },
    ],
  }),
  component: Privacidade,
});

function Privacidade() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl text-navy sm:text-4xl">Política de Privacidade</h1>
        <p className="mt-2 text-sm text-muted-foreground">Última atualização: agosto de 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/85">
          <section>
            <h2 className="font-display text-lg text-navy">1. Quem somos</h2>
            <p className="mt-2">
              {company.legalName} ({company.name}), CNPJ {company.cnpj}, com sede na{" "}
              {company.address.street}, {company.address.district}, {company.address.city}-
              {company.address.state}, é a responsável pelo tratamento dos dados coletados neste site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-navy">2. Dados que coletamos</h2>
            <p className="mt-2">
              Coletamos apenas o necessário para atender seu pedido: nome, telefone/WhatsApp,
              endereço de entrega e, no caso de revenda, razão social e CNPJ. Não vendemos nem
              compartilhamos seus dados com terceiros para fins publicitários.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-navy">3. Cookies</h2>
            <p className="mt-2">
              Utilizamos armazenamento local do navegador para guardar seu carrinho e sua preferência
              de compra (varejo ou atacado). São cookies essenciais ao funcionamento da loja. Você
              pode limpá-los a qualquer momento nas configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-navy">4. Seus direitos (LGPD)</h2>
            <p className="mt-2">
              Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pelo
              e-mail {company.email} ou pelo WhatsApp {company.phone}. Respondemos em até 15 dias.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-navy">5. Segurança</h2>
            <p className="mt-2">
              Adotamos medidas técnicas para proteger suas informações. Pagamentos via Pix são feitos
              diretamente no seu banco — nunca pedimos senha, código de acesso ou dados de cartão.
            </p>
          </section>
        </div>
      </article>
    </PageShell>
  );
}
