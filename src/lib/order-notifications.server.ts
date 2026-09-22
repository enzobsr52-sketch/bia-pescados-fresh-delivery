import { sendOwnerWhatsApp } from "./checkout.server";

type AdminClient = typeof import("@/integrations/supabase/client.server").supabaseAdmin;

function money(cents: number | null) {
  if (cents === null) return "A combinar";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

export async function processOrderNotification(supabaseAdmin: AdminClient, orderId: string) {
  const { data: outbox } = await supabaseAdmin.from("notification_outbox").select("id,status,attempts").eq("order_id", orderId).eq("channel", "WHATSAPP").eq("event_type", "ORDER_PAID").maybeSingle();
  if (!outbox || outbox.status === "SENT") return;
  const { data: order, error: orderError } = await supabaseAdmin.from("orders").select("*").eq("id", orderId).eq("payment_status", "PAID").single();
  const { data: items, error: itemsError } = await supabaseAdmin.from("order_items").select("product_name,product_weight,quantity,unit_price_cents,subtotal_cents").eq("order_id", orderId).order("created_at");
  if (orderError || itemsError || !order || !items) throw new Error("Pedido aprovado não pôde ser carregado para notificação.");
  const approved = new Date(order.approved_at ?? new Date().toISOString());
  const fullAddress = `${order.address_street}, ${order.address_number}${order.address_complement ? `, ${order.address_complement}` : ""} — ${order.address_neighborhood}, ${order.address_city}/${order.address_state}, CEP ${order.address_cep}, ${order.address_country}`;
  const lines = items.map((item) => `• ${item.quantity}x ${item.product_name} ${item.product_weight} — ${money(item.unit_price_cents)} cada — ${money(item.subtotal_cents)}`);
  const message = [
    "🛍️ NOVO PEDIDO APROVADO!",
    "",
    `Pedido: #${order.order_number}`,
    `Cliente: ${order.customer_name}`,
    `WhatsApp: ${order.customer_phone}`,
    `Endereço: ${fullAddress}`,
    "",
    "Produtos:",
    ...lines,
    "",
    `Subtotal: ${money(order.subtotal_cents)}`,
    `Frete: ${money(order.shipping_cents)}`,
    `Desconto: ${money(order.discount_cents)}`,
    `Total: ${money(order.total_cents)}`,
    `Pagamento: ${order.payment_method}`,
    `Status: APROVADO`,
    `Transação: ${order.provider_transaction_id ?? order.provider_charge_id ?? order.provider_order_id ?? "Não informado"}`,
    `Data: ${approved.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}`,
    `Horário: ${approved.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" })}`,
    "Frete a combinar com o cliente.",
  ].join("\n");

  const attempt = (outbox.attempts ?? 0) + 1;
  try {
    const providerMessageId = await sendOwnerWhatsApp(message);
    await supabaseAdmin.from("notification_outbox").update({ status: "SENT", attempts: attempt, last_attempt_at: new Date().toISOString(), last_error: null, provider_message_id: providerMessageId, sent_at: new Date().toISOString() }).eq("id", outbox.id).neq("status", "SENT");
  } catch (error) {
    await supabaseAdmin.from("notification_outbox").update({ status: "FAILED", attempts: attempt, last_attempt_at: new Date().toISOString(), last_error: error instanceof Error ? error.message.slice(0, 1000) : "Falha desconhecida" }).eq("id", outbox.id).neq("status", "SENT");
    throw error;
  }
}

export async function retryPendingNotifications(supabaseAdmin: AdminClient, limit = 5) {
  const { data: pending } = await supabaseAdmin.from("notification_outbox").select("order_id").in("status", ["PENDING", "FAILED"]).lt("attempts", 8).order("last_attempt_at", { ascending: true, nullsFirst: true }).limit(limit);
  for (const entry of pending ?? []) {
    await processOrderNotification(supabaseAdmin, entry.order_id).catch(() => undefined);
  }
}
