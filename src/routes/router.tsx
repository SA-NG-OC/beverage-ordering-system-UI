import { createBrowserRouter } from "react-router-dom"
import { AuthLayout } from "@/layouts/AuthLayout"
import { LoginPage } from "@/feature/auth/pages/LoginPage"
import { RegisterPage } from "@/feature/auth/pages/RegisterPage"
import { MainLayout } from "@/layouts/MainLayout"
import { ProtectedRoute } from "./ProtectedRoute"
import { StaffProductsPage } from "@/feature/product/pages/StaffProductsPage"
import { AdminProductsPage } from "@/feature/product/pages/AdminProductsPage"
import { CustomerProductsPage } from "@/feature/product/pages/CustomerProductsPage"
import { ProductDetailPage } from "@/feature/product/pages/ProductDetailPage"
import { EditProductPage } from "@/feature/product/pages/EditProductPage"
import { CreateProductPage } from "@/feature/product/pages/CreateProductPage"
import { Role } from "@/types/enum/role.enum"
import { NotFoundPage } from "@/feature/NotFoundPage"
import { StoreListPage } from "@/feature/store/pages/StoreListPage"
import { StoreDetailPage } from "@/feature/store/pages/StoreDetailPage"
import AdminUsersPage from "@/feature/admin/pages/AdminUsersPage"
import { AdminStoresPage } from "@/feature/admin/pages/AdminStoresPage"
import { StaffStorePage } from "@/feature/staff/pages/StaffStorePage"
import { PlaceholderPage } from "@/feature/PlaceholderPage"

export const router = createBrowserRouter([
  // 1. Auth Routes (Public)
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // 2. Main Public & Store Routes (Accessible by All)
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <StoreListPage /> },
      { path: "/stores", element: <StoreListPage /> },
      { path: "/stores/:id", element: <StoreDetailPage /> },
      { path: "/products", element: <CustomerProductsPage /> },
      { path: "/products/:id", element: <ProductDetailPage /> },
    ],
  },

  // 3. Protected Customer Routes
  {
    element: <ProtectedRoute allowedRoles={[Role.CUSTOMER]} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/profile",
            element: (
              <PlaceholderPage
                title="Customer Profile"
                description="View and update your personal information, delivery addresses, and account security settings."
                tag="Profile"
              />
            ),
          },
          {
            path: "/orders",
            element: (
              <PlaceholderPage
                title="Your Orders"
                description="Track live beverage orders, view order history, and reorder your favorite drinks."
                tag="Orders"
              />
            ),
          },
        ],
      },
    ],
  },

  // 4. Protected Staff Routes
  {
    element: <ProtectedRoute allowedRoles={[Role.STAFF, Role.ADMIN]} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/staff/store", element: <StaffStorePage /> },
          { path: "/staff/products", element: <StaffProductsPage /> },
          { path: "/staff/products/create", element: <CreateProductPage /> },
          { path: "/staff/products/:id", element: <ProductDetailPage /> },
          { path: "/staff/products/:id/edit", element: <EditProductPage /> },
        ],
      },
    ],
  },

  // 5. Protected Admin Routes
  {
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/admin/stores", element: <AdminStoresPage /> },
          { path: "/admin/products", element: <AdminProductsPage /> },
          { path: "/admin/products/:id", element: <ProductDetailPage /> },
          { path: "/admin/products/:id/edit", element: <EditProductPage /> },
          {
            path: "/admin/dashboard",
            element: (
              <PlaceholderPage
                title="System Analytics & Dashboard"
                description="View system-wide revenue, active stores, order volume, and performance indicators."
                tag="Dashboard"
              />
            ),
          },
          {
            path: "/admin/users",
            element: <AdminUsersPage />,
          },
        ],
      },
    ],
  },

  // 6. 404 Fallback
  {
    path: "*",
    element: <NotFoundPage />,
  },
])
