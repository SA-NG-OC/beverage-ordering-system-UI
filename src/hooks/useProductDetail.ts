import { useCallback, useEffect, useState } from "react";
import { productApi } from "@/api/productApi";
import type { ProductResponseDto } from "@/types/product.type";

export function useProductDetail(productId?: string, isPublic = false) {
    const [product, setProduct] = useState<ProductResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDetail = useCallback(async () => {
        if (!productId) return;

        try {
            setIsLoading(true);
            setError(null);

            const response = isPublic
                ? await productApi.getPublicById(productId)
                : await productApi.getById(productId);

            setProduct(response.data.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to load product details.");
        } finally {
            setIsLoading(false);
        }
    }, [productId, isPublic]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    return {
        product,
        isLoading,
        error,
        refresh: fetchDetail,
    };
}