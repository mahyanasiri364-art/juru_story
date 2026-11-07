'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Sparkles, CheckCircle2, ArrowLeft, Gift, Star, ShoppingBag, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { MysteryBox, Category } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/lib/cart-context';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const tierConfig = {
  economy: { label: 'اقتصادی', color: 'from-sky-400 to-sky-600', badge: 'bg-sky-500' },
  special: { label: 'ویژه', color: 'from-sky-500 to-blue-700', badge: 'bg-blue-600' },
  luxury: { label: 'لاکچری', color: 'from-amber-400 to-amber-600', badge: 'bg-gold' },
};

export default function MysteryBoxPage() {
  const [boxes, setBoxes] = useState<MysteryBox[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [selectedBox, setSelectedBox] = useState<MysteryBox | null>(null);
  const [preferences, setPreferences] = useState({
    isGift: false,
    senderName: '',
    giftMessage: '',
    ageGroup: 'any',
    excludeCats: [] as string[],
  });

  useEffect(() => {
    async function fetchData() {
      const [boxRes, catRes] = await Promise.all([
        supabase.from('mystery_boxes').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      ]);
      setBoxes((boxRes.data as MysteryBox[]) || []);
      setCategories((catRes.data as Category[]) || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const toggleExclude = (slug: string) => {
    setPreferences((prev) => ({
      ...prev,
      excludeCats: prev.excludeCats.includes(slug)
        ? prev.excludeCats.filter((s) => s !== slug)
        : [...prev.excludeCats, slug],
    }));
  };

  const handleAddToCart = (box: MysteryBox) => {
    addItem({
      id: `mystery-${box.id}`,
      type: 'mystery_box',
      mysteryBoxId: box.id,
      name: box.name,
      price: box.price,
      quantity: 1,
      image: box.image_url || '',
      isGift: preferences.isGift,
      senderName: preferences.senderName,
      giftMessage: preferences.giftMessage,
      mysteryBoxPreferences: {
        ageGroup: preferences.ageGroup,
        excludedCategories: preferences.excludeCats,
      },
    });
    toast({ title: 'به سبد خرید اضافه شد', description: box.name });
    setSelectedBox(null);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        </div>
        <div className="container mx-auto relative z-10 text-center max-w-2xl">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 mb-4">
            <Box className="w-3.5 h-3.5 ml-1" />
            باکس شانسی جورو
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-navy mb-4">
            انتخاب را به ما بسپار،
            <br />
            <span className="text-primary">سورپرایز را تجربه کن</span>
          </h1>
          <p className="text-lg text-foreground/70 leading-relaxed">
            در باکس شانسی جورو، شما به‌جای انتخاب عروسک، آن را به تیم جورو واگذار می‌کنید. مدل و رنگ عروسک برای گیرنده کاملاً سورپرایز خواهد بود. ارزش محتویات همیشه بیشتر از مبلغ پرداختی شماست.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Gift, title: '۱. سطح را انتخاب کن', desc: 'یکی از سه سطح اقتصادی، ویژه یا لاکچری' },
              { icon: Sparkles, title: '۲. ترجیحات بده', desc: 'گروه سنی، حذف برخی دسته‌ها و پیام هدیه' },
              { icon: Box, title: '۳. سورپرایز دریافت کن', desc: 'عروسک در جعبه جورو با ارزش بیشتر از مبلغ پرداختی' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gradient-sky rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-navy mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Boxes */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {boxes.map((box) => {
                const config = tierConfig[box.tier] || tierConfig.economy;
                return (
                  <Card
                    key={box.id}
                    className="relative overflow-hidden border-2 hover:border-primary/30 transition-all hover:shadow-xl"
                  >
                    <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-l ${config.color}`} />
                    <CardHeader className="text-center pt-8">
                      <div className={`w-16 h-16 ${config.badge} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                        <Box className="w-8 h-8 text-white" />
                      </div>
                      <Badge className={`${config.badge} text-white mb-2`}>
                        سطح {config.label}
                      </Badge>
                      <CardTitle className="text-xl text-navy">{box.name}</CardTitle>
                      {box.description && (
                        <CardDescription className="mt-2">{box.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <span className="text-3xl font-bold text-primary">{formatPrice(box.price)}</span>
                      </div>
                      <div className="bg-accent/50 rounded-xl p-3 text-center">
                        <p className="text-sm text-muted-foreground">ارزش تضمین‌شده محتویات</p>
                        <p className="text-lg font-bold text-navy">{formatPrice(box.min_value)}</p>
                        <p className="text-xs text-success mt-1">
                          {Math.round(((box.min_value - box.price) / box.price) * 100)}% بیشتر از مبلغ پرداختی
                        </p>
                      </div>
                      {box.contents_description && (
                        <p className="text-sm text-foreground/70 leading-relaxed">{box.contents_description}</p>
                      )}
                      <Button
                        className="w-full rounded-xl h-11"
                        onClick={() => {
                          setSelectedBox(box);
                          setPreferences({
                            isGift: false,
                            senderName: '',
                            giftMessage: '',
                            ageGroup: 'any',
                            excludeCats: [],
                          });
                        }}
                      >
                        <ShoppingBag className="w-5 h-5 ml-2" />
                        انتخاب و سفارش‌سازی
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-gradient-navy">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">چرا باکس شانسی؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'سورپرایز واقعی', desc: 'گیرنده هیچ‌چیز نمی‌داند و سورپرایز کامل می‌شود' },
              { icon: CheckCircle2, title: 'ارزش بیشتر', desc: 'ارزش عروسک همیشه بیشتر از مبلغ پرداختی شماست' },
              { icon: Gift, title: 'تجربه متفاوت', desc: 'هیجان باز کردن جعبه و کشف عروسک' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/cart" className="inline-block mt-8">
            <Button size="lg" className="rounded-full bg-white text-navy hover:bg-white/90 px-8 h-12">
              تکمیل سفارش <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Preferences Dialog */}
      {selectedBox && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedBox(null)}>
          <div
            className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-navy">سفارش‌سازی باکس شانسی</h2>
              <button onClick={() => setSelectedBox(null)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div className="p-4 bg-accent/50 rounded-xl">
                <p className="font-semibold text-navy">{selectedBox.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{selectedBox.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-primary">{formatPrice(selectedBox.price)}</span>
                  <span className="text-sm text-success">ارزش تضمین‌شده: {formatPrice(selectedBox.min_value)}</span>
                </div>
              </div>

              {/* Gift option */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="mb-gift"
                    checked={preferences.isGift}
                    onCheckedChange={(v) => setPreferences((p) => ({ ...p, isGift: v === true }))}
                  />
                  <Label htmlFor="mb-gift" className="text-sm cursor-pointer">ارسال به‌عنوان هدیه</Label>
                </div>
                {preferences.isGift && (
                  <div className="space-y-3 pl-6">
                    <div className="space-y-1.5">
                      <Label className="text-xs">نام فرستنده</Label>
                      <Input
                        value={preferences.senderName}
                        onChange={(e) => setPreferences((p) => ({ ...p, senderName: e.target.value }))}
                        placeholder="نام شما یا «ناشناس»"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">پیام هدیه</Label>
                      <Textarea
                        value={preferences.giftMessage}
                        onChange={(e) => setPreferences((p) => ({ ...p, giftMessage: e.target.value }))}
                        rows={2}
                        placeholder="پیام شما روی کارت هدیه..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Age group */}
              <div className="space-y-2">
                <Label className="text-sm">گروه سنی گیرنده</Label>
                <Select
                  value={preferences.ageGroup}
                  onValueChange={(v) => setPreferences((p) => ({ ...p, ageGroup: v }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">مهم نیست</SelectItem>
                    <SelectItem value="0-3">۰ تا ۳ سال</SelectItem>
                    <SelectItem value="3-7">۳ تا ۷ سال</SelectItem>
                    <SelectItem value="7-12">۷ تا ۱۲ سال</SelectItem>
                    <SelectItem value="12+">بزرگسال</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Exclude categories */}
              {categories.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">دسته‌های موردنظر (可不تیک دسته‌هایی که نمی‌خواهید را بردارید)</Label>
                  <div className="flex flex-wrap gap-3 pt-1">
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={!preferences.excludeCats.includes(cat.slug)}
                          onCheckedChange={() => toggleExclude(cat.slug)}
                        />
                        {cat.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <Button
                className="w-full rounded-xl h-12"
                onClick={() => handleAddToCart(selectedBox)}
              >
                <ShoppingBag className="w-5 h-5 ml-2" />
                افزودن به سبد خرید — {formatPrice(selectedBox.price)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
