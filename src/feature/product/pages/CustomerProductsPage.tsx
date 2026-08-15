import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "../components/ProductCard";
import { SearchToolbar } from "@/components/SearchToolbar";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CustomerProductsPage() {
  const { products, meta, isLoading, error, search, setSearch, setPage } = useProducts({
    initialLimit: 8,
    isPublic: true,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header & Toolbar section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Explore Beverages
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Discover fresh teas, coffees, and delicious drinks.
          </p>
        </div>

        {/* Toolbar: Search */}
        <SearchToolbar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search drinks by name..."
        />
      </div>

      {/* 2. Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {/* 3. Product Content Grid / Skeleton / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No drinks found"
          description="Try searching for a different drink keyword or check other categories."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* 4. Pagination Controls */}
      {meta && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.totalItems}
          itemName="drinks"
          isLoading={isLoading}
          onPageChange={setPage}
          className="rounded-xl border border-border bg-card"
        />
      )}
    </div>
  );
}

export default CustomerProductsPage;
