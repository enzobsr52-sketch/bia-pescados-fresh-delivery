import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/lib/products";
import { ArrowRight, Truck, Snowflake, ShieldCheck, Star } from "lucide-react";
import heroFish from "@/assets/hero-fish.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pescados da Bia — Peixes frescos e congelados com entrega" },
      { name: "description", content: "Compre pescados frescos, filés, frutos do mar e congelados direto da Pescados da Bia. Entrega rápida e qualidade garantida." },
      { property: "og:title", content: "Pescados da Bia" },
      { property: "og:description", content: "Sabor que conquista. Qualidade que permanece." },
    ],
  }),
  component: Home,
});

const testimonials = [
  { name: "Mariana S.", text: "Salmão sempre fresquinho e entrega super rápida. Virei cliente fiel!", rating: 5 },
  { name: "Roberto L.", text: "A costela de tambaqui é simplesmente sensacional. Recomendo demais.", rating: 5 },
  { name: "Patrícia A.", text: "Atendimento maravilhoso e produtos de altíssima qualidade.", rating: 5 },
];

function Home() {
  const featured = products.filter((p) => p.featured);
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-navy-foreground">
        <div className="absolute inset-0 opacity-40">
          <img src={heroFish} alt="" className="h-full w-full object-cover" width={1600} height={900} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-20 md:py-28 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-pink/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-pink">
              <Star className="h-3 w-3 fill-pink" /> Promoção da semana
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
              Sabor que <span className="text-pink">conquista.</span><br />
              Qualidade que <span className="text-pink">permanece.</span>
            </h1>
            <p className="mt-5 max-w-lg text-white/80">
              Peixes frescos, filés, frutos do mar e congelados selecionados a dedo, entregues com agilidade na sua casa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded-full bg-pink px-6 py-3 font-semibold text-pink-foreground shadow-pink transition-transform hover:scale-105"
              >
                Ver catálogo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/sobre"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                Conheça a Bia
              </Link>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 text-xs">
              {[
                { icon: Truck, label: "Entrega rápida" },
                { icon: Snowflake, label: "Cadeia de frio" },
                { icon: ShieldCheck, label: "100% Natural" },
              ].map((b) => (
                <div key={b.label} className="rounded-xl bg-white/5 p-3 backdrop-blur">
                  <b.icon className="mb-2 h-5 w-5 text-pink" />
                  <div className="font-semibold">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl text-navy sm:text-3xl">Categorias</h2>
            <p className="text-sm text-muted-foreground">Encontre o pescado perfeito para sua mesa</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c}
              to="/catalogo"
              search={{ cat: c } as never}
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-pink hover:shadow-soft"
            >
              <div className="font-display text-sm text-navy group-hover:text-pink">{c}</div>
              <div className="mt-1 text-xs text-muted-foreground">Ver produtos →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl text-navy sm:text-3xl">Destaques da semana</h2>
          <Link to="/catalogo" className="text-sm font-semibold text-pink hover:underline">
            Ver tudo →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-pink to-pink/70 p-8 text-pink-foreground md:p-12">
          <div className="max-w-xl">
            <div className="text-xs font-semibold uppercase tracking-widest">Frota própria</div>
            <h3 className="mt-2 font-display text-3xl md:text-4xl">Entrega refrigerada em toda a região.</h3>
            <p className="mt-3 text-white/90">Do Noroeste de Minas ao Triângulo, DF e Goiás. Confira as áreas atendidas.</p>
            <Link to="/entregas" className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-navy-foreground">
              Ver regiões <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <h2 className="mb-6 font-display text-2xl text-navy sm:text-3xl">O que dizem nossos clientes</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex gap-0.5 text-pink">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-pink" />)}
              </div>
              <p className="text-sm text-foreground/80">"{t.text}"</p>
              <div className="mt-4 text-xs font-semibold text-navy">{t.name}</div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
