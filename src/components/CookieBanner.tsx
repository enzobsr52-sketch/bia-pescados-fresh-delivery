import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const KEY = "pdb_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      /* storage indisponível */
    }
  }, []);

  const decide = (value: "accepted" | "essential") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur"
    >
      <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="min-w-0 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Usamos cookies para lembrar suas preferências (como o modo varejo ou atacado) e melhorar
          sua experiência de compra. Saiba mais na{" "}
          <Link to="/privacidade" className="font-semibold text-pink underline">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            onClick={() => decide("essential")}
            className="min-h-11 rounded-full border border-border px-4 text-sm font-semibold text-navy hover:bg-cream"
          >
            Só essenciais
          </button>
          <button
            onClick={() => decide("accepted")}
            className="min-h-11 rounded-full bg-pink px-5 text-sm font-semibold text-pink-foreground hover:brightness-110"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
