import { createFileRoute } from "@tanstack/react-router";
import { verifyWebhookRequest } from "@lovable.dev/webhooks-js";

type WhatsAppPayload = {
  entry?: Array<{ changes?: Array<{ value?: { statuses?: Array<{ id?: string; status?: string; recipient_id?: string; timestamp?: string; errors?: unknown[] }> } }> }>;
};

const allowedStatuses = new Set(["sent", "delivered", "read", "failed"]);

export const Route = createFileRoute("/api/public/whatsapp/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["WHATSAPP_API_KEY"];
        if (!secret) return new Response("WhatsApp is not configured", { status: 503 });
        const deliveryId = request.headers.get("X-Lovable-Delivery")?.trim();
        const event = request.headers.get("X-Lovable-Event")?.trim();
        if (!deliveryId || !event) return new Response("Missing delivery headers", { status: 400 });
        let payload: WhatsAppPayload;
        try {
          ({ payload } = await verifyWebhookRequest<WhatsAppPayload>({ req: request, secret, maxBodyBytes: 4 * 1024 * 1024 }));
        } catch {
          return new Response("Invalid signature", { status: 401 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: stored, error: storeError } = await supabaseAdmin.from("whatsapp_webhook_events").upsert({ delivery_id: deliveryId, event, payload }, { onConflict: "delivery_id", ignoreDuplicates: true }).select("processed_at").maybeSingle();
        if (storeError) return new Response("Storage failed", { status: 500 });
        if (stored?.processed_at) return new Response("ok");
        try {
          const statuses = payload.entry?.flatMap((entry) => entry.changes ?? []).flatMap((change) => change.value?.statuses ?? []) ?? [];
          for (const status of statuses) {
            if (!status.id || !status.status || !allowedStatuses.has(status.status)) continue;
            await supabaseAdmin.from("whatsapp_message_statuses").upsert({ delivery_id: deliveryId, provider_message_id: status.id, status: status.status, recipient_id: status.recipient_id ?? null, provider_timestamp: status.timestamp ? new Date(Number(status.timestamp) * 1000).toISOString() : null, errors: status.errors ?? null }, { onConflict: "delivery_id,provider_message_id,status", ignoreDuplicates: true });
            const notificationStatus = status.status === "failed" ? "FAILED" : status.status === "sent" || status.status === "delivered" || status.status === "read" ? "SENT" : undefined;
            if (notificationStatus) await supabaseAdmin.from("notification_outbox").update({ status: notificationStatus, last_error: status.status === "failed" ? JSON.stringify(status.errors ?? []) : null }).eq("provider_message_id", status.id);
          }
          await supabaseAdmin.from("whatsapp_webhook_events").update({ processed_at: new Date().toISOString(), processing_error: null }).eq("delivery_id", deliveryId);
          const { retryPendingNotifications } = await import("@/lib/order-notifications.server");
          await retryPendingNotifications(supabaseAdmin, 4);
          return new Response("ok");
        } catch (error) {
          await supabaseAdmin.from("whatsapp_webhook_events").update({ processing_error: error instanceof Error ? error.message.slice(0, 1000) : "Processing failed", next_attempt_at: new Date(Date.now() + 60_000).toISOString() }).eq("delivery_id", deliveryId);
          return new Response("Processing failed", { status: 500 });
        }
      },
    },
  },
});
