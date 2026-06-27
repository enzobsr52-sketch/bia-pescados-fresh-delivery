import postaSurubim from "@/assets/IMG-20260615-WA0022.jpg.asset.json";
import costelaTambaqui from "@/assets/IMG-20260615-WA0021.jpg.asset.json";
import postaTambaqui from "@/assets/IMG-20260615-WA0020.jpg.asset.json";
import saithe from "@/assets/IMG-20260615-WA0019.jpg.asset.json";
import salmao from "@/assets/IMG-20260623-WA0001.jpg.asset.json";
import camaraoGG from "@/assets/IMG-20260623-WA0005.jpg.asset.json";
import bolinhoTilapia from "@/assets/IMG-20260620-WA0014.jpg.asset.json";
import bolinhoCamarao from "@/assets/IMG-20260620-WA0015.jpg.asset.json";
import bolinhoBacalhau from "@/assets/IMG-20260620-WA0013.jpg.asset.json";
import iscaTilapia from "@/assets/IMG-20260620-WA0012.jpg.asset.json";
import camaraoEmpanado from "@/assets/IMG-20260620-WA0011.jpg.asset.json";
import hotFiladelfia from "@/assets/IMG-20260620-WA0010.jpg.asset.json";

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
  /** Preço sugerido por unidade no atacado (revenda) — exibido só p/ atacadistas */
  priceWholesale: number;
  oldPrice?: number;
  weight: string;
  image: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
}

export const products: Product[] = [
  // ── Linha Pescados (in natura, congelados) ─────────────────────────
  {
    id: "file-salmao",
    name: "Filé de Salmão com Pele",
    category: "Linha Pescados",
    priceRetail: 69.9,
    priceWholesale: 54.9,
    oldPrice: 79.9,
    weight: "400g",
    image: salmao.url,
    description: "Filé de salmão congelado com pele, rico em ômega 3. Corte uniforme, ideal para grelhar, assar ou preparar em receitas asiáticas.",
    inStock: true,
    featured: true,
  },
  {
    id: "camarao-gg",
    name: "Camarão GG Eviscerado com Cauda",
    category: "Frutos do Mar",
    priceRetail: 59.9,
    priceWholesale: 46.9,
    weight: "200g",
    image: camaraoGG.url,
    description: "Camarão Litopenaeus vannamei graúdo, limpo e eviscerado, mantendo a cauda para apresentação. Perfeito para risotos, massas e empanados.",
    inStock: true,
    featured: true,
  },
  {
    id: "posta-surubim",
    name: "Posta de Surubim Congelada",
    category: "Linha Pescados",
    priceRetail: 42.9,
    priceWholesale: 33.5,
    oldPrice: 49.9,
    weight: "450g",
    image: postaSurubim.url,
    description: "Postas selecionadas de surubim, peixe nobre de água doce, com carne branca e firme. Ideal para assados, grelhados e moquecas.",
    inStock: true,
  },
  {
    id: "costela-tambaqui",
    name: "Costela de Tambaqui Congelada",
    category: "Linha Pescados",
    priceRetail: 54.9,
    priceWholesale: 42.9,
    weight: "450g",
    image: costelaTambaqui.url,
    description: "A famosa costela de tambaqui, suculenta e marcante. Perfeita para o churrasco — basta temperar e levar à brasa.",
    inStock: true,
    featured: true,
  },
  {
    id: "posta-tambaqui",
    name: "Posta de Tambaqui Congelada",
    category: "Linha Pescados",
    priceRetail: 49.9,
    priceWholesale: 38.9,
    weight: "450g",
    image: postaTambaqui.url,
    description: "Postas generosas de tambaqui congeladas no ponto certo. Carne saborosa, ideal para fritar, grelhar ou assar.",
    inStock: true,
  },
  {
    id: "file-saithe",
    name: "Filé de Saithe Dessalgado",
    category: "Linha Pescados",
    priceRetail: 38.9,
    priceWholesale: 30.5,
    weight: "400g",
    image: saithe.url,
    description: "Filé de saithe dessalgado e congelado, pronto para preparar bolinhos, bacalhoadas e refeições do dia a dia.",
    inStock: true,
  },

  // ── Empanados & Prontos para preparo ───────────────────────────────
  {
    id: "bolinho-tilapia",
    name: "Bolinho de Tilápia Congelado",
    category: "Empanados & Prontos",
    priceRetail: 30.9,
    priceWholesale: 23.9,
    weight: "375g",
    image: bolinhoTilapia.url,
    description: "Bolinhos crocantes de tilápia, temperados e empanados, prontos para fritar. Petisco delicioso para qualquer ocasião.",
    inStock: true,
  },
  {
    id: "bolinho-camarao",
    name: "Bolinho de Camarão Congelado",
    category: "Empanados & Prontos",
    priceRetail: 34.9,
    priceWholesale: 27.5,
    weight: "375g",
    image: bolinhoCamarao.url,
    description: "Bolinhos de camarão na medida certa de sabor, empanados e prontos para fritar. Crocante por fora, macio por dentro.",
    inStock: true,
    featured: true,
  },
  {
    id: "bolinho-bacalhau",
    name: "Bolinho de Bacalhau Congelado",
    category: "Empanados & Prontos",
    priceRetail: 36.9,
    priceWholesale: 28.9,
    weight: "375g",
    image: bolinhoBacalhau.url,
    description: "Tradicional bolinho de bacalhau, com massa leve e recheio saboroso. Direto do congelador para a frigideira.",
    inStock: true,
  },
  {
    id: "isca-tilapia",
    name: "Isca de Tilápia Temperada e Empanada",
    category: "Empanados & Prontos",
    priceRetail: 32.9,
    priceWholesale: 25.5,
    weight: "380g",
    image: iscaTilapia.url,
    description: "Iscas de tilápia já temperadas e empanadas, congeladas. Praticidade total: basta fritar e servir.",
    inStock: true,
  },
  {
    id: "camarao-empanado-recheado",
    name: "Camarão Empanado Recheado com Requeijão Cremoso",
    category: "Empanados & Prontos",
    priceRetail: 45.0,
    priceWholesale: 35.9,
    weight: "400g",
    image: camaraoEmpanado.url,
    description: "Bandeja com camarões empanados recheados com requeijão cremoso. Receita exclusiva da casa, sucesso garantido nas festas.",
    inStock: true,
    featured: true,
  },
  {
    id: "hot-filadelfia",
    name: "Hot Filadélfia — Sushi Empanado de Salmão com Cream Cheese",
    category: "Empanados & Prontos",
    priceRetail: 54.9,
    priceWholesale: 42.9,
    weight: "500g",
    image: hotFiladelfia.url,
    description: "Sushi empanado de salmão com cream cheese, pronto para fritar. Crocante por fora, cremoso por dentro — o nosso campeão de vendas.",
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
