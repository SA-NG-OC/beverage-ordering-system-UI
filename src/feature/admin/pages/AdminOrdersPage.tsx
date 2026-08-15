import { useState } from "react";
import { useAdminOrders } from "@/hooks/useOrders";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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

const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Preparing", value: "preparing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function AdminOrdersPage() {
  const {
    orders,
    meta,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    storeId,
    setStoreId,
    setPage,
  } = useAdminOrders({ initialLimit: 10 });

  const [selectedOrder, setSelectedOrder] = useState<OrderResponseDto | null>(null);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          System Order Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Monitor and inspect all beverage orders across all stores in the system.
        </p>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
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

        {/* Search and Store Filter */}
        <div className="flex items-center gap-3">
          <div className="w-full sm:w-60">
            <SearchToolbar
              search={search}
              onSearchChange={setSearch}
              placeholder="Search code or name..."
            />
          </div>
          {storeId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStoreId(undefined)}
              className="text-xs"
            >
              Clear Store Filter
            </Button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <EmptyState title="Could not load system orders" description={error} />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description={
            status
              ? `There are no orders matching status "${status}".`
              : "No orders match the specified criteria."
          }
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-xs font-bold">Code</TableHead>
                <TableHead className="text-xs font-bold">Store ID</TableHead>
                <TableHead className="text-xs font-bold">Receiver</TableHead>
                <TableHead className="text-xs font-bold">Phone</TableHead>
                <TableHead className="text-xs font-bold text-center">Items</TableHead>
                <TableHead className="text-xs font-bold text-right">Total Amount</TableHead>
                <TableHead className="text-xs font-bold text-center">Status</TableHead>
                <TableHead className="text-xs font-bold">Created At</TableHead>
                <TableHead className="text-xs font-bold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs font-bold text-foreground">
                    #{order.orderCode}
                  </TableCell>
                  <TableCell className="font-mono text-[11px] text-muted-foreground truncate max-w-[100px]">
                    {order.storeId}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground">
                    {order.receiverName}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {order.receiverPhone}
                  </TableCell>
                  <TableCell className="text-xs text-center font-semibold text-foreground">
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
                    <Button variant="secondary" size="xs" onClick={() => setSelectedOrder(order)}>
                      Inspect
                    </Button>
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

      {/* Inspect Order Dialog */}
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
              {/* Order Metadata */}
              <div className="grid grid-cols-2 gap-2 text-xs rounded-lg bg-muted/40 p-3 border border-border">
                <p>
                  <span className="font-semibold text-foreground">Store ID:</span>{" "}
                  <span className="font-mono text-[11px]">{selectedOrder.storeId}</span>
                </p>
                <p>
                  <span className="font-semibold text-foreground">Customer ID:</span>{" "}
                  <span className="font-mono text-[11px]">{selectedOrder.customerId}</span>
                </p>
                <p>
                  <span className="font-semibold text-foreground">Receiver:</span>{" "}
                  {selectedOrder.receiverName}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Phone:</span>{" "}
                  {selectedOrder.receiverPhone}
                </p>
                <p className="col-span-2">
                  <span className="font-semibold text-foreground">Address:</span>{" "}
                  {selectedOrder.deliveryAddress}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Payment:</span>{" "}
                  {selectedOrder.paymentMethod}
                </p>
                {selectedOrder.cancelReason && (
                  <p className="col-span-2 text-rose-600 font-semibold pt-1">
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

              {/* Pricing Totals */}
              <div className="flex justify-between items-center text-sm font-extrabold text-foreground pt-2">
                <span>Total Amount:</span>
                <span className="text-primary text-base">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default AdminOrdersPage;
