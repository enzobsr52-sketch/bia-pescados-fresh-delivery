import { Store, Building2, Fish } from "lucide-react";
import { usePriceMode } from "@/lib/price-mode";
import { Logo } from "./Logo";

export function PriceModeModal() {
  const { needsChoice, setMode } = usePriceMode();
  if (!needsChoice) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-background p-6 shadow-2xl sm:p-8">
        <div className="flex items-center gap-3">
          <Logo className="h-12 w-12" />
          <div>
            <div className="font-display text-xl text-navy">Bem-vindo à Pescados da Bia</div>
            <div className="text-xs text-muted-foreground">Selecione seu perfil de compra para continuar</div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => setMode("varejo")}
            className="group flex flex-col items-start gap-2 rounded-2xl border-2 border-border bg-card p-5 text-left transition hover:border-pink hover:shadow-soft"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pink/10 text-pink group-hover:bg-pink group-hover:text-pink-foreground">
              <Store className="h-5 w-5" />
            </div>
            <div className="font-display text-base text-navy">Sou Consumidor</div>
            <div className="text-xs text-muted-foreground">Varejo — preços unitários para sua casa.</div>
          </button>

          <button
            onClick={() => setMode("atacado")}
            className="group flex flex-col items-start gap-2 rounded-2xl border-2 border-border bg-card p-5 text-left transition hover:border-pink hover:shadow-soft"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy/10 text-navy group-hover:bg-navy group-hover:text-navy-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="font-display text-base text-navy">Sou Revendedor</div>
            <div className="text-xs text-muted-foreground">Atacado — supermercados, peixarias, restaurantes.</div>
          </button>
        </div>

        <p className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Fish className="h-3 w-3 text-pink" />
          Você pode trocar de perfil a qualquer momento no menu superior.
        </p>
      </div>
    </div>
  );
}
