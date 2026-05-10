import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchMenu, fetchCategories, type MenuItem } from "../lib/api";
import { useCart } from "../lib/cart-context";
import { Plus, Minus, Search, Flame } from "lucide-react";

function MenuCard({ item }: { item: MenuItem }) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const qty = cartItem?.quantity || 0;

  return (
    <div className="warm-card p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <span className="badge bg-clay-100 text-clay-600 border-clay-300 text-[10px]">
            {item.category}
          </span>
          {item.price >= 300 && (
            <Flame className="w-4 h-4 text-saffron-500" title="Premium dish" />
          )}
        </div>
        <h3 className="font-heading text-lg font-bold text-clay-900 mb-1">
          {item.name}
        </h3>
        <p className="text-clay-500 text-sm leading-relaxed line-clamp-2 mb-4">
          {item.description}
        </p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xl font-bold text-saffron-600">₹{item.price}</span>
        {qty === 0 ? (
          <button
            onClick={() => addItem(item)}
            className="btn-primary text-sm px-4 py-2 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-clay-100 rounded-full px-2 py-1">
            <button
              onClick={() => updateQuantity(item.id, qty - 1)}
              className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-clay-50 active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4 text-clay-700" />
            </button>
            <span className="font-bold text-clay-900 min-w-[20px] text-center">
              {qty}
            </span>
            <button
              onClick={() => addItem(item)}
              className="w-8 h-8 rounded-full bg-saffron-500 shadow-sm flex items-center justify-center hover:bg-saffron-600 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ["menu"],
    queryFn: () => fetchMenu(),
  });

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const allCategories = ["All", ...categories];

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-clay-900 mb-2">
            Our Menu
          </h1>
          <p className="text-clay-500 text-lg">
            Authentic flavours, handpicked ingredients, made fresh for you.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-clay-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 mb-6 justify-start sm:justify-center">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-pill ${
                activeCategory === cat
                  ? "category-pill-active"
                  : "category-pill-inactive"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="warm-card p-5">
                <div className="shimmer h-4 bg-clay-200 rounded w-20 mb-4" />
                <div className="shimmer h-5 bg-clay-200 rounded w-3/4 mb-2" />
                <div className="shimmer h-4 bg-clay-200 rounded w-full mb-1" />
                <div className="shimmer h-4 bg-clay-200 rounded w-2/3 mb-4" />
                <div className="flex justify-between">
                  <div className="shimmer h-6 bg-clay-200 rounded w-16" />
                  <div className="shimmer h-9 bg-clay-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Menu Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, i) => (
              <div
                key={item.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
              >
                <MenuCard item={item} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-clay-500 text-lg">
              No dishes found. Try a different category or search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
