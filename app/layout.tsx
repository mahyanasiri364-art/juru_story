import './globals.css';
import type { Metadata } from 'next';
import { CartProvider } from '@/lib/cart-context';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from '@/components/ui/toaster';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://juru.ir';

export const metadata: Metadata = {
  title: {
    default: 'جورو | JURU - یه نفر به یادت بوده...',
    template: '%s | جورو',
  },
  description:
    'فروشگاه آنلاین جورو؛ عروسک‌های پولیشی وارداتی و هدیه‌های سورپرایزی. یه حس خوب توی یه جعبه. خرید عروسک، باکس شانسی و هدیه شخصی‌سازی شده.',
  keywords: [
    'جورو', 'JURU', 'عروسک پولیشی', 'خرید عروسک', 'هدیه سورپرایزی',
    'باکس شانسی', 'عروسک تدی بر', 'خرس پولیشی', 'هدیه ارسالی', 'عروسک وارداتی',
    'خرید هدیه', 'کارت هدیه', 'عروسک فانتزی', 'پاندا پولیشی', 'خرگوش پولیشی',
    'فیل پولیشی', 'کاپی‌بارا', 'عروسک بزرگ', 'هدیه ولنتاین', 'هدیه تولد',
    'خرید هدیه ارسالی', 'عروسک دخترانه', 'عروسک پسرانه', 'هدیه خاص',
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'جورو | JURU - یه نفر به یادت بوده...',
    description: 'فروشگاه آنلاین جورو؛ عروسک‌های پولیشی وارداتی و هدیه‌های سورپرایزی. یه حس خوب توی یه جعبه. خرید عروسک، باکس شانسی و هدیه شخصی‌سازی شده.',
    type: 'website',
    locale: 'fa_IR',
    siteName: 'جورو | JURU',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'جورو | JURU',
    description: 'عروسک‌های پولیشی وارداتی و هدیه‌های سورپرایزی. یه حس خوب توی یه جعبه.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'جورو | JURU',
  description: 'فروشگاه آنلاین عروسک‌های پولیشی وارداتی و هدیه‌های سورپرایزی. یه حس خوب توی یه جعبه.',
  url: siteUrl,
  telephone: '09307000415',
  email: 'sattari206@gmail.com',
  sameAs: ['https://instagram.com/juru.ir'],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IR',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/shop?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="font-sans antialiased bg-background min-h-screen flex flex-col">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
