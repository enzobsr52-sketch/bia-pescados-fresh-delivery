import postaSurubim from "@/assets/img/IMG-20260615-WA0022.webp";
import costelaTambaqui from "@/assets/img/IMG-20260615-WA0021.webp";
import postaTambaqui from "@/assets/img/IMG-20260615-WA0020.webp";
import saithe from "@/assets/img/IMG-20260615-WA0019.webp";
import salmao from "@/assets/img/IMG-20260623-WA0001.webp";
import camaraoGG from "@/assets/img/IMG-20260623-WA0005.webp";
import bolinhoTilapia from "@/assets/img/IMG-20260620-WA0014.webp";
import bolinhoCamarao from "@/assets/img/IMG-20260620-WA0015.webp";
import bolinhoBacalhau from "@/assets/img/IMG-20260620-WA0013.webp";
import iscaTilapia from "@/assets/img/IMG-20260620-WA0012.webp";
import hotFiladelfia from "@/assets/img/IMG-20260620-WA0010.webp";
import camaraoEmpanado340 from "@/assets/img/camarao-empanado-340.webp";
import camaraoCreamCheese from "@/assets/img/camarao-cream-cheese.webp";
import miniTemaki from "@/assets/img/mini-temaki.webp";

export type Category =
  | "Linha Pescados"
  | "Empanados & Prontos"
  | "Frutos do Mar";

export interface Product {
  id: string;
  name: string;
  category: Category;
  /** Preço unitário no varejo (consumidor final) */
  priceRetail: number;
  /** Preço unitário no atacado (revenda) — exibido só p/ atacadistas aprovados */
  priceWholesale: number;
  /** Quantidade de unidades por caixa (atacado) */
  boxQty?: number;
  /** Preço da caixa fechada no atacado */
  boxPrice?: number;
  weight: string;
  image: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
}

