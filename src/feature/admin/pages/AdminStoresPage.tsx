import { useState } from "react";
import axios from "axios";
import { useStores } from "@/hooks/useStores";
import { storeApi } from "@/api/storeApi";
import type { StoreResponseDto, CreateStoreDto, UpdateStoreDto } from "@/types/store.type";
import { Button } from "@/components/ui/Button";

export function AdminStoresPage() {
  const {
    stores,
    meta,
    isLoading,
    error,
    search,
    setSearch,
    isOpen,
    setIsOpen,
    isLocked,
    setIsLocked,
    page,
    setPage,
    refresh,
  } = useStores({
    isPublic: false,
    initialLimit: 10,
  });

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreResponseDto | null>(null);

  // Form States
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

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({ name: "", phone: "", address: "", isOpen: true });
    setFormError(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (store: StoreResponseDto) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      phone: store.phone,
      address: store.address,
      isOpen: store.isOpen,
    });
    setFormError(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setFormError("Please fill in all required fields (Name, Phone, Address).");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      const payload: CreateStoreDto = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        isOpen: formData.isOpen,
      };
      await storeApi.createStore(payload);
      setIsCreateModalOpen(false);
      resetForm();
      refresh();
    } catch (err: unknown) {
      setFormError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to create store."
          : "Failed to create store."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStore) return;
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      const payload: UpdateStoreDto = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        isOpen: formData.isOpen,
      };
      await storeApi.updateStore(editingStore.id, payload);
      setEditingStore(null);
      resetForm();
      refresh();
    } catch (err: unknown) {
      setFormError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to update store."
          : "Failed to update store."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLock = async (store: StoreResponseDto) => {
    try {
      setActionLoadingId(store.id);
      if (store.isLocked) {
        await storeApi.unlockStore(store.id);
      } else {
        await storeApi.lockStore(store.id);
      }
      refresh();
    } catch (err: unknown) {
      alert(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to change lock status."
          : "Failed to change lock status."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Store Management
          </h1>
          <p className="text-sm text-gray-500">
            View, create, update, and manage lock status for all system stores.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenCreateModal} className="gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create New Store</span>
        </Button>
      </div>

      {/* 2. Toolbar & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stores by name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm"
          />
        </div>

        {/* Filter Open Status */}
        <select
          value={isOpen === undefined ? "all" : isOpen ? "true" : "false"}
          onChange={(e) => {
            const val = e.target.value;
            setIsOpen(val === "all" ? undefined : val === "true");
          }}
          className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm bg-white text-gray-700 w-full md:w-auto"
        >
          <option value="all">All Open Status</option>
          <option value="true">Open Stores</option>
          <option value="false">Closed Stores</option>
        </select>

        {/* Filter Lock Status */}
        <select
          value={isLocked === undefined ? "all" : isLocked ? "true" : "false"}
          onChange={(e) => {
            const val = e.target.value;
            setIsLocked(val === "all" ? undefined : val === "true");
          }}
          className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm bg-white text-gray-700 w-full md:w-auto"
        >
          <option value="all">All Lock Status</option>
          <option value="false">Unlocked Stores</option>
          <option value="true">Locked Stores</option>
        </select>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* 3. Stores Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading stores list...</div>
        ) : stores.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No stores found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200/80 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Store Name</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Lock State</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {stores.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
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
                      <span>{s.name}</span>
                    </td>
                    <td className="px-6 py-4">{s.phone}</td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-600">{s.address}</td>
                    <td className="px-6 py-4">
                      {s.isOpen ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Open
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Closed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {s.isLocked ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
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
                          <span>Locked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                            />
                          </svg>
                          <span>Active</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEditModal(s)}
                        >
                          Edit
                        </Button>

                        <Button
                          variant={s.isLocked ? "secondary" : "danger"}
                          size="sm"
                          disabled={actionLoadingId === s.id}
                          onClick={() => handleToggleLock(s)}
                          className={
                            s.isLocked ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                          }
                        >
                          {actionLoadingId === s.id
                            ? "Processing..."
                            : s.isLocked
                              ? "Unlock"
                              : "Lock"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
            <span className="text-xs text-gray-500">
              Page <strong className="text-gray-900">{meta.page}</strong> of {meta.totalPages} (
              {meta.totalItems} stores)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= meta.totalPages || isLoading}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal Overlay */}
      {(isCreateModalOpen || editingStore) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">
                {editingStore ? "Edit Store Information" : "Create New Store"}
              </h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingStore(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs">{formError}</div>
            )}

            <form
              onSubmit={editingStore ? handleEditSubmit : handleCreateSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Store Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ABC Tea District 1"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm"
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
                  placeholder="e.g. 0901234567"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address..."
                  rows={3}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isOpenCheck"
                  checked={formData.isOpen}
                  onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded-md border-gray-300 focus:ring-purple-500"
                />
                <label htmlFor="isOpenCheck" className="text-sm font-medium text-gray-700">
                  Open for orders immediately
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingStore(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingStore ? "Save Changes" : "Create Store"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStoresPage;
