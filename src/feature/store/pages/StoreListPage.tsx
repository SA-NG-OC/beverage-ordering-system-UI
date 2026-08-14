import { useStores } from "@/hooks/useStores";
import { StoreCard } from "../components/StoreCard";
import { Button } from "@/components/ui/Button";

export function StoreListPage() {
  const {
    stores,
    meta,
    isLoading,
    error,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
    page,
    setPage,
  } = useStores({
    initialLimit: 9,
    isPublic: true,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header & Toolbar Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Explore Stores 🏪</h1>
          <p className="text-sm text-gray-500">
            Select a store near you to view their menu and place an order.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search store by name..."
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
            />
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "ASC" | "DESC")}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm bg-white text-gray-700"
          >
            <option value="DESC">Newest First</option>
            <option value="ASC">Oldest First</option>
          </select>
        </div>
      </div>

      {/* 2. Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* 3. Stores Grid / Loading Skeleton / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-56 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-5xl">🏪</span>
          <p className="mt-3 text-lg font-bold text-gray-900">No stores found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search keyword or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}

      {/* 4. Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-xs text-gray-500">
            Page <strong className="text-gray-900">{meta.page}</strong> of {meta.totalPages} (
            {meta.totalItems} stores)
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

export default StoreListPage;
