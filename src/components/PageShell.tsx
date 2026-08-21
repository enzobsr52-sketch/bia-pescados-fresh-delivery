import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { CookieBanner } from "./CookieBanner";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-navy-foreground"
      >
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </div>
  );
}
