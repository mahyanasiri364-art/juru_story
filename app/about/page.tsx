'use client';

import Link from 'next/link';
import { Heart, Gift, Package, Truck, ShieldCheck, Sparkles, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 mb-4">
            <Heart className="w-3.5 h-3.5 ml-1" />
            درباره جورو
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-navy mb-6">
            یه نفر به یادت بوده...
          </h1>
          <p className="text-lg text-foreground/70 leading-relaxed">
            جورو یک برند ایرانی است که عروسک‌های پولیشی باکیفیت و هدیه‌های سورپرایزی را به دست عزیزانت می‌رساند. ما باور داریم هر هدیه‌ای باید یک حس خوب باشد.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-navy">داستان جورو</h2>
              <p className="text-foreground/70 leading-relaxed">
                جورو با یک ایده ساده شروع شد: «یه حس خوب توی یه جعبه». ما می‌خواستیم راهی برای ارسال هدیه‌های خاص ایجاد کنیم که فراتر از یک خرید ساده باشد. تجربه‌ای که از لحظه باز کردن جعبه آبی جورو شروع می‌شود و با خواندن پیام روی کارت هدیه کامل می‌شود.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                تمام عروسک‌های جورک از تولیدکنندگان معتبر لهستانی وارد می‌شوند و دارای ضمانت اصالت هستند. هر عروسک با دقت انتخاب و بسته‌بندی می‌شود تا بهترین تجربه را برای فرستنده و گیرنده رقم بزند.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/6650015/pexels-photo-6650015.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="داستان جورو"
                className="w-full rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-gradient-sky">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-12">ارزش‌های جورو</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: 'اصالت', desc: 'تمام محصولات اصل و وارداتی با گواهی اصالت' },
              { icon: Heart, title: 'احساس', desc: 'هر هدیه یک حس خوب، هر جعبه یک سورپرایز' },
              { icon: Package, title: 'کیفیت', desc: 'بسته‌بندی اختصاصی و بادوام' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-navy mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-12">جورو چه ارائه می‌دهد؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Gift, title: 'عروسک‌های پولیشی', desc: 'خرس، خرگوش، پاندا، کاپی‌بارا، فیل و عروسک‌های فانتزی — همگی وارداتی و اصل' },
              { icon: Box, title: 'باکس شانسی', desc: 'سه سطح اقتصادی، ویژه و لاکچری با ارزش بیشتر از مبلغ پرداختی' },
              { icon: Sparkles, title: 'شخصی‌سازی هدیه', desc: 'پیام اختصاصی و کارت هدیه با خط زیبا' },
              { icon: Truck, title: 'ارسال سراسری', desc: 'ارسال به تمام نقاط ایران با پست عادی و پیشتاز' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 bg-card border border-border rounded-2xl hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-navy mb-4">یه حس خوب بفرست</h2>
          <Link href="/shop">
            <Button size="lg" className="rounded-full px-8 h-12">
              شروع خرید
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
