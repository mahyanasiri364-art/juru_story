'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
      ]);
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const filteredProducts = products
    .filter((p) => {
      if (selectedCategory === 'all') return true;
      const cat = categories.find((c) => c.slug === selectedCategory);
      return cat ? p.category_id === cat.id : true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return a.sort_order - b.sort_order;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 text-center md:text-right">
        <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">فروشگاه جورو</h1>
        <p className="text-muted-foreground">عروسک‌های پولیشی وارداتی و هدیه‌های سورپرایزی</p>
      </div>

      {/* Category Pills - Desktop */}
      <div className="hidden md:flex items-center gap-2 mb-8 flex-wrap">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          className="rounded-full"
          onClick={() => setSelectedCategory('all')}
        >
          همه محصولات
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.slug ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => setSelectedCategory(cat.slug)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4 ml-2" />
          دسته‌بندی
        </Button>
        <span className="text-sm text-muted-foreground hidden md:block">
          {loading ? '...' : `${filteredProducts.length} محصول`}
        </span>
        <div className="flex items-center gap-2 mr-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] md:w-[180px] h-9">
              <SelectValue placeholder="مرتب‌سازی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">پیش‌فرض</SelectItem>
              <SelectItem value="price-low">ارزان‌ترین</SelectItem>
              <SelectItem value="price-high">گران‌ترین</SelectItem>
              <SelectItem value="newest">جدیدترین</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="md:hidden mb-6 p-4 bg-card rounded-xl border border-border animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-sm">دسته‌بندی‌ها</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowFilters(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              onClick={() => { setSelectedCategory('all'); setShowFilters(false); }}
            >
              همه
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
                onClick={() => { setSelectedCategory(cat.slug); setShowFilters(false); }}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground">محصولی در این دسته‌بندی یافت نشد.</p>
        </div>
      )}
    </div>
  );
}
