import { z } from "zod";

export const deliveryBlockedMessage =
  "🚚 No momento, realizamos entregas somente em Unaí - MG. Verifique seu endereço e tente novamente.";

export const checkoutInputSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(3).max(120),
    email: z.email().max(180),
    phone: z.string().trim().min(10).max(20),
    cpf: z.string().trim().max(18).optional().default(""),
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
