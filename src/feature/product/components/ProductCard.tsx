import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ProductStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { addToCart } from "@/feature/cart/cartSlice";
import type { ProductResponseDto } from "@/types/product.type";
import { formatCurrency } from "@/utils/format";
import type { AppDispatch } from "@/app/store";

interface ProductCardProps {
  product: ProductResponseDto;
  onEdit?: (product: ProductResponseDto) => void;
  detailPath?: string;
}

export function ProductCard({ product, onEdit, detailPath }: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const targetPath = detailPath || `/products/${product.id}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <Card className="group flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md border-border bg-card p-0 py-0 gap-0">
      <div>
        {/* Product Image - Full cover to the top and side borders */}
        <div className="relative w-full h-52 bg-muted overflow-hidden">
          <Link to={targetPath} className="block w-full h-full">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/60 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 stroke-1 text-muted-foreground/60 mb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[11px] font-medium tracking-tight">No image</span>
              </div>
            )}
          </Link>

          <div className="absolute top-2.5 left-2.5">
            <ProductStatusBadge status={product.status} />
          </div>
        </div>

        {/* Product Details */}
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {product.categoryName || product.category?.name || "Beverage"}
            </span>

            {product.store && (
              <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">
                {product.store.name}
              </span>
            )}
          </div>

          <Link to={targetPath} className="block">
            <h4 className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h4>
          </Link>

          <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px] leading-relaxed">
            {product.description || "No description available."}
          </p>
        </CardContent>
      </div>

      {/* Price & Actions */}
      <div className="p-4 pt-0 flex items-center justify-between border-t border-border/50 mt-1">
        <span className="text-base font-bold text-foreground">{formatCurrency(product.price)}</span>
        {onEdit ? (
          <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
            Edit
          </Button>
        ) : (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={product.status !== "active"}
              onClick={handleAddToCart}
              title="Add to cart"
            >
              + Add
            </Button>
            <Link to={targetPath}>
              <Button variant="secondary" size="sm">
                View
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ProductCard;
