import { createZarinpalGateway } from "./zarinpal.ts";

export interface PaymentGateway {
  name: string;
  createPayment(input: {
    amount: number;
    orderNumber: string;
    description: string;
    callbackUrl: string;
  }): Promise<{ authority: string; paymentUrl: string }>;
  verifyPayment(input: { authority: string; amount: number }): Promise<VerifyResult>;
}

export type VerifyResult =
  | { ok: true; refId: string }
  | { ok: false; pending: boolean; message: string };

export function getGateway(): PaymentGateway | null {
  const provider = Deno.env.get("PAYMENT_PROVIDER") ?? "";
  const merchantId = Deno.env.get("PAYMENT_MERCHANT_ID") ?? "";
  const sandbox = Deno.env.get("PAYMENT_SANDBOX") === "true";

  if (!provider || !merchantId) return null;

  switch (provider) {
    case "zarinpal":
      return createZarinpalGateway({ merchantId, sandbox });
    default:
      return null;
  }
}
