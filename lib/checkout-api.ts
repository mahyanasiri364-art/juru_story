const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function callCheckout<T>(action: string, body: Record<string, unknown>): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl}/functions/v1/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ action, ...body }),
    });
  } catch {
    throw new Error('ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.');
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data || typeof data !== 'object') {
    const message = data && typeof (data as { error?: unknown }).error === 'string'
      ? (data as { error: string }).error
      : 'خطای ناشناخته رخ داد. لطفاً دوباره تلاش کنید.';
    throw new Error(message);
  }
  return data as T;
}
