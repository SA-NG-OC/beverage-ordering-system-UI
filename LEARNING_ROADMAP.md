# 🚀 LỘ TRÌNH THỰC HÀNH REACT — BEVERAGE ORDERING SYSTEM

> **Đối tượng**: Backend Dev Intern muốn lên Fullstack  
> **Trình độ hiện tại**: Đã học lý thuyết đến React Hooks, chưa thực hành  
> **Phương pháp**: Vừa học vừa code — mỗi giai đoạn gắn với tính năng thực tế của dự án  
> **Dự án**: Hệ thống đặt nước uống đa cửa hàng (Beverage Ordering System)  
> **Thời lượng ước tính**: 6–8 tuần (15–20h/tuần)

---

## 📋 TỔNG QUAN 12 MODULE CẦN THÀNH THỤC

| # | Chủ đề | Điểm | Nội dung chi tiết | Giai đoạn áp dụng |
|---|--------|------|--------------------|--------------------|
| 1 | Project Setup (Vite) | 4 | Create and configure React projects with Vite | GĐ 1 |
| 2 | React Fundamentals | 8 | JSX, Components, Props, State | GĐ 1 |
| 3 | React Hooks | 8 | useState, useEffect, useMemo, useCallback, Custom Hooks | GĐ 2, 3, 4 |
| 4 | Routing | 4 | React Router | GĐ 2 |
| 5 | HTTP Client | 8 | Fetch API, Axios | GĐ 2 |
| 6 | React Hook Form + Zod | 8 | Build and validate forms | GĐ 2, 3, 4 |
| 7 | TanStack Query | 8 | Queries, Mutations, Cache, Optimistic Updates | GĐ 3, 4, 5 |
| 8 | Redux Toolkit | 8 | Modern Redux | GĐ 3 |
| 9 | Tailwind CSS / CSS Modules | 6 | Modern styling | GĐ 1 → xuyên suốt |
| 10 | Component Library | 4 | MUI / Ant Design / shadcn/ui | GĐ 3 → xuyên suốt |
| 11 | Performance Optimization | 6 | Lazy Loading, Suspense, Memoization, Code Splitting | GĐ 6 |
| 12 | Testing | 8 | Vitest + React Testing Library | GĐ 6 |

---

## 🗺️ TỔNG QUAN CÁC GIAI ĐOẠN

```
GĐ 1: Nền tảng & Setup          ──▶  GĐ 2: Auth & Routing
  (Module 1, 2, 9)                       (Module 3, 4, 5, 6)
                                              │
GĐ 6: Optimization & Testing    ◀──  GĐ 5: Admin Portal
  (Module 11, 12)                       (Module 7, 10)
                                              │
                                         GĐ 4: Staff Dashboard
                                           (Module 3, 6, 7, 10)
                                              │
                                         GĐ 3: Customer App
                                           (Module 3, 6, 7, 8, 10)
```

---
---

# GIAI ĐOẠN 1: PROJECT SETUP & REACT FUNDAMENTALS

> **⏱ Thời lượng**: Tuần 1 (5–7 ngày)  
> **🎯 Module**: `1. Project Setup (Vite)` · `2. React Fundamentals` · `9. Tailwind CSS`  
> **💡 Mục tiêu**: Có project chạy được, hiểu cách React render UI, viết được Component cơ bản

---

## 📖 Phần A — Lý thuyết cần nắm trước khi code

Trước khi viết code, hãy đọc/ôn lại các khái niệm sau (bạn đã học lý thuyết rồi nên phần này chỉ là ôn nhanh):

### A1. React Core Concepts (ôn lại)
- **JSX** là gì: Cú pháp viết HTML trong JavaScript, khác HTML thuần ở đâu (`className` thay `class`, `{}` để chèn JS expression).
- **Functional Component**: Hàm JS trả về JSX. Mỗi component = 1 khối UI độc lập.
- **Props**: Dữ liệu truyền từ component cha → con (read-only, one-way data flow).
- **State**: Dữ liệu nội bộ của component, khi thay đổi → React re-render component đó.
- **Immutability**: Không bao giờ thay đổi trực tiếp state (`state.push(x)` ❌), luôn tạo bản mới (`[...state, x]` ✅).

### A2. JS ES6+ Syntax (Backend dev cần thuộc)
Bạn đã quen logic từ NestJS, nhưng hãy chắc chắn thuộc cú pháp JS:
```javascript
// Destructuring
const { name, email } = user;
const [first, ...rest] = items;

// Array Methods (dùng cực nhiều trong React)
items.map(item => <ProductCard key={item.id} product={item} />)
items.filter(item => item.status === 'active')

// Spread Operator
const updated = { ...product, price: newPrice };

// Optional Chaining & Nullish Coalescing
const storeName = store?.name ?? 'Không có tên';
```

---

## 🔨 Phần B — Thực hành code

### B1. Cấu hình Project (Module 1 — Project Setup)

Project đã được khởi tạo. Giờ cần cấu trúc lại thư mục và cài Tailwind CSS.

**Bước 1: Tạo cấu trúc thư mục chuẩn**

```
src/
├── api/              # Axios instance, interceptors, service functions
├── assets/           # Hình ảnh, icons, fonts
├── components/       # Components dùng chung (Button, Input, Modal, Badge, Spinner...)
│   └── ui/           # Primitive UI components
├── features/         # Chia theo tính năng nghiệp vụ
│   ├── auth/         # Trang Login, Register, components Auth
│   ├── stores/       # Trang danh sách cửa hàng, chi tiết
│   ├── products/     # Trang sản phẩm
│   ├── orders/       # Trang đơn hàng
│   ├── staff/        # Dashboard nhân viên
│   └── admin/        # Dashboard quản trị viên
├── hooks/            # Custom hooks (useDebounce, useAuth, useLocalStorage...)
├── layouts/          # Layout wrappers (MainLayout, AuthLayout, DashboardLayout)
├── routes/           # React Router config, ProtectedRoute
├── store/            # Redux Toolkit store & slices
│   └── slices/
├── types/            # TypeScript interfaces/types cho API
├── utils/            # Hàm tiện ích (format tiền, format ngày, storage helpers)
├── App.tsx
├── main.tsx
└── index.css
```

> 💡 **Tại sao cấu trúc này?** Là BE dev, bạn quen pattern Module-based (NestJS modules). Cấu trúc `features/` trong React tương đương — mỗi feature folder chứa page, components, hooks riêng của nó.

**Bước 2: Cài đặt Tailwind CSS v4**

```bash
npm install tailwindcss @tailwindcss/vite
```

Cấu hình `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Thay nội dung `src/index.css`:
```css
@import "tailwindcss";
```

**Bước 3: Cấu hình Path Alias**

Trong `tsconfig.app.json`, thêm:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Trong `vite.config.ts`:
```typescript
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Sau khi cấu hình, bạn có thể import:
```typescript
import { Button } from '@/components/ui/Button'  // thay vì '../../../components/ui/Button'
```

---

### B2. Định nghĩa TypeScript Types (Module 2 — Fundamentals)

> 🧠 **Tư duy BE**: Giống như bạn viết DTO trong NestJS, TypeScript interfaces giúp FE có type-safety hoàn toàn.

Tạo file `src/types/api.ts` — đây là nơi định nghĩa TẤT CẢ các kiểu dữ liệu khớp với OpenAPI schemas:

