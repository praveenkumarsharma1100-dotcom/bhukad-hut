import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useCart } from "../lib/cart-context";
import { createOrder } from "../lib/api";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Link } from "wouter";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } =
    useCart();
  const [, setLocation] = useLocation();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      clearCart();
      setLocation(`/order-confirmation/${data.id}`);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handlePlaceOrder = () => {
    setError("");
    if (!customerName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    orderMutation.mutate({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      tableNumber: tableNumber.trim() || undefined,
      notes: notes.trim() || undefined,
      items: items.map((i) => ({
        menuItemId: i.menuItem.id,
        quantity: i.quantity,
      })),
    });
  };

  if (items.length === 0) {
    return (
      <div className="py-20 px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-clay-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-clay-400" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-clay-900 mb-3">
            Your Cart is Empty
          </h1>
          <p className="text-clay-500 mb-8">
            Looks like you haven't added anything yet. Explore our delicious
            menu and add your favourites!
          </p>
          <Link
            href="/menu"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4"
          >
            Browse Menu
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/menu" className="btn-ghost p-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-heading text-3xl font-bold text-clay-900">
            Your Order
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-3 space-y-3">
            {items.map((item) => (
              <div
                key={item.menuItem.id}
                className="warm-card p-4 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-clay-900 truncate">
                    {item.menuItem.name}
                  </h3>
                  <p className="text-sm text-clay-500">
                    ₹{item.menuItem.price} each
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.menuItem.id, item.quantity - 1)
                    }
                    className="w-8 h-8 rounded-full bg-clay-100 flex items-center justify-center hover:bg-clay-200 active:scale-95 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold min-w-[24px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.menuItem.id, item.quantity + 1)
                    }
                    className="w-8 h-8 rounded-full bg-saffron-500 text-white flex items-center justify-center hover:bg-saffron-600 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <span className="font-bold text-saffron-600">
                    ₹{item.menuItem.price * item.quantity}
                  </span>
                </div>

                <button
                  onClick={() => removeItem(item.menuItem.id)}
                  className="p-2 text-clay-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Form & Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="warm-card p-6">
              <h3 className="font-heading font-bold text-lg text-clay-900 mb-4">
                Your Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-clay-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-clay-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="9876543210"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-clay-700 mb-1">
                    Table Number
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Optional"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-clay-700 mb-1">
                    Special Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Extra spicy, no onions, etc."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="warm-card p-6">
              <h3 className="font-heading font-bold text-lg text-clay-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div
                    key={item.menuItem.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-clay-600">
                      {item.menuItem.name} × {item.quantity}
                    </span>
                    <span className="font-bold text-clay-900">
                      ₹{item.menuItem.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-clay-200 pt-3 flex justify-between items-center">
                <span className="font-heading font-bold text-lg text-clay-900">
                  Grand Total
                </span>
                <span className="text-2xl font-bold text-saffron-600">
                  ₹{totalPrice}
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Place Order */}
            <button
              onClick={handlePlaceOrder}
              disabled={orderMutation.isPending}
              className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
            >
              {orderMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  Place Order
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
