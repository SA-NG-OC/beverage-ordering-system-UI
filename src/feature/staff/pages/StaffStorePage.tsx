import { useEffect, useState } from "react";
import { storeApi } from "@/api/storeApi";
import type { StoreResponseDto, UpdateStoreDto } from "@/types/store.type";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border border-gray-100 shadow-xs text-center space-y-4">
        <span className="text-5xl">🏬</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Staff Assigned Store 🏪</h1>
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
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Status Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 font-bold text-2xl flex items-center justify-center">
              🏪
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{store.name}</h2>
              <div className="flex items-center gap-2 text-xs text-amber-600 font-semibold mt-0.5">
                <span>⭐ {store.rating ? store.rating.toFixed(1) : "5.0"} Rating</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {store.isOpen ? (
              <Badge variant="success">Open for Orders</Badge>
            ) : (
              <Badge variant="danger">Closed</Badge>
            )}
            {store.isLocked && <Badge variant="danger">🔒 Locked by Admin</Badge>}
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
