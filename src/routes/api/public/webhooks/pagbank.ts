import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const webhookSchema = z.object({
  id: z.string().min(1),
  reference_id: z.string().uuid(),
  charges: z.array(z.object({
    id: z.string().min(1),
    reference_id: z.string().optional(),
    status: z.string().min(1),
    amount: z.object({ value: z.number().int().nonnegative() }),
    payment_response: z.object({ reference: z.string().optional() }).optional(),
  })).min(1),
});

const statusMap: Record<string, string> = {
  WAITING: "WAITING",
  IN_ANALYSIS: "IN_ANALYSIS",
  PAID: "PAID",
  DECLINED: "DECLINED",
  CANCELED: "CANCELED",
  EXPIRED: "EXPIRED",
};

export const Route = createFileRoute("/api/public/webhooks/pagbank")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const { verifyPagBankSignature, pagBankEventKey } = await import("@/lib/checkout.server");
        if (!verifyPagBankSignature(rawBody, request.headers.get("x-authenticity-token"))) return new Response("Invalid signature", { status: 401 });
        let payload: z.infer<typeof webhookSchema>;
        try {
          payload = webhookSchema.parse(JSON.parse(rawBody));
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }
        const charge = payload.charges[0];
        if (!charge) return new Response("Invalid payload", { status: 400 });
        const mappedStatus = statusMap[charge.status];
        if (!mappedStatus) return new Response("ok");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const eventKey = pagBankEventKey(payload, rawBody);
        const { error } = await supabaseAdmin.rpc("apply_pagbank_payment", {
          p_event_key: eventKey,
          p_order_id: payload.reference_id,
          p_provider_order_id: payload.id,
          p_provider_charge_id: charge.id,
          p_provider_transaction_id: charge.payment_response?.reference?.trim() || "",
          p_status: mappedStatus,
          p_amount_cents: charge.amount.value,
          p_payload: payload,
        });
        if (error) {
          console.error("PagBank webhook processing failed", { code: error.code, message: error.message, orderId: payload.reference_id, status: mappedStatus });
          return new Response("Processing failed", { status: 500 });
        }
        if (mappedStatus === "PAID") {
          const { processOrderNotification, retryPendingNotifications } = await import("@/lib/order-notifications.server");
          await processOrderNotification(supabaseAdmin, payload.reference_id).catch(() => undefined);
          await retryPendingNotifications(supabaseAdmin, 4);
        }
        return new Response("ok");
      },
    },
  },
});
