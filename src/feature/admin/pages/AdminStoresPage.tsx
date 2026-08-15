import { useState } from "react"
import axios from "axios"
import { useStores } from "@/hooks/useStores"
import { storeApi } from "@/api/storeApi"
import type { StoreResponseDto, CreateStoreDto, UpdateStoreDto } from "@/types/store.type"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SearchToolbar } from "@/components/SearchToolbar"
import { Pagination } from "@/components/Pagination"
import { EmptyState } from "@/components/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { FormField } from "@/components/FormField"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
    setPage,
    refresh,
  } = useStores({
    isPublic: false,
    initialLimit: 10,
  })

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<StoreResponseDto | null>(null)

  // Form States
  const [formData, setFormData] = useState<{
    name: string
    phone: string
    address: string
    isOpen: boolean
  }>({
    name: "",
    phone: "",
    address: "",
    isOpen: true,
  })

  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const resetForm = () => {
    setFormData({ name: "", phone: "", address: "", isOpen: true })
    setFormError(null)
  }

  const handleOpenCreateModal = () => {
    resetForm()
    setIsCreateModalOpen(true)
  }

  const handleOpenEditModal = (store: StoreResponseDto) => {
    setEditingStore(store)
    setFormData({
      name: store.name,
      phone: store.phone,
      address: store.address,
      isOpen: store.isOpen,
    })
    setFormError(null)
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setFormError("Please fill in all required fields (Name, Phone, Address).")
      return
    }

    try {
      setIsSubmitting(true)
      setFormError(null)
      const payload: CreateStoreDto = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        isOpen: formData.isOpen,
      }
      await storeApi.createStore(payload)
      setIsCreateModalOpen(false)
      resetForm()
      refresh()
    } catch (err: unknown) {
      setFormError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to create store."
          : "Failed to create store."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStore) return
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setFormError("Please fill in all required fields.")
      return
    }

    try {
      setIsSubmitting(true)
      setFormError(null)
      const payload: UpdateStoreDto = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        isOpen: formData.isOpen,
      }
      await storeApi.updateStore(editingStore.id, payload)
      setEditingStore(null)
      resetForm()
      refresh()
    } catch (err: unknown) {
      setFormError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to update store."
          : "Failed to update store."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleLock = async (store: StoreResponseDto) => {
    try {
      setActionLoadingId(store.id)
      if (store.isLocked) {
        await storeApi.unlockStore(store.id)
      } else {
        await storeApi.lockStore(store.id)
      }
      refresh()
    } catch (err: unknown) {
      alert(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to change lock status."
          : "Failed to change lock status."
      )
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="text-[10px] uppercase font-bold tracking-wider">
              Admin
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Store Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            View, create, update, and manage lock status for all system stores.
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleOpenCreateModal}
          className="self-start sm:self-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Store
        </Button>
      </div>

      {/* 2. Toolbar & Filters */}
      <SearchToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search stores by name..."
      >
        {/* Filter Open Status */}
        <select
          value={isOpen === undefined ? "all" : isOpen ? "true" : "false"}
          onChange={(e) => {
            const val = e.target.value
            setIsOpen(val === "all" ? undefined : val === "true")
          }}
          className="h-9 px-3 border border-border rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Open Status</option>
          <option value="true">Open Stores</option>
          <option value="false">Closed Stores</option>
        </select>

        {/* Filter Lock Status */}
        <select
          value={isLocked === undefined ? "all" : isLocked ? "true" : "false"}
          onChange={(e) => {
            const val = e.target.value
            setIsLocked(val === "all" ? undefined : val === "true")
          }}
          className="h-9 px-3 border border-border rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Lock Status</option>
          <option value="false">Unlocked Stores</option>
          <option value="true">Locked Stores</option>
        </select>
      </SearchToolbar>

      {/* Error alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {/* 3. Stores Table */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs font-semibold">Store Name</TableHead>
              <TableHead className="text-xs font-semibold">Phone</TableHead>
              <TableHead className="text-xs font-semibold">Address</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Lock State</TableHead>
              <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-7 w-24 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : stores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <EmptyState
                    title="No stores found"
                    description="No stores match your search query or filter selection."
                    className="border-0 bg-transparent p-4"
                  />
                </TableCell>
              </TableRow>
            ) : (
              stores.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-semibold text-foreground text-xs sm:text-sm">
                    {s.name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.phone}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {s.address}
                  </TableCell>
                  <TableCell>
                    {s.isOpen ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Open
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Closed
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {s.isLocked ? (
                      <Badge variant="danger">Locked</Badge>
                    ) : (
                      <Badge variant="neutral">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleOpenEditModal(s)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant={s.isLocked ? "default" : "destructive"}
                        size="xs"
                        disabled={actionLoadingId === s.id}
                        onClick={() => handleToggleLock(s)}
                      >
                        {actionLoadingId === s.id
                          ? "Processing..."
                          : s.isLocked
                            ? "Unlock"
                            : "Lock"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {meta && (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
            itemName="stores"
            isLoading={isLoading}
            onPageChange={setPage}
          />
        )}
      </Card>

      {/* Create / Edit Modal Overlay */}
      {(isCreateModalOpen || editingStore) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 border-border bg-card">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                {editingStore ? "Edit Store Information" : "Create New Store"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setEditingStore(null)
                }}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold p-1 rounded-md cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <Alert variant="destructive">
                <AlertDescription className="text-xs">{formError}</AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={editingStore ? handleEditSubmit : handleCreateSubmit}
              className="space-y-4"
            >
              <FormField label="Store Name" required id="modalStoreName">
                <Input
                  id="modalStoreName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ABC Tea District 1"
                  className="h-9 text-xs sm:text-sm"
                  required
                />
              </FormField>

              <FormField label="Phone Number" required id="modalStorePhone">
                <Input
                  id="modalStorePhone"
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 0901234567"
                  className="h-9 text-xs sm:text-sm"
                  required
                />
              </FormField>

              <FormField label="Address" required id="modalStoreAddress">
                <Textarea
                  id="modalStoreAddress"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full store address..."
                  rows={3}
                  className="text-xs sm:text-sm resize-none"
                  required
                />
              </FormField>

              <div className="flex items-center gap-2.5 pt-1">
                <Checkbox
                  id="isOpenCheck"
                  checked={formData.isOpen}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isOpen: checked === true })
                  }
                />
                <label
                  htmlFor="isOpenCheck"
                  className="text-xs font-medium text-foreground cursor-pointer select-none"
                >
                  Open for orders immediately
                </label>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreateModalOpen(false)
                    setEditingStore(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingStore ? "Save Changes" : "Create Store"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AdminStoresPage
