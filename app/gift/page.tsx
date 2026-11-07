'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gift, Heart, MessageSquare, Package, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart-context';
import { toast } from '@/hooks/use-toast';

export default function GiftPage() {
  const { addItem } = useCart();
  const [form, setForm] = useState({
    senderName: '',
    giftMessage: '',
    isAnonymous: false,
  });

  const handleAddGiftCard = () => {
    if (!form.giftMessage.trim()) {
      toast({ title: 'پیام هدیه را وارد کنید', variant: 'destructive' });
      return;
    }
    addItem({
      id: `gift-card-${Date.now()}`,
      type: 'product',
      name: 'کارت هدیه شخصی‌سازی شده',
      price: 0,
      quantity: 1,
      image: '',
      giftMessage: form.giftMessage,
      senderName: form.isAnonymous ? 'ناشناس' : form.senderName,
      isGift: true,
      isAnonymous: form.isAnonymous,
    });
    toast({ title: 'کارت هدیه به سبد اضافه شد' });
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 mb-4">
            <Heart className="w-3.5 h-3.5 ml-1" />
            شخصی‌سازی هدیه
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-navy mb-4">
            هدیه‌ات را <span className="text-primary">شخصی</span> کن
          </h1>
          <p className="text-lg text-foreground/70 leading-relaxed">
            با افزودن پیام اختصاصی و کارت هدیه، هدیه‌ات را خاص‌تر کن. گیرنده پیام تو را روی کارت دست‌نویس جورو خواهد خواند.
          </p>
        </div>
      </section>

      {/* Gift personalization */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                پیام هدیه
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senderName">نام فرستنده</Label>
                <Input
                  id="senderName"
                  value={form.senderName}
                  onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                  placeholder="نام شما..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="giftMessage">پیام شما روی کارت هدیه</Label>
                <Textarea
                  id="giftMessage"
                  rows={5}
                  value={form.giftMessage}
                  onChange={(e) => setForm({ ...form, giftMessage: e.target.value })}
                  placeholder="هر چه دل تنت می‌خواهد بنویس..."
                />
                <p className="text-xs text-muted-foreground">پیام با خط زیبا روی کارت هدیه نوشته می‌شود.</p>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isAnonymous"
                  checked={form.isAnonymous}
                  onCheckedChange={(v) => setForm({ ...form, isAnonymous: v === true })}
                />
                <Label htmlFor="isAnonymous" className="text-sm font-normal cursor-pointer">
                  ارسال به‌صورت ناشناس
                </Label>
              </div>
              <Button onClick={handleAddGiftCard} className="w-full rounded-xl h-12">
                <Gift className="w-5 h-5 ml-2" />
                افزودن کارت هدیه به سبد
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-cream">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-navy text-center mb-12">چگونه کار می‌کند؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Gift, title: 'انتخاب عروسک', desc: 'از فروشگاه یا باکس شانسی' },
              { icon: MessageSquare, title: 'نوشتن پیام', desc: 'پیام اختصاصی روی کارت' },
              { icon: Package, title: 'بسته‌بندی جورو', desc: 'جعبه آبی با کارت هدیه' },
              { icon: Heart, title: 'تحویل سورپرایز', desc: 'هدیه به دست گیرنده می‌رسد' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gradient-sky rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-xs font-bold text-primary mb-2">مرحله {i + 1}</div>
                <h3 className="font-semibold text-navy mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-navy mb-4">آماده‌ای برای ارسال هدیه؟</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop">
              <Button size="lg" className="rounded-full px-8 h-12">
                انتخاب عروسک <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
            <Link href="/mystery-box">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                باکس شانسی <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
