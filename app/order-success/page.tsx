'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Package, Truck, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('number') || '';
  const [copied, setCopied] = useState(false);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    toast({ title: 'کپی شد', description: orderNumber });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <CheckCircle2 className="w-12 h-12 text-success" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-navy mb-3">سفارش شما با موفقیت ثبت شد!</h1>
        <p className="text-muted-foreground mb-8">
          به‌زودی تیم جورو با شما تماس می‌گیرد. شماره سفارش خود را یادداشت کنید.
        </p>

        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">شماره سفارش</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-xl font-bold text-primary" dir="ltr">{orderNumber}</span>
              <button onClick={copyOrderNumber} className="text-muted-foreground hover:text-primary transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center gap-2 p-4 bg-accent/50 rounded-xl">
            <Package className="w-6 h-6 text-primary" />
            <span className="text-xs text-foreground/70 text-center">آماده‌سازی سفارش</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-accent/50 rounded-xl">
            <Truck className="w-6 h-6 text-primary" />
            <span className="text-xs text-foreground/70 text-center">ارسال به گیرنده</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-accent/50 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <span className="text-xs text-foreground/70 text-center">تحویل هدیه</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => router.push('/track-order')}>
            پیگیری سفارش
          </Button>
          <Button onClick={() => router.push('/shop')}>
            ادامه خرید
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center">...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
