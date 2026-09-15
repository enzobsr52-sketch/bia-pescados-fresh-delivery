import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, MapPin, Phone, Clock } from "lucide-react";
import { Logo } from "./Logo";
import { company } from "@/lib/company";

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12" />
            <div className="font-display">
              <div className="text-lg">PESCADOS</div>
              <div className="-mt-1 text-sm text-pink">DA BIA</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70">
            Sabor que conquista. Qualidade que permanece. Pescados frescos e congelados direto para sua casa.
          </p>
        </div>

        <nav aria-label="Navegação do rodapé">
          <h4 className="mb-3 text-sm font-display tracking-wider text-pink">NAVEGAÇÃO</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/" className="hover:text-pink">Início</Link></li>
            <li><Link to="/catalogo" className="hover:text-pink">Catálogo</Link></li>
            <li><Link to="/atacado" className="hover:text-pink">Atacado / Revenda</Link></li>
            <li><Link to="/sobre" className="hover:text-pink">Sobre nós</Link></li>
            <li><Link to="/entregas" className="hover:text-pink">Entregas</Link></li>
            <li><Link to="/termos" className="hover:text-pink">Termos de uso</Link></li>
            <li><Link to="/privacidade" className="hover:text-pink">Privacidade e cookies</Link></li>
          </ul>
        </nav>

        <div>
          <h4 className="mb-3 text-sm font-display tracking-wider text-pink">CONTATO</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-pink" aria-hidden="true" />{company.phone}</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pink" aria-hidden="true" />{company.address.street}, {company.address.district}, {company.address.city}-{company.address.state} • CEP {company.address.zip}</li>
            <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-pink" aria-hidden="true" />{company.hours}</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-display tracking-wider text-pink">REDES</h4>
          <div className="flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Pescados da Bia" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-pink"><Instagram className="h-4 w-4" aria-hidden="true" /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook da Pescados da Bia" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-pink"><Facebook className="h-4 w-4" aria-hidden="true" /></a>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-white/60">
            {company.legalName}<br />
            CNPJ: {company.cnpj}<br />
            Indústria Brasileira
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60">
        <p>© {new Date().getFullYear()} Pescados da Bia. Todos os direitos reservados.</p>
        <p className="mt-1">Site produzido por Biosites Profissional 2026.</p>
      </div>
    </footer>
  );
}

