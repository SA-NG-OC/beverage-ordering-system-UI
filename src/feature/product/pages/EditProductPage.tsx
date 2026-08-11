import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { useProductDetail } from "@/hooks/useProductDetail";
import { productApi } from "@/api/productApi";
import { Button } from "@/components/ui/Button";
import { updateProductSchema, type UpdateProductFormData } from "../schemas/productSchema";

export function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch product details for editing (isPublic = false for staff/admin)
  const { product, isLoading, error: fetchError } = useProductDetail(id, false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
  });

  // Pre-fill form values when product data is loaded
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: Number(product.price),
        description: product.description || "",
        status: product.status,
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product, reset]);

  const onSubmit = async (formData: UpdateProductFormData) => {
    if (!id) return;

    try {
      setServerError(null);
      setSuccessMsg(null);

      await productApi.update(id, {
        name: formData.name,
        price: Number(formData.price),
        status: formData.status,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
      });

      setSuccessMsg("Product updated successfully! Redirecting...");
      setTimeout(() => {
        navigate(-1);
      }, 1200);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setServerError(
          Array.isArray(message) ? message.join(", ") : message || "Failed to update product."
        );
      } else {
        setServerError("An unexpected error occurred.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse space-y-6">
        <div className="h-8 w-1/3 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-24 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (fetchError || !product) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl border border-gray-100 text-center space-y-4">
        <span className="text-4xl">🍹</span>
        <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-sm text-gray-500">
          {fetchError || "Unable to load product for editing."}
        </p>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
      >
        ← Cancel & Go Back
      </button>

      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500">
            Update beverage details, pricing, and availability status.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {serverError}
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                errors.name
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              placeholder="e.g. Milk Tea with Brown Sugar Pearls"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          {/* Price & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="1000"
                {...register("price", { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                  errors.price
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="35000"
              />
              {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register("status")}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm bg-white ${
                  errors.status
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              >
                <option value="active">Active (Selling)</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="hidden">Hidden</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              {...register("description")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
              placeholder="Describe taste, ingredients, size options..."
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              {...register("imageUrl")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && (
              <p className="mt-1 text-xs text-red-600">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => reset()}>
              Reset
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductPage;
