import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/pedidos")({
  head: () => ({ meta: [
    { title: "Pedidos | Pescados da Bia" },
    { name: "description", content: "Informações sobre o acompanhamento seguro dos pedidos da Pescados da Bia." },
    { property: "og:title", content: "Pedidos | Pescados da Bia" },
    { property: "og:description", content: "Informações sobre o acompanhamento seguro dos pedidos da Pescados da Bia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: () => <PageShell><main className="mx-auto max-w-3xl px-4 py-16"><h1 className="font-display text-3xl text-navy">Pedidos</h1><p className="mt-4 text-muted-foreground">O acompanhamento interno de pedidos está indisponível até que o acesso da loja seja configurado. Nenhum pagamento pode ser confirmado manualmente nesta página; a confirmação depende do PagBank.</p><Button asChild className="mt-6"><Link to="/">Voltar à loja</Link></Button></main></PageShell>,
});