import { useProducts } from "@/hooks/useProducts";
import type { ProductStatus } from "@/types/product.type";
import { ProductCard } from "../components/ProductCard";
import { Button } from "@/components/ui/Button";

export function StaffProductsPage() {
  const { products, meta, isLoading, error, search, setSearch, status, setStatus, page, setPage } =
    useProducts(8);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header & Toolbar section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title & Description */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-sm text-gray-500">View, search, and manage store beverage menu.</p>
        </div>

        {/* Toolbar: Search & Filter */}
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={status || ""}
            onChange={(e) => setStatus((e.target.value as ProductStatus) || undefined)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* 2. Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* 3. Product Content Grid / Skeleton / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-4xl">🍹</span>
          <p className="mt-2 text-lg font-bold text-gray-900">No products found</p>
          <p className="text-sm text-gray-500">
            Try adjusting your search keywords or filter status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              detailPath={`/staff/products/${product.id}`}
            />
          ))}
        </div>
      )}

      {/* 4. Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500">
            Page <strong className="text-gray-900">{meta.page}</strong> of {meta.totalPages} (
            {meta.totalItems} items)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= meta.totalPages || isLoading}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
