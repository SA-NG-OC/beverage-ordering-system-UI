import { useParams, Link } from "react-router-dom";
import { useStoreDetail } from "@/hooks/useStoreDetail";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/feature/product/components/ProductCard";

export function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { store, isLoading: isStoreLoading, error: storeError } = useStoreDetail(id);
  const { categories } = useCategories();

  // Filter & Search states for Store Products
  const {
    products,
    meta,
    isLoading: isProductsLoading,
    error: productsError,
    search,
    setSearch,
    categoryId,
    setCategoryId,
    page,
    setPage,
  } = useProducts({
    isPublic: true,
    storeId: id,
    initialLimit: 8,
  });

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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background gradient blur */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-5">
            {/* Store Icon Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 sm:w-10 sm:h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {store.name}
                </h1>
                {store.isOpen ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Open for Orders
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Closed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{store.address}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-600 pt-1">
                {/* Rating Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/70 font-semibold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-amber-500 fill-amber-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>{store.rating ? store.rating.toFixed(1) : "5.0"} Rating</span>
                </div>

                {/* Phone Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-50 text-gray-700 border border-gray-200/70 font-semibold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{store.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="self-start sm:self-center">
            <Link to="/stores">
              <Button variant="secondary" size="sm" className="gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>All Stores</span>
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
              value={categoryId || "all"}
              onChange={(e) => setCategoryId(e.target.value === "all" ? undefined : e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm bg-white text-gray-700"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid / Empty State */}
        {productsError ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
            {productsError}
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
