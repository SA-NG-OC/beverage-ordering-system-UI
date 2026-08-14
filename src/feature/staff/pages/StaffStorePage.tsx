import { useEffect, useState } from "react";
import { storeApi } from "@/api/storeApi";
import type { StoreResponseDto, UpdateStoreDto } from "@/types/store.type";
import { Button } from "@/components/ui/Button";
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
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl border border-gray-100 shadow-xs animate-pulse">
        <div className="h-8 bg-gray-200 rounded-xl w-1/3 mb-4" />
        <div className="h-4 bg-gray-100 rounded-lg w-2/3 mb-8" />
        <div className="space-y-4">
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-24 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border border-gray-200/80 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Assigned Store Error</h2>
        <p className="text-sm text-gray-500">{error || "No assigned store found."}</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setIsLoading(true);
            fetchAssignedStore();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Assigned Store</h1>
          <p className="text-sm text-gray-500">
            Manage your store information and toggle open/closed status.
          </p>
        </div>
        {!isEditing && (
          <Button variant="primary" size="md" onClick={() => setIsEditing(true)}>
            Edit Store Info
          </Button>
        )}
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm">
          {successMessage}
        </div>
      )}

      {/* Main Details Card / Form */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{store.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold mt-1">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200/60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-amber-500 fill-amber-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>{store.rating ? store.rating.toFixed(1) : "5.0"} Rating</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {store.isOpen ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Open for Orders
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Closed
              </span>
            )}
            {store.isLocked && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Locked by Admin</span>
              </span>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-5">
            {submitError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs">{submitError}</div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Store Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Store Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200 text-sm"
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="staffIsOpenCheck"
                checked={formData.isOpen}
                onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                className="w-5 h-5 text-amber-600 rounded-md border-gray-300 focus:ring-amber-500"
              />
              <label htmlFor="staffIsOpenCheck" className="text-sm font-semibold text-gray-800">
                Store is open and accepting new orders
              </label>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Store Details"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 gap-1">
              <span className="text-gray-500 font-medium">Store Phone:</span>
              <span className="font-semibold text-gray-900">{store.phone}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 gap-1">
              <span className="text-gray-500 font-medium">Store Address:</span>
              <span className="font-semibold text-gray-900 text-right">{store.address}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 gap-1">
              <span className="text-gray-500 font-medium">Created Date:</span>
              <span className="font-semibold text-gray-900">
                {new Date(store.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffStorePage;
