'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, X, Search } from 'lucide-react';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'خانه' },
  { href: '/shop', label: 'فروشگاه' },
  { href: '/mystery-box', label: 'باکس شانسی' },
  { href: '/gift', label: 'شخصی‌سازی هدیه' },
  { href: '/about', label: 'درباره جورو' },
  { href: '/authenticity', label: 'اصالت و ضمانت' },
  { href: '/contact', label: 'تماس با ما' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-white/80 backdrop-blur-sm'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-accent hover:text-primary',
                  isActive(link.href)
                    ? 'text-primary bg-accent'
                    : 'text-foreground/70'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link href="/track-order" className="hidden md:block">
              <Button variant="ghost" size="sm" className="text-foreground/70">
                پیگیری سفارش
              </Button>
            </Link>

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -left-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <div className="flex items-center justify-between p-4 border-b">
                  <SheetTitle asChild>
                    <Link href="/" onClick={() => setMobileOpen(false)}>
                      <Logo />
                    </Link>
                  </SheetTitle>
                </div>
                <nav className="flex flex-col p-4 gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-accent',
                        isActive(link.href) ? 'text-primary bg-accent' : 'text-foreground/80'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/track-order"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm font-medium rounded-lg text-foreground/80 hover:bg-accent"
                  >
                    پیگیری سفارش
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm font-medium rounded-lg text-foreground/80 hover:bg-accent"
                  >
                    سوالات متداول
                  </Link>
                  <Link
                    href="/terms"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm font-medium rounded-lg text-foreground/80 hover:bg-accent"
                  >
                    قوانین و مقررات
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm font-medium rounded-lg text-foreground/50 hover:bg-accent mt-2 border-t pt-4"
                  >
                    پنل مدیریت
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
