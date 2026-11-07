'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { Phone, Mail, Instagram, Globe, Heart } from 'lucide-react';

const footerLinks = {
  shop: [
    { href: '/shop', label: 'فروشگاه' },
    { href: '/mystery-box', label: 'باکس شانسی' },
    { href: '/gift', label: 'شخصی‌سازی هدیه' },
    { href: '/track-order', label: 'پیگیری سفارش' },
  ],
  info: [
    { href: '/about', label: 'درباره جورو' },
    { href: '/authenticity', label: 'اصالت و ضمانت' },
    { href: '/faq', label: 'سوالات متداول' },
    { href: '/terms', label: 'قوانین و مقررات' },
  ],
};

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white/90 mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo variant="light" />
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              جورو؛ یه حس خوب توی یه جعبه. فروشگاه تخصصی عروسک‌های پولیشی وارداتی و هدیه‌های سورپرایزی.
            </p>
            <p className="mt-3 text-sm font-medium text-white/90">
              «یه نفر به یادت بوده...»
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">فروشگاه</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">اطلاعات</h3>
            <ul className="space-y-2">
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">راه‌های ارتباطی</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:09307000415"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                  dir="ltr"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>09307000415</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:sattari206@gmail.com"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                  dir="ltr"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>sattari206@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/juru.ir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                  dir="ltr"
                >
                  <Instagram className="w-4 h-4 flex-shrink-0" />
                  <span>@juru.ir</span>
                </a>
              </li>
              <li>
                <a
                  href="https://juru.ir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                  dir="ltr"
                >
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span>juru.ir</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} جورو | JURU. تمام حقوق محفوظ است.
          </p>
          <p className="text-xs text-white/50 flex items-center gap-1">
            ساخته شده با <Heart className="w-3 h-3 text-primary fill-primary" /> در ایران
          </p>
        </div>
      </div>
    </footer>
  );
}