```typescript
// ============================================
// 🔐 AUTH TYPES
// ============================================

/** Dữ liệu đăng ký — tương đương RegisterDto ở BE */
export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

/** Dữ liệu đăng nhập — tương đương LoginDto ở BE */
export interface LoginDto {
  email: string;
  password: string;
}

/** Thông tin user trả về (không có password) */
export interface UserResponseDto {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: 'customer' | 'staff' | 'admin';
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Response khi login thành công */
export interface LoginResponseDto {
  accessToken: string;
  user: UserResponseDto;
}

/** Response khi refresh token */
export interface AccessTokenResponseDto {
  accessToken: string;
}

/** Response message đơn giản */
export interface MessageResponseDto {
  message: string;
}

// ============================================
// 🏪 STORE TYPES
// ============================================

export interface StoreResponseDto {
  id: string;
  name: string;
  phone: string;
  address: string;
  isOpen: boolean;
  isLocked: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreDto {
  name: string;
  phone: string;
  address: string;
}

export interface UpdateStoreDto {
  name?: string;
  phone?: string;
  address?: string;
  isOpen?: boolean;
}

// ============================================
// 📁 CATEGORY TYPES
// ============================================

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

// ============================================
// 🥤 PRODUCT TYPES
// ============================================

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

// ============================================
// 📦 ORDER TYPES
// ============================================

export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled';

export interface OrderItemDto {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  storeId: string;
  items: OrderItemDto[];
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  note?: string;
}

export interface CancelOrderDto {
  cancelReason: string;
}

export interface UpdateOrderStatusDto {
  status: 'preparing' | 'completed';
}

export interface OrderItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderResponseDto {
  id: string;
  customerId: string;
  storeId: string;
  store: StoreResponseDto;
  items: OrderItemResponseDto[];
  totalAmount: number;
  status: OrderStatus;
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  note: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderHistoryResponseDto {
  id: string;
  storeId: string;
  storeName: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

// ============================================
// 👤 USER MANAGEMENT TYPES (Admin)
// ============================================

export interface StaffResponseDto {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: 'staff';
  isBanned: boolean;
  storeId: string | null;
  store: StoreResponseDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  storeId: string;
}

export interface UserManagementResponseDto {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: 'customer' | 'staff' | 'admin';
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 📊 STATISTICS TYPES
// ============================================

export interface StaffOrderStatisticsResponseDto {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  completedRevenue: number;
}

// ============================================
// 📤 UPLOAD TYPES
// ============================================

export interface UploadImageResponseDto {
  imageUrl: string;
}

// ============================================
// 📄 PAGINATION & API RESPONSE WRAPPER
// ============================================

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

// ============================================
// 🔍 QUERY PARAMS
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface StoreQueryParams extends PaginationParams {
  isOpen?: boolean;
  isLocked?: boolean;
}

export interface ProductQueryParams extends PaginationParams {
  storeId?: string;
  categoryId?: string;
  status?: ProductStatus;
}

export interface OrderQueryParams extends PaginationParams {
  status?: OrderStatus;
  storeId?: string;
  customerId?: string;
}

export interface UserQueryParams extends PaginationParams {
  role?: 'customer' | 'staff' | 'admin';
  isBanned?: boolean;
}

export interface StaffQueryParams extends PaginationParams {
  storeId?: string;
  isBanned?: boolean;
}

export interface StatisticsQueryParams {
  from?: string; // 'YYYY-MM-DD'
  to?: string;   // 'YYYY-MM-DD'
}
```

> 🎓 **Bài học Module 2**: Bạn vừa thực hành **TypeScript interfaces** — nền tảng của React Fundamentals. Mọi dữ liệu trong ứng dụng đều có type rõ ràng, giúp IDE autocomplete và bắt lỗi lúc compile.

---

### B3. Xây dựng Components cơ bản (Module 2 + 9)

Tạo một số Reusable Components đầu tiên để hiểu rõ JSX, Props, State:

**File `src/components/ui/Button.tsx`** — Component đầu tiên của bạn:

```tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
}: ButtonProps) {
  // 🎓 Đây là cách dùng object lookup thay vì if-else dài
  const variantClasses: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
```

**File `src/components/ui/Badge.tsx`** — Hiển thị trạng thái đơn hàng:

```tsx
import type { OrderStatus, ProductStatus } from '@/types/api';

type BadgeVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

// 🎓 Helper function — ví dụ thực tế về việc map business logic sang UI
export function getOrderStatusBadge(status: OrderStatus) {
  const config: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
    pending: { label: 'Chờ xử lý', variant: 'warning' },
    preparing: { label: 'Đang pha chế', variant: 'info' },
    completed: { label: 'Hoàn thành', variant: 'success' },
    cancelled: { label: 'Đã hủy', variant: 'danger' },
  };
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function getProductStatusBadge(status: ProductStatus) {
  const config: Record<ProductStatus, { label: string; variant: BadgeVariant }> = {
    active: { label: 'Đang bán', variant: 'success' },
    hidden: { label: 'Ẩn', variant: 'neutral' },
    out_of_stock: { label: 'Hết hàng', variant: 'danger' },
  };
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
```

---

### B4. Viết Utility Functions (Module 2)

**File `src/utils/format.ts`**:

```typescript
/**
 * Format số tiền sang định dạng VND
 * formatCurrency(35000) → "35.000 ₫"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Format ngày giờ sang định dạng Việt Nam
 * formatDateTime('2026-07-08T10:00:00Z') → "08/07/2026 17:00"
 */
export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(dateString));
}

/**
 * Format ngày (không có giờ)
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(dateString));
}
```

---

### ✅ Checklist hoàn thành Giai đoạn 1

- [ ] Tạo xong cấu trúc thư mục `src/` theo chuẩn
- [ ] Cài đặt và chạy được Tailwind CSS
- [ ] Cấu hình Path Alias `@/` hoạt động
- [ ] Viết xong file `src/types/api.ts` với tất cả TypeScript interfaces
- [ ] Viết xong component `Button` và `Badge` (hiểu Props, JSX, Conditional Rendering)
- [ ] Viết xong utility functions (format tiền, ngày)
- [ ] Chạy `npm run dev` thấy UI hiển thị component Button + Badge thành công

### 🧠 Kiến thức đã thành thục sau GĐ 1

| Module | Mức độ |
|--------|--------|
| 1. Project Setup (Vite) | ██████████ 100% |
| 2. React Fundamentals (JSX, Components, Props) | ████████░░ 80% (State sẽ học sâu ở GĐ 2) |
| 9. Tailwind CSS | ████░░░░░░ 40% (sẽ tiếp tục xuyên suốt) |

---
---

# GIAI ĐOẠN 2: AUTHENTICATION & ROUTING

> **⏱ Thời lượng**: Tuần 2 (7 ngày)  
> **🎯 Module**: `3. React Hooks` · `4. Routing` · `5. HTTP Client` · `6. React Hook Form + Zod`  
> **💡 Mục tiêu**: Xây dựng luồng Auth hoàn chỉnh (Login, Register, Logout, Auto-refresh token), phân quyền Route theo Role

---

## 📖 Phần A — Lý thuyết cần đọc

### A1. React Hooks — Những hook bạn sẽ dùng ngay
```
useState     → Lưu trạng thái: loading, error, form data, toggle UI
useEffect    → Gọi side-effect: fetch user profile khi mount, check auth khi route thay đổi
useMemo      → Cache kết quả tính toán: tổng tiền giỏ hàng (GĐ 3)
useCallback  → Cache function reference: tránh re-render child component (GĐ 4+)
Custom Hooks → Gom logic dùng lại: useAuth(), useDebounce(), useLocalStorage()
```

### A2. React Router v6 Concepts
- **BrowserRouter** → Bọc toàn bộ app
- **Routes / Route** → Định nghĩa URL → Component mapping
- **Outlet** → Slot để render child route (dùng cho Layout)
- **Navigate** → Redirect programmatically
- **useNavigate, useParams, useSearchParams** → Hooks điều hướng

