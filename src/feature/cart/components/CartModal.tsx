import { useState, lazy, Suspense, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/EmptyState";
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  addToCart,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "@/feature/cart/cartSlice";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/utils/format";
import type { AppDispatch } from "@/app/store";

// Lazy load CheckoutModal on demand
const CheckoutModal = lazy(() =>
  import("./CheckoutModal").then((m) => ({ default: m.CheckoutModal }))
);

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();

  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotal);
  const totalCount = useSelector(selectCartCount);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleOpenCheckout = useCallback(() => {
    setIsCheckoutOpen(true);
  }, []);

  const handleCloseCheckout = useCallback(() => {
    setIsCheckoutOpen(false);
    onClose();
  }, [onClose]);

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <>
      <Dialog open={isOpen && !isCheckoutOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg p-6 max-h-[85vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="text-xl font-bold text-foreground">
                Your Cart ({totalCount})
              </DialogTitle>
              {cartItems.length > 0 && (
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-xs text-muted-foreground hover:text-destructive"
                  onClick={handleClearCart}
                >
                  Clear all
                </Button>
              )}
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Review and manage items before checkout.
            </DialogDescription>
          </DialogHeader>

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="Your cart is empty"
                description="Explore our menu and add some refreshing drinks to get started!"
                action={
                  <Button variant="outline" size="sm" onClick={onClose} asChild>
                    <Link to="/products">Browse Drinks</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-1 divide-y divide-border/60 my-3">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="py-3 flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 stroke-1 text-muted-foreground/60"
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
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      {formatCurrency(product.price)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 border border-border rounded-lg p-1 bg-card">
                    <button
                      type="button"
                      onClick={() => dispatch(decreaseQuantity(product.id))}
                      className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted text-xs font-semibold cursor-pointer"
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-foreground">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
                      className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted text-xs font-semibold cursor-pointer"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => dispatch(removeFromCart(product.id))}
                    className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.75}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Footer with Subtotal & Proceed */}
          {cartItems.length > 0 && (
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Subtotal</span>
                <span className="text-base font-bold text-foreground">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              {!isAuthenticated ? (
                <div className="space-y-2">
                  <Button variant="default" className="w-full" onClick={onClose} asChild>
                    <Link to="/login">Log In to Order</Link>
                  </Button>
                  <p className="text-[11px] text-center text-muted-foreground">
                    You need to be logged in as a customer to place orders.
                  </p>
                </div>
              ) : (
                <Button variant="default" className="w-full" onClick={handleOpenCheckout}>
                  Proceed to Checkout
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lazy Checkout Modal */}
      {isCheckoutOpen && (
        <Suspense fallback={null}>
          <CheckoutModal isOpen={isCheckoutOpen} onClose={handleCloseCheckout} />
        </Suspense>
      )}
    </>
  );
}

export default CartModal;
