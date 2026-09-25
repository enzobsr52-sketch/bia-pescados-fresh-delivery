import { createServerFn, getRequest } from "@tanstack/react-start";
import { checkoutInputSchema, statusInputSchema } from "./checkout.shared";

export const createCheckout = createServerFn({ method: "POST" })
  .inputValidator(checkoutInputSchema)
  .handler(async ({ data }) => {
    if (!process.env["PAGBANK_API_TOKEN"]) throw new Error("PAGBANK_NOT_CONFIGURED");
    const { verifyCep, priceCheckout, createPagBankPix, newOrderId } = await import("./checkout.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const address = await verifyCep(data.address);
    const priced = priceCheckout(data);
    const inventoryIds = priced.items.map((item) => item.productId);
    const { data: inventory, error: inventoryError } = await supabaseAdmin.from("product_inventory").select("product_id,available,stock_quantity").in("product_id", inventoryIds);
    if (inventoryError) throw new Error("Não foi possível verificar a disponibilidade.");
    for (const item of priced.items) {
      const stock = inventory?.find((entry) => entry.product_id === item.productId);
      if (!stock?.available || (stock.stock_quantity !== null && stock.stock_quantity < item.quantity)) throw new Error(`${item.name} não possui quantidade disponível.`);
    }
    const orderId = newOrderId();
    const { data: order, error: orderError } = await supabaseAdmin.from("orders").insert({
      id: orderId,
      price_mode: data.priceMode,
      customer_name: data.customer.name,
      customer_email: data.customer.email,
      customer_phone: data.customer.phone.replace(/\D/g, ""),
      customer_cpf: data.customer.cpf.replace(/\D/g, "") || null,
      address_cep: address.cep,
      address_street: address.street,
      address_number: address.number,
      address_complement: address.complement || null,
      address_neighborhood: address.neighborhood,
      address_city: address.city,
      address_state: address.state,
      address_country: address.country,
      address_verified_at: new Date().toISOString(),
      subtotal_cents: priced.subtotalCents,
      discount_cents: priced.discountCents,
      shipping_cents: null,
      total_cents: priced.totalCents,
    }).select("id,order_number,public_status_token").single();
    if (orderError || !order) throw new Error("Não foi possível registrar o pedido.");
    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(priced.items.map((item) => ({ order_id: order.id, product_id: item.productId, product_name: item.name, product_weight: item.weight, quantity: item.quantity, unit_price_cents: item.unitPriceCents, subtotal_cents: item.subtotalCents })));
    if (itemsError) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      throw new Error("Não foi possível registrar os produtos do pedido.");
    }
    const configuredOrigin = process.env["APP_ORIGIN"];
    const requestOrigin = new URL(getRequest().url).origin;
    const appOrigin = configuredOrigin || requestOrigin;
    try {
      const payment = await createPagBankPix({ orderId: order.id, orderNumber: order.order_number, customer: data.customer, items: priced.items, totalCents: priced.totalCents, notificationUrl: `${appOrigin.replace(/\/$/, "")}/api/public/webhooks/pagbank` });
      const { error: updateError } = await supabaseAdmin.from("orders").update({ provider_order_id: payment.providerOrderId, qr_code_text: payment.qrCodeText, qr_code_expires_at: payment.expiresAt }).eq("id", order.id);
      if (updateError) throw updateError;
      return { orderId: order.id, orderNumber: order.order_number, statusToken: order.public_status_token, paymentStatus: "WAITING", qrCodeText: payment.qrCodeText, expiresAt: payment.expiresAt, subtotalCents: priced.subtotalCents, discountCents: priced.discountCents, totalCents: priced.totalCents };
    } catch (error) {
      console.error("Checkout payment creation failed", { orderId: order.id, error: error instanceof Error ? error.message : "Unknown error" });
      await supabaseAdmin.from("orders").update({ status: "CANCELED", payment_status: "CANCELED" }).eq("id", order.id).is("provider_order_id", null);
      if (error instanceof Error && error.message.startsWith("PAGBANK_CREATE_FAILED:")) throw new Error("PAYMENT_PROVIDER_UNAVAILABLE");
      throw error;
    }
  });

export const getCheckoutStatus = createServerFn({ method: "POST" })
  .inputValidator(statusInputSchema)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin.from("orders").select("order_number,status,payment_status,approved_at").eq("id", data.orderId).eq("public_status_token", data.statusToken).maybeSingle();
    if (!order) throw new Error("Pedido não encontrado.");
    return order;
  });
