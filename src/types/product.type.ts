import type { CategoryResponseDto } from "./category.type";
import type { StoreResponseDto } from "./store.type";

export type ProductStatus = "active" | "hidden" | "out_of_stock";

export interface ProductResponseDto {
  id: string;
  storeId: string;
  categoryName: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  categoryId?: string;
  category?: CategoryResponseDto;
  store?: StoreResponseDto;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  status?: ProductStatus;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  categoryId?: string;
  status?: ProductStatus;
}
