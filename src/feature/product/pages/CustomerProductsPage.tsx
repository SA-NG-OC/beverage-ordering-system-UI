import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "../components/ProductCard";
import { Button } from "@/components/ui/Button";

export function CustomerProductsPage() {
    const {
        products,
        meta,
        isLoading,
        error,
        search,
        setSearch,
        page,
        setPage,
    } = useProducts({ initialLimit: 8, isPublic: true });

    return (
        <div className="flex flex-col gap-6">
            {/* 1. Header & Toolbar section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Title & Description */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Explore Beverages 🧋</h1>
                    <p className="text-sm text-gray-500">Discover fresh teas, coffees, and delicious drinks.</p>
                </div>

                {/* Toolbar: Search */}
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="relative flex-1 w-full sm:w-64">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search drinks by name..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                        />
                    </div>
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
                    <span className="text-4xl">☕</span>
                    <p className="mt-2 text-lg font-bold text-gray-900">No drinks available right now</p>
                    <p className="text-sm text-gray-500">Try searching for a different drink keyword.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* 4. Pagination Controls */}
            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-xs text-gray-500">
                        Page <strong className="text-gray-900">{meta.page}</strong> of {meta.totalPages} ({meta.totalItems} items)
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

export default CustomerProductsPage;
