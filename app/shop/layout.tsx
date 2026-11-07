import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'فروشگاه - خرید عروسک پولیشی و هدیه سورپرایزی',
  description:
    'فروشگاه آنلاین جورو؛ خرید عروسک‌های پولیشی وارداتی. خرس، خرگوش، پاندا، فیل، کاپی‌بارا و عروسک‌های فانتزی. باکس شانسی و هدیه شخصی‌سازی شده.',
  keywords: [
    'خرید عروسک', 'عروسک پولیشی', 'خرس عروسکی', 'خرگوش پولیشی', 'پاندا پولیشی',
    'فیل پولیشی', 'کاپی‌بارا', 'عروسک فانتزی', 'خرید هدیه', 'فروشگاه عروسک',
  ],
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: 'فروشگاه جورو - خرید عروسک پولیشی',
    description: 'خرید عروسک‌های پولیشی وارداتی و هدیه‌های سورپرایزی از فروشگاه جورو.',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
