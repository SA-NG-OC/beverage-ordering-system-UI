import type { OrderStatus } from "@/types/order.type";
import type { ProductStatus } from "@/types/product.type";

type BadgeVariant = "info" | "success" | "warning" | "danger" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    info: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    neutral: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
    pending: { label: "Chờ xử lý", variant: "warning" },
    preparing: { label: "Đang pha chế", variant: "info" },
    completed: { label: "Hoàn thành", variant: "success" },
    cancelled: { label: "Đã hủy", variant: "danger" },
  };
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const config: Record<ProductStatus, { label: string; variant: BadgeVariant }> = {
    active: { label: "Active", variant: "success" },
    hidden: { label: "Hidden", variant: "neutral" },
    out_of_stock: { label: "Out of Stock", variant: "danger" },
  };
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
