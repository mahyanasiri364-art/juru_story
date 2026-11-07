'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  Package,
  Star,
  ArrowRight,
  Minus,
  Plus,
  CheckCircle2,
  ChevronLeft,
  ZoomIn,
  Globe,
  Award,
  Scissors,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Review, Category } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/lib/cart-context';
import { toast } from '@/hooks/use-toast';
import { ProductCard } from '@/components/product-card';
import { Separator } from '@/components/ui/separator';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setActiveImage(0);
      setQuantity(1);
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (!data) {
        setLoading(false);
        return;
      }

      setProduct(data as Product);

      if (data.category_id) {
        const { data: catData } = await supabase
          .from('categories')
          .select('*')
          .eq('id', data.category_id)
          .single();
        setCategory(catData as Category);

        const { data: relatedData } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', data.category_id)
          .eq('is_active', true)
          .neq('id', data.id)
          .limit(4);
        setRelated((relatedData as Product[]) || []);
      }

      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', data.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(5);
      setReviews((reviewData as Review[]) || []);

      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addItem({
      id: `product-${product.id}`,
      type: 'product',
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0] || '',
      slug: product.slug,
    });
    toast({ title: 'به سبد خرید اضافه شد', description: `${quantity} × ${product.name}` });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy mb-4">محصول یافت نشد</h1>
        <p className="text-muted-foreground mb-6">محصول مورد نظر شما وجود ندارد یا حذف شده است.</p>
        <Link href="/shop">
          <Button>بازگشت به فروشگاه</Button>
        </Link>
      </div>
    );
  }

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <ChevronLeft className="w-3 h-3" />
        <Link href="/shop" className="hover:text-primary">فروشگاه</Link>
        {category && (
          <>
            <ChevronLeft className="w-3 h-3" />
            <Link href={`/shop?category=${category.slug}`} className="hover:text-primary">{category.name}</Link>
          </>
        )}
        <ChevronLeft className="w-3 h-3" />
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div
            className="relative aspect-square rounded-3xl overflow-hidden bg-muted/20 border border-border group cursor-zoom-in"
            onClick={() => setZoomOpen(true)}
          >
            <img
              src={product.images[activeImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-5 h-5 text-foreground" />
            </div>
            {discount > 0 && (
              <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-sm px-3 py-1">
                {discount}% تخفیف
              </Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img src={img} alt={`${product.name} - تصویر ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            {category && (
              <Link href={`/shop?category=${category.slug}`}>
                <Badge variant="secondary" className="mb-3">{category.name}</Badge>
              </Link>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-navy mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(avgRating) ? 'text-gold fill-gold' : 'text-muted-foreground/30'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({reviews.length} نظر)</span>
                </div>
              )}
              {product.is_bestseller && (
                <Badge className="bg-gold/20 text-gold border-gold/30">پرفروش</Badge>
              )}
              {product.is_new && (
                <Badge className="bg-success/20 text-success border-success/30">جدید</Badge>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compare_at_price)}</span>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="text-sm">
                {formatPrice(product.compare_at_price! - product.price)} تخفیف
              </Badge>
            )}
          </div>

          {product.description && (
            <p className="text-foreground/70 leading-relaxed">{product.description}</p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1.5 text-sm text-success font-medium">
                <CheckCircle2 className="w-4 h-4" /> موجود در انبار ({product.stock} عدد)
              </span>
            ) : (
              <span className="text-sm text-destructive font-medium">ناموجود</span>
            )}
          </div>

          {/* Quantity + Add to cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 hover:bg-accent transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2.5 font-medium min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2.5 hover:bg-accent transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button
                size="lg"
                className="flex-1 rounded-xl h-12"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-5 h-5 ml-2" />
                افزودن به سبد خرید
              </Button>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col items-center gap-2 p-3 bg-accent/50 rounded-xl text-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-xs text-foreground/70">ضمانت اصالت</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 bg-accent/50 rounded-xl text-center">
              <Truck className="w-5 h-5 text-primary" />
              <span className="text-xs text-foreground/70">ارسال سراسری</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 bg-accent/50 rounded-xl text-center">
              <Package className="w-5 h-5 text-primary" />
              <span className="text-xs text-foreground/70">بسته‌بندی خاص</span>
            </div>
          </div>

          <Separator />

          {/* Full specs table */}
          <div className="space-y-3">
            <h3 className="font-semibold text-navy">مشخصات کامل محصول</h3>
            <div className="space-y-2">
              {product.dimensions && (
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg text-sm">
                  <span className="text-muted-foreground">ابعاد</span>
                  <span className="font-medium">{product.dimensions}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg text-sm">
                  <span className="text-muted-foreground">وزن</span>
                  <span className="font-medium">{product.weight}</span>
                </div>
              )}
              {product.material && (
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg text-sm">
                  <span className="text-muted-foreground">جنس پارچه و الیاف</span>
                  <span className="font-medium text-left max-w-[60%]">{product.material}</span>
                </div>
              )}
              {product.country_of_origin && (
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> کشور سازنده
                  </span>
                  <span className="font-medium">{product.country_of_origin}</span>
                </div>
              )}
              <div className="flex justify-between p-3 bg-muted/30 rounded-lg text-sm">
                <span className="text-muted-foreground">کشور مبدأ واردات</span>
                <span className="font-medium">ایران</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/30 rounded-lg text-sm">
                <span className="text-muted-foreground">نوع دوخت</span>
                <span className="font-medium">دوخت تقویت‌شده صنعتی</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/30 rounded-lg text-sm">
                <span className="text-muted-foreground">استاندارد</span>
                <span className="font-medium">CE / EN71 اروپا</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/30 rounded-lg text-sm">
                <span className="text-muted-foreground">نگهداری و شست‌وشو</span>
                <span className="font-medium">شست‌وشو با دست در آب ولرم</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/30 rounded-lg text-sm">
                <span className="text-muted-foreground">محتویات بسته‌بندی</span>
                <span className="font-medium">عروسک، کارت هدیه، کارت اصالت</span>
              </div>
            </div>
          </div>

          {/* Long description */}
          {product.long_description && (
            <div className="space-y-2">
              <h3 className="font-semibold text-navy">معرفی و ویژگی‌ها</h3>
              <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">
                {product.long_description}
              </p>
            </div>
          )}

          {/* Warranty & Authenticity */}
          {product.warranty_info && (
            <div className="p-5 bg-gradient-to-l from-primary/5 to-accent/30 rounded-2xl border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-navy">ضمانت اصالت و کیفیت جورو</h3>
              </div>
              <div className="space-y-2 text-sm text-foreground/70">
                <p>{product.warranty_info}</p>
                {product.warranty_duration && (
                  <p>مدت ضمانت: <span className="font-medium text-navy">{product.warranty_duration}</span></p>
                )}
                <div className="flex items-start gap-2 pt-2">
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span>تمام عروسک‌های جورو وارداتی و دارای مدارک کتبی خرید از تأمین‌کننده معتبر هستند.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span>کشور سازنده: {product.country_of_origin} — کشور واردات: ایران</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span>هر محصول دارای کارت اصالت با شماره سریال اختصاصی جورو است.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-navy mb-6">نظرات مشتریان</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-gold fill-gold' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                </div>
                {review.title && <h3 className="font-semibold text-navy mb-1">{review.title}</h3>}
                <p className="text-sm text-foreground/70 mb-3">{review.comment}</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                    {review.customer_name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{review.customer_name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-navy">محصولات مشابه</h2>
            <Link href="/shop">
              <Button variant="ghost" className="text-primary">
                مشاهده همه <ArrowRight className="w-4 h-4 mr-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Zoom modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setZoomOpen(false)}
        >
          <button className="absolute top-4 right-4 text-white/80 hover:text-white p-2" onClick={() => setZoomOpen(false)}>
            <X className="w-8 h-8" />
          </button>
          <img
            src={product.images[activeImage] || product.images[0]}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-background/20 backdrop-blur-sm rounded-xl p-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveImage(i); }}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-primary' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
