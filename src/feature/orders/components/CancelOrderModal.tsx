import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CancelOrderModalProps {
  isOpen: boolean;
  orderId: string;
  orderCode?: string;
  isPending: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function CancelOrderModal({
  isOpen,
  orderCode,
  isPending,
  error,
  onClose,
  onConfirm,
}: CancelOrderModalProps) {
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setValidationError("Please enter a reason for cancellation.");
      return;
    }
    setValidationError(null);
    onConfirm(reason.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            Cancel Order {orderCode ? `#${orderCode}` : ""}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Please provide a valid cancellation reason. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2">
          {(validationError || error) && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">{validationError || error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="cancelReason" className="text-xs font-semibold text-foreground">
              Cancellation Reason *
            </Label>
            <Textarea
              id="cancelReason"
              placeholder="e.g. Changed my mind, Ordered by mistake, Waiting too long..."
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (validationError) setValidationError(null);
              }}
              disabled={isPending}
              required
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
            >
              Back
            </Button>
            <Button type="submit" variant="destructive" size="sm" disabled={isPending}>
              {isPending ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
