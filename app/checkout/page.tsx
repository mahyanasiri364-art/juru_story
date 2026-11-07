'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Truck, Package, ShieldCheck, CreditCard } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice, SHIPPING_COST_STANDARD, SHIPPING_COST_EXPRESS, FREE_SHIPPING_THRESHOLD } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { callCheckout } from '@/lib/checkout-api';
import { toast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  const [form, setForm] = useState({
    buyer_name: '',
    buyer_phone: '',
    buyer_email: '',
    recipient_name: '',
    recipient_phone: '',
    recipient_address: '',
    recipient_city: '',
    recipient_postal_code: '',
    gift_message: '',
    sender_name: '',
    is_anonymous: false,
    is_gift: false,
    notes: '',
  });

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : shippingMethod === 'express' ? SHIPPING_COST_EXPRESS : SHIPPING_COST_STANDARD;
  const total = subtotal + shippingCost;

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const checkoutAttemptRef = useRef<{ signature: string; key: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({ title: 'سبد خرید خالی است', variant: 'destructive' });
      return;
    }

    setSubmitting(true);

    const payloadItems = items.map((item) => ({
      type: item.type,
      id: item.type === 'product' ? item.productId : item.mysteryBoxId,
      quantity: item.quantity,
      giftMessage: item.giftMessage,
      mysteryBoxPreferences: item.mysteryBoxPreferences,
    }));

    const signature = JSON.stringify({ payloadItems, shippingMethod, phone: form.buyer_phone });
    if (!checkoutAttemptRef.current || checkoutAttemptRef.current.signature !== signature) {
      checkoutAttemptRef.current = { signature, key: crypto.randomUUID() };
    }

    try {
      const order = await callCheckout<{ orderNumber: string }>('create_order', {
        checkoutKey: checkoutAttemptRef.current.key,
        buyer: { name: form.buyer_name, phone: form.buyer_phone, email: form.buyer_email },
        recipient: {
          name: form.recipient_name,
          phone: form.recipient_phone,
          address: form.recipient_address,
          city: form.recipient_city,
          postalCode: form.recipient_postal_code,
        },
        gift: {
          isGift: form.is_gift,
          senderName: form.sender_name,
          isAnonymous: form.is_anonymous,
          message: form.gift_message,
        },
        shippingMethod,
        notes: form.notes,
        items: payloadItems,
      });

      const payment = await callCheckout<{ paymentUrl: string }>('start_payment', {
        orderNumber: order.orderNumber,
      });

      clearCart();
      window.location.href = payment.paymentUrl;
    } catch (err) {
      toast({
        title: 'خطا در ثبت سفارش',
        description: err instanceof Error ? err.message : 'لطفاً دوباره تلاش کنید',
        variant: 'destructive',
      });
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy mb-4">سبد خرید خالی است</h1>
        <p className="text-muted-foreground mb-6">برای ادامه، ابتدا محصولی به سبد خرید اضافه کنید.</p>
        <Button onClick={() => router.push('/shop')}>بازگشت به فروشگاه</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-navy mb-8">تکمیل سفارش</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Buyer info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">اطلاعات خریدار</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyer_name">نام و نام خانوادگی *</Label>
                  <Input id="buyer_name" required value={form.buyer_name} onChange={(e) => handleChange('buyer_name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer_phone">شماره تماس *</Label>
                  <Input id="buyer_phone" required type="tel" dir="ltr" value={form.buyer_phone} onChange={(e) => handleChange('buyer_phone', e.target.value)} placeholder="09xxxxxxxxx" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="buyer_email">ایمیل (اختیاری)</Label>
                  <Input id="buyer_email" type="email" dir="ltr" value={form.buyer_email} onChange={(e) => handleChange('buyer_email', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipient info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">اطلاعات گیرنده</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  id="is_gift"
                  checked={form.is_gift}
                  onCheckedChange={(v) => handleChange('is_gift', v === true)}
                />
                <Label htmlFor="is_gift" className="text-sm font-normal cursor-pointer">
                  این سفارش به‌عنوان هدیه ارسال می‌شود
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient_name">نام گیرنده *</Label>
                  <Input id="recipient_name" required value={form.recipient_name} onChange={(e) => handleChange('recipient_name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient_phone">شماره تماس گیرنده *</Label>
                  <Input id="recipient_phone" required type="tel" dir="ltr" value={form.recipient_phone} onChange={(e) => handleChange('recipient_phone', e.target.value)} placeholder="09xxxxxxxxx" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="recipient_address">آدرس کامل *</Label>
                  <Textarea id="recipient_address" required value={form.recipient_address} onChange={(e) => handleChange('recipient_address', e.target.value)} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient_city">شهر</Label>
                  <Input id="recipient_city" value={form.recipient_city} onChange={(e) => handleChange('recipient_city', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient_postal_code">کد پستی</Label>
                  <Input id="recipient_postal_code" dir="ltr" value={form.recipient_postal_code} onChange={(e) => handleChange('recipient_postal_code', e.target.value)} />
                </div>
              </div>

              {form.is_gift && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="sender_name">نام فرستنده (روی کارت هدیه)</Label>
                    <Input id="sender_name" value={form.sender_name} onChange={(e) => handleChange('sender_name', e.target.value)} placeholder="نام شما یا «ناشناس»" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gift_message">پیام هدیه</Label>
                    <Textarea id="gift_message" value={form.gift_message} onChange={(e) => handleChange('gift_message', e.target.value)} rows={3} placeholder="پیام شما روی کارت هدیه..." />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="is_anonymous"
                      checked={form.is_anonymous}
                      onCheckedChange={(v) => handleChange('is_anonymous', v === true)}
                    />
                    <Label htmlFor="is_anonymous" className="text-sm font-normal cursor-pointer">
                      ارسال به‌صورت ناشناس (نام فرستنده نمایش داده نمی‌شود)
                    </Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">روش ارسال</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-primary bg-accent/50' : 'border-border'}`}>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <div>
                    <span className="font-medium">پست عادی</span>
                    <p className="text-xs text-muted-foreground">تحویل ۳ تا ۵ روز کاری</p>
                  </div>
                </div>
                <span className="font-medium text-sm">{subtotal >= FREE_SHIPPING_THRESHOLD ? 'رایگان' : formatPrice(SHIPPING_COST_STANDARD)}</span>
                <input type="radio" name="shipping" className="sr-only" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
              </label>
              <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-primary bg-accent/50' : 'border-border'}`}>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-primary" />
                  <div>
                    <span className="font-medium">پست پیشتاز</span>
                    <p className="text-xs text-muted-foreground">تحویل ۱ تا ۲ روز کاری</p>
                  </div>
                </div>
                <span className="font-medium text-sm">{formatPrice(SHIPPING_COST_EXPRESS)}</span>
                <input type="radio" name="shipping" className="sr-only" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
              </label>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">توضیحات (اختیاری)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={2}
                placeholder="هر نکته‌ای که لازم است بدانیم..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">خلاصه سفارش</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground/70">{item.name} × {item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">جمع کالاها</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ارسال</span>
                  <span>{shippingCost === 0 ? <span className="text-success">رایگان</span> : formatPrice(shippingCost)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-navy">مبلغ نهایی</span>
                <span className="font-bold text-primary">{formatPrice(total)}</span>
              </div>
              <Button type="submit" size="lg" className="w-full rounded-xl h-12" disabled={submitting}>
                {submitting ? 'در حال انتقال به درگاه...' : 'پرداخت آنلاین'}
                {!submitting && <CreditCard className="w-5 h-5 ml-2" />}
              </Button>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> پرداخت امن</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> درگاه زرین‌پال</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
