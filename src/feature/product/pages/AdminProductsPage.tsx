import { useProducts } from "@/hooks/useProducts";
import type { ProductStatus } from "@/types/product.type";
import { ProductCard } from "../components/ProductCard";
import { SearchToolbar } from "@/components/SearchToolbar";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/Badge";

export function AdminProductsPage() {
  const { products, meta, isLoading, error, search, setSearch, status, setStatus, setPage } =
    useProducts({ initialLimit: 12, isPublic: false });

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header & Toolbar section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="text-[10px] uppercase font-bold tracking-wider">
              Admin
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            System Products Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Overview and manage all beverage products across all stores.
          </p>
        </div>
      </div>

      {/* Toolbar: Search & Filter */}
      <SearchToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search products by name..."
      >
        <select
          value={status || ""}
          onChange={(e) => setStatus((e.target.value as ProductStatus) || undefined)}
          className="h-9 px-3 border border-border rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="hidden">Hidden</option>
        </select>
      </SearchToolbar>

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
          title="No products found"
          description="Try adjusting your search keywords or filter status."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              detailPath={`/admin/products/${product.id}`}
            />
          ))}
        </div>
      )}

      {/* 4. Pagination Controls */}
      {meta && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.totalItems}
          itemName="products"
          isLoading={isLoading}
          onPageChange={setPage}
          className="rounded-xl border border-border bg-card"
        />
      )}
    </div>
  );
}

export default AdminProductsPage;
