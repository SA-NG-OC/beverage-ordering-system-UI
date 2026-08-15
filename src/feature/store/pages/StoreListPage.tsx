import { useStores } from "@/hooks/useStores"
import { StoreCard } from "../components/StoreCard"
import { SearchToolbar } from "@/components/SearchToolbar"
import { Pagination } from "@/components/Pagination"
import { EmptyState } from "@/components/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
    setPage,
  } = useStores({
    initialLimit: 9,
    isPublic: true,
  })

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header & Toolbar Section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Explore Stores
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Select a store near you to view their menu and place an order.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <SearchToolbar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search stores by name..."
        >
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "ASC" | "DESC")}
            className="h-9 px-3 border border-border rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="DESC">Newest First</option>
            <option value="ASC">Oldest First</option>
          </select>
        </SearchToolbar>
      </div>

      {/* 2. Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {/* 3. Stores Grid / Loading Skeleton / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <EmptyState
          title="No stores found"
          description="Try adjusting your search keyword or check back later."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}

      {/* 4. Pagination */}
      {meta && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.totalItems}
          itemName="stores"
          isLoading={isLoading}
          onPageChange={setPage}
          className="rounded-xl border border-border bg-card"
        />
      )}
    </div>
  )
}

export default StoreListPage
