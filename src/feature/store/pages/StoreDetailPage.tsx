import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStoreDetail } from "@/hooks/useStoreDetail";
import { useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/feature/product/components/ProductCard";

export function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { store, isLoading: isStoreLoading, error: storeError } = useStoreDetail(id);

  // Filter & Search states for Store Products
  const {
    products,
    meta,
    isLoading: isProductsLoading,
    error: productsError,
    search,
    setSearch,
    page,
    setPage,
  } = useProducts({
    isPublic: true,
    storeId: id,
    initialLimit: 8,
  });

  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  if (isStoreLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-3xl" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (storeError || !store) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs text-center space-y-4 max-w-lg mx-auto mt-8">
        <span className="text-5xl">🚫</span>
        <h2 className="text-xl font-bold text-gray-900">Store Not Found</h2>
        <p className="text-sm text-gray-500">
          {storeError || "The requested store does not exist or may be closed/locked."}
        </p>
        <Link to="/stores">
          <Button variant="primary" size="md">
            ← Back to Store List
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Store Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl sm:text-4xl font-extrabold shrink-0 shadow-inner">
              ☕
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {store.name}
                </h1>
                {store.isOpen ? (
                  <Badge variant="success">Open for Orders</Badge>
                ) : (
                  <Badge variant="danger">Closed</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span>📍 {store.address}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600 pt-1">
                <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                  ⭐ {store.rating ? store.rating.toFixed(1) : "5.0"} Rating
                </span>
                <span className="flex items-center gap-1 text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                  📞 {store.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="self-start sm:self-center">
            <Link to="/stores">
              <Button variant="secondary" size="sm">
                ← All Stores
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Store Menu & Products Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Store Menu & Products 🧋</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Browse drinks and items available at {store.name}.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products in store..."
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm bg-white text-gray-700"
            >
              <option value="all">All Categories</option>
              <option value="tea">Tea Series</option>
              <option value="coffee">Coffee Series</option>
              <option value="smoothie">Smoothies & Frappe</option>
            </select>
          </div>
        </div>

        {/* Product Grid / Empty State */}
        {productsError ? (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-sm">
            Product search API for store is coming soon. (Message: {productsError})
          </div>
        ) : isProductsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-xs">
            <span className="text-4xl">🍵</span>
            <p className="mt-2 text-base font-bold text-gray-900">
              No products found for this store
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Try a different search term or filter options above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination if applicable */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-xs">
            <span className="text-xs text-gray-500">
              Page <strong className="text-gray-900">{meta.page}</strong> of {meta.totalPages} (
              {meta.totalItems} products)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1 || isProductsLoading}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= meta.totalPages || isProductsLoading}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoreDetailPage;
