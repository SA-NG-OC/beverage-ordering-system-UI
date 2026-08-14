import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export function MainLayout() {
  const { user, isAuthenticated, logout, isAdmin, isStaff, isCustomer } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 5.636l-3.536 3.536m0 0l-3.536 3.536M14.828 9.172l3.536 3.536M14.828 9.172L11.293 5.636m3.535 3.536L9.172 14.828m0 0L5.636 18.364m3.536-3.536l-3.536-3.536m3.536 3.536l3.536 3.536"
                  />
                </svg>
              </div>
              <div>
                <span className="text-lg font-extrabold text-gray-900 tracking-tight">
                  Beverage<span className="text-blue-600">Order</span>
                </span>
                <span className="block text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
                  Ordering System
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                to="/stores"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                  isActive("/stores") || isActive("/")
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Stores</span>
              </Link>

              {/* Customer Routes */}
              {isAuthenticated && (isCustomer || (!isAdmin && !isStaff)) && (
                <>
                  <Link
                    to="/orders"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                      isActive("/orders")
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                    }`}
                  >
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                      isActive("/profile")
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                    }`}
                  >
                    <span>Profile</span>
                  </Link>
                </>
              )}

              {/* Staff Routes */}
              {isStaff && (
                <div className="flex items-center gap-1 pl-2 border-l border-gray-200">
                  <Link
                    to="/staff/store"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                      isActive("/staff/store")
                        ? "bg-amber-50 text-amber-800 font-semibold border border-amber-200/60"
                        : "text-amber-700 hover:bg-amber-50/80"
                    }`}
                  >
                    <span>My Store</span>
                  </Link>
                  <Link
                    to="/staff/products"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                      isActive("/staff/products")
                        ? "bg-amber-50 text-amber-800 font-semibold border border-amber-200/60"
                        : "text-amber-700 hover:bg-amber-50/80"
                    }`}
                  >
                    <span>Products</span>
                  </Link>
                </div>
              )}

              {/* Admin Routes */}
              {isAdmin && (
                <div className="flex items-center gap-1 pl-2 border-l border-gray-200">
                  <Link
                    to="/admin/stores"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                      isActive("/admin/stores")
                        ? "bg-purple-50 text-purple-800 font-semibold border border-purple-200/60"
                        : "text-purple-700 hover:bg-purple-50/80"
                    }`}
                  >
                    <span>Stores</span>
                  </Link>
                  <Link
                    to="/admin/products"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                      isActive("/admin/products")
                        ? "bg-purple-50 text-purple-800 font-semibold border border-purple-200/60"
                        : "text-purple-700 hover:bg-purple-50/80"
                    }`}
                  >
                    <span>Products</span>
                  </Link>
                  <Link
                    to="/admin/dashboard"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                      isActive("/admin/dashboard")
                        ? "bg-purple-50 text-purple-800 font-semibold border border-purple-200/60"
                        : "text-purple-700 hover:bg-purple-50/80"
                    }`}
                  >
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                      isActive("/admin/users")
                        ? "bg-purple-50 text-purple-800 font-semibold border border-purple-200/60"
                        : "text-purple-700 hover:bg-purple-50/80"
                    }`}
                  >
                    <span>Users</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>

          {/* Right: Cart & User Profile Section */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link
              to="/orders"
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              title="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

            {/* Auth Buttons / Profile info */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-semibold text-gray-900 leading-tight">
                    {user.fullName}
                  </span>
                  <span className="text-[11px] text-gray-500 capitalize">{user.role}</span>
                </div>

                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-200">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-200/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-500 space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-800">
            <span>BeverageOrder</span>
          </div>
          <p>© {new Date().getFullYear()} Beverage Ordering System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
