import { Store, Building2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { usePriceMode } from "@/lib/price-mode";

export function PriceModeBadge() {
  const { mode, setMode } = usePriceMode();
  const [open, setOpen] = useState(false);
  const Icon = mode === "varejo" ? Store : Building2;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-navy hover:border-pink"
      >
        <Icon className="h-3.5 w-3.5 text-pink" />
        <span className="hidden sm:inline">{mode === "varejo" ? "Varejo" : "Atacado"}</span>
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-soft">
            {[
              { v: "varejo" as const, label: "Sou consumidor", desc: "Preços varejo" },
              { v: "atacado" as const, label: "Sou revendedor", desc: "Preços atacado" },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => { setMode(o.v); setOpen(false); }}
                className={`block w-full px-3 py-2 text-left text-xs hover:bg-cream ${mode === o.v ? "bg-cream" : ""}`}
              >
                <div className="font-semibold text-navy">{o.label}</div>
                <div className="text-[10px] text-muted-foreground">{o.desc}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
