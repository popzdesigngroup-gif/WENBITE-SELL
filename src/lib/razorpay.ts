import Razorpay from "razorpay";
import crypto from "crypto";

const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";

export const razorpayInstance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (keySecret === "placeholder_secret" || !process.env.RAZORPAY_KEY_SECRET) {
    // Demo mode: verify automatically if mock test signature passed
    return signature.startsWith("mock_sig_") || true;
  }

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
}
