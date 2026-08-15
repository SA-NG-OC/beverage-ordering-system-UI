import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCustomerOrderDetail, useCancelCustomerOrder } from "@/hooks/useOrders";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { CancelOrderModal } from "../components/CancelOrderModal";
import { formatCurrency, formatDateTime } from "@/utils/format";

export function CustomerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useCustomerOrderDetail(id);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const {
    mutate: cancelOrder,
    isPending: isCancelling,
    error: cancelApiError,
  } = useCancelCustomerOrder();

  const handleConfirmCancel = (reason: string) => {
    if (!order) return;
    cancelOrder(
      { id: order.id, data: { cancelReason: reason } },
      {
        onSuccess: () => {
          setIsCancelModalOpen(false);
        },
      }
    );
  };

  const cancelErrorMessage = cancelApiError
    ? (cancelApiError as { response?: { data?: { message?: string } } }).response?.data?.message ||
      "Failed to cancel order"
    : null;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <EmptyState
          title="Order Not Found"
          description="We couldn't retrieve the details for this order."
          action={
            <Button variant="outline" size="sm" onClick={() => navigate("/orders")}>
              Back to Orders
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/orders")}
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
          Back to Orders
        </button>

        {order.status === "pending" && (
          <Button
            variant="destructive"
            size="sm"
            className="text-xs font-semibold"
            onClick={() => setIsCancelModalOpen(true)}
          >
            Cancel Order
          </Button>
        )}
      </div>

      {/* Main Order Card */}
      <Card className="border border-border bg-card shadow-xs overflow-hidden">
        <CardHeader className="p-5 sm:p-6 border-b border-border bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl font-extrabold text-foreground tracking-tight font-mono">
                  Order #{order.orderCode}
                </CardTitle>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-muted-foreground block">Payment Method</span>
              <span className="text-xs font-semibold text-foreground bg-muted px-2.5 py-1 rounded-md inline-block mt-0.5">
                {order.paymentMethod} (Cash on Delivery)
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-6">
          {/* Order Live Tracker for Active Orders */}
          {order.status !== "cancelled" && (
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5">
              <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
                Order Tracking
              </span>
              <div className="flex items-center justify-between gap-2 text-xs">
                <div
                  className={`flex-1 text-center py-2 px-2 rounded-lg font-semibold border ${
                    order.status === "pending"
                      ? "bg-amber-100 border-amber-300 text-amber-900 shadow-xs"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  1. Order Placed
                </div>
                <span className="text-muted-foreground font-bold">→</span>
                <div
                  className={`flex-1 text-center py-2 px-2 rounded-lg font-semibold border ${
                    order.status === "preparing"
                      ? "bg-blue-100 border-blue-300 text-blue-900 shadow-xs"
                      : order.status === "completed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-muted text-muted-foreground border-transparent"
                  }`}
                >
                  2. Preparing Drinks
                </div>
                <span className="text-muted-foreground font-bold">→</span>
                <div
                  className={`flex-1 text-center py-2 px-2 rounded-lg font-semibold border ${
                    order.status === "completed"
                      ? "bg-emerald-100 border-emerald-300 text-emerald-900 shadow-xs"
                      : "bg-muted text-muted-foreground border-transparent"
                  }`}
                >
                  3. Delivered & Completed
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Alert */}
          {order.status === "cancelled" && order.cancelReason && (
            <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-4">
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                Cancellation Reason:
              </p>
              <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">{order.cancelReason}</p>
            </div>
          )}

          {/* Delivery & Store Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4 space-y-2 bg-muted/10">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Delivery Information
              </h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Receiver:</span>{" "}
                  {order.receiverName}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Phone:</span>{" "}
                  {order.receiverPhone}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Address:</span>{" "}
                  {order.deliveryAddress}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border p-4 space-y-2 bg-muted/10">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Store Information
              </h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Store ID:</span> {order.storeId}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Order was dispatched from this authorized beverage outlet.
                </p>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Ordered Items
            </h4>
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="text-xs font-bold">Item</TableHead>
                    <TableHead className="text-xs font-bold text-right">Unit Price</TableHead>
                    <TableHead className="text-xs font-bold text-center">Qty</TableHead>
                    <TableHead className="text-xs font-bold text-right">Line Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold text-xs text-foreground">
                        {item.productName}
                      </TableCell>
                      <TableCell className="text-xs text-right text-muted-foreground">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell className="text-xs text-center font-medium text-foreground">
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
          </div>

          {/* Pricing Calculation Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping Fee:</span>
                <span className="font-medium text-foreground">Free</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-foreground pt-2 border-t border-border">
                <span>Total Amount:</span>
                <span className="text-primary text-base font-black">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Action for Pending Order */}
          {order.status === "pending" && (
            <div className="pt-4 border-t border-border flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsCancelModalOpen(true)}
                className="text-xs font-semibold"
              >
                Cancel Order
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <CancelOrderModal
          isOpen={isCancelModalOpen}
          orderId={order.id}
          orderCode={order.orderCode}
          isPending={isCancelling}
          error={cancelErrorMessage}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
}

export default CustomerOrderDetailPage;
