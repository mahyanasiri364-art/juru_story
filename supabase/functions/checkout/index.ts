import { createClient } from "npm:@supabase/supabase-js@2";
import { getGateway } from "./gateway.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SHIPPING_COST_STANDARD = 80000;
const SHIPPING_COST_EXPRESS = 150000;
const FREE_SHIPPING_THRESHOLD = 1500000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PHONE_RE = /^09\d{9}$/;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);

class ApiError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function text(value: unknown, field: string, max: number, required = true): string {
  const s = typeof value === "string" ? value.trim() : "";
  if (!s && required) throw new ApiError(`فیلد «${field}» را وارد کنید.`);
  if (s.length > max) throw new ApiError(`فیلد «${field}» طولانی‌تر از حد مجاز است.`);
  return s;
}

function normalizePhone(value: unknown): string {
  const s = typeof value === "string" ? value.replace(/\s|-/g, "") : "";
  if (!PHONE_RE.test(s)) throw new ApiError("شماره موبایل معتبر نیست.");
  return s;
}

type RawItem = { type?: unknown; id?: unknown; quantity?: unknown; giftMessage?: unknown; mysteryBoxPreferences?: unknown };

function parseItems(raw: unknown) {
  if (!Array.isArray(raw) || raw.length < 1 || raw.length > 50) {
    throw new ApiError("سبد خرید نامعتبر است.");
  }
  return raw.map((entry: RawItem) => {
    const type = entry?.type;
    if (type !== "product" && type !== "mystery_box") throw new ApiError("سبد خرید نامعتبر است.");
    if (typeof entry.id !== "string" || !UUID_RE.test(entry.id)) throw new ApiError("سبد خرید نامعتبر است.");
    const quantity = entry.quantity;
    if (!Number.isInteger(quantity) || (quantity as number) < 1 || (quantity as number) > 99) {
      throw new ApiError("تعداد یکی از کالاها نامعتبر است.");
    }
    return {
      type: type as "product" | "mystery_box",
      id: entry.id,
      quantity: quantity as number,
      giftMessage: typeof entry.giftMessage === "string" ? entry.giftMessage.slice(0, 500) : null,
      mysteryBoxPreferences: entry.mysteryBoxPreferences ?? null,
    };
  });
}

