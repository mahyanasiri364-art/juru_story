import type { PaymentGateway, VerifyResult } from "./gateway.ts";

interface ZarinpalConfig {
  merchantId: string;
  sandbox: boolean;
}

export function createZarinpalGateway({ merchantId, sandbox }: ZarinpalConfig): PaymentGateway {
  const apiBase = sandbox
    ? "https://sandbox.zarinpal.com/pg/v4/payment"
    : "https://payment.zarinpal.com/pg/v4/payment";
  const startPayBase = sandbox
    ? "https://sandbox.zarinpal.com/pg/StartPay"
    : "https://www.zarinpal.com/pg/StartPay";

  async function post(path: string, body: Record<string, unknown>) {
    const res = await fetch(`${apiBase}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  return {
    name: "zarinpal",

    async createPayment({ amount, description, callbackUrl }) {
      const data = await post("request.json", {
        merchant_id: merchantId,
        amount,
        description,
        callback_url: callbackUrl,
      });
      const authority = data?.data?.authority;
      if (data?.data?.code !== 100 || typeof authority !== "string" || !authority) {
        throw new Error(`zarinpal request failed: ${data?.data?.code ?? "unknown"}`);
      }
      return { authority, paymentUrl: `${startPayBase}/${authority}` };
    },

    async verifyPayment({ authority, amount }): Promise<VerifyResult> {
      const data = await post("verify.json", { merchant_id: merchantId, amount, authority });
      const code = data?.data?.code;
      if (code === 100 && data?.data?.ref_id) {
        return { ok: true, refId: String(data.data.ref_id) };
      }
      if (code === 101) {
        return { ok: false, pending: true, message: "نتیجه تراکنش نامشخص است؛ لطفاً با پشتیبانی تماس بگیرید." };
      }
      return { ok: false, pending: false, message: "تراکنش توسط درگاه تایید نشد." };
    },
  };
}
