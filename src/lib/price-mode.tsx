import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type PriceMode = "varejo" | "atacado";
const KEY = "pdb-price-mode-v1";
const APPROVED_KEY = "pdb-atacado-approved-v1";

interface Ctx {
  mode: PriceMode;
  setMode: (m: PriceMode) => void;
  /** true quando o usuário marcou que já recebeu aprovação de revendedor */
  wholesaleApproved: boolean;
  setWholesaleApproved: (v: boolean) => void;
  /** controla o modal de boas-vindas */
  needsChoice: boolean;
  dismissChoice: () => void;
}

const PriceModeCtx = createContext<Ctx | null>(null);

export function PriceModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<PriceMode>("varejo");
  const [wholesaleApproved, setApprovedState] = useState(false);
  const [needsChoice, setNeedsChoice] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY) as PriceMode | null;
      const approved = localStorage.getItem(APPROVED_KEY) === "1";
      setApprovedState(approved);
      if (stored === "varejo" || stored === "atacado") {
        setModeState(stored);
      } else {
        setNeedsChoice(true);
      }
    } catch {
      setNeedsChoice(true);
    }
    setHydrated(true);
  }, []);

  const setMode = (m: PriceMode) => {
    setModeState(m);
    try { localStorage.setItem(KEY, m); } catch {}
    setNeedsChoice(false);
  };
  const setWholesaleApproved = (v: boolean) => {
    setApprovedState(v);
    try { localStorage.setItem(APPROVED_KEY, v ? "1" : "0"); } catch {}
  };
  const dismissChoice = () => setNeedsChoice(false);

  return (
    <PriceModeCtx.Provider
      value={{
        mode,
        setMode,
        wholesaleApproved,
        setWholesaleApproved,
        needsChoice: hydrated && needsChoice,
        dismissChoice,
      }}
    >
      {children}
    </PriceModeCtx.Provider>
  );
}

export function usePriceMode() {
  const v = useContext(PriceModeCtx);
  if (!v) throw new Error("usePriceMode must be used inside PriceModeProvider");
  return v;
}
