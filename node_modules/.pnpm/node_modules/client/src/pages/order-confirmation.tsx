import { useQuery } from "@tanstack/react-query";
import { fetchOrder } from "../lib/api";
import { Link } from "wouter";
import { CheckCircle, ArrowRight, Clock, Package } from "lucide-react";

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: "badge-pending", label: "Pending" },
  preparing: { color: "badge-preparing", label: "Preparing" },
  ready: { color: "badge-ready", label: "Ready" },
  completed: { color: "badge-completed", label: "Completed" },
};

export default function OrderConfirmationPage({ id }: { id: string }) {
  const orderId = parseInt(id);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: !isNaN(orderId),
    refetchInterval: 10_000, // poll every 10s for status updates
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-heading text-3xl font-bold text-clay-900 mb-3">
          Order Not Found
        </h1>
        <Link href="/menu" className="btn-primary inline-flex items-center gap-2 mt-4">
          Back to Menu <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;

  return (
    <div className="py-12 px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-6 animate-fade-in-up">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-clay-900 mb-2">
            Order Placed!
          </h1>
          <p className="text-clay-500">
            Thank you, <strong>{order.customerName}</strong>! Your order has
            been received.
          </p>
        </div>

        {/* Order Info */}
        <div className="warm-card p-6 text-left mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-saffron-500" />
              <span className="font-heading font-bold text-lg text-clay-900">
                Order #{order.id}
              </span>
            </div>
            <span className={`badge ${status.color}`}>{status.label}</span>
          </div>

          {order.tableNumber && (
            <p className="text-sm text-clay-500 mb-4">
              Table: <strong className="text-clay-900">{order.tableNumber}</strong>
            </p>
          )}

          {/* Itemized Bill */}
          <div className="border-t border-clay-200 pt-4 space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-clay-600">
                  {item.menuItemName} × {item.quantity}
                </span>
                <span className="font-bold text-clay-900">₹{item.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-clay-200 mt-4 pt-4 flex justify-between items-center">
            <span className="font-heading font-bold text-lg text-clay-900">
              Grand Total
            </span>
            <span className="text-2xl font-bold text-saffron-600">
              ₹{order.total}
            </span>
          </div>
        </div>

        {/* Auto-refresh notice */}
        <div className="flex items-center justify-center gap-2 text-sm text-clay-500 mb-6">
          <Clock className="w-4 h-4" />
          Status refreshes automatically every 10 seconds
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/menu"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            Order More <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