async function priceBasket(items: ReturnType<typeof parseItems>, shippingMethod: unknown) {
  const productIds = items.filter((i) => i.type === "product").map((i) => i.id);
  const boxIds = items.filter((i) => i.type === "mystery_box").map((i) => i.id);

  const [productsRes, boxesRes] = await Promise.all([
    productIds.length
      ? supabase.from("products").select("id, name, price, stock, images, is_active").in("id", productIds)
      : Promise.resolve({ data: [], error: null }),
    boxIds.length
      ? supabase.from("mystery_boxes").select("id, name, price, is_active").in("id", boxIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (productsRes.error || boxesRes.error) throw new Error("basket lookup failed");

  const lines = items.map((item) => {
    const row = item.type === "product"
      ? productsRes.data?.find((p) => p.id === item.id)
      : boxesRes.data?.find((b) => b.id === item.id);
    if (!row || !row.is_active) throw new ApiError("یکی از کالاهای سبد دیگر در دسترس نیست.");
    if (item.type === "product" && (row as { stock: number }).stock < item.quantity) {
      throw new ApiError(`موجودی «${row.name}» برای این تعداد کافی نیست.`);
    }
    return {
      ...item,
      name: row.name as string,
      price: row.price as number,
      image: item.type === "product" ? ((row as { images: string[] }).images?.[0] ?? null) : null,
    };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  if (shippingMethod !== "standard" && shippingMethod !== "express") {
    throw new ApiError("روش ارسال نامعتبر است.");
  }
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD
    ? 0
    : shippingMethod === "express" ? SHIPPING_COST_EXPRESS : SHIPPING_COST_STANDARD;

  return { lines, subtotal, shipping, total: subtotal + shipping };
}

async function createOrder(body: Record<string, unknown>) {
  const checkoutKey = text(body.checkoutKey, "کلید سفارش", 80);
  const existing = await supabase
    .from("orders")
    .select("order_number, total, payment_status")
    .eq("checkout_key", checkoutKey)
    .maybeSingle();
  if (existing.data) {
    return {
      orderNumber: existing.data.order_number,
      total: existing.data.total,
      paymentStatus: existing.data.payment_status,
    };
  }

  const buyer = (body.buyer ?? {}) as Record<string, unknown>;
  const recipient = (body.recipient ?? {}) as Record<string, unknown>;
  const gift = (body.gift ?? {}) as Record<string, unknown>;
  const items = parseItems(body.items);
  const priced = await priceBasket(items, body.shippingMethod);

  const buyerEmail = text(buyer.email, "ایمیل", 150, false);
  const isGift = gift.isGift === true;

  const orderNumber = `JURU-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      checkout_key: checkoutKey,
      status: "pending",
      payment_status: "pending",
      buyer_name: text(buyer.name, "نام خریدار", 100),
      buyer_phone: normalizePhone(buyer.phone),
      buyer_email: buyerEmail || null,
      recipient_name: text(recipient.name, "نام گیرنده", 100),
      recipient_phone: normalizePhone(recipient.phone),
      recipient_address: text(recipient.address, "آدرس", 500),
      recipient_city: text(recipient.city, "شهر", 80, false) || null,
      recipient_postal_code: text(recipient.postalCode, "کد پستی", 20, false) || null,
      gift_message: isGift ? text(gift.message, "پیام هدیه", 500, false) || null : null,
      sender_name: isGift ? text(gift.senderName, "نام فرستنده", 100, false) || null : null,
      is_anonymous: isGift && gift.isAnonymous === true,
      is_gift: isGift,
      subtotal: priced.subtotal,
      shipping_cost: priced.shipping,
      discount_amount: 0,
      total: priced.total,
      shipping_method: body.shippingMethod as string,
      notes: text(body.notes, "توضیحات", 500, false) || null,
      is_test: false,
    })
    .select("id, order_number, total, payment_status")
    .single();

  if (orderError || !order) {
    const raced = await supabase
      .from("orders")
      .select("order_number, total, payment_status")
      .eq("checkout_key", checkoutKey)
      .maybeSingle();
    if (raced.data) {
      return { orderNumber: raced.data.order_number, total: raced.data.total, paymentStatus: raced.data.payment_status };
    }
    console.error("order insert failed", orderError);
    throw new ApiError("ثبت سفارش انجام نشد. لطفاً دوباره تلاش کنید.", 500);
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    priced.lines.map((l) => ({
      order_id: order.id,
      product_id: l.type === "product" ? l.id : null,
      mystery_box_id: l.type === "mystery_box" ? l.id : null,
      name: l.name,
      price: l.price,
      quantity: l.quantity,
      image_url: l.image,
      item_type: l.type,
      gift_message: l.giftMessage,
      mystery_box_preferences: l.type === "mystery_box" ? l.mysteryBoxPreferences : null,
    })),
  );
  if (itemsError) {
    console.error("order items insert failed", itemsError);
    await supabase.from("orders").delete().eq("id", order.id);
    throw new ApiError("ثبت سفارش انجام نشد. لطفاً دوباره تلاش کنید.", 500);
  }

  return { orderNumber: order.order_number, total: order.total, paymentStatus: order.payment_status };
}

type OrderRow = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  payment_status: string;
  payment_attempts: number;
  payment_ref_id: string | null;
};

async function loadOrderByNumber(orderNumber: string): Promise<OrderRow> {
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, status, total, payment_status, payment_attempts, payment_ref_id")
    .eq("order_number", orderNumber)
    .maybeSingle();
  if (!data) throw new ApiError("سفارش یافت نشد.", 404);
  return data as OrderRow;
}

async function startPayment(body: Record<string, unknown>) {
  const orderNumber = text(body.orderNumber, "شماره سفارش", 40);
  const order = await loadOrderByNumber(orderNumber);

  if (order.payment_status === "paid") throw new ApiError("این سفارش قبلاً پرداخت شده است.", 409);

  const gateway = getGateway();
  if (!gateway) throw new ApiError("درگاه پرداخت هنوز فعال نشده است.", 503);

  const callbackBase = Deno.env.get("PAYMENT_CALLBACK_URL") ?? "";
  if (!callbackBase) throw new ApiError("درگاه پرداخت هنوز فعال نشده است.", 503);

  let created: { authority: string; paymentUrl: string };
  try {
    created = await gateway.createPayment({
      amount: order.total,
      orderNumber,
      description: `سفارش جورو - ${orderNumber}`,
      callbackUrl: `${callbackBase}?order=${encodeURIComponent(orderNumber)}`,
    });
  } catch (err) {
    console.error("gateway request failed", err);
    await supabase.from("orders").update({ payment_error: "ایجاد درخواست پرداخت ناموفق بود." }).eq("id", order.id);
    throw new ApiError("ارتباط با درگاه پرداخت برقرار نشد. لطفاً دوباره تلاش کنید.", 502);
  }

  const { error: txError } = await supabase.from("payment_transactions").insert({
    order_id: order.id,
    provider: gateway.name,
    authority: created.authority,
    amount: order.total,
  });
  if (txError) {
    console.error("payment transaction insert failed", txError);
    throw new ApiError("ثبت تراکنش انجام نشد. لطفاً دوباره تلاش کنید.", 500);
  }

  await supabase
    .from("orders")
    .update({
      payment_provider: gateway.name,
      payment_authority: created.authority,
      payment_attempts: order.payment_attempts + 1,
      payment_error: null,
    })
    .eq("id", order.id);

  return { paymentUrl: created.paymentUrl };
}

async function markFailed(orderId: string, authority: string, message: string) {
  await supabase
    .from("payment_transactions")
    .update({ status: "failed", error_message: message })
    .eq("authority", authority);
  await supabase
    .from("orders")
    .update({ payment_status: "failed", payment_error: message })
    .eq("id", orderId)
    .neq("payment_status", "paid");
}

async function verifyPayment(body: Record<string, unknown>) {
  const authority = text(body.authority, "کد تراکنش", 100);
  const gatewayStatus = typeof body.status === "string" ? body.status : "";

  const { data: tx } = await supabase
    .from("payment_transactions")
    .select("id, order_id, authority, amount, status, ref_id")
    .eq("authority", authority)
    .maybeSingle();
  if (!tx) throw new ApiError("تراکنش یافت نشد.", 404);

  const { data: order } = await supabase
    .from("orders")
    .select("id, order_number, status, total, payment_status, payment_ref_id")
    .eq("id", tx.order_id)
    .single();
  if (!order) throw new ApiError("سفارش یافت نشد.", 404);

  if (typeof body.orderNumber === "string" && body.orderNumber !== order.order_number) {
    throw new ApiError("اطلاعات تراکنش با سفارش مطابقت ندارد.", 400);
  }

  if (order.payment_status === "paid") {
    return { state: "paid", orderNumber: order.order_number, total: order.total, refId: order.payment_ref_id };
  }

  if (gatewayStatus !== "OK") {
    const message = "پرداخت لغو شد یا ناموفق بود.";
    await markFailed(order.id, authority, message);
    return { state: "failed", orderNumber: order.order_number, total: order.total, message };
  }

  const gateway = getGateway();
  if (!gateway) throw new ApiError("درگاه پرداخت هنوز فعال نشده است.", 503);

  let result;
  try {
    result = await gateway.verifyPayment({ authority, amount: tx.amount });
  } catch (err) {
    console.error("gateway verify failed", err);
    return {
      state: "pending",
      orderNumber: order.order_number,
      total: order.total,
      message: "تایید پرداخت انجام نشد. وضعیت به‌زودی بررسی می‌شود؛ با پشتیبانی تماس بگیرید.",
    };
  }

  if (!result.ok) {
    if (result.pending) {
      return { state: "pending", orderNumber: order.order_number, total: order.total, message: result.message };
    }
    await markFailed(order.id, authority, result.message);
    return { state: "failed", orderNumber: order.order_number, total: order.total, message: result.message };
  }

  const now = new Date().toISOString();
  await supabase
    .from("payment_transactions")
    .update({ status: "verified", ref_id: result.refId, verified_at: now, error_message: null })
    .eq("id", tx.id);

  await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      payment_ref_id: result.refId,
      payment_amount: tx.amount,
      payment_error: null,
      paid_at: now,
      status: order.status === "pending" ? "confirmed" : order.status,
    })
    .eq("id", order.id)
    .neq("payment_status", "paid");

  return { state: "paid", orderNumber: order.order_number, total: order.total, refId: result.refId };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    switch (body.action) {
      case "create_order":
        return json(await createOrder(body));
      case "start_payment":
        return json(await startPayment(body));
      case "verify":
        return json(await verifyPayment(body));
      default:
        return json({ error: "درخواست نامعتبر است." }, 400);
    }
  } catch (err) {
    if (err instanceof ApiError) return json({ error: err.message }, err.status);
    console.error("checkout failed", err);
    return json({ error: "خطای داخلی سرور. لطفاً دوباره تلاش کنید." }, 500);
  }
});
