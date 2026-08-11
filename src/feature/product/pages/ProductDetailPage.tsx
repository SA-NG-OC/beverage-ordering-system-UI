import { ProductStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useProductDetail } from "@/hooks/useProductDetail";
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
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse space-y-6">
        <div className="h-8 w-1/3 bg-gray-200 rounded" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl border border-gray-100 text-center space-y-4">
        <span className="text-4xl">🍹</span>
        <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-sm text-gray-500">
          {error || "The product you are looking for does not exist."}
        </p>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
      >
        ← Back to Products
      </button>

      {/* Product Card Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
        {/* Left: Product Image */}
        <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl">🧋</span>
          )}
          <div className="absolute top-4 left-4">
            <ProductStatusBadge status={product.status} />
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Store */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                {product.category?.name || "Beverage"}
              </span>
              {product.store && (
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                  🏪 {product.store.name}
                </span>
              )}
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{product.name}</h1>
              <p className="text-2xl font-black text-blue-600 mt-2">
                {Number(product.price).toLocaleString("vi-VN")} đ
              </p>
            </div>

            {/* Description */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || "No description provided for this beverage."}
              </p>
            </div>

            {/* Bottom Action Buttons */}
            <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
              {isStaff ? (
                /* Nút Sửa dành riêng cho Staff */
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate(`/staff/products/${product.id}/edit`)}
                >
                  Edit Product
                </Button>
              ) : isAdmin ? (
                /* Admin View Only Mode */
                <div className="w-full text-center text-xs font-semibold text-purple-600 bg-purple-50 py-2.5 rounded-lg border border-purple-100">
                  Admin View Only Mode
                </div>
              ) : (
                /* Nút Thêm vào giỏ dành cho Khách hàng */
                <Button variant="primary" className="w-full" disabled={product.status !== "active"}>
                  {product.status === "active" ? "Add to Cart 🛒" : "Unavailable"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
