import { Link } from "@tanstack/react-router";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";
import { PriceModeBadge } from "./PriceModeBadge";

const links = [
  { to: "/", label: "Início" },
  { to: "/catalogo", label: "Produtos" },
  { to: "/sobre", label: "Sobre nós" },
  { to: "/entregas", label: "Entregas" },
  { to: "/atacado", label: "Revenda" },
];

export function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 md:flex md:justify-between md:py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo className="h-12 w-12 md:h-14 md:w-14" />
          <div className="leading-tight">
            <div className="font-display text-lg text-grape md:text-xl">PESCADOS</div>
            <div className="-mt-1 font-display text-base text-pink md:text-lg">DA BIA</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="border-b-2 border-transparent py-2 text-sm font-semibold text-navy/80 transition-colors hover:text-pink"
              activeProps={{ className: "border-pink text-pink" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <PriceModeBadge />
          <Link
            to="/catalogo"
            aria-label="Buscar produtos"
            title="Buscar produtos"
            className="hidden h-10 w-10 items-center justify-center text-navy transition-colors hover:text-pink sm:inline-flex"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            to="/carrinho"
            aria-label="Abrir carrinho"
            className="relative inline-flex h-10 w-10 items-center justify-center text-navy transition-colors hover:text-pink"
          >
            <ShoppingCart className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute right-0 top-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-pink px-1 text-[10px] font-bold text-pink-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            className="rounded-full border border-border p-2 text-navy md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-navy hover:bg-cream"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
