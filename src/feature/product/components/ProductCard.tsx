import { getProductStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ProductResponseDto } from "@/types/product.type";
import { Link } from "react-router-dom";

interface ProductCardProps {
    product: ProductResponseDto;
    onEdit?: (product: ProductResponseDto) => void;
    detailPath?: string;
}

export function ProductCard({ product, onEdit, detailPath }: ProductCardProps) {
    const targetPath = detailPath || `/products/${product.id}`;
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
            <div>
                {/* Product Image Link*/}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                    <Link to={targetPath} className="relative block w-full h-48 bg-gray-100 overflow-hidden">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl bg-blue-50 text-blue-500 font-bold">
                                🧋
                            </div>
                        )}</Link>

                    <div className="absolute top-3 left-3">
                        {getProductStatusBadge(product.status)}
                    </div>
                </div>
            </div>

            {/* Product detail */}
            <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {product.category?.name || "Beverage"}
                    </span>

                    {product.store && (
                        <span className="text-xs text-gray-500 truncate max-w-[120px]">
                            🏪 {product.store.name}
                        </span>
                    )}
                </div>

                <p className="font-bold text-gray-900 text-base line-clamp-1">
                    {product.name}
                </p>

                <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px]">
                    {product.description || "No description available."}
                </p>
            </div>

            {/* Price & Actions */}
            <div className="p-4 pt-0 border-t border-gray-50 flex items-center justify-between mt-2">
                <span className="text-lg font-extrabold text-blue-600">
                    {Number(product.price).toLocaleString("vi-VN")} đ
                </span>
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product)}
                    >
                        Edit
                    </Button>
                )}
            </div>
        </div>
    );
}