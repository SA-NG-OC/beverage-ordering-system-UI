import { useParams, Link } from "react-router-dom";
import { useStoreDetail } from "@/hooks/useStoreDetail";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/feature/product/components/ProductCard";
import { SearchToolbar } from "@/components/SearchToolbar";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    setPage,
  } = useProducts({
    isPublic: true,
    storeId: id,
    initialLimit: 8,
  });

  if (isStoreLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-44 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (storeError || !store) {
    return (
      <div className="max-w-lg mx-auto mt-8">
        <EmptyState
          title="Store Not Found"
          description={storeError || "The requested store does not exist or may be closed/locked."}
          action={
            <Link to="/stores">
              <Button variant="default" size="sm">
                Back to Store List
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Store Header Banner */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              {/* Store Icon Avatar */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009 9.35c.692 0 1.345-.233 1.875-.626.53.393 1.183.626 1.875.626.692 0 1.345-.233 1.875-.626a2.993 2.993 0 003.375.626"
                  />
                </svg>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                    {store.name}
                  </h1>
                  {store.isOpen ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Open
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Closed
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  <span>{store.address}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted font-medium text-[11px]">
                    Rating: {store.rating ? store.rating.toFixed(1) : "5.0"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted font-medium text-[11px]">
                    Phone: {store.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="self-start sm:self-center">
              <Link to="/stores">
                <Button variant="outline" size="sm">
                  All Stores
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Store Menu & Products Section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Store Menu & Products
            </h2>
            <p className="text-xs text-muted-foreground">
              Browse drinks and items available at {store.name}.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <SearchToolbar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search products in this store..."
          >
            <select
              value={categoryId || "all"}
              onChange={(e) => setCategoryId(e.target.value === "all" ? undefined : e.target.value)}
              className="h-9 px-3 border border-border rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </SearchToolbar>
        </div>

        {/* Product Grid / Empty State */}
        {productsError ? (
          <Alert variant="destructive">
            <AlertDescription className="text-xs">{productsError}</AlertDescription>
          </Alert>
        ) : isProductsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No products available"
            description="Try selecting a different category or adjusting search keywords."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
            itemName="products"
            isLoading={isProductsLoading}
            onPageChange={setPage}
            className="rounded-xl border border-border bg-card"
          />
        )}
      </div>
    </div>
  );
}

export default StoreDetailPage;
