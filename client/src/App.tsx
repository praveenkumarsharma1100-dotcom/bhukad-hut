import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import { CartProvider } from "./lib/cart-context";
import { AdminAuthProvider, useAdminAuth } from "./lib/admin-auth-context";
import MainLayout from "./components/main-layout";
import AdminLayout from "./components/admin-layout";
import HomePage from "./pages/home";
import MenuPage from "./pages/menu";
import CartPage from "./pages/cart";
import OrderConfirmationPage from "./pages/order-confirmation";
import AdminLoginPage from "./pages/admin-login";
import AdminDashboardPage from "./pages/admin-dashboard";
import AdminOrdersPage from "./pages/admin-orders";
import AdminMenuPage from "./pages/admin-menu";
import NotFoundPage from "./pages/not-found";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAdminAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAdmin === false) {
      setLocation("/admin/login");
    }
  }, [isAdmin, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-clay-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-clay-500 font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;
  return <>{children}</>;
}

export default function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <Switch>
          {/* Admin routes */}
          <Route path="/admin/login" component={AdminLoginPage} />
          <Route path="/admin">
            <AdminGuard>
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            </AdminGuard>
          </Route>
          <Route path="/admin/orders">
            <AdminGuard>
              <AdminLayout>
                <AdminOrdersPage />
              </AdminLayout>
            </AdminGuard>
          </Route>
          <Route path="/admin/menu">
            <AdminGuard>
              <AdminLayout>
                <AdminMenuPage />
              </AdminLayout>
            </AdminGuard>
          </Route>

          {/* Customer routes */}
          <Route path="/">
            <MainLayout>
              <HomePage />
            </MainLayout>
          </Route>
          <Route path="/menu">
            <MainLayout>
              <MenuPage />
            </MainLayout>
          </Route>
          <Route path="/cart">
            <MainLayout>
              <CartPage />
            </MainLayout>
          </Route>
          <Route path="/order-confirmation/:id">
            {(params) => (
              <MainLayout>
                <OrderConfirmationPage id={params.id} />
              </MainLayout>
            )}
          </Route>

          {/* 404 */}
          <Route>
            <MainLayout>
              <NotFoundPage />
            </MainLayout>
          </Route>
        </Switch>
      </CartProvider>
    </AdminAuthProvider>
  );
}
