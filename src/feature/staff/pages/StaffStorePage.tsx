import { useEffect, useState } from "react";
import { storeApi } from "@/api/storeApi";
import type { StoreResponseDto, UpdateStoreDto } from "@/types/store.type";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { FormField } from "@/components/FormField";
import { formatDate } from "@/utils/format";
import axios from "axios";

export function StaffStorePage() {
  const [store, setStore] = useState<StoreResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    address: string;
    isOpen: boolean;
  }>({
    name: "",
    phone: "",
    address: "",
    isOpen: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchAssignedStore = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await storeApi.getStaffStore();
      const data = res.data.data;
      setStore(data);
      setFormData({
        name: data.name,
        phone: data.phone,
        address: data.address,
        isOpen: data.isOpen,
      });
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to load assigned store."
          : "Failed to load assigned store."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    storeApi
      .getStaffStore()
      .then((res) => {
        if (!isMounted) return;
        const data = res.data.data;
        setStore(data);
        setFormData({
          name: data.name,
          phone: data.phone,
          address: data.address,
          isOpen: data.isOpen,
        });
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to load assigned store."
            : "Failed to load assigned store."
        );
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSuccessMessage(null);

      const payload: UpdateStoreDto = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        isOpen: formData.isOpen,
      };

      const res = await storeApi.updateStaffStore(payload);
      setStore(res.data.data);
      setIsEditing(false);
      setSuccessMessage("Assigned store details updated successfully!");
    } catch (err: unknown) {
      setSubmitError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to update assigned store."
          : "Failed to update assigned store."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </Card>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <EmptyState
          title="Assigned Store Error"
          description={error || "No assigned store found for your account."}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsLoading(true);
                fetchAssignedStore();
              }}
            >
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Assigned Store</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your store information and toggle open/closed status.
          </p>
        </div>
        {!isEditing && (
          <Button variant="default" size="sm" onClick={() => setIsEditing(true)}>
            Edit Store Info
          </Button>
        )}
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900 rounded-lg text-xs font-medium animate-in fade-in-50">
          {successMessage}
        </div>
      )}

      {/* Main Details Card / Form */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-5 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009 9.35c.692 0 1.345-.233 1.875-.626.53.393 1.183.626 1.875.626.692 0 1.345-.233 1.875-.626a2.993 2.993 0 003.375.626"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{store.name}</h2>
                <span className="text-[11px] text-muted-foreground">
                  Rating: {store.rating ? store.rating.toFixed(1) : "5.0"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {store.isOpen ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Open for Orders
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Closed
                </span>
              )}
              {store.isLocked && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                  Locked by Admin
                </span>
              )}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              {submitError && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs">{submitError}</AlertDescription>
                </Alert>
              )}

              <FormField label="Store Name" required id="storeName">
                <Input
                  id="storeName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 text-xs sm:text-sm"
                  required
                />
              </FormField>

              <FormField label="Phone Number" required id="storePhone">
                <Input
                  id="storePhone"
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-9 text-xs sm:text-sm"
                  required
                />
              </FormField>

              <FormField label="Store Address" required id="storeAddress">
                <Textarea
                  id="storeAddress"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="text-xs sm:text-sm resize-none"
                  required
                />
              </FormField>

              <div className="flex items-center gap-2.5 pt-1">
                <Checkbox
                  id="staffIsOpenCheck"
                  checked={formData.isOpen}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isOpen: checked === true })
                  }
                />
                <label
                  htmlFor="staffIsOpenCheck"
                  className="text-xs font-medium text-foreground cursor-pointer select-none"
                >
                  Store is open and accepting new orders
                </label>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Store Details"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-xs sm:text-sm text-foreground">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-border/50 gap-1">
                <span className="text-muted-foreground font-medium">Store Phone:</span>
                <span className="font-semibold">{store.phone}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-border/50 gap-1">
                <span className="text-muted-foreground font-medium">Store Address:</span>
                <span className="font-semibold text-right">{store.address}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-border/50 gap-1">
                <span className="text-muted-foreground font-medium">Created Date:</span>
                <span className="font-semibold">{formatDate(store.createdAt)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default StaffStorePage;
