import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order.type";
import type { ProductStatus } from "@/types/product.type";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
        outline: "border-border text-foreground",
        ghost: "border-transparent hover:bg-muted text-muted-foreground",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400",
        warning:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400",
        info: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400",
        danger:
          "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400",
        neutral:
          "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<
    OrderStatus,
    { label: string; variant: "warning" | "info" | "success" | "danger" }
  > = {
    pending: { label: "Pending", variant: "warning" },
    preparing: { label: "Preparing", variant: "info" },
    completed: { label: "Completed", variant: "success" },
    cancelled: { label: "Cancelled", variant: "danger" },
  };
  const { label, variant } = config[status] || { label: status, variant: "neutral" };
  return <Badge variant={variant}>{label}</Badge>;
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const config: Record<
    ProductStatus,
    { label: string; variant: "success" | "neutral" | "danger" }
  > = {
    active: { label: "Active", variant: "success" },
    hidden: { label: "Hidden", variant: "neutral" },
    out_of_stock: { label: "Out of Stock", variant: "danger" },
  };
  const { label, variant } = config[status] || { label: status, variant: "neutral" };
  return <Badge variant={variant}>{label}</Badge>;
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
