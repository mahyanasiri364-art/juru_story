'use client';

import Link from 'next/link';
import { ShoppingBag, Eye } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart-context';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) {
      toast({ title: 'محصول ناموجود است', variant: 'destructive' });
      return;
    }
    addItem({
      id: `product-${product.id}`,
      type: 'product',
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || '',
      slug: product.slug,
    });
    toast({ title: 'به سبد خرید اضافه شد', description: product.name });
  };

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <Link href={`/product/${product.slug}`} className={cn('group block', className)}>
      <div className="relative bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            {product.is_new && (
              <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5">
                جدید
              </Badge>
            )}
            {product.is_bestseller && (
              <Badge className="bg-gold text-navy text-[10px] px-2 py-0.5">
                پرفروش
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground text-[10px] px-2 py-0.5">
                {discount}% تخفیف
              </Badge>
            )}
          </div>
          {/* Hover actions */}
          <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/5 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
              <Eye className="w-5 h-5 text-navy" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-base font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full h-9 w-9 hover:bg-primary hover:text-primary-foreground transition-colors flex-shrink-0"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </div>
          {/* Stock status */}
          {product.stock > 0 ? (
            <span className="text-[10px] text-success font-medium">موجود در انبار</span>
          ) : (
            <span className="text-[10px] text-destructive font-medium">ناموجود</span>
          )}
        </div>
      </div>
    </Link>
  );
}
