import { z } from "zod";

export const deliveryBlockedMessage =
  "🚚 No momento, realizamos entregas somente em Unaí - MG.";

function isValidCpf(value: string) {
  const cpf = value.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const digit = (length: number) => {
    const sum = cpf.slice(0, length).split("").reduce((total, number, index) => total + Number(number) * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };
  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

export const checkoutInputSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(3).max(120),
    email: z.email().max(180),
    phone: z.string().trim().refine((value) => /^\d{10,11}$/.test(value.replace(/\D/g, "")), "Informe um telefone válido com DDD."),
    cpf: z.string().trim().refine(isValidCpf, "Informe um CPF válido."),
  }),
  address: z.object({
    cep: z.string().trim().regex(/^\d{5}-?\d{3}$/),
    street: z.string().trim().min(2).max(160),
    number: z.string().trim().min(1).max(20),
    complement: z.string().trim().max(100).optional().default(""),
    neighborhood: z.string().trim().min(2).max(100),
    city: z.string().trim().min(2).max(80),
    state: z.string().trim().length(2),
    country: z.string().trim().length(2),
  }),
  items: z.array(z.object({ id: z.string().min(1).max(80), quantity: z.number().int().min(1).max(100) })).min(1).max(50),
  priceMode: z.enum(["varejo", "atacado"]),
  wholesaleApproved: z.boolean(),
  paymentMethod: z.literal("PIX"),
});

export const statusInputSchema = z.object({
  orderId: z.uuid(),
  statusToken: z.uuid(),
});

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;
