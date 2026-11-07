/*
# Payment infrastructure: order payment status and server-only order writes

1. Modified table `orders`
- `payment_status` (pending, paid, failed, refunded), default pending. Separate from the order `status`.
- `payment_provider`, `payment_authority`, `payment_ref_id`, `payment_error`, `payment_amount`, `payment_attempts`, `paid_at`.
- `checkout_key`: client-generated idempotency key so a repeated submit returns the same order.
- Existing rows keep their values. Nothing is deleted.

2. New table `payment_transactions`
- One row per payment attempt (authority, amount, status, reference, error). Server-only.

3. Security
- anon/authenticated can no longer INSERT or DELETE orders or order_items (orders are created by the server).
- anon/authenticated can update only status, tracking_number, estimated_delivery, notes, updated_at on orders. Payment columns are not writable from the browser.
- payment_transactions has RLS enabled with no policies and no grants for anon/authenticated. Only service_role can access it.

4. Notes
- Orders confirmed by the old browser-only flow have no payment reference. They are reported, not changed.
*/

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_payment_status_check') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check
      CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));
  END IF;
END $$;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_provider text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_authority text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_ref_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_error text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_amount bigint;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_attempts integer NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at timestamptz;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS checkout_key text;

CREATE UNIQUE INDEX IF NOT EXISTS orders_checkout_key_key ON orders (checkout_key) WHERE checkout_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_authority_key ON orders (payment_authority) WHERE payment_authority IS NOT NULL;

CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  provider text NOT NULL,
  authority text NOT NULL UNIQUE,
  amount bigint NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'verified', 'failed')),
  ref_id text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  verified_at timestamptz
);

CREATE INDEX IF NOT EXISTS payment_transactions_order_id_idx ON payment_transactions (order_id);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON payment_transactions FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON payment_transactions TO service_role;

REVOKE INSERT, DELETE ON orders FROM anon, authenticated;
REVOKE INSERT, DELETE ON order_items FROM anon, authenticated;
REVOKE UPDATE ON orders FROM anon, authenticated;
GRANT UPDATE (status, tracking_number, estimated_delivery, notes, updated_at) ON orders TO anon, authenticated;
