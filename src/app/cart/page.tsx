"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Lock,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, totalAmount, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please provide your email address for license and download delivery.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Call checkout API
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          customer_email: email,
          customer_name: name || "Creator",
          items: cart,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      // 2. If running mock / demo razorpay
      if (data.isMock || !data.keyId || data.keyId === "rzp_test_placeholder") {
        // Direct mock payment simulation
        const verifyRes = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.orderId,
            paymentId: `pay_mock_${Date.now()}`,
            signature: `mock_sig_${Date.now()}`,
            items: cart,
            email: email,
            name: name,
          }),
        });

        if (verifyRes.ok) {
          clearCart();
          router.push(`/order/success?order_id=${data.orderId}&email=${encodeURIComponent(email)}`);
          return;
        }
      }

      // 3. Launch Razorpay Checkout Modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "Viper AI Studio",
        description: "AI Video Master Licensing",
        order_id: data.orderId,
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: "#10b981",
        },
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              items: cart,
              email: email,
              name: name,
            }),
          });

          if (verifyRes.ok) {
            clearCart();
            router.push(`/order/success?order_id=${response.razorpay_order_id}&email=${encodeURIComponent(email)}`);
          } else {
            alert("Payment signature verification failed. Please contact support.");
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert("Error initiating checkout: " + (err.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Cart is Empty</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Explore our collection of 4K cinematic AI video masters and discover the visual assets your projects need.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
        >
          <span>Browse 4K Footage</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Order Checkout</h1>
        <p className="text-gray-400 text-sm mt-1">Review your licenses and claim uncompressed master downloads.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Item List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#11131a] border border-white/10 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-20 h-14 sm:w-28 sm:h-18 rounded-lg object-cover bg-black"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {item.license_type} License
                  </span>
                  <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1">
                    {item.title}
                  </h3>
                  <span className="text-xs text-gray-400 font-mono">
                    {item.resolution || "4K Master"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-white text-base sm:text-lg">
                  {formatCurrency(item.price)}
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Summary Form (1 col) */}
        <div className="space-y-6">
          <form
            onSubmit={handleCheckout}
            className="p-6 rounded-2xl bg-[#11131a] border border-emerald-500/30 space-y-5 shadow-xl"
          >
            <h2 className="text-lg font-bold text-white pb-3 border-b border-white/10">
              License Recipient
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">
                Delivery Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@studio.com"
                className="w-full bg-[#181a24] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-gray-500 block">
                Your license keys and Cloudflare R2 download links are tied to this email.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">
                Full Name / Studio Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Apex Motion Media"
                className="w-full bg-[#181a24] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Total calculation */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({cart.length} items)</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Commercial Rights</span>
                <span className="text-emerald-400">Included</span>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-white pt-2 border-t border-white/5">
                <span>Total Due</span>
                <span className="text-emerald-400">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? "Connecting Gateway..." : "Pay with Razorpay"}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secure 256-bit encrypted checkout</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
