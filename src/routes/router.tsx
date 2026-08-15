/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, type ComponentType } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Role } from "@/types/enum/role.enum";
import { PageLoader } from "@/components/PageLoader";

// Lazy-loaded Pages (Route-based Code Splitting)
const LoginPage = lazy(() =>
  import("@/feature/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("@/feature/auth/pages/RegisterPage").then((m) => ({ default: m.RegisterPage }))
);
const StoreListPage = lazy(() => import("@/feature/store/pages/StoreListPage"));
const StoreDetailPage = lazy(() => import("@/feature/store/pages/StoreDetailPage"));
const CustomerProductsPage = lazy(() => import("@/feature/product/pages/CustomerProductsPage"));
const ProductDetailPage = lazy(() => import("@/feature/product/pages/ProductDetailPage"));
const CustomerOrdersPage = lazy(() => import("@/feature/orders/pages/CustomerOrdersPage"));
const CustomerOrderDetailPage = lazy(
  () => import("@/feature/orders/pages/CustomerOrderDetailPage")
);
const StaffStorePage = lazy(() =>
  import("@/feature/staff/pages/StaffStorePage").then((m) => ({ default: m.StaffStorePage }))
);
const StaffOrdersPage = lazy(() => import("@/feature/staff/pages/StaffOrdersPage"));
const StaffProductsPage = lazy(() => import("@/feature/product/pages/StaffProductsPage"));
const CreateProductPage = lazy(() => import("@/feature/product/pages/CreateProductPage"));
const EditProductPage = lazy(() => import("@/feature/product/pages/EditProductPage"));
const AdminStoresPage = lazy(() =>
  import("@/feature/admin/pages/AdminStoresPage").then((m) => ({ default: m.AdminStoresPage }))
);
const AdminProductsPage = lazy(() => import("@/feature/product/pages/AdminProductsPage"));
const AdminOrdersPage = lazy(() => import("@/feature/admin/pages/AdminOrdersPage"));
const AdminUsersPage = lazy(() => import("@/feature/admin/pages/AdminUsersPage"));
const NotFoundPage = lazy(() =>
  import("@/feature/NotFoundPage").then((m) => ({ default: m.NotFoundPage }))
);
const PlaceholderPage = lazy(() =>
  import("@/feature/PlaceholderPage").then((m) => ({ default: m.PlaceholderPage }))
);

// Helper function to wrap lazy components with Suspense fallback
const withSuspense = (Component: ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // 1. Auth Routes (Public)
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: withSuspense(LoginPage) },
      { path: "/register", element: withSuspense(RegisterPage) },
    ],
  },

  // 2. Main Public & Store Routes (Accessible by All)
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: withSuspense(StoreListPage) },
      { path: "/stores", element: withSuspense(StoreListPage) },
      { path: "/stores/:id", element: withSuspense(StoreDetailPage) },
      { path: "/products", element: withSuspense(CustomerProductsPage) },
      { path: "/products/:id", element: withSuspense(ProductDetailPage) },
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
              <Suspense fallback={<PageLoader />}>
                <PlaceholderPage
                  title="Customer Profile"
                  description="View and update your personal information, delivery addresses, and account security settings."
                  tag="Profile"
                />
              </Suspense>
            ),
          },
          {
            path: "/orders",
            element: withSuspense(CustomerOrdersPage),
          },
          {
            path: "/orders/:id",
            element: withSuspense(CustomerOrderDetailPage),
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
          { path: "/staff/store", element: withSuspense(StaffStorePage) },
          { path: "/staff/orders", element: withSuspense(StaffOrdersPage) },
          { path: "/staff/products", element: withSuspense(StaffProductsPage) },
          { path: "/staff/products/create", element: withSuspense(CreateProductPage) },
          { path: "/staff/products/:id", element: withSuspense(ProductDetailPage) },
          { path: "/staff/products/:id/edit", element: withSuspense(EditProductPage) },
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
          { path: "/admin/stores", element: withSuspense(AdminStoresPage) },
          { path: "/admin/products", element: withSuspense(AdminProductsPage) },
          { path: "/admin/products/:id", element: withSuspense(ProductDetailPage) },
          { path: "/admin/products/:id/edit", element: withSuspense(EditProductPage) },
          { path: "/admin/orders", element: withSuspense(AdminOrdersPage) },
          {
            path: "/admin/dashboard",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PlaceholderPage
                  title="System Analytics & Dashboard"
                  description="View system-wide revenue, active stores, order volume, and performance indicators."
                  tag="Dashboard"
                />
              </Suspense>
            ),
          },
          {
            path: "/admin/users",
            element: withSuspense(AdminUsersPage),
          },
        ],
      },
    ],
  },

  // 6. 404 Fallback
  {
    path: "*",
    element: withSuspense(NotFoundPage),
  },
]);
