'use client';

import Link from 'next/link';
import { ShieldCheck, Package, CheckCircle2, Award, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function AuthenticityPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 ml-1" />
            اصالت و ضمانت
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-navy mb-4">
            تمام محصولات جورک اصل و وارداتی
          </h1>
          <p className="text-lg text-foreground/70 leading-relaxed">
            تمام عروسک‌های جورک از تولیدکنندگان معتبر لهستانی وارد می‌شوند و دارای ضمانت اصالت هستند.
          </p>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: 'اصالت تضمین‌شده', desc: 'تمام محصولات اصل و وارداتی با گواهی اصالت. هر عروسک دارای برچسب و هولوگرام تولیدکننده است.' },
              { icon: CheckCircle2, title: 'ضمانت کیفیت', desc: 'تعویض در صورت معیوب بودن محصول. اگر عروسک شما مشکل داشت، آن را تعویض می‌کنیم.' },
              { icon: Package, title: 'بسته‌بندی امن', desc: 'بسته‌بندی استاندارد برای حفظ سلامت محصول در طول ارسال.' },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 text-center">
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

      {/* How to verify */}
      <section className="py-16 px-4 bg-gradient-sky">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-12">چگونه اصالت را بررسی کنیم؟</h2>
          <div className="space-y-4">
            {[
              { icon: Search, title: 'بررسی برچسب', desc: 'هر عروسک دارای برچسب تولیدکننده لهستانی است.' },
              { icon: Award, title: 'هولوگرام اصالت', desc: 'هولوگرام جورو روی جعبه داخلی قرار دارد.' },
              { icon: ShieldCheck, title: 'گواهی اصالت', desc: 'شماره اصالت در داخل جعبه قرار دارد و قابل پیگیری است.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 bg-white rounded-2xl p-6 shadow-sm">
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

      {/* Warranty claim */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center">
              <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-navy mb-3">درخواست ضمانت</h2>
              <p className="text-muted-foreground mb-6">
                اگر محصول شما مشکل دارد یا اصالت آن را تایید می‌خواهید، فرم درخواست ضمانت را تکمیل کنید.
              </p>
              <Link href="/contact">
                <Button size="lg" className="rounded-full px-8">
                  ثبت درخواست ضمانت
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
