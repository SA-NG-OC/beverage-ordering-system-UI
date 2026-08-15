import { useState, lazy, Suspense, useCallback } from "react";
import {
  useStaffOrders,
  useUpdateStaffOrderStatus,
  useCancelStaffOrder,
  useStaffOrderStatistics,
} from "@/hooks/useOrders";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { SearchToolbar } from "@/components/SearchToolbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatCurrency, formatDateTime } from "@/utils/format";
import type { OrderResponseDto, OrderStatus } from "@/types/order.type";

const CancelOrderModal = lazy(() =>
  import("@/feature/orders/components/CancelOrderModal").then((m) => ({
    default: m.CancelOrderModal,
  }))
);

const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Preparing", value: "preparing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function StaffOrdersPage() {
  const { orders, meta, isLoading, error, search, setSearch, status, setStatus, setPage } =
    useStaffOrders({ initialLimit: 10 });

  const { data: statistics, isLoading: isStatsLoading } = useStaffOrderStatistics();

  const [selectedOrder, setSelectedOrder] = useState<OrderResponseDto | null>(null);
  const [cancelTarget, setCancelTarget] = useState<{ id: string; code: string } | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateStaffOrderStatus();
  const {
    mutate: cancelOrder,
    isPending: isCancelling,
    error: cancelApiError,
  } = useCancelStaffOrder();

  const handleUpdateStatus = useCallback(
    (id: string, newStatus: "preparing" | "completed") => {
      setUpdatingOrderId(id);
      updateStatus(
        { id, data: { status: newStatus } },
        {
          onSuccess: (updated) => {
            if (selectedOrder && selectedOrder.id === updated.id) {
              setSelectedOrder(updated);
            }
          },
          onSettled: () => {
            setUpdatingOrderId(null);
          },
        }
      );
    },
    [updateStatus, selectedOrder]
  );

  const handleConfirmCancel = useCallback(
    (reason: string) => {
      if (!cancelTarget) return;
      cancelOrder(
        { id: cancelTarget.id, data: { cancelReason: reason } },
        {
          onSuccess: () => {
            setCancelTarget(null);
            if (selectedOrder && selectedOrder.id === cancelTarget.id) {
              setSelectedOrder(null);
            }
          },
        }
      );
    },
    [cancelTarget, cancelOrder, selectedOrder]
  );

  const handleCloseCancel = useCallback(() => {
    setCancelTarget(null);
  }, []);

  const cancelErrorMessage = cancelApiError
    ? (cancelApiError as { response?: { data?: { message?: string } } }).response?.data?.message ||
      "Failed to cancel staff order."
    : null;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Store Order Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Monitor incoming customer orders, manage beverage preparation, and fulfill deliveries.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-border bg-card">
          <span className="text-xs font-semibold text-muted-foreground">Total Orders</span>
          <p className="text-2xl font-black text-foreground mt-1">
            {isStatsLoading ? "..." : (statistics?.totalOrders ?? 0)}
          </p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <span className="text-xs font-semibold text-emerald-600">Completed Orders</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {isStatsLoading ? "..." : (statistics?.completedOrders ?? 0)}
          </p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <span className="text-xs font-semibold text-rose-600">Cancelled Orders</span>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {isStatsLoading ? "..." : (statistics?.cancelledOrders ?? 0)}
          </p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <span className="text-xs font-semibold text-primary">Completed Revenue</span>
          <p className="text-2xl font-black text-primary mt-1">
            {isStatsLoading ? "..." : formatCurrency(statistics?.completedRevenue ?? 0)}
          </p>
        </Card>
      </div>

      {/* Toolbar & Filters */}
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

      {/* Orders Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <EmptyState title="Could not load staff orders" description={error} />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description={
            status
              ? `There are no orders with status "${status}".`
              : "No orders have been placed for your store yet."
          }
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-xs font-bold">Order Code</TableHead>
                <TableHead className="text-xs font-bold">Customer</TableHead>
                <TableHead className="text-xs font-bold">Phone</TableHead>
                <TableHead className="text-xs font-bold text-center">Items</TableHead>
                <TableHead className="text-xs font-bold text-right">Total Amount</TableHead>
                <TableHead className="text-xs font-bold text-center">Status</TableHead>
                <TableHead className="text-xs font-bold">Time</TableHead>
                <TableHead className="text-xs font-bold text-right min-w-[220px]">
                  Order Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs font-bold text-foreground">
                    #{order.orderCode}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground">
                    {order.receiverName}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {order.receiverPhone}
                  </TableCell>
                  <TableCell className="text-xs text-center text-foreground font-semibold">
                    {order.items?.length || 0}
                  </TableCell>
                  <TableCell className="text-xs text-right font-extrabold text-primary">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateTime(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {/* Step 1: Pending -> Preparing */}
                      {order.status === "pending" && (
                        <Button
                          variant="default"
                          size="xs"
                          isLoading={isUpdatingStatus && updatingOrderId === order.id}
                          disabled={isUpdatingStatus}
                          onClick={() => handleUpdateStatus(order.id, "preparing")}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                          title="Change status from Pending to Preparing"
                        >
                          Start Preparing
                        </Button>
                      )}

                      {/* Step 2: Preparing -> Completed */}
                      {order.status === "preparing" && (
                        <Button
                          variant="default"
                          size="xs"
                          isLoading={isUpdatingStatus && updatingOrderId === order.id}
                          disabled={isUpdatingStatus}
                          onClick={() => handleUpdateStatus(order.id, "completed")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                          title="Change status from Preparing to Completed"
                        >
                          Mark Completed
                        </Button>
                      )}

                      {/* Cancel action for pending/preparing */}
                      {(order.status === "pending" || order.status === "preparing") && (
                        <Button
                          variant="outline"
                          size="xs"
                          className="text-destructive hover:bg-destructive/10 border-destructive/30"
                          onClick={() => setCancelTarget({ id: order.id, code: order.orderCode })}
                          title="Cancel this order with reason"
                        >
                          Cancel
                        </Button>
                      )}

                      <Button variant="secondary" size="xs" onClick={() => setSelectedOrder(order)}>
                        Detail
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

      {/* Detail Dialog with Full Status Workflow */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="max-w-xl p-6 max-h-[85vh] flex flex-col">
            <DialogHeader>
              <div className="flex items-center justify-between pr-6">
                <DialogTitle className="text-lg font-bold text-foreground font-mono">
                  Order #{selectedOrder.orderCode}
                </DialogTitle>
                <OrderStatusBadge status={selectedOrder.status} />
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Placed at {formatDateTime(selectedOrder.createdAt)}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto space-y-4 my-2 pr-1">
              {/* Order Status Workflow Banner */}
              <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2">
                <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
                  Order Processing Status
                </span>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div
                    className={`flex-1 text-center py-1.5 px-2 rounded-lg font-semibold border ${
                      selectedOrder.status === "pending"
                        ? "bg-amber-100 border-amber-300 text-amber-900"
                        : "bg-muted text-muted-foreground border-transparent"
                    }`}
                  >
                    1. Pending
                  </div>
                  <span className="text-muted-foreground font-bold">→</span>
                  <div
                    className={`flex-1 text-center py-1.5 px-2 rounded-lg font-semibold border ${
                      selectedOrder.status === "preparing"
                        ? "bg-blue-100 border-blue-300 text-blue-900"
                        : selectedOrder.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-muted text-muted-foreground border-transparent"
                    }`}
                  >
                    2. Preparing
                  </div>
                  <span className="text-muted-foreground font-bold">→</span>
                  <div
                    className={`flex-1 text-center py-1.5 px-2 rounded-lg font-semibold border ${
                      selectedOrder.status === "completed"
                        ? "bg-emerald-100 border-emerald-300 text-emerald-900"
                        : "bg-muted text-muted-foreground border-transparent"
                    }`}
                  >
                    3. Completed
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-1 border border-border">
                <p>
                  <span className="font-semibold text-foreground">Receiver:</span>{" "}
                  {selectedOrder.receiverName}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Phone:</span>{" "}
                  {selectedOrder.receiverPhone}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Address:</span>{" "}
                  {selectedOrder.deliveryAddress}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Payment:</span>{" "}
                  {selectedOrder.paymentMethod} (Cash on Delivery)
                </p>
                {selectedOrder.cancelReason && (
                  <p className="text-rose-600 font-semibold pt-1">
                    Cancel Reason: {selectedOrder.cancelReason}
                  </p>
                )}
              </div>

              {/* Items List */}
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs font-bold">Item</TableHead>
                      <TableHead className="text-xs font-bold text-right">Price</TableHead>
                      <TableHead className="text-xs font-bold text-center">Qty</TableHead>
                      <TableHead className="text-xs font-bold text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs font-semibold text-foreground">
                          {item.productName}
                        </TableCell>
                        <TableCell className="text-xs text-right text-muted-foreground">
                          {formatCurrency(item.price)}
                        </TableCell>
                        <TableCell className="text-xs text-center font-medium">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-xs text-right font-bold text-foreground">
                          {formatCurrency(item.lineTotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center text-sm font-extrabold text-foreground pt-2">
                <span>Total Amount:</span>
                <span className="text-primary text-base">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>

            {/* Actions in Dialog */}
            <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
              <div>
                {(selectedOrder.status === "pending" || selectedOrder.status === "preparing") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 border-destructive/30"
                    onClick={() =>
                      setCancelTarget({ id: selectedOrder.id, code: selectedOrder.orderCode })
                    }
                  >
                    Cancel Order
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedOrder.status === "pending" && (
                  <Button
                    variant="default"
                    size="sm"
                    isLoading={isUpdatingStatus}
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(selectedOrder.id, "preparing")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Start Preparing
                  </Button>
                )}
                {selectedOrder.status === "preparing" && (
                  <Button
                    variant="default"
                    size="sm"
                    isLoading={isUpdatingStatus}
                    disabled={isUpdatingStatus}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleUpdateStatus(selectedOrder.id, "completed")}
                  >
                    Mark Completed
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
            onClose={handleCloseCancel}
            onConfirm={handleConfirmCancel}
          />
        </Suspense>
      )}
    </div>
  );
}

export default StaffOrdersPage;
