CREATE OR REPLACE FUNCTION public.apply_pagbank_payment(
  p_event_key text,
  p_order_id uuid,
  p_provider_order_id text,
  p_provider_charge_id text,
  p_provider_transaction_id text,
  p_status text,
  p_amount_cents integer,
  p_payload jsonb
)
RETURNS TABLE(order_id uuid, order_number text, became_paid boolean)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_became_paid boolean := false;
  v_item record;
  v_transaction_id text := NULLIF(btrim(p_provider_transaction_id), '');
BEGIN
  INSERT INTO public.payment_events(provider, event_key, order_id, provider_order_id, provider_charge_id, event_status, authenticity_verified, amount_cents, payload)
  VALUES ('PAGBANK', p_event_key, p_order_id, p_provider_order_id, p_provider_charge_id, p_status, true, p_amount_cents, p_payload)
  ON CONFLICT (provider, event_key) DO NOTHING;

  IF NOT FOUND THEN
    SELECT o.id, o.order_number, false INTO order_id, order_number, became_paid
    FROM public.orders o WHERE o.id = p_order_id;
    RETURN NEXT;
    RETURN;
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ORDER_NOT_FOUND'; END IF;
  IF v_order.provider_order_id IS NOT NULL AND v_order.provider_order_id <> p_provider_order_id THEN RAISE EXCEPTION 'PROVIDER_ORDER_MISMATCH'; END IF;

  IF p_status = 'PAID' THEN
    IF p_amount_cents IS NULL OR p_amount_cents <> v_order.total_cents THEN RAISE EXCEPTION 'PAYMENT_AMOUNT_MISMATCH'; END IF;
    IF v_order.payment_status <> 'PAID' THEN
      FOR v_item IN
        SELECT oi.product_id, oi.quantity, pi.stock_quantity, pi.available
        FROM public.order_items oi
        JOIN public.product_inventory pi ON pi.product_id = oi.product_id
        WHERE oi.order_id = p_order_id
        FOR UPDATE OF pi
      LOOP
        IF NOT v_item.available THEN RAISE EXCEPTION 'PRODUCT_UNAVAILABLE'; END IF;
        IF v_item.stock_quantity IS NOT NULL AND v_item.stock_quantity < v_item.quantity THEN RAISE EXCEPTION 'INSUFFICIENT_STOCK'; END IF;
        IF v_item.stock_quantity IS NOT NULL THEN
          UPDATE public.product_inventory
          SET stock_quantity = stock_quantity - v_item.quantity
          WHERE product_id = v_item.product_id;
        END IF;
      END LOOP;

      UPDATE public.orders
      SET status = 'PAID',
          payment_status = 'PAID',
          provider_order_id = p_provider_order_id,
          provider_charge_id = NULLIF(btrim(p_provider_charge_id), ''),
          provider_transaction_id = v_transaction_id,
          provider_amount_cents = p_amount_cents,
          approved_at = now()
      WHERE id = p_order_id;

      INSERT INTO public.notification_outbox(order_id)
      VALUES (p_order_id)
      ON CONFLICT (order_id, channel, event_type) DO NOTHING;
      v_became_paid := true;
    END IF;
  ELSE
    UPDATE public.orders
    SET payment_status = p_status,
        status = CASE p_status WHEN 'DECLINED' THEN 'DECLINED' WHEN 'CANCELED' THEN 'CANCELED' WHEN 'EXPIRED' THEN 'EXPIRED' ELSE status END,
        provider_order_id = COALESCE(provider_order_id, p_provider_order_id),
        provider_charge_id = COALESCE(provider_charge_id, NULLIF(btrim(p_provider_charge_id), ''))
    WHERE id = p_order_id AND payment_status <> 'PAID';
  END IF;

  UPDATE public.payment_events
  SET processed_at = now()
  WHERE provider = 'PAGBANK' AND event_key = p_event_key;

  SELECT o.id, o.order_number, v_became_paid
  INTO order_id, order_number, became_paid
  FROM public.orders o WHERE o.id = p_order_id;
  RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.apply_pagbank_payment(text,uuid,text,text,text,text,integer,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_pagbank_payment(text,uuid,text,text,text,text,integer,jsonb) TO service_role;