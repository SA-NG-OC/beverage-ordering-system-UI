import type { CategoryResponseDto } from "./category.type";
import type { StoreResponseDto } from "./store.type";

export type ProductStatus = 'active' | 'hidden' | 'out_of_stock';

export interface ProductResponseDto {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    status: ProductStatus;
    categoryId: string;
    category: CategoryResponseDto;
    storeId: string;
    store: StoreResponseDto;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductDto {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryId: string;
}

export interface UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    categoryId?: string;
    status?: ProductStatus;
}