CREATE TABLE public.whatsapp_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id text NOT NULL UNIQUE,
  event text NOT NULL,
  payload jsonb NOT NULL,
  processed_at timestamptz,
  processing_error text,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  received_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.whatsapp_webhook_events TO service_role;
ALTER TABLE public.whatsapp_webhook_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal service manages WhatsApp events" ON public.whatsapp_webhook_events FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.whatsapp_message_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id text NOT NULL REFERENCES public.whatsapp_webhook_events(delivery_id) ON DELETE CASCADE,
  provider_message_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('accepted','sent','delivered','read','failed')),
  recipient_id text,
  provider_timestamp timestamptz,
  errors jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(delivery_id, provider_message_id, status)
);
GRANT ALL ON public.whatsapp_message_statuses TO service_role;
ALTER TABLE public.whatsapp_message_statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal service manages WhatsApp statuses" ON public.whatsapp_message_statuses FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TRIGGER whatsapp_events_set_updated_at BEFORE UPDATE ON public.whatsapp_webhook_events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER whatsapp_statuses_set_updated_at BEFORE UPDATE ON public.whatsapp_message_statuses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();