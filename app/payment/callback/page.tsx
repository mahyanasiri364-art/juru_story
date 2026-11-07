'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, Copy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/format';
import { callCheckout } from '@/lib/checkout-api';
import { toast } from '@/hooks/use-toast';

type PaymentResult = {
  state: 'paid' | 'failed' | 'pending';
  orderNumber: string;
  total: number;
  refId?: string | null;
  message?: string;
};

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [loadError, setLoadError] = useState('');
  const [retrying, setRetrying] = useState(false);
  const [copied, setCopied] = useState(false);
  const verifiedRef = useRef(false);

  useEffect(() => {
    if (verifiedRef.current) return;
    verifiedRef.current = true;

    const authority = searchParams.get('Authority') || '';
    const status = searchParams.get('Status') || '';
    const orderNumber = searchParams.get('order') || '';

    if (!authority) {
      setLoadError('اطلاعات پرداخت یافت نشد.');
      return;
    }

    callCheckout<PaymentResult>('verify', { authority, status, orderNumber })
      .then(setResult)
      .catch((err: unknown) => setLoadError(err instanceof Error ? err.message : 'خطای ناشناخته رخ داد.'));
  }, [searchParams]);

  const retryPayment = async () => {
    if (!result) return;
    setRetrying(true);
    try {
      const data = await callCheckout<{ paymentUrl: string }>('start_payment', { orderNumber: result.orderNumber });
      window.location.href = data.paymentUrl;
    } catch (err) {
      toast({
        title: 'خطا در شروع پرداخت مجدد',
        description: err instanceof Error ? err.message : 'لطفاً دوباره تلاش کنید',
        variant: 'destructive',
      });
      setRetrying(false);
    }
  };

  const copyRefId = (refId: string) => {
    navigator.clipboard.writeText(refId);
    setCopied(true);
    toast({ title: 'کپی شد' });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loadError) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-3">تایید پرداخت انجام نشد</h1>
          <p className="text-muted-foreground mb-8">{loadError}</p>
          <Link href="/contact">
            <Button>تماس با پشتیبانی</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
        <h1 className="text-xl font-bold text-navy mb-2">در حال تایید پرداخت...</h1>
        <p className="text-muted-foreground">لطفاً صبر کنید، در حال بررسی تراکنش هستیم.</p>
      </div>
    );
  }

  if (result.state === 'pending') {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-warning" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-3">پرداخت در انتظار بررسی است</h1>
          <p className="text-muted-foreground mb-2" dir="ltr">{result.orderNumber}</p>
          <p className="text-muted-foreground mb-8">{result.message}</p>
          <Link href="/track-order">
            <Button variant="outline">پیگیری سفارش</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (result.state === 'failed') {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-3">پرداخت ناموفق بود</h1>
          <p className="text-muted-foreground mb-2" dir="ltr">{result.orderNumber}</p>
          <p className="text-muted-foreground mb-8">
            سفارش شما در انتظار پرداخت باقی مانده است. می‌توانید دوباره پرداخت کنید.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={retryPayment} disabled={retrying}>
              {retrying ? 'در حال انتقال...' : 'پرداخت مجدد'}
            </Button>
            <Link href="/contact">
              <Button>تماس با پشتیبانی</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <CheckCircle2 className="w-12 h-12 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-navy mb-3">پرداخت با موفقیت انجام شد!</h1>
        <p className="text-muted-foreground mb-6">سفارش شما ثبت و تایید شد.</p>

        <Card className="mb-6 text-right">
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">شماره سفارش</span>
              <span className="font-bold text-navy" dir="ltr">{result.orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">مبلغ پرداختی</span>
              <span className="font-bold text-primary">{formatPrice(result.total)}</span>
            </div>
            {result.refId && (
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">کد پیگیری پرداخت</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-navy" dir="ltr">{result.refId}</span>
                  <button
                    onClick={() => copyRefId(result.refId as string)}
                    aria-label={copied ? 'کپی شد' : 'کپی کد پیگیری'}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground mb-6">
          به‌زودی تیم جورو با شما تماس می‌گیرد. شماره سفارش خود را یادداشت کنید.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/track-order">
            <Button variant="outline">پیگیری سفارش</Button>
          </Link>
          <Link href="/shop">
            <Button>ادامه خرید</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center"><Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" /></div>}>
      <PaymentCallbackContent />
    </Suspense>
  );
}
