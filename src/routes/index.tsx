import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { products, type Product } from "@/lib/products";
import { PriceTag } from "@/components/PriceTag";
import { useCart } from "@/lib/cart";
import { ArrowRight, Truck, Snowflake, BadgeCheck, Heart, ShoppingBasket, PackageCheck, Package, Megaphone } from "lucide-react";
import heroFish from "@/assets/img/hero-pescados.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pescados da Bia — Peixes frescos e congelados com entrega" },
      { name: "description", content: "Compre pescados frescos, filés, frutos do mar e congelados direto da Pescados da Bia. Entrega rápida e qualidade garantida." },
      { property: "og:title", content: "Pescados da Bia — Peixes frescos e congelados com entrega" },
      { property: "og:description", content: "Compre pescados frescos, filés, frutos do mar e congelados direto da Pescados da Bia. Entrega rápida e qualidade garantida." },
    ],
  }),
  component: Home,
});

const featuredIds = [
  "bolinho-bacalhau",
  "bolinho-camarao",
  "camarao-cream-cheese",
  "file-salmao",
  "costela-tambaqui",
  "camarao-gg",
];

const benefits = [
  { icon: Truck, title: "Entrega rápida", text: "Seu pedido no prazo e com segurança." },
  { icon: Snowflake, title: "Produtos congelados", text: "Mais frescor e qualidade em cada escolha." },
  { icon: BadgeCheck, title: "Procedência garantida", text: "Selecionamos o melhor para você." },
  { icon: Heart, title: "Atendimento especial", text: "Estamos aqui para ajudar sempre." },
];

function HomeProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <article className="group flex min-w-0 flex-col rounded-lg border border-border bg-card p-3 transition-all hover:-translate-y-1 hover:shadow-soft">
      <Link to="/produto/$id" params={{ id: product.id }} className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-cream">
        <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
      </Link>
      <Link to="/produto/$id" params={{ id: product.id }} className="mt-4 min-h-10 font-display text-sm leading-tight text-navy hover:text-pink">
        {product.name}
      </Link>
      <div className="mt-auto flex items-end justify-between gap-2 pt-3">
        <PriceTag product={product} />
        <button onClick={() => add(product.id)} aria-label={`Adicionar ${product.name} ao carrinho`} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-pink text-pink transition-colors hover:bg-pink hover:text-pink-foreground">
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function Home() {
  const featured = featuredIds.map((id) => products.find((product) => product.id === id)).filter((product): product is Product => Boolean(product));
  return (
    <PageShell>
      <section className="relative overflow-hidden bg-grape text-grape-foreground">
        <div className="absolute inset-0">
          <img
            src={heroFish}
            alt="Filés de salmão fresco sobre gelo em bancada de peixaria artesanal"
            className="h-full w-full object-cover object-center md:object-[70%_50%]"
            width={1600}
            height={907}
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-grape via-grape/90 to-grape/10" />
        <div className="absolute inset-0 bg-grape/35 md:hidden" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-20 md:py-24">
          <div className="max-w-xl min-w-0">
            <span className="text-xs font-bold uppercase text-grape-foreground/90">
              Peixes, frutos do mar e produtos congelados
            </span>
            <h1 className="mt-4 font-display text-[2.25rem] leading-[1.02] sm:text-5xl md:text-6xl">
              Sabor e qualidade<br className="hidden sm:block" />
              <span className="text-accent">em cada refeição.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-grape-foreground/90 sm:text-base">
              Produtos selecionados, com procedência e praticidade para o seu dia a dia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-pink px-7 py-3 text-sm font-bold text-pink-foreground shadow-pink transition-transform hover:scale-105"
              >
                Ver catálogo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/sobre"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-grape-foreground/70 px-7 py-3 text-sm font-bold text-grape-foreground hover:bg-grape-foreground/10"
              >
                Conheça a Bia
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background" aria-label="Vantagens">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 py-6 md:grid-cols-4 md:py-8">
          {benefits.map((benefit, index) => (
            <div key={benefit.title} className={`px-3 py-4 text-center md:px-7 ${index % 2 === 1 ? "border-l border-border" : ""} ${index > 1 ? "border-t border-border md:border-t-0" : ""} ${index > 0 ? "md:border-l" : ""}`}>
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent text-pink">
                <benefit.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-3 font-display text-sm text-navy sm:text-base">{benefit.title}</h2>
              <p className="mx-auto mt-1 max-w-40 text-xs leading-relaxed text-muted-foreground">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-pink">Nossos produtos</div>
            <h2 className="font-display text-2xl text-navy sm:text-4xl">Do mar para a <span className="text-pink">sua mesa.</span></h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">Confira nossas categorias e escolha o que mais combina com você.</p>
          </div>
          <Link to="/catalogo" className="hidden min-h-11 items-center gap-2 rounded-full border border-pink px-5 py-2 text-sm font-bold text-pink hover:bg-pink hover:text-pink-foreground sm:inline-flex">
            Ver todos os produtos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((product) => <HomeProductCard key={product.id} product={product} />)}
        </div>
        <Link to="/catalogo" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-pink px-5 py-2 text-sm font-bold text-pink sm:hidden">Ver todos os produtos <ArrowRight className="h-4 w-4" /></Link>
      </section>

      <section className="bg-secondary py-14 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1fr_2fr] lg:items-center">
          <div>
            <div className="font-display text-2xl text-pink">Como funciona</div>
            <h2 className="mt-2 font-display text-2xl leading-tight text-navy sm:text-3xl">Do pedido à entrega,<br />é simples!</h2>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">Facilitamos o seu dia a dia para que você foque no que realmente importa: o seu negócio.</p>
          </div>
          <ol className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: ShoppingBasket, title: "Escolha os produtos", text: "Navegue pelo nosso catálogo e faça seu pedido." },
              { icon: PackageCheck, title: "Preparamos com cuidado", text: "Tudo é selecionado e embalado com segurança." },
              { icon: Truck, title: "Entregamos para você", text: "Com agilidade e pontualidade." },
            ].map((step, index) => (
              <li key={step.title} className="relative text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-pink"><step.icon className="h-6 w-6" /></div>
                <h3 className="mt-4 font-display text-sm text-navy">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-44 text-xs leading-relaxed text-muted-foreground">{step.text}</p>
                {index < 2 && <ArrowRight className="absolute -right-3 top-4 hidden h-4 w-4 text-pink/60 sm:block" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[1fr_1.8fr] md:items-center md:py-16">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-pink"><Megaphone className="h-5 w-5" /> Fique por dentro</div>
          <h2 className="mt-3 font-display text-2xl leading-tight text-navy sm:text-3xl">Novidades, receitas e dicas do mundo dos pescados.</h2>
          <Link to="/catalogo" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-pink px-5 py-2 text-sm font-bold text-pink hover:bg-pink hover:text-pink-foreground">Ver todas <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Receitas", image: products.find((p) => p.id === "camarao-empanado")?.image },
            { label: "Novidades", image: heroFish },
            { label: "Dicas", image: products.find((p) => p.id === "posta-tambaqui")?.image },
          ].map((item) => (
            <div key={item.label} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-cream">
              {item.image && <img src={item.image} alt="" loading="lazy" className="h-full w-full object-cover" />}
              <span className="absolute bottom-2 left-2 rounded-full bg-pink px-3 py-1 text-[10px] font-bold text-pink-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
