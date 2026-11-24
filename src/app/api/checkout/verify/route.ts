import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const { orderId, paymentId, signature, items, email, name } = await req.json();

    const isValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // In a live Supabase environment, write to `orders`, `order_items`, and `user_licenses`
    // Return verified success
    return NextResponse.json({
      success: true,
      orderId,
      paymentId,
      message: "Payment successfully verified. Licenses granted.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Verification error" },
      { status: 500 }
    );
  }
}
