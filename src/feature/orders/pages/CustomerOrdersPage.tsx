import { useState, lazy, Suspense, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCustomerOrders, useCancelCustomerOrder } from "@/hooks/useOrders";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { SearchToolbar } from "@/components/SearchToolbar";
import { formatCurrency, formatDateTime } from "@/utils/format";
import type { OrderStatus } from "@/types/order.type";

const CancelOrderModal = lazy(() =>
  import("../components/CancelOrderModal").then((m) => ({ default: m.CancelOrderModal }))
);

const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Preparing", value: "preparing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function CustomerOrdersPage() {
  const { orders, meta, isLoading, error, search, setSearch, status, setStatus, setPage } =
    useCustomerOrders({ initialLimit: 8 });

  const [cancelTarget, setCancelTarget] = useState<{ id: string; code: string } | null>(null);

  const {
    mutate: cancelOrder,
    isPending: isCancelling,
    error: cancelApiError,
  } = useCancelCustomerOrder();

  const handleConfirmCancel = useCallback(
    (reason: string) => {
      if (!cancelTarget) return;
      cancelOrder(
        { id: cancelTarget.id, data: { cancelReason: reason } },
        {
          onSuccess: () => {
            setCancelTarget(null);
          },
        }
      );
    },
    [cancelTarget, cancelOrder]
  );

  const handleCloseCancelModal = useCallback(() => {
    setCancelTarget(null);
  }, []);

  const cancelErrorMessage = cancelApiError
    ? (cancelApiError as { response?: { data?: { message?: string } } }).response?.data?.message ||
      "Failed to cancel order"
    : null;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Your Orders
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Track real-time drink orders and review your past order history.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const isActive = tab.value === "all" ? !status : status === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setStatus(tab.value === "all" ? undefined : tab.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <SearchToolbar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search order code..."
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <EmptyState title="Could not load orders" description={error} />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description={
            status
              ? `You don't have any orders with status "${status}".`
              : "You haven't placed any drink orders yet."
          }
          action={
            <Button variant="default" size="sm" asChild>
              <Link to="/products">Order Now</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="border border-border bg-card hover:shadow-xs transition-shadow"
            >
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-sm font-bold text-foreground">
                      #{order.orderCode}
                    </span>
                    <OrderStatusBadge status={order.status} />
                    <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      {order.paymentMethod}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Placed on {formatDateTime(order.createdAt)}
                  </p>

                  {order.cancelReason && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded-md mt-1 inline-block">
                      Reason: {order.cancelReason}
                    </p>
                  )}
                </div>

                {/* Right total & actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/60">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-muted-foreground block">Total Amount</span>
                    <span className="text-base font-extrabold text-primary">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setCancelTarget({ id: order.id, code: order.orderCode })}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button variant="secondary" size="sm" asChild>
                      <Link to={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.totalItems}
          itemName="orders"
          isLoading={isLoading}
          onPageChange={setPage}
          className="rounded-xl border border-border bg-card"
        />
      )}

      {/* Lazy Cancel Order Modal */}
      {cancelTarget && (
        <Suspense fallback={null}>
          <CancelOrderModal
            isOpen={!!cancelTarget}
            orderId={cancelTarget.id}
            orderCode={cancelTarget.code}
            isPending={isCancelling}
            error={cancelErrorMessage}
            onClose={handleCloseCancelModal}
            onConfirm={handleConfirmCancel}
          />
        </Suspense>
      )}
    </div>
  );
}

export default CustomerOrdersPage;
