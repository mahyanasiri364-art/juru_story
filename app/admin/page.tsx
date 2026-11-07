'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Star, MessageSquare, TrendingUp, Box, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice, formatDateTime } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Order, Product, Review, ContactMessage, MysteryBox } from '@/lib/types';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [boxes, setBoxes] = useState<MysteryBox[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [ordersRes, productsRes, reviewsRes, messagesRes, boxesRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('mystery_boxes').select('*').order('sort_order', { ascending: true }),
      ]);
      setOrders((ordersRes.data as Order[]) || []);
      setProducts((productsRes.data as Product[]) || []);
      setReviews((reviewsRes.data as Review[]) || []);
      setMessages((messagesRes.data as ContactMessage[]) || []);
      setBoxes((boxesRes.data as MysteryBox[]) || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);

  const statusColors: Record<string, string> = {
    pending: 'bg-warning/20 text-warning',
    confirmed: 'bg-sky-100 text-sky-700',
    processing: 'bg-sky-100 text-sky-700',
    shipped: 'bg-primary/20 text-primary',
    delivered: 'bg-success/20 text-success',
    cancelled: 'bg-destructive/20 text-destructive',
  };

  const statusLabels: Record<string, string> = {
    pending: 'در انتظار',
    confirmed: 'تایید شد',
    processing: 'آماده‌سازی',
    shipped: 'ارسال شد',
    delivered: 'تحویل شد',
    cancelled: 'لغو شد',
  };

  const paymentLabels: Record<string, string> = {
    pending: 'در انتظار پرداخت',
    paid: 'پرداخت شده',
    failed: 'ناموفق',
    refunded: 'بازپرداخت شده',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-navy">پنل مدیریت جورو</h1>
        <p className="text-muted-foreground mt-1">نمای کلی فروش و مدیریت</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: ShoppingCart, label: 'سفارش‌ها', value: orders.length, color: 'text-primary' },
          { icon: TrendingUp, label: 'درآمد کل', value: formatPrice(totalRevenue), color: 'text-success' },
          { icon: Package, label: 'محصولات', value: products.length, color: 'text-sky-600' },
          { icon: MessageSquare, label: 'پیام‌ها', value: messages.length, color: 'text-warning' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-bold text-navy text-sm">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">در حال بارگذاری...</div>
      ) : (
        <Tabs defaultValue="orders">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="orders">سفارش‌ها</TabsTrigger>
            <TabsTrigger value="products">محصولات</TabsTrigger>
            <TabsTrigger value="reviews">نظرات</TabsTrigger>
            <TabsTrigger value="messages">پیام‌ها</TabsTrigger>
            <TabsTrigger value="boxes">باکس‌ها</TabsTrigger>
          </TabsList>

          {/* Orders */}
          <TabsContent value="orders" className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">سفارشی ثبت نشده است.</p>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-navy" dir="ltr">{order.order_number}</span>
                        <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                      </div>
                      <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <span>خریدار: {order.buyer_name}</span>
                      <span className="mx-2">|</span>
                      <span>گیرنده: {order.recipient_name}</span>
                      <span className="mx-2">|</span>
                      <span>{formatDateTime(order.created_at)}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 rounded-lg bg-muted/50 p-3 text-xs">
                      <div>
                        <p className="text-muted-foreground">وضعیت پرداخت</p>
                        <p className="font-medium">{paymentLabels[order.payment_status] ?? order.payment_status}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">درگاه</p>
                        <p className="font-medium" dir="ltr">{order.payment_provider || '-'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">شماره مرجع پرداخت</p>
                        <p className="font-medium" dir="ltr">{order.payment_ref_id || '-'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">تاریخ پرداخت</p>
                        <p className="font-medium">{order.paid_at ? formatDateTime(order.paid_at) : '-'}</p>
                      </div>
                      {order.payment_error && (
                        <p className="col-span-2 md:col-span-4 text-destructive">علت خطا: {order.payment_error}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Products */}
          <TabsContent value="products" className="space-y-3">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted/20 flex-shrink-0">
                    {product.images[0] && <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">موجودی: {product.stock}</p>
                  </div>
                  <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.is_active ? (
                    <Badge className="bg-success/20 text-success">فعال</Badge>
                  ) : (
                    <Badge variant="secondary">غیرفعال</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews" className="space-y-3">
            {reviews.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">نظری ثبت نشده است.</p>
            ) : (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-navy">{review.customer_name}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-gold fill-gold' : 'text-muted-foreground/30'}`} />
                          ))}
                        </div>
                        {review.is_approved ? (
                          <Badge className="bg-success/20 text-success">تایید شده</Badge>
                        ) : (
                          <Badge className="bg-warning/20 text-warning">در انتظار</Badge>
                        )}
                      </div>
                    </div>
                    {review.comment && <p className="text-sm text-foreground/70">{review.comment}</p>}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Messages */}
          <TabsContent value="messages" className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">پیامی ثبت نشده است.</p>
            ) : (
              messages.map((msg) => (
                <Card key={msg.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-navy">{msg.name}</span>
                      <Badge className={msg.status === 'unread' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'}>
                        {msg.status === 'unread' ? 'جدید' : 'خوانده شده'}
                      </Badge>
                    </div>
                    {msg.subject && <p className="text-sm font-medium mb-1">{msg.subject}</p>}
                    <p className="text-sm text-foreground/70">{msg.message}</p>
                    <p className="text-xs text-muted-foreground mt-2" dir="ltr">{msg.email} | {formatDateTime(msg.created_at)}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Mystery boxes */}
          <TabsContent value="boxes" className="space-y-3">
            {boxes.map((box) => (
              <Card key={box.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Box className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-navy">{box.name}</p>
                    <p className="text-sm text-muted-foreground">ارزش واقعی: {formatPrice(box.min_value)}</p>
                  </div>
                  <span className="font-bold text-primary">{formatPrice(box.price)}</span>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
