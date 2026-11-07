'use client';

import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, Gift } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice, SHIPPING_COST_STANDARD, FREE_SHIPPING_THRESHOLD } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST_STANDARD;
  const total = subtotal + shippingCost;
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-navy mb-3">سبد خرید شما خالی است</h1>
        <p className="text-muted-foreground mb-6">هنوز محصولی به سبد خرید اضافه نکرده‌اید.</p>
        <Link href="/shop">
          <Button size="lg" className="rounded-full px-8">
            شروع خرید <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-navy mb-8">سبد خرید</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id + (item.giftMessage || '')}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted/20 flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gift className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-navy">{item.name}</h3>
                        {item.isGift && item.giftMessage && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            پیام هدیه: {item.giftMessage}
                          </p>
                        )}
                        {item.type === 'mystery_box' && (
                          <Badge variant="secondary" className="mt-1 text-xs">باکس شانسی</Badge>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1.5 hover:bg-accent transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-medium min-w-[2.5rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1.5 hover:bg-accent transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4 ml-2" />
              خالی کردن سبد
            </Button>
            <Link href="/shop">
              <Button variant="outline">
                ادامه خرید <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">خلاصه سفارش</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">جمع کالاها</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">هزینه ارسال</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-success">رایگان</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
              </div>

              {subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
                <div className="bg-accent/50 rounded-xl p-3">
                  <p className="text-xs text-foreground/70 mb-2">
                    {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} تا ارسال رایگان
                  </p>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg">
                <span className="font-semibold text-navy">مبلغ نهایی</span>
                <span className="font-bold text-primary">{formatPrice(total)}</span>
              </div>

              <Link href="/checkout">
                <Button size="lg" className="w-full rounded-xl h-12">
                  تکمیل سفارش <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
