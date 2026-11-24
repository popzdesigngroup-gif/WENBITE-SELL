import { NextResponse } from "next/server";
import { razorpayInstance } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const { amount, customer_email, customer_name, items } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const isMock = !keyId || keyId === "rzp_test_placeholder";

    if (isMock) {
      // Demo sandbox fallback for local development without live API keys
      const mockOrderId = `order_mock_${Date.now()}`;
      return NextResponse.json({
        orderId: mockOrderId,
        amount: Math.round(amount * 100),
        currency: "INR",
        keyId: "rzp_test_placeholder",
        isMock: true,
      });
    }

    // Real Razorpay order creation
    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: "INR",
      receipt: `vpr_rcpt_${Date.now()}`,
      notes: {
        customer_email,
        customer_name,
        item_count: items?.length || 1,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      isMock: false,
    });
  } catch (error: any) {
    console.error("Razorpay order error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
