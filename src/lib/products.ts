import surubim from "@/assets/IMG-20260615-WA0022.jpg.asset.json";
import costelaTambaqui from "@/assets/IMG-20260615-WA0021.jpg.asset.json";
import postaTambaqui from "@/assets/IMG-20260615-WA0020.jpg.asset.json";
import saithe from "@/assets/IMG-20260615-WA0019.jpg.asset.json";
import salmao from "@/assets/IMG-20260615-WA0018.jpg.asset.json";
import camarao from "@/assets/IMG-20260615-WA0017.jpg.asset.json";
import bolinhoTilapia from "@/assets/IMG-20260615-WA0016.jpg.asset.json";
import camaraoEmpanado from "@/assets/IMG-20260615-WA0015.jpg.asset.json";

export type Category =
  | "Peixes Frescos"
  | "Filés"
  | "Frutos do Mar"
  | "Congelados"
  | "Kits Churrasco";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  weight: string;
  image: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "posta-surubim",
    name: "Posta de Surubim Congelada",
    category: "Congelados",
    price: 42.9,
    oldPrice: 49.9,
    weight: "450g",
    image: surubim.url,
    description: "Postas selecionadas de surubim, peixe nobre de água doce, com carne branca e firme. Congelamento rápido que preserva o sabor e os nutrientes. Ideal para assados, grelhados e moquecas.",
    inStock: true,
    featured: true,
  },
  {
    id: "costela-tambaqui",
    name: "Costela de Tambaqui Congelada",
    category: "Congelados",
    price: 54.9,
    weight: "450g",
    image: costelaTambaqui.url,
    description: "A famosa costela de tambaqui, suculenta e marcante. Perfeita para o churrasco — basta temperar e levar à brasa.",
    inStock: true,
    featured: true,
  },
  {
    id: "posta-tambaqui",
    name: "Posta de Tambaqui Congelada",
    category: "Congelados",
    price: 49.9,
    weight: "450g",
    image: postaTambaqui.url,
    description: "Postas generosas de tambaqui congeladas no ponto certo. Carne saborosa, ideal para fritar, grelhar ou assar.",
    inStock: true,
  },
  {
    id: "file-saithe",
    name: "Filé de Saithe Dessalgado",
    category: "Filés",
    price: 38.9,
    weight: "400g",
    image: saithe.url,
    description: "Filé de saithe dessalgado e congelado, pronto para preparar bolinhos, bacalhoadas e refeições do dia a dia.",
    inStock: true,
  },
  {
    id: "file-salmao",
    name: "Filé de Salmão com Pele",
    category: "Filés",
    price: 69.9,
    oldPrice: 79.9,
    weight: "400g",
    image: salmao.url,
    description: "Filé de salmão fresco com pele, rico em ômega 3. Corte uniforme, ideal para grelhar, assar ou preparar em receitas asiáticas.",
    inStock: true,
    featured: true,
  },
  {
    id: "camarao-gg",
    name: "Camarão GG Eviscerado com Cauda",
    category: "Frutos do Mar",
    price: 59.9,
    weight: "200g",
    image: camarao.url,
    description: "Camarão graúdo limpo e eviscerado, mantendo a cauda para uma apresentação impecável. Perfeito para risotos, massas e empanados.",
    inStock: true,
    featured: true,
  },
  {
    id: "bolinho-tilapia",
    name: "Bolinho de Tilápia Congelado",
    category: "Congelados",
    price: 30.9,
    weight: "375g",
    image: bolinhoTilapia.url,
    description: "Bolinhos crocantes de tilápia, prontos para fritar. Petisco delicioso para qualquer ocasião.",
    inStock: true,
  },
  {
    id: "camarao-empanado-recheado",
    name: "Camarão Empanado Recheado com Requeijão",
    category: "Frutos do Mar",
    price: 45.0,
    weight: "400g",
    image: camaraoEmpanado.url,
    description: "Bandeja com camarões empanados recheados com requeijão cremoso. Receita exclusiva da casa, sucesso garantido nas festas.",
    inStock: true,
    featured: true,
  },
];

export const categories: Category[] = [
  "Peixes Frescos",
  "Filés",
  "Frutos do Mar",
  "Congelados",
  "Kits Churrasco",
];

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const getProduct = (id: string) => products.find((p) => p.id === id);
