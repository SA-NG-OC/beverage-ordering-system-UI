export interface CategoryItemDto {
  id: string;
  name: string;
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name?: string;
}
