import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, MapPin, Phone, Clock } from "lucide-react";
import { Logo } from "./Logo";
import { company } from "@/lib/company";

export function Footer() {
  return (
    <footer className="mt-20 bg-navy text-navy-foreground">
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

        <div>
          <h4 className="mb-3 text-sm font-display tracking-wider text-pink">NAVEGAÇÃO</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/" className="hover:text-pink">Início</Link></li>
            <li><Link to="/catalogo" className="hover:text-pink">Catálogo</Link></li>
            <li><Link to="/atacado" className="hover:text-pink">Atacado / Revenda</Link></li>
            <li><Link to="/sobre" className="hover:text-pink">Sobre nós</Link></li>
            <li><Link to="/entregas" className="hover:text-pink">Entregas</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-display tracking-wider text-pink">CONTATO</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-pink" />{company.phone}</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-pink" />{company.address.street}, {company.address.district}, {company.address.city}-{company.address.state} • CEP {company.address.zip}</li>
            <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-pink" />{company.hours}</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-display tracking-wider text-pink">REDES</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-pink"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-pink"><Facebook className="h-4 w-4" /></a>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-white/50">
            {company.legalName}<br />
            CNPJ: {company.cnpj}<br />
            Indústria Brasileira
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Pescados da Bia. Todos os direitos reservados.
      </div>
    </footer>
  );
}
