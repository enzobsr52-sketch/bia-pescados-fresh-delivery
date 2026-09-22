CREATE POLICY "Internal service manages orders" ON public.orders FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Internal service manages order items" ON public.order_items FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Internal service manages inventory" ON public.product_inventory FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Internal service manages payment events" ON public.payment_events FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Internal service manages notification outbox" ON public.notification_outbox FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER FUNCTION public.apply_pagbank_payment(text,uuid,text,text,text,text,integer,jsonb) SECURITY INVOKER;
REVOKE ALL ON FUNCTION public.apply_pagbank_payment(text,uuid,text,text,text,text,integer,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_pagbank_payment(text,uuid,text,text,text,text,integer,jsonb) TO service_role;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO service_role;