import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_NETLIFY_URL) {
    return `https://${process.env.NEXT_PUBLIC_NETLIFY_URL}`;
  }
  return 'https://juru.ir';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const staticPages = [
    { url: '', lastModified: new Date(), priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/shop', lastModified: new Date(), priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/mystery-box', lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/gift', lastModified: new Date(), priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/about', lastModified: new Date(), priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/authenticity', lastModified: new Date(), priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/contact', lastModified: new Date(), priority: 0.5, changeFrequency: 'monthly' as const },
    { url: '/track-order', lastModified: new Date(), priority: 0.5, changeFrequency: 'monthly' as const },
    { url: '/faq', lastModified: new Date(), priority: 0.5, changeFrequency: 'monthly' as const },
    { url: '/terms', lastModified: new Date(), priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true);

  const { data: categories } = await supabase
    .from('categories')
    .select('slug')
    .eq('is_active', true);

  const productPages = (products || []).map((p) => ({
    url: `/product/${p.slug}`,
    lastModified: new Date(p.updated_at || new Date()),
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }));

  const categoryPages = (categories || []).map((c) => ({
    url: `/shop?category=${c.slug}`,
    lastModified: new Date(),
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }));

  return [...staticPages, ...productPages, ...categoryPages].map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: page.lastModified,
    priority: page.priority,
    changeFrequency: page.changeFrequency,
  }));
}