### A3. Axios vs Fetch
| | Fetch (built-in) | Axios |
|--|---|---|
| Interceptors | ❌ Không có | ✅ Request & Response interceptors |
| Auto JSON | ❌ Cần `.json()` | ✅ Tự động parse |
| Cancel request | AbortController | CancelToken / AbortController |
| Cookie | `credentials: 'include'` | `withCredentials: true` |

→ **Chọn Axios** vì cần Interceptor để auto-refresh token (quan trọng cho dự án này).

---

## 🔨 Phần B — Thực hành code

### B1. Setup Axios Client (Module 5 — HTTP Client)

> 🧠 **Tư duy BE**: Đây giống middleware/guard ở NestJS — mỗi request tự động gắn token, mỗi response 401 tự động refresh.

**Cài đặt**:
```bash
npm install axios
```

**File `src/api/axiosClient.ts`**:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // 🔑 Quan trọng: Để gửi/nhận httpOnly cookie (refreshToken)
});

// ──────────────────────────────────────────
// REQUEST INTERCEPTOR — Tự động gắn Bearer Token
// ──────────────────────────────────────────
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ──────────────────────────────────────────
// RESPONSE INTERCEPTOR — Auto Refresh Token khi gặp 401
// ──────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 VÀ chưa retry VÀ không phải request refresh/login
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      // Nếu đang có request refresh, xếp hàng chờ
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi refresh — cookie httpOnly được gửi tự động nhờ withCredentials
        const { data } = await axiosClient.post('/auth/refresh');
        const newToken = data.data.accessToken;

        localStorage.setItem('accessToken', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh thất bại → xóa token, redirect về login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
```

> 🎓 **Bài học Module 5**: Bạn vừa xây dựng HTTP Client hoàn chỉnh với **Request Interceptor** (auto-attach token) và **Response Interceptor** (auto-refresh token + retry queue). Đây là pattern chuyên nghiệp dùng trong production.

---

**File `src/api/authApi.ts`** — Các hàm gọi API Auth:

```typescript
import axiosClient from './axiosClient';
import type {
  ApiResponse,
  RegisterDto,
  LoginDto,
  LoginResponseDto,
  UserResponseDto,
  AccessTokenResponseDto,
  MessageResponseDto,
} from '@/types/api';

export const authApi = {
  register: (data: RegisterDto) =>
    axiosClient.post<ApiResponse<UserResponseDto>>('/auth/register', data),

  login: (data: LoginDto) =>
    axiosClient.post<ApiResponse<LoginResponseDto>>('/auth/login', data),

  getMe: () =>
    axiosClient.get<ApiResponse<UserResponseDto>>('/auth/me'),

  refresh: () =>
    axiosClient.post<ApiResponse<AccessTokenResponseDto>>('/auth/refresh'),

  logout: () =>
    axiosClient.post<ApiResponse<MessageResponseDto>>('/auth/logout'),
};
```

---

### B2. Auth Forms (Module 6 — React Hook Form + Zod)

**Cài đặt**:
```bash
npm install react-hook-form zod @hookform/resolvers
```

**File `src/features/auth/schemas/authSchemas.ts`** — Validation Schemas:

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không đúng định dạng'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ tên không được để trống')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không đúng định dạng'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  phone: z
    .string()
    .optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
```

**File `src/features/auth/pages/LoginPage.tsx`**:

```tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../schemas/authSchemas';
import { authApi } from '@/api/authApi';
import { Button } from '@/components/ui/Button';

export function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  // 🎓 useForm hook — Quản lý toàn bộ form state, validation, submit
  const {
    register,     // Đăng ký input field vào form
    handleSubmit,  // Wrapper xử lý submit (chỉ gọi onSubmit nếu validate pass)
    formState: { errors, isSubmitting }, // errors: lỗi validation, isSubmitting: đang gửi?
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // Kết nối Zod schema để validate
  });

  // 🎓 useState — Lưu lỗi server (401, 403) để hiển thị
  const onSubmit = async (formData: LoginFormData) => {
    try {
      setServerError(null);
      const response = await authApi.login(formData);
      const { accessToken, user } = response.data.data;

      // Lưu token vào localStorage (sẽ chuyển sang Redux ở GĐ 3)
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Điều hướng theo role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'staff') navigate('/staff');
      else navigate('/');
    } catch (error: any) {
      if (error.response?.status === 401) {
        setServerError('Email hoặc mật khẩu không đúng');
      } else if (error.response?.status === 403) {
        setServerError('Tài khoản đã bị khóa');
      } else {
        setServerError('Đã xảy ra lỗi, vui lòng thử lại');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng nhập</h1>

        {/* Hiển thị lỗi server */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
                ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
                ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
              placeholder="••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full"
          >
            Đăng nhập
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
```

> 🎓 **Bài học Module 6**: Bạn vừa học cách kết hợp **React Hook Form** (quản lý form state) + **Zod** (schema validation) + **zodResolver** (cầu nối). Pattern này dùng cho MỌI form trong dự án: Register, Create Product, Create Order, Cancel Order,...

---

### B3. React Router & Protected Routes (Module 4 — Routing)

**Cài đặt**:
```bash
npm install react-router-dom
```

**File `src/routes/ProtectedRoute.tsx`**:

```tsx
import { Navigate, Outlet } from 'react-router-dom';
import type { UserResponseDto } from '@/types/api';

interface ProtectedRouteProps {
  allowedRoles: Array<'customer' | 'staff' | 'admin'>;
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');

  // 🎓 Guard 1: Chưa đăng nhập → redirect về /login
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user: UserResponseDto = JSON.parse(userStr);

  // 🎓 Guard 2: Sai role → redirect về trang chủ
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 🎓 Outlet render child routes bên trong layout
  return <Outlet />;
}
```

**File `src/routes/AppRouter.tsx`**:

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { StaffLayout } from '@/layouts/StaffLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

// Auth Pages
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';

// Public Pages (sẽ code ở GĐ 3)
// import { HomePage } from '@/features/stores/pages/HomePage';
// ...

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── AUTH ROUTES (không cần đăng nhập) ── */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* ── PUBLIC + CUSTOMER ROUTES ── */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<div>Home Page — GĐ 3</div>} />
          <Route path="/stores" element={<div>Store List — GĐ 3</div>} />
          <Route path="/stores/:id" element={<div>Store Detail — GĐ 3</div>} />
          <Route path="/products" element={<div>Products — GĐ 3</div>} />

          {/* Customer Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/cart" element={<div>Cart — GĐ 3</div>} />
            <Route path="/checkout" element={<div>Checkout — GĐ 3</div>} />
            <Route path="/orders" element={<div>Order History — GĐ 3</div>} />
            <Route path="/orders/:id" element={<div>Order Detail — GĐ 3</div>} />
          </Route>
        </Route>

        {/* ── STAFF ROUTES (role = staff) ── */}
        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route element={<StaffLayout />}>
            <Route path="/staff" element={<div>Staff Dashboard — GĐ 4</div>} />
            <Route path="/staff/store" element={<div>Store Info — GĐ 4</div>} />
            <Route path="/staff/categories" element={<div>Categories — GĐ 4</div>} />
            <Route path="/staff/products" element={<div>Products — GĐ 4</div>} />
            <Route path="/staff/orders" element={<div>Orders — GĐ 4</div>} />
            <Route path="/staff/statistics" element={<div>Statistics — GĐ 4</div>} />
          </Route>
        </Route>

        {/* ── ADMIN ROUTES (role = admin) ── */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<div>Admin Dashboard — GĐ 5</div>} />
            <Route path="/admin/stores" element={<div>Stores — GĐ 5</div>} />
            <Route path="/admin/staff" element={<div>Staff Mgmt — GĐ 5</div>} />
            <Route path="/admin/users" element={<div>Users — GĐ 5</div>} />
            <Route path="/admin/orders" element={<div>All Orders — GĐ 5</div>} />
          </Route>
        </Route>

        {/* ── FALLBACK ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

> 🎓 **Bài học Module 4**: Bạn vừa học **Nested Routes** (Layout → Pages), **Protected Routes** (guard theo role), và **Outlet pattern**. Giống middleware guard trong NestJS nhưng ở phía client.

---

### B4. Custom Hook đầu tiên (Module 3 — React Hooks)

**File `src/hooks/useAuth.ts`** — Custom hook gom logic auth:

```typescript
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import type { UserResponseDto } from '@/types/api';

export function useAuth() {
  // 🎓 useState: Quản lý state user và loading
  const [user, setUser] = useState<UserResponseDto | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 🎓 useCallback: Cache hàm logout để truyền xuống child không gây re-render
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Logout failed nhưng vẫn xóa local data
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  }, [navigate]);

  // 🎓 useEffect: Chạy 1 lần khi mount — verify token bằng GET /auth/me
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi.getMe()
      .then((response) => {
        const userData = response.data.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isCustomer: user?.role === 'customer',
    logout,
  };
}
```

> 🎓 **Bài học Module 3**: Bạn vừa viết **Custom Hook** đầu tiên, sử dụng cả `useState`, `useEffect`, `useCallback`. Custom Hook = gom logic dùng lại giữa nhiều component. Giống concept Service trong Angular/NestJS.

---

### ✅ Checklist hoàn thành Giai đoạn 2

- [ ] Axios Client với Request + Response Interceptor (auto-refresh token)
- [ ] File `authApi.ts` gọi đủ 5 endpoint: register, login, me, refresh, logout
- [ ] Login Page hoạt động với React Hook Form + Zod validation
- [ ] Register Page hoạt động (tương tự Login, dùng `registerSchema`)
- [ ] Router config đầy đủ với Public/Customer/Staff/Admin routes
- [ ] ProtectedRoute guard hoạt động (redirect nếu chưa login hoặc sai role)
- [ ] Custom hook `useAuth` hoạt động
- [ ] Tạo các Layout placeholder (MainLayout, AuthLayout, StaffLayout, AdminLayout)

### 🧠 Kiến thức đã thành thục sau GĐ 2

| Module | Mức độ |
|--------|--------|
| 3. React Hooks (useState, useEffect, useCallback) | ██████░░░░ 60% |
| 4. Routing (React Router) | ██████████ 100% |
| 5. HTTP Client (Axios) | ██████████ 100% |
| 6. React Hook Form + Zod | ██████░░░░ 60% (sẽ dùng thêm ở GĐ 3, 4) |

---
---

# GIAI ĐOẠN 3: CUSTOMER APP — XEM CỬA HÀNG, SẢN PHẨM, ĐẶT HÀNG

> **⏱ Thời lượng**: Tuần 3–4 (10–14 ngày)  
> **🎯 Module**: `3. React Hooks (useMemo, Custom Hooks)` · `7. TanStack Query` · `8. Redux Toolkit` · `10. Component Library`  
> **💡 Mục tiêu**: Xây dựng toàn bộ luồng Customer: xem store → xem sản phẩm → thêm giỏ hàng → đặt hàng COD → xem lịch sử

---

## 📖 Phần A — Lý thuyết cần đọc

### A1. TanStack Query (React Query) — Server State Manager
```
🔑 Nguyên tắc vàng:
  - TanStack Query = quản lý DỮ LIỆU TỪ SERVER (fetch, cache, refetch, loading/error states)
  - Redux = quản lý DỮ LIỆU CLIENT (giỏ hàng, user đang login, theme, UI state)
  - KHÔNG lưu dữ liệu API vào Redux! (lỗi phổ biến nhất của BE dev chuyển sang FE)
```

Các concept chính:
- **useQuery**: Fetch dữ liệu + tự động cache + refetch khi focus lại tab
- **useMutation**: Tạo/sửa/xóa dữ liệu + xử lý onSuccess/onError
- **queryKey**: Key để identify cache entry (giống cache key ở Redis)
- **invalidateQueries**: Xóa cache cũ để refetch data mới (giống cache eviction)

### A2. Redux Toolkit — Client State Manager
```
Store   → Kho chứa toàn bộ client state (giống Database)
Slice   → Module quản lý 1 phần state (giống Table)
Action  → Hành động thay đổi state (giống SQL Command)
Reducer → Hàm xử lý action, trả về state mới (giống Stored Procedure)
```

---

## 🔨 Phần B — Thực hành code

### B1. Cài đặt dependencies mới

```bash
npm install @tanstack/react-query @reduxjs/toolkit react-redux
npm install -D @tanstack/react-query-devtools
```

### B2. Setup TanStack Query Provider (Module 7)

**File `src/main.tsx`** — Cập nhật:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/store';
import { AppRouter } from '@/routes/AppRouter';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // Data "tươi" trong 5 phút
      retry: 1,                     // Retry 1 lần nếu fetch thất bại
      refetchOnWindowFocus: false,  // Không refetch khi focus lại tab
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>
  </React.StrictMode>
);
```

### B3. API Service Functions cho Customer (Module 5 + 7)

**File `src/api/storeApi.ts`**:
```typescript
import axiosClient from './axiosClient';
import type {
  ApiResponse, PaginatedData, StoreResponseDto, StoreQueryParams,
} from '@/types/api';

export const storeApi = {
  // GET /stores — danh sách store công khai
  getAll: (params?: StoreQueryParams) =>
    axiosClient.get<ApiResponse<PaginatedData<StoreResponseDto>>>('/stores', { params }),

  // GET /stores/:id — chi tiết 1 store
  getById: (id: string) =>
    axiosClient.get<ApiResponse<StoreResponseDto>>(`/stores/${id}`),
};
```

**File `src/api/productApi.ts`**:
```typescript
import axiosClient from './axiosClient';
import type {
  ApiResponse, PaginatedData, ProductResponseDto, ProductQueryParams,
} from '@/types/api';

export const productApi = {
  // GET /products/public — sản phẩm công khai
  getPublic: (params?: ProductQueryParams) =>
    axiosClient.get<ApiResponse<PaginatedData<ProductResponseDto>>>('/products/public', { params }),

  // GET /products/public/:id
  getPublicById: (id: string) =>
    axiosClient.get<ApiResponse<ProductResponseDto>>(`/products/public/${id}`),
};
```

**File `src/api/orderApi.ts`**:
```typescript
import axiosClient from './axiosClient';
import type {
  ApiResponse, PaginatedData, OrderResponseDto, OrderHistoryResponseDto,
  CreateOrderDto, CancelOrderDto, OrderQueryParams,
} from '@/types/api';

export const orderApi = {
  // POST /orders — đặt hàng COD
  create: (data: CreateOrderDto) =>
    axiosClient.post<ApiResponse<OrderResponseDto>>('/orders', data),

  // GET /orders/history — lịch sử đơn hàng customer
  getHistory: (params?: OrderQueryParams) =>
    axiosClient.get<ApiResponse<PaginatedData<OrderHistoryResponseDto>>>('/orders/history', { params }),

  // GET /orders/:id — chi tiết đơn hàng customer
  getById: (id: string) =>
    axiosClient.get<ApiResponse<OrderResponseDto>>(`/orders/${id}`),

  // PATCH /orders/:id/cancel — hủy đơn
  cancel: (id: string, data: CancelOrderDto) =>
    axiosClient.patch<ApiResponse<OrderResponseDto>>(`/orders/${id}/cancel`, data),
};
```

### B4. Custom Hooks với TanStack Query (Module 3 + 7)

**File `src/hooks/useDebounce.ts`** — Custom Hook quan trọng cho Search:

```typescript
import { useState, useEffect } from 'react';

/**
 * Hook debounce giá trị — tránh gọi API liên tục khi user gõ phím
 * 🧠 Tư duy BE: Giống throttle/debounce middleware ở API Gateway
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // 🎓 Cleanup function — hủy timer cũ khi value thay đổi
  }, [value, delay]);

  return debouncedValue;
}
```

**File `src/features/stores/hooks/useStores.ts`** — Query hook cho Store list:

```typescript
import { useQuery } from '@tanstack/react-query';
import { storeApi } from '@/api/storeApi';
import type { StoreQueryParams } from '@/types/api';

export function useStores(params?: StoreQueryParams) {
  return useQuery({
    // 🎓 queryKey: Mỗi bộ params khác nhau = cache entry riêng
    queryKey: ['stores', params],
    queryFn: async () => {
      const response = await storeApi.getAll(params);
      return response.data.data; // Trả về { items, meta }
    },
  });
}

export function useStoreDetail(id: string) {
  return useQuery({
    queryKey: ['stores', id],
    queryFn: async () => {
      const response = await storeApi.getById(id);
      return response.data.data;
    },
    enabled: !!id, // 🎓 Chỉ fetch khi có id (tránh gọi API với id undefined)
  });
}
```

### B5. Redux Cart Slice (Module 8 — Redux Toolkit)

**File `src/store/slices/cartSlice.ts`**:

```typescript
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartState {
  storeId: string | null;   // Giỏ hàng chỉ chứa sản phẩm từ 1 store
  storeName: string | null;
  items: CartItem[];
}

const initialState: CartState = {
  storeId: null,
  storeName: null,
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Thêm sản phẩm vào giỏ
    addToCart: (state, action: PayloadAction<{
      storeId: string;
      storeName: string;
      item: CartItem;
    }>) => {
      const { storeId, storeName, item } = action.payload;

      // 🎓 Business Logic: Nếu thêm SP từ store khác → clear giỏ cũ
      if (state.storeId && state.storeId !== storeId) {
        state.items = [];
      }

      state.storeId = storeId;
      state.storeName = storeName;

      const existing = state.items.find(i => i.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },

    // Cập nhật số lượng
    updateQuantity: (state, action: PayloadAction<{
      productId: string;
      quantity: number;
    }>) => {
      const item = state.items.find(i => i.productId === action.payload.productId);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },

    // Xóa sản phẩm khỏi giỏ
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.productId !== action.payload);
      if (state.items.length === 0) {
        state.storeId = null;
        state.storeName = null;
      }
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: () => initialState,
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

**File `src/store/store.ts`**:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// 🎓 TypeScript helpers — Dùng để type hóa useSelector và useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**File `src/store/hooks.ts`** — Typed hooks (Best Practice):

```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// 🎓 Dùng hooks này thay vì useDispatch/useSelector gốc — đã có type sẵn
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

### B6. useMemo — Tính tổng giỏ hàng (Module 3)

**File `src/features/orders/hooks/useCartTotal.ts`**:

```typescript
import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useCartTotal() {
  const items = useAppSelector(state => state.cart.items);

  // 🎓 useMemo: Chỉ tính lại khi items thay đổi, tránh tính toán mỗi lần re-render
  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return { totalAmount, totalItems };
}
```

### B7. Component Library — Cài đặt (Module 10)

Chọn **Ant Design** (phù hợp cho dashboard + dễ học cho BE dev):

```bash
npm install antd @ant-design/icons
```

Bạn sẽ dùng các component chính:
- `Table` → Hiển thị danh sách (sản phẩm, đơn hàng, user) có phân trang sẵn
- `Modal` / `Drawer` → Dialog tạo/sửa sản phẩm, xem chi tiết
- `message` / `notification` → Toast thông báo thành công/lỗi
- `Select`, `DatePicker` → Filter, chọn ngày thống kê
- `Tag` → Badge trạng thái (có thể dùng thay hoặc bổ sung Badge tự viết)
- `Spin`, `Skeleton` → Loading states

---

### B8. Trang chính cần code ở Giai đoạn này

| Trang | API sử dụng | Kiến thức áp dụng |
|-------|-------------|-------------------|
| **Trang chủ / Danh sách cửa hàng** | `GET /stores` | useQuery, useDebounce, Pagination |
| **Chi tiết cửa hàng + Sản phẩm** | `GET /stores/:id`, `GET /products/public?storeId=` | useQuery, filter theo Category |
| **Giỏ hàng** | (Client State) | Redux: addToCart, removeFromCart, useMemo |
| **Trang Checkout** | `POST /orders` | useMutation, React Hook Form, clear cart on success |
| **Lịch sử đơn hàng** | `GET /orders/history` | useQuery, filter status, Badge |
| **Chi tiết đơn hàng** | `GET /orders/:id` | useQuery, params |
| **Hủy đơn hàng** | `PATCH /orders/:id/cancel` | useMutation, invalidateQueries |

---

### ✅ Checklist hoàn thành Giai đoạn 3

- [ ] TanStack Query Provider hoạt động
- [ ] Redux Store + Cart Slice hoạt động (thêm/sửa/xóa/clear giỏ hàng)
- [ ] Hook `useStores`, `useStoreDetail` fetch dữ liệu thành công
- [ ] Hook `useDebounce` hoạt động cho ô tìm kiếm
- [ ] Trang danh sách Store có search + phân trang
- [ ] Trang chi tiết Store + danh sách sản phẩm có filter theo category
- [ ] Trang giỏ hàng + Checkout với React Hook Form
- [ ] Trang lịch sử đơn hàng + filter theo status
- [ ] Nút hủy đơn (chỉ hiển thị khi pending) hoạt động
- [ ] Cài đặt và sử dụng ít nhất 3 component từ Ant Design (Table, message, Tag)

### 🧠 Kiến thức đã thành thục sau GĐ 3

| Module | Mức độ |
|--------|--------|
| 3. React Hooks (useState, useEffect, useMemo, useCallback, Custom) | ██████████ 100% ✅ |
| 7. TanStack Query (useQuery, useMutation, cache) | ██████░░░░ 60% |
| 8. Redux Toolkit (Slice, Dispatch, Selector) | ██████████ 100% ✅ |
| 10. Component Library (Ant Design cơ bản) | ██████░░░░ 60% |

---
---

# GIAI ĐOẠN 4: STAFF DASHBOARD — QUẢN LÝ CỬA HÀNG & ĐƠN HÀNG

> **⏱ Thời lượng**: Tuần 5 (7 ngày)  
> **🎯 Module**: `6. React Hook Form + Zod (nâng cao)` · `7. TanStack Query (Mutations, Optimistic Updates)` · `10. Component Library (Table, Modal)`  
> **💡 Mục tiêu**: Dashboard cho nhân viên CRUD Category, Product, quản lý Order status, xem thống kê

---

## 🔨 Thực hành code

### B1. API Service cho Staff

**File `src/api/staffApi.ts`**:

```typescript
import axiosClient from './axiosClient';
import type {
  ApiResponse, PaginatedData, StoreResponseDto, UpdateStoreDto,
  CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto,
  ProductResponseDto, CreateProductDto, UpdateProductDto,
  OrderResponseDto, UpdateOrderStatusDto, CancelOrderDto,
  StaffOrderStatisticsResponseDto, StatisticsQueryParams,
  PaginationParams, ProductQueryParams, OrderQueryParams,
  UploadImageResponseDto,
} from '@/types/api';

export const staffApi = {
  // ── STORE ──
  getMyStore: () =>
    axiosClient.get<ApiResponse<StoreResponseDto>>('/staff/store'),
  updateMyStore: (data: UpdateStoreDto) =>
    axiosClient.patch<ApiResponse<StoreResponseDto>>('/staff/store', data),

  // ── CATEGORIES ──
  getCategories: (params?: PaginationParams) =>
    axiosClient.get<ApiResponse<PaginatedData<CategoryResponseDto>>>('/categories', { params }),
  createCategory: (data: CreateCategoryDto) =>
    axiosClient.post<ApiResponse<CategoryResponseDto>>('/categories', data),
  updateCategory: (id: string, data: UpdateCategoryDto) =>
    axiosClient.patch<ApiResponse<CategoryResponseDto>>(`/categories/${id}`, data),
  deleteCategory: (id: string) =>
    axiosClient.delete<ApiResponse<CategoryResponseDto>>(`/categories/${id}`),

  // ── PRODUCTS ──
  getProducts: (params?: ProductQueryParams) =>
    axiosClient.get<ApiResponse<PaginatedData<ProductResponseDto>>>('/products', { params }),
  createProduct: (data: CreateProductDto) =>
    axiosClient.post<ApiResponse<ProductResponseDto>>('/products', data),
  updateProduct: (id: string, data: UpdateProductDto) =>
    axiosClient.patch<ApiResponse<ProductResponseDto>>(`/products/${id}`, data),

  // ── ORDERS ──
  getOrders: (params?: OrderQueryParams) =>
    axiosClient.get<ApiResponse<PaginatedData<OrderResponseDto>>>('/orders/staff', { params }),
  getOrderDetail: (id: string) =>
    axiosClient.get<ApiResponse<OrderResponseDto>>(`/orders/staff/${id}`),
  updateOrderStatus: (id: string, data: UpdateOrderStatusDto) =>
    axiosClient.patch<ApiResponse<OrderResponseDto>>(`/orders/staff/${id}/status`, data),
  cancelOrder: (id: string, data: CancelOrderDto) =>
    axiosClient.patch<ApiResponse<OrderResponseDto>>(`/orders/staff/${id}/cancel`, data),

  // ── STATISTICS ──
  getStatistics: (params?: StatisticsQueryParams) =>
    axiosClient.get<ApiResponse<StaffOrderStatisticsResponseDto>>('/orders/staff/statistics', { params }),

  // ── UPLOAD ──
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return axiosClient.post<ApiResponse<UploadImageResponseDto>>('/uploads/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
```

### B2. Optimistic Updates — Cập nhật trạng thái đơn hàng (Module 7 nâng cao)

> 🧠 **Tư duy BE**: Optimistic Update giống eventual consistency — UI update trước, nếu server fail thì rollback.

**File `src/features/staff/hooks/useUpdateOrderStatus.ts`**:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/api/staffApi';
import type { OrderResponseDto, UpdateOrderStatusDto, PaginatedData } from '@/types/api';
import { message } from 'antd';

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusDto }) =>
      staffApi.updateOrderStatus(id, data),

    // 🎓 onMutate: Chạy TRƯỚC KHI gọi API — cập nhật cache ngay lập tức
    onMutate: async ({ id, data }) => {
      // Cancel các query đang chạy để tránh overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ['staff-orders'] });

      // Lưu snapshot data cũ để rollback nếu lỗi
      const previousOrders = queryClient.getQueryData<PaginatedData<OrderResponseDto>>(['staff-orders']);

      // Optimistic update: cập nhật status trong cache
      queryClient.setQueriesData<PaginatedData<OrderResponseDto>>(
        { queryKey: ['staff-orders'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map(order =>
              order.id === id ? { ...order, status: data.status } : order
            ),
          };
        }
      );

      return { previousOrders }; // Context cho onError
    },

    // 🎓 onError: Rollback nếu API thất bại
    onError: (_error, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['staff-orders'], context.previousOrders);
      }
      message.error('Cập nhật trạng thái thất bại!');
    },

    // 🎓 onSettled: Luôn refetch để đảm bảo data đồng bộ với server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-orders'] });
    },

    onSuccess: () => {
      message.success('Cập nhật trạng thái thành công!');
    },
  });
}
```

### B3. Form tạo sản phẩm với Upload ảnh (Module 6 nâng cao)

**File `src/features/staff/schemas/productSchema.ts`**:
```typescript
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  description: z.string().optional(),
  price: z
    .number({ invalid_type_error: 'Giá phải là số' })
    .min(1000, 'Giá phải ít nhất 1.000đ'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  imageUrl: z.string().optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
```

### B4. Các trang cần code

| Trang | API | Kiến thức trọng tâm |
|-------|-----|---------------------|
| **Staff Store Info** | `GET/PATCH /staff/store` | Toggle isOpen, useMutation |
| **Category Management** | `CRUD /categories` | Ant Design Table + Modal, CRUD mutations |
| **Product Management** | `CRUD /products`, `POST /uploads/images` | Upload FormData, status filter, Table |
| **Order Board** | `GET/PATCH /orders/staff` | Optimistic Updates, Tab filter by status |
| **Revenue Statistics** | `GET /orders/staff/statistics` | DatePicker, Card stats display |

---

### ✅ Checklist hoàn thành Giai đoạn 4

- [ ] Staff Dashboard Layout với sidebar navigation
- [ ] Trang Store Info: xem info + toggle bật/tắt cửa hàng (`isOpen`)
- [ ] CRUD Category hoạt động (Table + Modal tạo/sửa + xóa có confirm)
- [ ] CRUD Product: Form tạo product với upload ảnh, filter theo status
- [ ] Order Board: Tab filter (pending/preparing/completed/cancelled)
- [ ] Order Status Update với Optimistic Updates
- [ ] Staff cancel order với lý do
- [ ] Trang Statistics: Card thống kê + DatePicker filter

### 🧠 Kiến thức đã thành thục sau GĐ 4

| Module | Mức độ |
|--------|--------|
| 6. React Hook Form + Zod | ██████████ 100% ✅ |
| 7. TanStack Query (Queries + Mutations + Optimistic Updates + Cache) | ██████████ 100% ✅ |
| 10. Component Library (Table, Modal, DatePicker, message, Tag) | ██████████ 100% ✅ |

---
---

# GIAI ĐOẠN 5: ADMIN PORTAL — QUẢN TRỊ HỆ THỐNG

> **⏱ Thời lượng**: Tuần 6 (7 ngày)  
> **🎯 Module**: `7. TanStack Query (Advanced)` · `10. Component Library (Advanced)`  
> **💡 Mục tiêu**: Dashboard admin toàn hệ thống — quản lý Store, Staff, User, xem tất cả Orders

---

## 🔨 Thực hành code

### B1. API Service cho Admin

**File `src/api/adminApi.ts`**:

```typescript
import axiosClient from './axiosClient';
import type {
  ApiResponse, PaginatedData,
  StoreResponseDto, CreateStoreDto, UpdateStoreDto, StoreQueryParams,
  StaffResponseDto, CreateStaffDto, StaffQueryParams,
  UserManagementResponseDto, UserQueryParams,
  OrderResponseDto, OrderQueryParams,
} from '@/types/api';

export const adminApi = {
  // ── STORES ──
  getStores: (params?: StoreQueryParams) =>
    axiosClient.get<ApiResponse<PaginatedData<StoreResponseDto>>>('/stores/admin', { params }),
  createStore: (data: CreateStoreDto) =>
    axiosClient.post<ApiResponse<StoreResponseDto>>('/stores', data),
  updateStore: (id: string, data: UpdateStoreDto) =>
    axiosClient.patch<ApiResponse<StoreResponseDto>>(`/stores/${id}`, data),
  lockStore: (id: string) =>
    axiosClient.patch<ApiResponse<StoreResponseDto>>(`/stores/${id}/lock`),
  unlockStore: (id: string) =>
    axiosClient.patch<ApiResponse<StoreResponseDto>>(`/stores/${id}/unlock`),

  // ── STAFF ──
  getStaff: (params?: StaffQueryParams) =>
    axiosClient.get<ApiResponse<PaginatedData<StaffResponseDto>>>('/admin/staff', { params }),
  createStaff: (data: CreateStaffDto) =>
    axiosClient.post<ApiResponse<StaffResponseDto>>('/admin/staff', data),
  lockStaff: (id: string) =>
    axiosClient.patch<ApiResponse<StaffResponseDto>>(`/admin/staff/${id}/lock`),
  unlockStaff: (id: string) =>
    axiosClient.patch<ApiResponse<StaffResponseDto>>(`/admin/staff/${id}/unlock`),

  // ── USERS ──
  getUsers: (params?: UserQueryParams) =>
    axiosClient.get<ApiResponse<PaginatedData<UserManagementResponseDto>>>('/admin/users', { params }),
  lockUser: (id: string) =>
    axiosClient.patch<ApiResponse<UserManagementResponseDto>>(`/admin/users/${id}/lock`),
  unlockUser: (id: string) =>
    axiosClient.patch<ApiResponse<UserManagementResponseDto>>(`/admin/users/${id}/unlock`),

  // ── ORDERS ──
  getOrders: (params?: OrderQueryParams) =>
    axiosClient.get<ApiResponse<PaginatedData<OrderResponseDto>>>('/orders/admin', { params }),
  getOrderDetail: (id: string) =>
    axiosClient.get<ApiResponse<OrderResponseDto>>(`/orders/admin/${id}`),
};
```

### B2. Các trang cần code

| Trang | API | Kiến thức trọng tâm |
|-------|-----|---------------------|
| **Store Management** | `GET /stores/admin`, `POST /stores`, `PATCH lock/unlock` | Table + search/filter isOpen & isLocked, Modal tạo store |
| **Staff Management** | `GET/POST /admin/staff`, `PATCH lock/unlock` | Table + filter storeId & isBanned, Form tạo staff (chọn store) |
| **User Management** | `GET /admin/users`, `PATCH lock/unlock` | Table + filter role & isBanned |
| **All Orders** | `GET /orders/admin` | Table + filter status, storeId, customerId |
| **Order Detail** | `GET /orders/admin/:id` | View-only chi tiết đơn hàng |

### B3. Pattern: Reusable Data Table + Search + Filter

Đến giai đoạn này, bạn sẽ nhận ra nhiều trang có pattern giống nhau: **Table + Search + Filter + Pagination**. Hãy tạo custom hook `usePaginatedQuery` để tái sử dụng:

**File `src/hooks/usePaginatedQuery.ts`**:

```typescript
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';

interface UsePaginatedQueryOptions<TParams, TData> {
  queryKey: string;
  queryFn: (params: TParams) => Promise<{ data: { data: { items: TData[]; meta: any } } }>;
  defaultParams?: Partial<TParams>;
}

export function usePaginatedQuery<
  TParams extends { page?: number; limit?: number; search?: string },
  TData
>({ queryKey, queryFn, defaultParams }: UsePaginatedQueryOptions<TParams, TData>) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Partial<TParams>>(defaultParams ?? {});

  const debouncedSearch = useDebounce(search, 500);

  const params = {
    page,
    limit,
    search: debouncedSearch || undefined,
    ...filters,
  } as TParams;

  const query = useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const response = await queryFn(params);
      return response.data.data;
    },
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    meta: query.data?.meta,
    page, setPage,
    search, setSearch,
    filters, setFilters,
  };
}
```

---

### ✅ Checklist hoàn thành Giai đoạn 5

- [ ] Admin Layout với sidebar và navigation
- [ ] Store Management: CRUD + lock/unlock
- [ ] Staff Management: Tạo staff (chọn store) + lock/unlock
- [ ] User Management: List + filter role + lock/unlock
- [ ] All Orders: xem tất cả đơn + filter theo store/customer/status
- [ ] Custom hook `usePaginatedQuery` hoạt động và tái sử dụng

---
---

# GIAI ĐOẠN 6: PERFORMANCE OPTIMIZATION & TESTING

> **⏱ Thời lượng**: Tuần 7–8 (10–14 ngày)  
> **🎯 Module**: `11. Performance Optimization` · `12. Testing`  
> **💡 Mục tiêu**: Tối ưu bundle size, tốc độ tải trang, và viết automated tests

---

## 📖 Phần A — Lý thuyết

### A1. Performance Concepts
```
React.lazy()    → Dynamic import component (chỉ tải khi cần)
Suspense        → Hiển thị fallback UI trong khi lazy component đang load
React.memo()    → Bọc component, chỉ re-render khi props thay đổi
Code Splitting  → Chia bundle thành nhiều chunk nhỏ, tải theo route
```

### A2. Testing Pyramid cho React
```
                    /\
                   /  \
                  / E2E \        ← Playwright/Cypress (ít nhất, chậm nhất)
                 /--------\
                /Integration\    ← Test luồng: Fill form → Submit → Check result
               /--------------\
              /   Unit Tests    \  ← Test functions, isolated components
             /____________________\
```

---

## 🔨 Phần B — Thực hành code

### B1. Code Splitting với React.lazy (Module 11)

**Cập nhật `src/routes/AppRouter.tsx`**:

```tsx
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';

// 🎓 React.lazy: Component chỉ được import khi user truy cập route tương ứng
const StaffDashboard = lazy(() => import('@/features/staff/pages/StaffDashboard'));
const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboard'));
const StoreListPage = lazy(() => import('@/features/stores/pages/StoreListPage'));
// ... thêm các page khác

function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spin size="large" tip="Đang tải..." />
    </div>
  );
}

// Trong Routes:
// <Route path="/staff" element={
//   <Suspense fallback={<PageLoading />}>
//     <StaffDashboard />
//   </Suspense>
// } />
```

### B2. React.memo cho List Items (Module 11)

```tsx
import { memo } from 'react';
import type { ProductResponseDto } from '@/types/api';
import { formatCurrency } from '@/utils/format';

// 🎓 React.memo: Component chỉ re-render khi props (product) thay đổi
// Rất hữu ích khi render danh sách dài (100+ sản phẩm)
export const ProductCard = memo(function ProductCard({
  product,
  onAddToCart,
}: {
  product: ProductResponseDto;
  onAddToCart: (product: ProductResponseDto) => void;
}) {
  return (
    <div className="border rounded-xl p-4 hover:shadow-md transition-shadow">
      <img src={product.imageUrl ?? '/placeholder.png'} alt={product.name}
           className="w-full h-40 object-cover rounded-lg" />
      <h3 className="mt-2 font-semibold">{product.name}</h3>
      <p className="text-blue-600 font-bold">{formatCurrency(product.price)}</p>
      <button onClick={() => onAddToCart(product)}>Thêm vào giỏ</button>
    </div>
  );
});
```

### B3. Bundle Analyzer (Module 11)

```bash
npm install -D rollup-plugin-visualizer
```

Thêm vào `vite.config.ts`:
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ open: true, gzipSize: true }), // Mở report sau khi build
  ],
});
```

Chạy `npm run build` → tự động mở trang web hiển thị kích thước từng module.

---

### B4. Setup Testing (Module 12)

**Cài đặt**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Thêm vào `vite.config.ts`:
```typescript
/// <reference types="vitest/config" />
export default defineConfig({
  // ... plugins
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

**File `src/test/setup.ts`**:
```typescript
import '@testing-library/jest-dom';
```

### B5. Unit Tests (Module 12)

**File `src/utils/__tests__/format.test.ts`**:

```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../format';

describe('formatCurrency', () => {
  it('format số nguyên', () => {
    expect(formatCurrency(35000)).toContain('35.000');
  });

  it('format số 0', () => {
    expect(formatCurrency(0)).toContain('0');
  });

  it('format số lớn', () => {
    expect(formatCurrency(1500000)).toContain('1.500.000');
  });
});

describe('formatDate', () => {
  it('format ISO string sang dd/mm/yyyy', () => {
    const result = formatDate('2026-07-08T10:00:00.000Z');
    expect(result).toContain('08');
    expect(result).toContain('07');
    expect(result).toContain('2026');
  });
});
```

### B6. Component Tests (Module 12)

**File `src/components/ui/__tests__/Button.test.tsx`**:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('render text đúng', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('gọi onClick khi click', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    await userEvent.click(screen.getByText('Submit'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled khi isLoading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('hiển thị spinner khi isLoading', () => {
    render(<Button isLoading>Saving</Button>);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
```

### B7. Integration Test — Login Flow (Module 12)

**File `src/features/auth/__tests__/LoginPage.test.tsx`**:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { authApi } from '@/api/authApi';

// Mock API module
vi.mock('@/api/authApi');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('hiển thị validation errors khi submit form rỗng', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByText('Đăng nhập'));

    await waitFor(() => {
      expect(screen.getByText('Email không được để trống')).toBeInTheDocument();
      expect(screen.getByText('Mật khẩu không được để trống')).toBeInTheDocument();
    });
  });

  it('login thành công → lưu token + navigate', async () => {
    const mockResponse = {
      data: {
        data: {
          accessToken: 'mock-token',
          user: { id: '1', email: 'test@test.com', role: 'customer', fullName: 'Test' },
        },
      },
    };
    vi.mocked(authApi.login).mockResolvedValue(mockResponse as any);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText('email@example.com'), 'test@test.com');
    await userEvent.type(screen.getByPlaceholderText('••••••'), 'password123');
    await userEvent.click(screen.getByText('Đăng nhập'));

    await waitFor(() => {
      expect(localStorage.getItem('accessToken')).toBe('mock-token');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('hiển thị lỗi khi API trả về 401', async () => {
    vi.mocked(authApi.login).mockRejectedValue({
      response: { status: 401 },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText('email@example.com'), 'wrong@test.com');
    await userEvent.type(screen.getByPlaceholderText('••••••'), 'wrongpass');
    await userEvent.click(screen.getByText('Đăng nhập'));

    await waitFor(() => {
      expect(screen.getByText('Email hoặc mật khẩu không đúng')).toBeInTheDocument();
    });
  });
});
```

Thêm script vào `package.json`:
```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage"
}
```

---

### ✅ Checklist hoàn thành Giai đoạn 6

- [ ] React.lazy + Suspense cho ít nhất 3 route (Customer, Staff, Admin)
- [ ] React.memo áp dụng cho ProductCard, OrderItem
- [ ] Bundle size report chạy được (`npm run build` → visualizer)
- [ ] Vitest + React Testing Library cài đặt thành công
- [ ] ≥ 3 Unit Tests cho utility functions (formatCurrency, formatDate)
- [ ] ≥ 2 Component Tests (Button, Badge)
- [ ] ≥ 1 Integration Test (Login Flow)
- [ ] Tất cả tests pass (`npm run test`)

### 🧠 Kiến thức đã thành thục sau GĐ 6

| Module | Mức độ |
|--------|--------|
| 11. Performance Optimization (Lazy, Suspense, Memo, Code Splitting) | ██████████ 100% ✅ |
| 12. Testing (Vitest + RTL) | ██████████ 100% ✅ |

---
---

# 📊 BẢNG TỔNG KẾT TOÀN BỘ LỘ TRÌNH

## Tiến độ theo tuần

| Tuần | Giai đoạn | Module hoàn thành | Sản phẩm đầu ra |
|------|-----------|-------------------|------------------|
| **1** | GĐ 1: Setup & Fundamentals | M1, M2, M9 (khởi đầu) | Project cấu trúc chuẩn, Types, Components cơ bản |
| **2** | GĐ 2: Auth & Routing | M3 (cơ bản), M4, M5, M6 (cơ bản) | Login/Register hoạt động, Protected Routes, Axios Interceptor |
| **3–4** | GĐ 3: Customer App | M3 (hoàn thiện), M7 (cơ bản), M8, M10 (cơ bản) | Store list, Product list, Cart, Checkout, Order History |
| **5** | GĐ 4: Staff Dashboard | M6 (hoàn thiện), M7 (hoàn thiện), M10 (hoàn thiện) | Staff CRUD Products/Categories, Order Board, Statistics |
| **6** | GĐ 5: Admin Portal | M7 (nâng cao) | Admin Dashboard, Store/Staff/User Management |
| **7–8** | GĐ 6: Optimization & Testing | M11, M12 | Code Splitting, Memoization, Unit/Integration Tests |

## Module completion matrix

```
Module                        GĐ1   GĐ2   GĐ3   GĐ4   GĐ5   GĐ6
─────────────────────────────────────────────────────────────────────
 1. Project Setup (Vite)       ✅
 2. React Fundamentals         ✅
 3. React Hooks                      🔶    ✅
 4. Routing                          ✅
 5. HTTP Client (Axios)              ✅
 6. React Hook Form + Zod           🔶          ✅
 7. TanStack Query                         🔶    ✅    ✅
 8. Redux Toolkit                          ✅
 9. Tailwind CSS               🔶    ──    ──    ──    ──    ✅
10. Component Library                      🔶    ✅
11. Performance Optimization                                 ✅
12. Testing                                                  ✅

✅ = Hoàn thành    🔶 = Đang học    ── = Tiếp tục áp dụng
```

---

## 💡 LỜI KHUYÊN QUAN TRỌNG

### 1. Nguyên tắc phân tách State
```
┌─────────────────────────────────────────┐
│           Server State                   │
│  (Dữ liệu từ API: stores, products,    │
│   orders, users)                         │
│  👉 Dùng: TanStack Query                │
│  👉 KHÔNG lưu vào Redux                 │
├─────────────────────────────────────────┤
│           Client State                   │
│  (Dữ liệu tạm trên browser: cart,      │
│   logged-in user, theme, UI toggles)    │
│  👉 Dùng: Redux Toolkit                 │
│  👉 HOẶC: useState (nếu cục bộ)        │
└─────────────────────────────────────────┘
```

### 2. Luôn xử lý 3 trạng thái cho mọi API call
```tsx
// ❌ Sai — Chỉ hiển thị data
return <div>{data.map(...)}</div>

// ✅ Đúng — Xử lý đủ 3 trạng thái
if (isLoading) return <Skeleton />;      // ← Loading state
if (error) return <ErrorAlert />;         // ← Error state
if (!data?.length) return <EmptyState />; // ← Empty state
return <div>{data.map(...)}</div>;        // ← Success state
```

### 3. Mỗi API call = 1 Custom Hook
```
Đừng gọi API trực tiếp trong component.
Luôn wrap trong custom hook hoặc TanStack Query hook.

Component → useStores() → storeApi.getAll() → axiosClient → API
```

---

*Chúc bạn hoàn thành xuất sắc lộ trình! Mỗi dòng code bạn viết đều đang rèn luyện kỹ năng Fullstack. 🚀*
