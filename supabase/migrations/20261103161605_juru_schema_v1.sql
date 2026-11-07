/*
# JURU E-Commerce Database Schema v1

This migration creates the complete database schema for the JURU online store — a premium imported plush toy and surprise gift brand.

## Tables Created

1. **categories** — Product categories (teddy bear, rabbit, panda, capybara, elephant, fantasy, collectible)
2. **products** — Full product catalog with images, pricing, stock, dimensions, origin, warranty info
3. **mystery_boxes** — Three tiers of JURU Mystery Box (economy, special, luxury) with editable pricing
4. **orders** — Customer orders with buyer/recipient info, gift personalization, tracking number
5. **order_items** — Individual items within an order (products or mystery boxes)
6. **reviews** — Customer reviews with photos and ratings
7. **discount_codes** — Discount codes with usage limits and validity periods
8. **warranty_claims** — Warranty claim submissions with document upload URLs
9. **contact_messages** — Messages submitted via the contact form

## Security

- Single-tenant app with no user authentication required for shopping.
- RLS enabled on all tables with full CRUD for anon + authenticated.
- Admin panel accessible via secret URL path; in production would use Supabase auth.
*/

-- ==========================================
-- 1. CATEGORIES
-- ==========================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON categories TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_categories" ON categories;
CREATE POLICY "public_insert_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_categories" ON categories;
CREATE POLICY "public_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_categories" ON categories;
CREATE POLICY "public_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

-- ==========================================
-- 2. PRODUCTS
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  long_description text,
  price bigint NOT NULL DEFAULT 0,
  compare_at_price bigint,
  stock int NOT NULL DEFAULT 0,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  images text[] NOT NULL DEFAULT '{}',
  dimensions text,
  weight text,
  material text,
  country_of_origin text DEFAULT 'لهستان',
  is_featured boolean DEFAULT false,
  is_new boolean DEFAULT false,
  is_bestseller boolean DEFAULT false,
  is_active boolean DEFAULT true,
  warranty_info text,
  warranty_duration text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON products TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_products" ON products;
CREATE POLICY "public_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_products" ON products;
CREATE POLICY "public_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_products" ON products;
CREATE POLICY "public_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- ==========================================
-- 3. MYSTERY BOXES
-- ==========================================
CREATE TABLE IF NOT EXISTS mystery_boxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tier text NOT NULL CHECK (tier IN ('economy', 'special', 'luxury')),
  price bigint NOT NULL DEFAULT 0,
  description text,
  contents_description text,
  min_value bigint NOT NULL DEFAULT 0,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mystery_boxes ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON mystery_boxes TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_mystery_boxes" ON mystery_boxes;
CREATE POLICY "public_read_mystery_boxes" ON mystery_boxes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_mystery_boxes" ON mystery_boxes;
CREATE POLICY "public_insert_mystery_boxes" ON mystery_boxes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_mystery_boxes" ON mystery_boxes;
CREATE POLICY "public_update_mystery_boxes" ON mystery_boxes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_mystery_boxes" ON mystery_boxes;
CREATE POLICY "public_delete_mystery_boxes" ON mystery_boxes FOR DELETE
  TO anon, authenticated USING (true);

-- ==========================================
-- 4. ORDERS
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  buyer_name text NOT NULL,
  buyer_phone text NOT NULL,
  buyer_email text,
  recipient_name text NOT NULL,
  recipient_phone text NOT NULL,
  recipient_address text NOT NULL,
  recipient_city text,
  recipient_postal_code text,
  gift_message text,
  sender_name text,
  is_anonymous boolean DEFAULT false,
  is_gift boolean DEFAULT false,
  mystery_box_preferences jsonb,
  subtotal bigint NOT NULL DEFAULT 0,
  shipping_cost bigint NOT NULL DEFAULT 0,
  discount_amount bigint NOT NULL DEFAULT 0,
  total bigint NOT NULL DEFAULT 0,
  shipping_method text,
  tracking_number text,
  estimated_delivery text,
  discount_code text,
  notes text,
  is_test boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_orders" ON orders;
CREATE POLICY "public_read_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_orders" ON orders;
CREATE POLICY "public_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_orders" ON orders;
CREATE POLICY "public_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ==========================================
-- 5. ORDER ITEMS
-- ==========================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  mystery_box_id uuid REFERENCES mystery_boxes(id) ON DELETE SET NULL,
  name text NOT NULL,
  price bigint NOT NULL DEFAULT 0,
  quantity int NOT NULL DEFAULT 1,
  image_url text,
  item_type text NOT NULL DEFAULT 'product' CHECK (item_type IN ('product', 'mystery_box')),
  gift_message text,
  mystery_box_preferences jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON order_items TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_order_items" ON order_items;
CREATE POLICY "public_read_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_order_items" ON order_items;
CREATE POLICY "public_update_order_items" ON order_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_order_items" ON order_items;
CREATE POLICY "public_delete_order_items" ON order_items FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ==========================================
-- 6. REVIEWS
-- ==========================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  images text[] DEFAULT '{}',
  is_approved boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON reviews TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_reviews" ON reviews;
CREATE POLICY "public_insert_reviews" ON reviews FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_reviews" ON reviews;
CREATE POLICY "public_update_reviews" ON reviews FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_reviews" ON reviews;
CREATE POLICY "public_delete_reviews" ON reviews FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

-- ==========================================
-- 7. DISCOUNT CODES
-- ==========================================
CREATE TABLE IF NOT EXISTS discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  type text NOT NULL DEFAULT 'percentage' CHECK (type IN ('percentage', 'fixed')),
  value int NOT NULL DEFAULT 0,
  min_order_amount bigint DEFAULT 0,
  max_uses int,
  used_count int DEFAULT 0,
  is_active boolean DEFAULT true,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON discount_codes TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_discount_codes" ON discount_codes;
CREATE POLICY "public_read_discount_codes" ON discount_codes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_discount_codes" ON discount_codes;
CREATE POLICY "public_insert_discount_codes" ON discount_codes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_discount_codes" ON discount_codes;
CREATE POLICY "public_update_discount_codes" ON discount_codes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_discount_codes" ON discount_codes;
CREATE POLICY "public_delete_discount_codes" ON discount_codes FOR DELETE
  TO anon, authenticated USING (true);

-- ==========================================
-- 8. WARRANTY CLAIMS
-- ==========================================
CREATE TABLE IF NOT EXISTS warranty_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  order_number text,
  issue_description text NOT NULL,
  document_urls text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'resolved')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE warranty_claims ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON warranty_claims TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_warranty_claims" ON warranty_claims;
CREATE POLICY "public_read_warranty_claims" ON warranty_claims FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_warranty_claims" ON warranty_claims;
CREATE POLICY "public_insert_warranty_claims" ON warranty_claims FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_warranty_claims" ON warranty_claims;
CREATE POLICY "public_update_warranty_claims" ON warranty_claims FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_warranty_claims" ON warranty_claims;
CREATE POLICY "public_delete_warranty_claims" ON warranty_claims FOR DELETE
  TO anon, authenticated USING (true);

-- ==========================================
-- 9. CONTACT MESSAGES
-- ==========================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON contact_messages TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_contact_messages" ON contact_messages;
CREATE POLICY "public_read_contact_messages" ON contact_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_contact_messages" ON contact_messages;
CREATE POLICY "public_update_contact_messages" ON contact_messages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_contact_messages" ON contact_messages;
CREATE POLICY "public_delete_contact_messages" ON contact_messages FOR DELETE
  TO anon, authenticated USING (true);
