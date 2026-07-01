import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/lib/products";
import { Search } from "lucide-react";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";

const schema = z.object({
  cat: fallback(z.string(), "").optional(),
});

export const Route = createFileRoute("/catalogo")({
  validateSearch: zodValidator(schema),
  head: () => ({
    meta: [
      { title: "Catálogo — Pescados da Bia" },
      { name: "description", content: "Catálogo completo de peixes frescos, filés, frutos do mar e congelados da Pescados da Bia." },
    ],
  }),
  component: Catalogo,
});

function Catalogo() {
  const { cat } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(cat ?? "Todos");
  const [maxPrice, setMaxPrice] = useState(100);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== "Todos" && p.category !== category) return false;
      if (p.priceRetail > maxPrice) return false;
      if (onlyAvailable && !p.inStock) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, category, maxPrice, onlyAvailable]);

  return (
    <PageShell>
      <section className="border-b border-border bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h1 className="font-display text-3xl text-navy sm:text-4xl">Catálogo</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} produto(s) encontrado(s)</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[260px_1fr]">
        {/* FILTERS */}
        <aside className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-navy">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Salmão, camarão..."
                className="w-full rounded-full border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-pink"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-navy">Categoria</div>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
              {["Todos", ...categories].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-3 py-1.5 text-left text-sm transition ${
                    category === c
                      ? "border-pink bg-pink text-pink-foreground"
                      : "border-border bg-card text-navy hover:border-pink"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-navy">
              <span>Preço máx.</span>
              <span className="text-pink">R$ {maxPrice}</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-pink"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-navy">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="h-4 w-4 accent-pink"
            />
            Somente disponíveis
          </label>
        </aside>

        {/* GRID */}
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Nenhum produto encontrado com esses filtros.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
