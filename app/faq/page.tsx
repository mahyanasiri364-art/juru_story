'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const faqs = [
  {
    q: 'عروسک‌های جورو اصل هستند؟',
    a: 'بله، تمام عروسک‌های جورک از تولیدکنندگان معتبر لهستانی وارد می‌شوند و دارای ضمانت اصالت هستند. هر عروسک دارای برچسب و هولوگرام تولیدکننده است.',
  },
  {
    q: 'زمان ارسال چقدر است؟',
    a: 'ارسال با پست عادی ۳ تا ۵ روز کاری و با پست پیشتاز ۱ تا ۲ روز کاری طول می‌کشد. زمان ارسال به شهر مقصد بستگی دارد.',
  },
  {
    q: 'هزینه ارسال چقدر است؟',
    a: 'هزینه ارسال پست عادی ۸۰,۰۰۰ تومان و پست پیشتاز ۱۵۰,۰۰۰ تومان است. برای سفارش‌های بالای ۱,۵۰۰,۰۰۰ تومان، ارسال پست عادی رایگان است.',
  },
  {
    q: 'باکس شانسی چیست؟',
    a: 'در باکس شانسی، شما به‌جای انتخاب عروسک، آن را به تیم جورو واگذار می‌کنید. مدل و رنگ عروسک برای گیرنده کاملاً سورپرایز خواهد بود. ارزش عروسک همیشه بیشتر از مبلغ پرداختی است.',
  },
  {
    q: 'آیا می‌توانم هدیه را به‌صورت ناشناس بفرستم؟',
    a: 'بله، در صفحه تکمیل سفارش می‌توانید گزینه «ارسال به‌صورت ناشناس» را انتخاب کنید. در این حالت نام شما روی کارت هدیه درج نمی‌شود.',
  },
  {
    q: 'آیا روی جعبه بیرونی اطلاعات برند وجود دارد؟',
    a: 'خیر، جعبه بیرونی فقط شامل عبارت «SOMEONE LOVES YOU» و «یکی دوستت دارد» است. هیچ شماره تماس، آدرس سایت یا تبلیغاتی روی جعبه بیرونی وجود ندارد.',
  },
  {
    q: 'چگونه پیام هدیه اضافه کنم؟',
    a: 'در صفحه تکمیل سفارش، گزینه «این سفارش به‌عنوان هدیه ارسال می‌شود» را فعال کنید. سپس می‌توانید پیام خود را وارد کنید که با خط زیبا روی کارت هدیه نوشته می‌شود.',
  },
  {
    q: 'اگر محصول معیوب باشد چه؟',
    a: 'تمام محصولات دارای ضمانت کیفیت هستند. اگر محصول شما معیوب بود، از طریق صفحه تماس با ما درخواست ضمانت ثبت کنید تا محصول تعویض شود.',
  },
  {
    q: 'چگونه سفارش خود را پیگیری کنم؟',
    a: 'با وارد کردن شماره سفارش در صفحه «پیگیری سفارش» می‌توانید وضعیت سفارش خود را ببینید. شماره سفارش پس از ثبت به شما نمایش داده می‌شود.',
  },
  {
    q: 'آیا ارسال به تمام شهرها انجام می‌شود؟',
    a: 'بله، ارسال به تمام نقاط ایران انجام می‌شود.',
  },
];

export default function FAQPage() {
  return (
    <div className="overflow-hidden">
      <section className="gradient-hero py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 mb-4">
            <HelpCircle className="w-3.5 h-3.5 ml-1" />
            سوالات متداول
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">سوالات متداول</h1>
          <p className="text-lg text-foreground/70">پاسخ سوالات پرتکرار درباره جورو</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-xl px-4 bg-card">
                <AccordionTrigger className="text-right font-medium text-navy hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
