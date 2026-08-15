import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { useProductDetail } from "@/hooks/useProductDetail";
import { useCategories } from "@/hooks/useCategories";
import { productApi } from "@/api/productApi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { FormField } from "@/components/FormField";
import { updateProductSchema, type UpdateProductFormData } from "../schemas/productSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch categories for staff selection
  const { categories, isLoading: isCategoriesLoading } = useCategories();

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

  // Pre-fill form values when product data or categories list is loaded
  useEffect(() => {
    if (product) {
      const matchedCategory = categories.find(
        (c) => c.id === product.categoryId || c.name === product.categoryName
      );
      const selectedCategoryId = matchedCategory?.id || product.categoryId || "";

      reset({
        name: product.name,
        price: Number(product.price),
        description: product.description || "",
        status: product.status,
        imageUrl: product.imageUrl || "",
        categoryId: selectedCategoryId,
      });
    }
  }, [product, categories, reset]);

  const queryClient = useQueryClient();

  const updateProductMutation = useMutation({
    mutationFn: async (formData: UpdateProductFormData) => {
      if (!id) throw new Error("Missing Product ID");
      const response = await productApi.update(id, {
        name: formData.name,
        price: Number(formData.price),
        status: formData.status,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
        categoryId: formData.categoryId || undefined,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const onSubmit = async (formData: UpdateProductFormData) => {
    if (!id) return;

    try {
      setServerError(null);
      setSuccessMsg(null);

      await updateProductMutation.mutateAsync(formData);

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
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-6 w-32" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </Card>
      </div>
    );
  }

  if (fetchError || !product) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <EmptyState
          title="Product Not Found"
          description={fetchError || "Unable to load product for editing."}
          action={
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Cancel & Go Back
      </button>

      {/* Form Container */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-xl font-bold tracking-tight">Edit Product</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Update beverage details, pricing, and availability status.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4">
          {/* Server Error Alert */}
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">{serverError}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900 rounded-lg text-xs font-medium animate-in fade-in-50">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Product Name */}
            <FormField label="Product Name" error={errors.name?.message} required id="name">
              <Input
                id="name"
                type="text"
                placeholder="e.g. Brown Sugar Milk Tea"
                {...register("name")}
                className="h-9 text-xs sm:text-sm"
              />
            </FormField>

            {/* Price, Status & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="Price (VND)" error={errors.price?.message} required id="price">
                <Input
                  id="price"
                  type="number"
                  step="1000"
                  placeholder="35000"
                  {...register("price", { valueAsNumber: true })}
                  className="h-9 text-xs sm:text-sm"
                />
              </FormField>

              <FormField label="Status" error={errors.status?.message} required id="status">
                <select
                  id="status"
                  {...register("status")}
                  className="w-full h-9 px-3 border border-input rounded-lg text-xs sm:text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="active">Active (Selling)</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="hidden">Hidden</option>
                </select>
              </FormField>

              <FormField label="Category" error={errors.categoryId?.message} id="categoryId">
                <select
                  id="categoryId"
                  {...register("categoryId")}
                  disabled={isCategoriesLoading}
                  className="w-full h-9 px-3 border border-input rounded-lg text-xs sm:text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">{isCategoriesLoading ? "Loading..." : "-- Category --"}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            {/* Description */}
            <FormField label="Description" error={errors.description?.message} id="description">
              <Textarea
                id="description"
                rows={3}
                placeholder="Describe taste, ingredients, size options..."
                {...register("description")}
                className="text-xs sm:text-sm resize-none"
              />
            </FormField>

            {/* Image URL */}
            <FormField label="Image URL" error={errors.imageUrl?.message} id="imageUrl">
              <Input
                id="imageUrl"
                type="text"
                placeholder="https://example.com/image.jpg"
                {...register("imageUrl")}
                className="h-9 text-xs sm:text-sm"
              />
            </FormField>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
              <Button type="button" variant="outline" size="sm" onClick={() => reset()}>
                Reset
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="default"
                size="sm"
                isLoading={isSubmitting || updateProductMutation.isPending}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditProductPage;
