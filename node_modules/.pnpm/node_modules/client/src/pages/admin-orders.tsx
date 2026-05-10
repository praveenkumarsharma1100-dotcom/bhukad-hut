import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchOrders, fetchOrder, updateOrderStatus, type Order } from "../lib/api";
import { Clock, ChefHat, CheckCircle, CircleCheck, ChevronDown, ChevronUp, Phone, User, Hash, StickyNote } from "lucide-react";

const statusConfig = [
  { value: "pending", label: "Pending", icon: Clock, color: "badge-pending" },
  { value: "preparing", label: "Preparing", icon: ChefHat, color: "badge-preparing" },
  { value: "ready", label: "Ready", icon: CheckCircle, color: "badge-ready" },
  { value: "completed", label: "Completed", icon: CircleCheck, color: "badge-completed" },
];

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const qc = useQueryClient();
  const { data: detail } = useQuery({ queryKey: ["order", order.id], queryFn: () => fetchOrder(order.id), enabled: expanded });
  const mut = useMutation({ mutationFn: (s: string) => updateOrderStatus(order.id, s), onSuccess: () => { qc.invalidateQueries({ queryKey: ["orders"] }); qc.invalidateQueries({ queryKey: ["order", order.id] }); } });
  const badge = statusConfig.find((s) => s.value === order.status) || statusConfig[0];

  return (
    <div className="warm-card overflow-hidden">
      <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-clay-50 transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-heading font-bold text-clay-900">#{order.id}</span>
            <span className={`badge ${badge.color}`}>{badge.label}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-clay-500 flex-wrap">
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {order.customerName}</span>
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {order.customerPhone}</span>
            {order.tableNumber && <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> Table {order.tableNumber}</span>}
          </div>
        </div>
        <div className="text-right">
          <span className="font-bold text-lg text-saffron-600">₹{order.total}</span>
          <p className="text-xs text-clay-400">{new Date(order.createdAt).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-clay-400" /> : <ChevronDown className="w-5 h-5 text-clay-400" />}
      </div>
      {expanded && (
        <div className="border-t border-clay-200 p-4 bg-clay-50/50 animate-fade-in-up">
          <div className="flex flex-wrap gap-2 mb-4">
            {statusConfig.map((s) => (
              <button key={s.value} onClick={() => mut.mutate(s.value)} disabled={mut.isPending || order.status === s.value}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${order.status === s.value ? "bg-saffron-500 text-white shadow-md" : "bg-white border border-clay-300 text-clay-600 hover:border-saffron-400"} disabled:opacity-50`}>
                {s.label}
              </button>
            ))}
          </div>
          {order.notes && (
            <div className="flex items-start gap-2 text-sm text-clay-600 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <StickyNote className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />{order.notes}
            </div>
          )}
          {detail?.items && (
            <div className="space-y-2">
              {detail.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm bg-white rounded-lg p-3 border border-clay-200">
                  <span className="text-clay-700">{item.menuItemName} <span className="text-clay-400">× {item.quantity}</span></span>
                  <span className="font-bold text-clay-900">₹{item.subtotal}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["orders", statusFilter], queryFn: () => fetchOrders(statusFilter || undefined), refetchInterval: 15_000 });

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-clay-900 mb-1">Orders</h1>
          <p className="text-clay-500">Manage incoming orders and update their status.</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="">All Orders</option>
          {statusConfig.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      {isLoading && <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="warm-card p-6 shimmer h-20" />)}</div>}
      <div className="space-y-4">{orders.map((order) => <OrderRow key={order.id} order={order} />)}</div>
      {!isLoading && orders.length === 0 && <div className="text-center py-16"><p className="text-clay-500 text-lg">No orders found.</p></div>}
    </div>
  );
}
