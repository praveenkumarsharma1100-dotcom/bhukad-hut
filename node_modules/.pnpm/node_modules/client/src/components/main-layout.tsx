import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { useCart } from "../lib/cart-context";
import { useAdminAuth } from "../lib/admin-auth-context";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAdmin } = useAdminAuth();
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-clay-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 gradient-warm rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-clay-900">
                Bhukad <span className="text-saffron-500">Hut</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                    location === link.href
                      ? "text-saffron-500"
                      : "text-clay-600 hover:text-saffron-500"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin === true && (
                <Link
                  href="/admin"
                  className="text-sm font-bold uppercase tracking-wider text-terracotta-600 hover:text-terracotta-700 transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Cart + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                className="relative p-2 rounded-lg hover:bg-clay-100 transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-clay-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-saffron-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-fade-in-up">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                className="md:hidden p-2 rounded-lg hover:bg-clay-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-clay-700" />
                ) : (
                  <Menu className="w-6 h-6 text-clay-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-clay-200 bg-white animate-fade-in-up">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider ${
                    location === link.href
                      ? "bg-saffron-50 text-saffron-500"
                      : "text-clay-600 hover:bg-clay-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin === true && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider text-terracotta-600 hover:bg-terracotta-50"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="gradient-dark text-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-saffron-500 rounded-lg flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading font-bold text-xl">
                  Bhukad Hut
                </span>
              </div>
              <p className="text-clay-300 text-sm leading-relaxed">
                Feast like royalty with our authentic Indian cuisine.
                Every dish tells a story of tradition and flavour.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg mb-4 text-turmeric-400">
                Contact Us
              </h4>
              <div className="space-y-2 text-sm text-clay-300">
                <p>📍 Main Road, Hapur, UP 245101</p>
                <p>📞 +91 98765 43210</p>
                <p>✉️ hello@bhukadhut.in</p>
              </div>
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg mb-4 text-turmeric-400">
                Hours
              </h4>
              <div className="space-y-2 text-sm text-clay-300">
                <p>Mon – Fri: 11:00 AM – 11:00 PM</p>
                <p>Sat – Sun: 10:00 AM – 11:30 PM</p>
                <p className="text-saffron-400 font-bold mt-2">
                  🎉 Happy Hours: 3 PM – 6 PM
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-clay-400">
            © 2026 Bhukad Hut. Made with ❤️ and a lot of Masala Chai.
          </div>
        </div>
      </footer>
    </div>
  );
}
