export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  category_id: string | null;
  images: string[];
  dimensions: string | null;
  weight: string | null;
  material: string | null;
  country_of_origin: string | null;
  is_featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  is_active: boolean;
  warranty_info: string | null;
  warranty_duration: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductWithCategory extends Product {
  category?: Category | null;
}

export interface MysteryBox {
  id: string;
  name: string;
  tier: 'economy' | 'special' | 'luxury';
  price: number;
  description: string | null;
  contents_description: string | null;
  min_value: number;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Review {
  id: string;
  product_id: string | null;
  customer_name: string;
  rating: number;
  title: string | null;
  comment: string | null;
  images: string[];
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string | null;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_city: string | null;
  recipient_postal_code: string | null;
  gift_message: string | null;
  sender_name: string | null;
  is_anonymous: boolean;
  is_gift: boolean;
  mystery_box_preferences: Record<string, unknown> | null;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  shipping_method: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  discount_code: string | null;
  notes: string | null;
  is_test: boolean;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_provider: string | null;
  payment_authority: string | null;
  payment_ref_id: string | null;
  payment_error: string | null;
  payment_amount: number | null;
  payment_attempts: number;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  mystery_box_id: string | null;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
  item_type: 'product' | 'mystery_box';
  gift_message: string | null;
  mystery_box_preferences: Record<string, unknown> | null;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_amount: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
}

export interface WarrantyClaim {
  id: string;
  product_id: string | null;
  product_name: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  order_number: string | null;
  issue_description: string;
  document_urls: string[];
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'resolved';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export interface CartItem {
  id: string;
  type: 'product' | 'mystery_box';
  productId?: string;
  mysteryBoxId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug?: string;
  giftMessage?: string;
  senderName?: string;
  isGift?: boolean;
  isAnonymous?: boolean;
  mysteryBoxPreferences?: {
    fullyRandom: boolean;
    surpriseColor: boolean;
    recipientGender?: string;
    recipientAgeGroup?: string;
    excludedCategories?: string[];
  };
}
