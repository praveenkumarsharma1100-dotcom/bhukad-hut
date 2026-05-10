import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { fetchMenu } from "../lib/api";
import { useCart } from "../lib/cart-context";
import {
  ChefHat,
  Flame,
  ShoppingCart,
  ArrowRight,
  Star,
  Clock,
  Smartphone,
  UtensilsCrossed,
} from "lucide-react";

export default function HomePage() {
  const { data: menuItems } = useQuery({
    queryKey: ["menu", "featured"],
    queryFn: () => fetchMenu(),
  });
  const { addItem } = useCart();

  const featured = menuItems?.slice(0, 3) || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="gradient-dark py-20 sm:py-28 px-4 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-turmeric-400 rounded-full" />
            <div className="absolute bottom-10 right-10 w-48 h-48 border border-saffron-400 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-saffron-500/20 rounded-full" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/10">
              <Flame className="w-4 h-4 text-saffron-400" />
              <span className="text-sm font-bold text-saffron-300 uppercase tracking-wider">
                Authentic Indian Cuisine
              </span>
            </div>

            <h1 className="font-heading text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
              Feast Like{" "}
              <span className="text-gradient-warm bg-clip-text text-transparent bg-gradient-to-r from-saffron-400 via-turmeric-400 to-saffron-300">
                Royalty
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-clay-300 mb-10 max-w-2xl mx-auto leading-relaxed font-body">
              Experience the rich flavours of Rajasthan at{" "}
              <strong className="text-white">Bhukad Hut</strong>. Every dish is
              crafted with love, tradition, and the finest spices.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/menu"
                className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
              >
                <UtensilsCrossed className="w-5 h-5" />
                Explore Our Menu
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/cart"
                className="btn-secondary text-white border-white/30 hover:bg-white/10 flex items-center gap-2 px-8 py-4"
              >
                <ShoppingCart className="w-5 h-5" />
                View Cart
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="bg-clay-50 -mt-1">
          <svg
            viewBox="0 0 1440 80"
            className="w-full h-12 sm:h-20"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C360,80 720,0 1080,40 C1260,60 1360,50 1440,40 L1440,0 L0,0 Z"
              className="fill-[#2d1810]"
            />
          </svg>
        </div>
      </section>

      {/* Chef's Specials */}
      {featured.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-3">
                <ChefHat className="w-6 h-6 text-saffron-500" />
                <span className="text-sm font-bold text-saffron-500 uppercase tracking-wider">
                  Chef's Specials
                </span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-clay-900">
                Today's Featured Dishes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((item, i) => (
                <div
                  key={item.id}
                  className="warm-card p-6 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 gradient-warm rounded-lg flex items-center justify-center shadow-md">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <span className="badge bg-turmeric-100 text-turmeric-800 border-turmeric-300">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-clay-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-clay-500 text-sm mb-4 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-saffron-600">
                      ₹{item.price}
                    </span>
                    <button
                      onClick={() => addItem(item)}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 px-4 bg-white border-y border-clay-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-clay-900 mb-3">
              Order in 3 Simple Steps
            </h2>
            <p className="text-clay-500">
              Fresh food, fast service, no hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: UtensilsCrossed,
                title: "Browse Menu",
                desc: "Explore our authentic Rajasthani cuisine — starters, mains, breads, biryanis, desserts and drinks.",
                step: "01",
              },
              {
                icon: ShoppingCart,
                title: "Add to Cart",
                desc: "Pick your favourites, adjust quantities, and add special notes for the chef.",
                step: "02",
              },
              {
                icon: Clock,
                title: "Place Order",
                desc: "Submit your order and we'll prepare it fresh. Track your order status in real-time.",
                step: "03",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 gradient-warm rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                    <s.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-turmeric-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-clay-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-clay-500 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/menu"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
            >
              Start Ordering
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
