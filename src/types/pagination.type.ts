export interface PaginationMetaDto {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

/** Wrapper chuẩn cho mọi API response */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

/** Wrapper cho response có phân trang */
export interface PaginatedData<T> {
    items: T[];
    meta: PaginationMetaDto;
}