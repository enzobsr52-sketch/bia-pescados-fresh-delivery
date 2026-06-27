/** Dados oficiais da empresa Pescados da Bia */
export const company = {
  name: "Pescados da Bia",
  legalName: "Unidade de Beneficiamento de Pescados e Produtos de Pescados",
  cnpj: "45.388.872/0001-07",
  address: {
    street: "Rua do Sol, Nº 210",
    district: "Park Canabrava",
    city: "Unaí",
    state: "MG",
    zip: "38.612-173",
  },
  phone: "(34) 9236-7342",
  whatsapp: "553492367342",
  email: "contato@pescadosdabia.com.br",
  hours: "Seg a Sáb: 8h às 19h",
  /** Chave Pix usada na cobrança (CNPJ) */
  pixKey: "45388872000107",
  pixKeyType: "CNPJ",
  pixReceiver: "PESCADOS DA BIA",
  pixCity: "UNAI",
};

export const waLink = (text: string) =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;
