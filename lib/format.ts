export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
}

export function formatPriceShort(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function generateOrderNumber(): string {
  const prefix = 'JURU';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}${random}`;
}

export function calculateDiscount(
  subtotal: number,
  discount: { type: 'percentage' | 'fixed'; value: number } | null
): number {
  if (!discount) return 0;
  if (discount.type === 'percentage') {
    return Math.floor((subtotal * discount.value) / 100);
  }
  return Math.min(discount.value, subtotal);
}

export const SHIPPING_COST_STANDARD = 80000;
export const SHIPPING_COST_EXPRESS = 150000;
export const FREE_SHIPPING_THRESHOLD = 1500000;
