'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Gift,
  Sparkles,
  ShieldCheck,
  Truck,
  Package,
  Heart,
  Star,
  ArrowLeft,
  CheckCircle2,
  Box,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import type { Product, Review } from '@/lib/types';
import { formatPrice } from '@/lib/format';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [productsRes, reviewsRes] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('reviews')
          .select('*')
          .eq('is_approved', true)
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(6),
      ]);
      setProducts(productsRes.data || []);
      setReviews(reviewsRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const bestsellers = products.filter((p) => p.is_bestseller).slice(0, 4);
  const newArrivals = products.filter((p) => p.is_new).slice(0, 4);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative gradient-hero min-h-[90vh] flex items-center justify-center px-4 py-20">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-sky-light/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-right space-y-6 animate-fade-up">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm">
                <Sparkles className="w-3.5 h-3.5 ml-1" />
                عروسک‌های پولیشی وارداتی
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight text-balance">
                یه نفر به یادت بوده...
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                جورو؛ یه حس خوب توی یه جعبه. عروسک‌های پولیشی باکیفیت و هدیه‌های سورپرایزی که قلب هر کسی را لمس می‌کنند.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/shop">
                  <Button size="lg" className="rounded-full px-8 h-12 text-base">
                    <Gift className="w-5 h-5 ml-2" />
                    انتخاب عروسک
                  </Button>
                </Link>
                <Link href="/mystery-box">
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Box className="w-5 h-5 ml-2" />
                    ارسال یک سورپرایز
                  </Button>
                </Link>
              </div>
              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>ضمانت اصالت</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>ارسال به سراسر ایران</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Package className="w-4 h-4 text-primary" />
                  <span>بسته‌بندی اختصاصی</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative w-full max-w-md mx-auto">
                {/* Blue box background */}
                <div className="absolute inset-0 bg-gradient-sky rounded-3xl rotate-6 scale-95 opacity-50" />
                <div className="relative bg-gradient-sky rounded-3xl p-8 shadow-2xl shadow-primary/20">
                  <img
                    src="https://images.pexels.com/photos/264917/pexels-photo-264917.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="جعبه آبی جورو با عروسک"
                    className="w-full h-auto rounded-2xl shadow-lg"
                  />
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-3 animate-float">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary fill-primary" />
                    <span className="text-xs font-medium text-navy">یکی دوستت دارد</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-navy rounded-2xl shadow-xl p-3 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold" />
                    <span className="text-xs font-medium text-white">SOMEONE LOVES YOU</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-navy">پرفروش‌ترین‌ها</h2>
                <p className="text-sm text-muted-foreground mt-1">محبوب‌ترین عروسک‌های جورو</p>
              </div>
              <Link href="/shop">
                <Button variant="ghost" className="text-primary hover:text-primary">
                  مشاهده همه
                  <ArrowLeft className="w-4 h-4 mr-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mystery Box Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5">
                <Box className="w-3.5 h-3.5 ml-1" />
                باکس شانسی جورو
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                انتخاب را به ما بسپار،
                <br />
                <span className="text-gold">سورپرایز را تجربه کن</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                در باکس شانسی جورو، شما به‌جای انتخاب عروسک، آن را به تیم جورو واگذار می‌کنید. مدل و رنگ عروسک برای گیرنده کاملاً سورپرایز خواهد بود. سه سطح اقتصادی، ویژه و لاکچری.
              </p>
              <div className="space-y-3">
                {[
                  'ارزش عروسک همیشه بیشتر از مبلغ پرداختی',
                  'بسته‌بندی اختصاصی جورو',
                  'امکان ارسال به‌عنوان هدیه با پیام اختصاصی',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/mystery-box">
                <Button size="lg" className="rounded-full bg-white text-navy hover:bg-white/90 px-8 h-12">
                  مشاهده باکس‌ها
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/9169327/pexels-photo-9169327.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="باکس شانسی جورو"
                className="w-full rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-navy">جدیدترین‌ها</h2>
                <p className="text-sm text-muted-foreground mt-1">تازه‌های جورو</p>
              </div>
              <Link href="/shop">
                <Button variant="ghost" className="text-primary hover:text-primary">
                  مشاهده همه
                  <ArrowLeft className="w-4 h-4 mr-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Authenticity & Warranty */}
      <section className="py-16 md:py-24 px-4 bg-gradient-sky">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              <ShieldCheck className="w-3.5 h-3.5 ml-1" />
              اصالت و ضمانت
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
              تمام محصولات جورو وارداتی و اصل
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              تمام عروسک‌های جورک از تولیدکنندگان معتبر لهستانی وارد می‌شوند و دارای ضمانت اصالت هستند. اطلاعات ضمانت هر محصول شفاف و قابل پیگیری است.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: ShieldCheck,
                title: 'اصالت تضمین‌شده',
                desc: 'تمام محصولات اصل و وارداتی با گواهی اصالت',
              },
              {
                icon: CheckCircle2,
                title: 'ضمانت کیفیت',
                desc: 'تعویض در صورت معیوب بودن محصول',
              },
              {
                icon: Package,
                title: 'بسته‌بندی امن',
                desc: 'بسته‌بندی استاندارد برای حفظ سلامت محصول',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-navy mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/authenticity">
              <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                اطلاعات بیشتر اصالت و ضمانت
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Order Steps */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
              مراحل سفارش از انتخاب تا تحویل هدیه
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Gift, title: 'انتخاب عروسک', desc: 'از فروشگاه یا باکس شانسی' },
              { icon: Heart, title: 'شخصی‌سازی هدیه', desc: 'پیام اختصاصی و بسته‌بندی' },
              { icon: Package, title: 'بسته‌بندی جورو', desc: 'جعبه آبی اختصاصی با کارت هدیه' },
              { icon: Truck, title: 'ارسال و تحویل', desc: 'ارسال به آدرس گیرنده در سراسر ایران' },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-card rounded-2xl border border-border p-6 text-center hover:border-primary/30 transition-colors">
                  <div className="w-16 h-16 bg-gradient-sky rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-xs font-bold text-primary mb-2">مرحله {i + 1}</div>
                  <h3 className="font-semibold text-navy mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -left-3 w-6 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packaging Showcase */}
      <section className="py-16 md:py-24 px-4 bg-cream">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <img
                src="https://images.pexels.com/photos/6650015/pexels-photo-6650015.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="بسته‌بندی اختصاصی جورو"
                className="w-full rounded-3xl shadow-xl"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Package className="w-3.5 h-3.5 ml-1" />
                بسته‌بندی اختصاصی
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-navy">
                جعبه آبی جورو؛ بیش از یک بسته‌بندی
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                بسته‌بندی بیرونی جورو شامل یک جعبه آبی آسمانی ساده و شیک است. یک طرف عبارت «SOMEONE LOVES YOU» و طرف دیگر عبارت «یکی دوستت دارد» درج شده است. بدون شماره تماس، آدرس سایت یا تبلیغات روی جعبه بیرونی.
              </p>
              <div className="space-y-3">
                {[
                  'جعبه آبی آسمانی ساده و شیک',
                  'عبارت SOMEONE LOVES YOU روی جعبه',
                  'کارت هدیه با ظاهر دست‌نویس',
                  'هویت برند جورو داخل جعبه',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                تجربه مشتریان جورو
              </h2>
              <p className="text-foreground/70">نظرات و تصاویر دریافت هدیه از جورو</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-gold fill-gold'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  {review.title && (
                    <h3 className="font-semibold text-navy mb-2">{review.title}</h3>
                  )}
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                      {review.customer_name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {review.customer_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-sky rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-2xl md:text-4xl font-bold text-navy">
                همین حالا یک هدیه خاص بفرست
              </h2>
              <p className="text-foreground/70 max-w-xl mx-auto">
                با جورو، ارسال هدیه آسان‌تر از همیشه است. عروسک را انتخاب کن، پیام بنویس و جورو بقیه را انجام می‌دهد.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/shop">
                  <Button size="lg" className="rounded-full px-8 h-12">
                    شروع خرید
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
                <Link href="/gift">
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Gift className="w-5 h-5 ml-2" />
                    شخصی‌سازی هدیه
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
