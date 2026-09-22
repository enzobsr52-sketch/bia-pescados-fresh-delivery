CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO service_role;

CREATE SEQUENCE public.order_number_seq START WITH 1001;
GRANT USAGE, SELECT ON SEQUENCE public.order_number_seq TO service_role;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('PDB-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('public.order_number_seq')::text, 6, '0')),
  public_status_token uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'PENDING_PAYMENT' CHECK (status IN ('PENDING_PAYMENT','PAID','DECLINED','CANCELED','EXPIRED')),
  payment_status text NOT NULL DEFAULT 'WAITING' CHECK (payment_status IN ('WAITING','IN_ANALYSIS','PAID','DECLINED','CANCELED','EXPIRED')),
  payment_method text NOT NULL DEFAULT 'PIX' CHECK (payment_method IN ('PIX','CARD')),
  price_mode text NOT NULL CHECK (price_mode IN ('varejo','atacado')),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_cpf text,
  address_cep text NOT NULL,
  address_street text NOT NULL,
  address_number text NOT NULL,
  address_complement text,
  address_neighborhood text NOT NULL,
  address_city text NOT NULL CHECK (address_city = 'Unaí'),
  address_state text NOT NULL CHECK (address_state = 'MG'),
  address_country text NOT NULL DEFAULT 'BR' CHECK (address_country = 'BR'),
  address_verified_at timestamptz NOT NULL,
  subtotal_cents integer NOT NULL CHECK (subtotal_cents >= 0),
  discount_cents integer NOT NULL DEFAULT 0 CHECK (discount_cents >= 0),
  shipping_cents integer CHECK (shipping_cents IS NULL OR shipping_cents >= 0),
  shipping_note text NOT NULL DEFAULT 'A combinar após o pedido',
  total_cents integer NOT NULL CHECK (total_cents > 0),
  currency text NOT NULL DEFAULT 'BRL' CHECK (currency = 'BRL'),
  provider text NOT NULL DEFAULT 'PAGBANK' CHECK (provider = 'PAGBANK'),
  provider_order_id text UNIQUE,
  provider_charge_id text UNIQUE,
  provider_transaction_id text UNIQUE,
  provider_amount_cents integer CHECK (provider_amount_cents IS NULL OR provider_amount_cents >= 0),
  qr_code_text text,
  qr_code_expires_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  product_weight text NOT NULL,
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 100),
  unit_price_cents integer NOT NULL CHECK (unit_price_cents > 0),
  subtotal_cents integer NOT NULL CHECK (subtotal_cents = unit_price_cents * quantity),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(order_id, product_id)
);
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.product_inventory (
  product_id text PRIMARY KEY,
  available boolean NOT NULL DEFAULT true,
  stock_quantity integer CHECK (stock_quantity IS NULL OR stock_quantity >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.product_inventory TO service_role;
ALTER TABLE public.product_inventory ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'PAGBANK' CHECK (provider = 'PAGBANK'),
  event_key text NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  provider_order_id text,
  provider_charge_id text,
  event_status text,
  authenticity_verified boolean NOT NULL DEFAULT false,
  amount_cents integer,
  payload jsonb NOT NULL,
  processed_at timestamptz,
  processing_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider, event_key)
);
GRANT ALL ON public.payment_events TO service_role;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.notification_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  channel text NOT NULL DEFAULT 'WHATSAPP' CHECK (channel = 'WHATSAPP'),
  event_type text NOT NULL DEFAULT 'ORDER_PAID' CHECK (event_type = 'ORDER_PAID'),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','SENT','FAILED')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_attempt_at timestamptz,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_error text,
  provider_message_id text UNIQUE,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(order_id, channel, event_type)
);
GRANT ALL ON public.notification_outbox TO service_role;
ALTER TABLE public.notification_outbox ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER order_items_set_updated_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER inventory_set_updated_at BEFORE UPDATE ON public.product_inventory FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER payment_events_set_updated_at BEFORE UPDATE ON public.payment_events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER notification_outbox_set_updated_at BEFORE UPDATE ON public.notification_outbox FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.product_inventory (product_id, available, stock_quantity) VALUES
('bolinho-bacalhau', true, NULL),
('bolinho-camarao', true, NULL),
('bolinho-tilapia', true, NULL),
('isca-tilapia', true, NULL),
('camarao-empanado', true, NULL),
('camarao-cream-cheese', true, NULL),
('camarao-requeijao', true, NULL),
('mini-temaki', true, NULL),
('hot-filadelfia', true, NULL),
('costela-tambaqui', true, NULL),
('posta-tambaqui', true, NULL),
('posta-surubim', true, NULL),
('file-saithe', true, NULL),
('file-salmao', true, NULL),
('camarao-gg', true, NULL);

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
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_became_paid boolean := false;
  v_item record;
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
      FOR v_item IN SELECT oi.product_id, oi.quantity, pi.stock_quantity, pi.available FROM public.order_items oi JOIN public.product_inventory pi ON pi.product_id = oi.product_id WHERE oi.order_id = p_order_id FOR UPDATE OF pi LOOP
        IF NOT v_item.available THEN RAISE EXCEPTION 'PRODUCT_UNAVAILABLE'; END IF;
        IF v_item.stock_quantity IS NOT NULL AND v_item.stock_quantity < v_item.quantity THEN RAISE EXCEPTION 'INSUFFICIENT_STOCK'; END IF;
        IF v_item.stock_quantity IS NOT NULL THEN UPDATE public.product_inventory SET stock_quantity = stock_quantity - v_item.quantity WHERE product_id = v_item.product_id; END IF;
      END LOOP;
      UPDATE public.orders SET status='PAID', payment_status='PAID', provider_order_id=p_provider_order_id, provider_charge_id=p_provider_charge_id, provider_transaction_id=p_provider_transaction_id, provider_amount_cents=p_amount_cents, approved_at=now() WHERE id=p_order_id;
      INSERT INTO public.notification_outbox(order_id) VALUES (p_order_id) ON CONFLICT (order_id, channel, event_type) DO NOTHING;
      v_became_paid := true;
    END IF;
  ELSE
    UPDATE public.orders SET payment_status=p_status, status=CASE p_status WHEN 'DECLINED' THEN 'DECLINED' WHEN 'CANCELED' THEN 'CANCELED' WHEN 'EXPIRED' THEN 'EXPIRED' ELSE status END, provider_order_id=COALESCE(provider_order_id,p_provider_order_id), provider_charge_id=COALESCE(provider_charge_id,p_provider_charge_id) WHERE id=p_order_id AND payment_status <> 'PAID';
  END IF;

  UPDATE public.payment_events SET processed_at=now() WHERE provider='PAGBANK' AND event_key=p_event_key;
  SELECT o.id, o.order_number, v_became_paid INTO order_id, order_number, became_paid FROM public.orders o WHERE o.id=p_order_id;
  RETURN NEXT;
END;
$$;
REVOKE ALL ON FUNCTION public.apply_pagbank_payment(text,uuid,text,text,text,text,integer,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.apply_pagbank_payment(text,uuid,text,text,text,text,integer,jsonb) TO service_role;