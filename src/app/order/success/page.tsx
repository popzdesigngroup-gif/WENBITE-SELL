import { Suspense } from "react";
import { OrderSuccessClient } from "./OrderSuccessClient";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading order details...</div>}>
      <OrderSuccessClient />
    </Suspense>
  );
}
