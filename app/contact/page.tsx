'use client';

import { useState } from 'react';
import { Phone, Mail, Instagram, Globe, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject || null,
      message: form.message,
      status: 'unread',
    });

    if (error) {
      toast({ title: 'خطا در ارسال پیام', description: 'لطفاً دوباره تلاش کنید', variant: 'destructive' });
    } else {
      toast({ title: 'پیام شما ارسال شد', description: 'به‌زودی پاسخ خواهیم داد' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    }
    setSubmitting(false);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="gradient-hero py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">تماس با ما</h1>
          <p className="text-lg text-foreground/70">سوال یا پیشنهادی دارید؟ با جورو در تماس باشید.</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-navy">راه‌های ارتباطی</h2>
              <div className="space-y-4">
                <a href="tel:09307000415" className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/30 transition-colors" dir="ltr">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-sm text-muted-foreground">تماس تلفنی</p>
                    <p className="font-medium">09307000415</p>
                  </div>
                </a>
                <a href="mailto:sattari206@gmail.com" className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/30 transition-colors" dir="ltr">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-sm text-muted-foreground">ایمیل</p>
                    <p className="font-medium">sattari206@gmail.com</p>
                  </div>
                </a>
                <a href="https://instagram.com/juru.ir" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/30 transition-colors" dir="ltr">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-sm text-muted-foreground">اینستاگرام</p>
                    <p className="font-medium">@juru.ir</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl" dir="ltr">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-sm text-muted-foreground">وب‌سایت</p>
                    <p className="font-medium">juru.ir</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  فرم تماس
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">نام و نام خانوادگی *</Label>
                    <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل *</Label>
                    <Input id="email" type="email" required dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">شماره تماس</Label>
                    <Input id="phone" type="tel" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09xxxxxxxxx" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">موضوع</Label>
                    <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">پیام *</Label>
                    <Textarea id="message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <Button type="submit" size="lg" className="w-full rounded-xl h-12" disabled={submitting}>
                    {submitting ? 'در حال ارسال...' : 'ارسال پیام'}
                    {!submitting && <Send className="w-4 h-4 mr-2" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
