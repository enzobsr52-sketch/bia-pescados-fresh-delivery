import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { products } from "./products";
import type { CheckoutInput } from "./checkout.shared";
import { deliveryBlockedMessage } from "./checkout.shared";

const PAGBANK_SANDBOX_URL = "https://sandbox.api.pagseguro.com";
const PAGBANK_LIVE_URL = "https://api.pagseguro.com";
const WHATSAPP_GATEWAY_URL = "https://connector-gateway.lovable.dev/whatsapp";
const OWNER_WHATSAPP_NUMBER = "5534992367342";

export function normalizeCity(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

export function isUnaiAddress(country: string, state: string, city: string) {
  return country.trim().toUpperCase() === "BR" && state.trim().toUpperCase() === "MG" && normalizeCity(city) === "unai";
}

export async function verifyCep(address: CheckoutInput["address"]) {
  if (!isUnaiAddress(address.country, address.state, address.city)) throw new Error(deliveryBlockedMessage);
  const cep = address.cep.replace(/\D/g, "");
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) throw new Error(deliveryBlockedMessage);
  const result = (await response.json()) as { erro?: boolean; localidade?: string; uf?: string; logradouro?: string; bairro?: string };
  if (result.erro || !isUnaiAddress("BR", result.uf ?? "", result.localidade ?? "")) throw new Error(deliveryBlockedMessage);
  return {
    cep,
    street: address.street || result.logradouro || "",
    number: address.number,
    complement: address.complement,
    neighborhood: address.neighborhood || result.bairro || "",
    city: "Unaí",
    state: "MG",
    country: "BR",
  };
}

export function priceCheckout(input: CheckoutInput) {
  if (input.priceMode === "atacado" && !input.wholesaleApproved) throw new Error("Acesso aos preços de revenda ainda não aprovado.");
  const seen = new Set<string>();
  const items = input.items.map(({ id, quantity }) => {
    if (seen.has(id)) throw new Error("Produto repetido no carrinho.");
    seen.add(id);
    const product = products.find((entry) => entry.id === id);
    if (!product || !product.inStock) throw new Error("Um produto do carrinho não está disponível.");
    const unitPriceCents = Math.round((input.priceMode === "atacado" ? product.priceWholesale : product.priceRetail) * 100);
    return { productId: product.id, name: product.name, weight: product.weight, quantity, unitPriceCents, subtotalCents: unitPriceCents * quantity };
  });
  const subtotalCents = items.reduce((sum, item) => sum + item.subtotalCents, 0);
  const discountCents = 0;
  const totalCents = subtotalCents - discountCents;
  if (totalCents <= 0) throw new Error("Total do pedido inválido.");
  return { items, subtotalCents, discountCents, totalCents };
}

export function pagBankBaseUrl() {
  return process.env["PAGBANK_ENVIRONMENT"] === "live" ? PAGBANK_LIVE_URL : PAGBANK_SANDBOX_URL;
}

export async function createPagBankPix(params: {
  orderId: string;
  orderNumber: string;
  customer: CheckoutInput["customer"];
  items: ReturnType<typeof priceCheckout>["items"];
  totalCents: number;
  notificationUrl: string;
}) {
  const token = process.env["PAGBANK_API_TOKEN"];
  if (!token) throw new Error("PAGBANK_NOT_CONFIGURED");
  const phone = params.customer.phone.replace(/\D/g, "");
  const area = phone.slice(0, 2);
  const number = phone.slice(2);
  const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const body = {
    reference_id: params.orderId,
    customer: { name: params.customer.name, email: params.customer.email, tax_id: params.customer.cpf.replace(/\D/g, ""), phones: [{ country: "55", area, number, type: "MOBILE" }] },
    items: params.items.map((item) => ({ reference_id: item.productId, name: `${item.name} ${item.weight}`, quantity: item.quantity, unit_amount: item.unitPriceCents })),
    qr_codes: [{ amount: { value: params.totalCents }, expiration_date: expirationDate }],
    notification_urls: [params.notificationUrl],
  };
  const response = await fetch(`${pagBankBaseUrl()}/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "x-idempotency-key": params.orderId },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) {
    console.error("PagBank order creation failed", { status: response.status, response: text.slice(0, 1000), orderId: params.orderId });
    throw new Error(`PAGBANK_CREATE_FAILED:${response.status}`);
  }
  const result = JSON.parse(text) as { id?: string; qr_codes?: Array<{ text?: string; expiration_date?: string }> };
  const qr = result.qr_codes?.[0];
  if (!result.id || !qr?.text) throw new Error("PAGBANK_INVALID_RESPONSE");
  return { providerOrderId: result.id, qrCodeText: qr.text, expiresAt: qr.expiration_date ?? expirationDate };
}

export function verifyPagBankSignature(rawBody: string, signature: string | null) {
  const token = process.env["PAGBANK_API_TOKEN"];
  if (!token || !signature) return false;
  const expected = createHash("sha256").update(`${token}-${rawBody}`).digest("hex");
  const received = signature.trim().toLowerCase();
  if (expected.length !== received.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

export function pagBankEventKey(payload: Record<string, unknown>, rawBody: string) {
  const id = typeof payload.id === "string" ? payload.id : undefined;
  const chargeId = Array.isArray(payload.charges) && typeof payload.charges[0]?.id === "string" ? payload.charges[0].id : undefined;
  const status = Array.isArray(payload.charges) && typeof payload.charges[0]?.status === "string" ? payload.charges[0].status : "UNKNOWN";
  return id && chargeId ? `${id}:${chargeId}:${status}` : createHash("sha256").update(rawBody).digest("hex");
}

export async function sendOwnerWhatsApp(message: string) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const whatsappKey = process.env["WHATSAPP_API_KEY"];
  if (!lovableKey || !whatsappKey) throw new Error("WHATSAPP_NOT_CONFIGURED");
  const response = await fetch(`${WHATSAPP_GATEWAY_URL}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": whatsappKey, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: OWNER_WHATSAPP_NUMBER, type: "text", text: { body: message } }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`WHATSAPP_SEND_FAILED:${response.status}:${text.slice(0, 500)}`);
  const result = JSON.parse(text) as { messages?: Array<{ id?: string }> };
  const messageId = result.messages?.[0]?.id;
  if (!messageId) throw new Error("WHATSAPP_INVALID_RESPONSE");
  return messageId;
}

export function newOrderId() {
  return randomUUID();
}