export const products: Product[] = [
  // ── Empanados & Prontos ────────────────────────────────────────────
  {
    id: "bolinho-bacalhau",
    name: "Bolinho de Bacalhau",
    category: "Empanados & Prontos",
    priceRetail: 36.9,
    priceWholesale: 26.9,
    boxQty: 15,
    boxPrice: 403.5,
    weight: "375g",
    image: bolinhoBacalhau,
    description: "Tradicional bolinho de bacalhau, com massa leve e recheio saboroso. Direto do congelador para a frigideira.",
    inStock: true,
    featured: true,
  },
  {
    id: "bolinho-camarao",
    name: "Bolinho de Camarão",
    category: "Empanados & Prontos",
    priceRetail: 36.9,
    priceWholesale: 26.9,
    boxQty: 20,
    boxPrice: 538.0,
    weight: "375g",
    image: bolinhoCamarao,
    description: "Bolinhos de camarão empanados e prontos para fritar. Crocante por fora, macio por dentro.",
    inStock: true,
    featured: true,
  },
  {
    id: "bolinho-tilapia",
    name: "Bolinho de Tilápia",
    category: "Empanados & Prontos",
    priceRetail: 31.9,
    priceWholesale: 22.9,
    boxQty: 20,
    boxPrice: 458.0,
    weight: "375g",
    image: bolinhoTilapia,
    description: "Bolinhos crocantes de tilápia, temperados e empanados, prontos para fritar.",
    inStock: true,
  },
  {
    id: "isca-tilapia",
    name: "Isca de Tilápia Temperada e Empanada",
    category: "Empanados & Prontos",
    priceRetail: 39.9,
    priceWholesale: 29.9,
    boxQty: 15,
    boxPrice: 448.5,
    weight: "380g",
    image: iscaTilapia,
    description: "Filé de tilápia em tiras, temperado e empanado. Praticidade total: basta fritar e servir.",
    inStock: true,
  },
  {
    id: "camarao-empanado",
    name: "Camarão Empanado",
    category: "Empanados & Prontos",
    priceRetail: 39.9,
    priceWholesale: 28.9,
    boxQty: 12,
    boxPrice: 346.8,
    weight: "340g",
    image: camaraoEmpanado340,
    description: "Camarão empanado tradicional, crocante e no ponto certo do tempero. Pronto para fritar.",
    inStock: true,
  },
  {
    id: "camarao-cream-cheese",
    name: "Camarão Recheado com Cream Cheese",
    category: "Empanados & Prontos",
    priceRetail: 45.9,
    priceWholesale: 33.9,
    boxQty: 12,
    boxPrice: 406.8,
    weight: "400g",
    image: camaraoCreamCheese,
    description: "Camarões empanados recheados com cream cheese. Receita cremosa, ideal para festas e petiscos.",
    inStock: true,
    featured: true,
  },
  {
    id: "mini-temaki",
    name: "Mini Temaki Recheado com Salmão e Cream Cheese",
    category: "Empanados & Prontos",
    priceRetail: 45.9,
    priceWholesale: 33.9,
    boxQty: 12,
    boxPrice: 406.8,
    weight: "400g",
    image: miniTemaki,
    description: "Mini temakis empanados recheados com salmão e cream cheese. Crocantes por fora, cremosos por dentro — prontos para fritar.",
    inStock: true,
    featured: true,
  },
  {
    id: "hot-filadelfia",
    name: "Hot Filadélfia — Sushi de Salmão com Cream Cheese",
    category: "Empanados & Prontos",
    priceRetail: 52.9,
    priceWholesale: 38.9,
    boxQty: 12,
    boxPrice: 466.8,
    weight: "500g",
    image: hotFiladelfia,
    description: "Sushi empanado recheado com salmão e cream cheese, pronto para fritar. Crocante por fora, cremoso por dentro.",
    inStock: true,
    featured: true,
  },

  // ── Linha Pescados ─────────────────────────────────────────────────
  {
    id: "costela-tambaqui",
    name: "Costela de Tambaqui",
    category: "Linha Pescados",
    priceRetail: 27.9,
    priceWholesale: 19.9,
    boxQty: 25,
    boxPrice: 497.5,
    weight: "450g",
    image: costelaTambaqui,
    description: "A famosa costela de tambaqui, suculenta e marcante. Perfeita para o churrasco.",
    inStock: true,
    featured: true,
  },
  {
    id: "posta-tambaqui",
    name: "Posta de Tambaqui",
    category: "Linha Pescados",
    priceRetail: 24.9,
    priceWholesale: 17.9,
    boxQty: 25,
    boxPrice: 447.5,
    weight: "450g",
    image: postaTambaqui,
    description: "Postas generosas de tambaqui congeladas no ponto certo. Ideal para fritar, grelhar ou assar.",
    inStock: true,
  },
  {
    id: "posta-surubim",
    name: "Posta de Surubim",
    category: "Linha Pescados",
    priceRetail: 39.9,
    priceWholesale: 28.9,
    boxQty: 25,
    boxPrice: 722.5,
    weight: "450g",
    image: postaSurubim,
    description: "Postas selecionadas de surubim, peixe nobre de água doce. Carne branca e firme.",
    inStock: true,
  },
  {
    id: "file-saithe",
    name: "Filé de Saithe Dessalgado (tipo bacalhau)",
    category: "Linha Pescados",
    priceRetail: 54.9,
    priceWholesale: 39.9,
    boxQty: 25,
    boxPrice: 997.5,
    weight: "400g",
    image: saithe,
    description: "Filé de saithe dessalgado tipo bacalhau, congelado. Pronto para bolinhos, bacalhoadas e receitas tradicionais.",
    inStock: true,
  },
  {
    id: "file-salmao",
    name: "Filé de Salmão com Pele",
    category: "Linha Pescados",
    priceRetail: 66.9,
    priceWholesale: 48.5,
    boxQty: 25,
    boxPrice: 1212.5,
    weight: "porção",
    image: salmao,
    description: "Filé de salmão congelado com pele, rico em ômega 3. Ideal para grelhar, assar ou preparar em receitas asiáticas.",
    inStock: true,
    featured: true,
  },
  {
    id: "camarao-gg",
    name: "Camarão Cinza Eviscerado GG",
    category: "Frutos do Mar",
    priceRetail: 51.9,
    priceWholesale: 37.9,
    boxQty: 25,
    boxPrice: 947.5,
    weight: "200g",
    image: camaraoGG,
    description: "Camarão cinza graúdo (GG), limpo e eviscerado. Perfeito para risotos, massas e empanados.",
    inStock: true,
    featured: true,
  },
];

export const categories: Category[] = [
  "Linha Pescados",
  "Empanados & Prontos",
  "Frutos do Mar",
];

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const getProduct = (id: string) => products.find((p) => p.id === id);
