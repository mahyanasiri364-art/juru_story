'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import type { Order, OrderItem } from '@/lib/types';
import { formatPrice, formatDateTime } from '@/lib/format';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Package }> = {
  pending: { label: 'در انتظار تایید', color: 'bg-warning/20 text-warning', icon: Clock },
  confirmed: { label: 'تایید شد', color: 'bg-sky-100 text-sky-700', icon: CheckCircle2 },
  processing: { label: 'در حال آماده‌سازی', color: 'bg-sky-100 text-sky-700', icon: Package },
  shipped: { label: 'ارسال شد', color: 'bg-primary/20 text-primary', icon: Truck },
  delivered: { label: 'تحویل شد', color: 'bg-success/20 text-success', icon: CheckCircle2 },
  cancelled: { label: 'لغو شد', color: 'bg-destructive/20 text-destructive', icon: XCircle },
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setSearched(true);

    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber.trim())
      .single();

    if (orderData) {
      setOrder(orderData as Order);
      const { data: itemData } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderData.id);
      setItems((itemData as OrderItem[]) || []);
    } else {
      setOrder(null);
      setItems([]);
    }
    setLoading(false);
  };

  const status = order ? statusConfig[order.status] : null;
  const StatusIcon = status?.icon;

  return (
    <div className="overflow-hidden">
      <section className="gradient-hero py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">پیگیری سفارش</h1>
          <p className="text-lg text-foreground/70">شماره سفارش خود را وارد کنید تا وضعیت آن را ببینید.</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex-1">
              <Input
                placeholder="شماره سفارش (مثلاً JURU-123456789)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                dir="ltr"
                className="h-12"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 rounded-xl" disabled={loading}>
              <Search className="w-5 h-5 ml-2" />
              {loading ? 'در حال جستجو...' : 'جستجو'}
            </Button>
          </form>

          {searched && !loading && !order && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">سفارشی با این شماره یافت نشد. شماره سفارش را بررسی کنید.</p>
              </CardContent>
            </Card>
          )}

          {order && status && StatusIcon && (
            <div className="space-y-6">
              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>وضعیت سفارش</span>
                    <span className="text-sm font-normal text-muted-foreground" dir="ltr">{order.order_number}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${status.color}`}>
                      <StatusIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <Badge className={status.color}>{status.label}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">تاریخ ثبت: {formatDateTime(order.created_at)}</p>
                    </div>
                  </div>

                  {/* Tracking steps */}
                  <div className="flex items-center justify-between gap-2">
                    {[
                      { key: 'pending', label: 'ثبت', icon: Clock },
                      { key: 'confirmed', label: 'تایید', icon: CheckCircle2 },
                      { key: 'processing', label: 'آماده‌سازی', icon: Package },
                      { key: 'shipped', label: 'ارسال', icon: Truck },
                      { key: 'delivered', label: 'تحویل', icon: CheckCircle2 },
                    ].map((step, i) => {
                      const stepOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
                      const currentIdx = stepOrder.indexOf(order.status);
                      const stepIdx = stepOrder.indexOf(step.key);
                      const isDone = stepIdx <= currentIdx && order.status !== 'cancelled';
                      return (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDone ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            <step.icon className="w-5 h-5" />
                          </div>
                          <span className={`text-xs ${isDone ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{step.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {order.tracking_number && (
                    <div className="p-4 bg-accent/50 rounded-xl">
                      <p className="text-sm text-muted-foreground">شماره رهگیری پستی</p>
                      <p className="font-medium" dir="ltr">{order.tracking_number}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">اقلام سفارش</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 pb-3 border-b last:border-0 last:pb-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted/20 flex-shrink-0">
                        {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-navy">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity} عدد</p>
                      </div>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 font-bold text-lg">
                    <span>مبلغ کل</span>
                    <span className="text-primary">{formatPrice(order.total)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recipient */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">اطلاعات گیرنده</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">نام گیرنده</span><span className="font-medium">{order.recipient_name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">آدرس</span><span className="font-medium max-w-[60%] text-left">{order.recipient_address}</span></div>
                  {order.recipient_city && <div className="flex justify-between"><span className="text-muted-foreground">شهر</span><span className="font-medium">{order.recipient_city}</span></div>}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
