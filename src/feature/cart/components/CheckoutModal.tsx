import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  selectCartItems,
  selectCartStoreId,
  selectCartTotal,
  clearCart,
} from "@/feature/cart/cartSlice";
import { useCreateOrder } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/utils/format";
import type { AppDispatch } from "@/app/store";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const cartItems = useSelector(selectCartItems);
  const storeId = useSelector(selectCartStoreId);
  const totalAmount = useSelector(selectCartTotal);

  const [receiverName, setReceiverName] = useState(() => user?.fullName || "");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const { mutate: createOrder, isPending, error } = useCreateOrder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isAuthenticated) {
      setFormError("Please log in to place an order.");
      return;
    }

    if (!storeId || cartItems.length === 0) {
      setFormError("Your cart is empty or missing store information.");
      return;
    }

    if (!receiverName.trim()) {
      setFormError("Receiver name is required.");
      return;
    }

    if (!receiverPhone.trim()) {
      setFormError("Receiver phone is required.");
      return;
    }

    if (!deliveryAddress.trim()) {
      setFormError("Delivery address is required.");
      return;
    }

    createOrder(
      {
        storeId,
        receiverName: receiverName.trim(),
        receiverPhone: receiverPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: (order) => {
          dispatch(clearCart());
          onClose();
          navigate(`/orders/${order.id}`);
        },
      }
    );
  };

  const apiErrorMessage = error
    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
      "Failed to create order. Please check store status and your cart."
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Checkout Order</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Complete your delivery information. Payment method is Cash on Delivery (COD).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2">
          {(formError || apiErrorMessage) && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">
                {formError || apiErrorMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Receiver Name */}
          <div className="space-y-1.5">
            <Label htmlFor="receiverName" className="text-xs font-semibold text-foreground">
              Receiver Name *
            </Label>
            <Input
              id="receiverName"
              placeholder="e.g. Nguyen Van A"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              disabled={isPending}
              required
            />
          </div>

          {/* Receiver Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="receiverPhone" className="text-xs font-semibold text-foreground">
              Phone Number *
            </Label>
            <Input
              id="receiverPhone"
              placeholder="e.g. 0901234567"
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              disabled={isPending}
              required
            />
          </div>

          {/* Delivery Address */}
          <div className="space-y-1.5">
            <Label htmlFor="deliveryAddress" className="text-xs font-semibold text-foreground">
              Delivery Address *
            </Label>
            <Input
              id="deliveryAddress"
              placeholder="e.g. 123 Nguyen Trai, District 1, HCMC"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              disabled={isPending}
              required
            />
          </div>

          {/* Order Summary Box */}
          <div className="rounded-lg bg-muted/60 p-3 space-y-2 border border-border">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Items count:</span>
              <span className="font-medium text-foreground">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Payment method:</span>
              <span className="font-medium text-foreground">Cash on Delivery (COD)</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
              <span>Total Amount:</span>
              <span className="text-primary">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" size="sm" disabled={isPending}>
              {isPending ? "Placing Order..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
