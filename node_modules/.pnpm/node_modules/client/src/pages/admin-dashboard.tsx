import { useQuery } from "@tanstack/react-query";
import { fetchAdminStats, fetchBilling, fetchOrders } from "../lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingCart,
  IndianRupee,
  Clock,
  UtensilsCrossed,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: fetchAdminStats,
    refetchInterval: 30_000,
  });

  const { data: billing = [] } = useQuery({
    queryKey: ["admin", "billing"],
    queryFn: () => fetchBilling(14),
  });

  const { data: recentOrders = [] } = useQuery({
    queryKey: ["orders", "recent"],
    queryFn: () => fetchOrders(),
  });

  const statCards = [
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Gross Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Menu Items",
      value: `${stats?.availableMenuItems || 0}/${stats?.menuItemCount || 0}`,
      icon: UtensilsCrossed,
      color: "bg-saffron-50 text-saffron-600",
    },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "badge-pending",
      preparing: "badge-preparing",
      ready: "badge-ready",
      completed: "badge-completed",
    };
    return map[status] || "badge-pending";
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-clay-900 mb-1">
          Dashboard
        </h1>
        <p className="text-clay-500">
          Welcome back! Here's your restaurant overview.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="stat-card animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm text-clay-500 font-bold uppercase tracking-wider mb-1">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-clay-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="warm-card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-saffron-500" />
          <h2 className="font-heading text-xl font-bold text-clay-900">
            Revenue — Last 14 Days
          </h2>
        </div>
        {billing.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={billing}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e8822a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e8822a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8d5b8" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })
                }
                stroke="#b89b6e"
                fontSize={12}
              />
              <YAxis
                stroke="#b89b6e"
                fontSize={12}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                formatter={(value: number) => [`₹${value}`, "Revenue"]}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                }
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e8d5b8",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#e8822a"
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-clay-400">
            No billing data yet
          </div>
        )}
      </div>

      {/* Recent Orders Table */}
      <div className="warm-card overflow-hidden animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        <div className="p-6 border-b border-clay-200 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-clay-900">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-bold text-saffron-500 hover:text-saffron-600"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-clay-50 text-left">
                <th className="px-6 py-3 font-bold text-clay-600 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 font-bold text-clay-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 font-bold text-clay-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 font-bold text-clay-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 font-bold text-clay-600 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clay-100">
              {recentOrders.slice(0, 8).map((order) => (
                <tr key={order.id} className="hover:bg-clay-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-clay-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 text-clay-700">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 font-bold text-saffron-600">
                    ₹{order.total}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${statusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-clay-500">
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
