import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { LoginPage } from "@/feature/auth/pages/LoginPage";
import { RegisterPage } from "@/feature/auth/pages/RegisterPage";
import { MainLayout } from "@/layouts/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { StaffProductsPage } from "@/feature/product/pages/StaffProductsPage";
import { AdminProductsPage } from "@/feature/product/pages/AdminProductsPage";
import { CustomerProductsPage } from "@/feature/product/pages/CustomerProductsPage";
import { ProductDetailPage } from "@/feature/product/pages/ProductDetailPage";
import { EditProductPage } from "@/feature/product/pages/EditProductPage";
import { Role } from "@/types/enum/role.enum";
import { NotFoundPage } from "@/feature/NotFoundPage";
import AdminUsersPage from "@/feature/admin/pages/AdminUsersPage";

export const router = createBrowserRouter([
  // 1. Auth Routes (Public)
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // 2. Main Public & Customer Product Routes (Accessible by All)
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <CustomerProductsPage /> },
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
          { path: "/profile", element: <h1>Profile View</h1> },
          { path: "/orders", element: <h1>Orders View</h1> },
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
          { path: "/staff/products", element: <StaffProductsPage /> },
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
          { path: "/admin/products", element: <AdminProductsPage /> },
          { path: "/admin/products/:id", element: <ProductDetailPage /> },
          { path: "/admin/products/:id/edit", element: <EditProductPage /> },
          { path: "/admin/dashboard", element: <h1>Admin Board View</h1> },
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
]);
