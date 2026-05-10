// Central API helper — all fetch calls go through here
const API_BASE = "/api";

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ---- Menu ----
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  imageUrl: string | null;
  createdAt: string;
}

export const fetchMenu = (category?: string) =>
  apiFetch<MenuItem[]>(
    `/menu${category ? `?category=${encodeURIComponent(category)}&available=true` : "?available=true"}`
  );

export const fetchAllMenu = () => apiFetch<MenuItem[]>("/menu");
export const fetchCategories = () => apiFetch<string[]>("/menu/categories");

export const createMenuItem = (data: Partial<MenuItem>) =>
  apiFetch<MenuItem>("/menu", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateMenuItem = (id: number, data: Partial<MenuItem>) =>
  apiFetch<MenuItem>(`/menu/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteMenuItem = (id: number) =>
  apiFetch<{ success: boolean }>(`/menu/${id}`, { method: "DELETE" });

export const toggleAvailability = (id: number, available: boolean) =>
  apiFetch<MenuItem>(`/menu/${id}/availability`, {
    method: "PATCH",
    body: JSON.stringify({ available }),
  });

// ---- Orders ----
export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  tableNumber: string | null;
  status: string;
  total: number;
  notes: string | null;
  paymentStatus: string;
  createdAt: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

export const fetchOrders = (status?: string) =>
  apiFetch<Order[]>(`/orders${status ? `?status=${status}` : ""}`);

export const fetchOrder = (id: number) =>
  apiFetch<OrderDetail>(`/orders/${id}`);

export const createOrder = (data: {
  customerName: string;
  customerPhone: string;
  tableNumber?: string;
  notes?: string;
  items: { menuItemId: number; quantity: number }[];
}) =>
  apiFetch<OrderDetail>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateOrderStatus = (id: number, status: string) =>
  apiFetch<Order>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// ---- Admin ----
export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  menuItemCount: number;
  availableMenuItems: number;
}

export interface BillingDay {
  date: string;
  revenue: number;
  orderCount: number;
}

export const fetchAdminStats = () => apiFetch<AdminStats>("/admin/stats");
export const fetchBilling = (days = 14) =>
  apiFetch<BillingDay[]>(`/admin/billing?days=${days}`);

// ---- Auth ----
export interface AuthStatus {
  isAdmin: boolean;
}

export const login = (password: string) =>
  apiFetch<{ success: boolean }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });

export const logout = () =>
  apiFetch<{ success: boolean }>("/auth/logout", { method: "POST" });

export const checkAuth = () => apiFetch<AuthStatus>("/auth/me");
