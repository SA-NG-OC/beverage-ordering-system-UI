import { ProductStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { useProductDetail } from "@/hooks/useProductDetail";
import { formatCurrency } from "@/utils/format";
import { useNavigate, useParams } from "react-router-dom";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isStaff, isAdmin } = useAuth();

  const canManage = isStaff || isAdmin;
  const isPublic = !canManage;
  const { product, isLoading, error } = useProductDetail(id, isPublic);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-6 w-32" />
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-72 rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <EmptyState
          title="Product Not Found"
          description={error || "The product you are looking for does not exist."}
          action={
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Back to Products
      </button>

      {/* Product Card Container */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Product Image */}
          <div className="relative w-full h-72 sm:h-80 bg-muted rounded-xl overflow-hidden border border-border flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 stroke-1 text-muted-foreground/60 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs font-medium">No Image Available</span>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <ProductStatusBadge status={product.status} />
            </div>
          </div>

          {/* Right: Product Info & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Store */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                  {product.categoryName || product.category?.name || "Beverage"}
                </span>
                {product.store && (
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-md">
                    {product.store.name}
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {formatCurrency(product.price)}
                </p>
              </div>

              {/* Description */}
              <div className="pt-2 border-t border-border/50">
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Description
                </h3>
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                  {product.description || "No description provided for this beverage."}
                </p>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="pt-4 border-t border-border flex items-center gap-3">
              {isStaff ? (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => navigate(`/staff/products/${product.id}/edit`)}
                >
                  Edit Product
                </Button>
              ) : isAdmin ? (
                <div className="w-full text-center text-xs font-medium text-muted-foreground bg-muted py-2.5 rounded-lg border border-border">
                  Admin View Only Mode
                </div>
              ) : (
                <Button variant="default" className="w-full" disabled={product.status !== "active"}>
                  {product.status === "active" ? "Add to Cart" : "Currently Unavailable"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductDetailPage;
