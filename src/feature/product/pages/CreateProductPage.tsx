import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productApi } from "@/api/productApi";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/Button";
import { createProductSchema, type CreateProductFormData } from "../schemas/productSchema";

export function CreateProductPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch categories for dropdown selection
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      price: 0,
      categoryId: "",
      status: "active",
      description: "",
      imageUrl: "",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (formData: CreateProductFormData) => {
      const response = await productApi.create({
        name: formData.name,
        price: Number(formData.price),
        categoryId: formData.categoryId,
        status: formData.status,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const onSubmit = async (formData: CreateProductFormData) => {
    try {
      setServerError(null);
      setSuccessMsg(null);

      await createProductMutation.mutateAsync(formData);

      setSuccessMsg("Product created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/staff/products");
      }, 1200);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setServerError(
          Array.isArray(message) ? message.join(", ") : message || "Failed to create product."
        );
      } else {
        setServerError("An unexpected error occurred while creating product.");
      }
    }
  };

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
          <h1 className="text-2xl font-extrabold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500">Add a new beverage or item to your store menu.</p>
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
              placeholder="e.g. Brown Sugar Milk Tea"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("categoryId")}
              disabled={isCategoriesLoading}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm bg-white ${
                errors.categoryId
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
            >
              <option value="">
                {isCategoriesLoading ? "Loading categories..." : "-- Select Category --"}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>
            )}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
              placeholder="Milk tea with brown sugar pearls, size M..."
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
              placeholder="/uploads/products/example.jpg"
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
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting || createProductMutation.isPending}
            >
              Create Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProductPage;
