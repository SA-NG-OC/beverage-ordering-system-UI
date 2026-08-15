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
    <div className="min-h-screen bg-muted/20 flex flex-col justify-between font-sans">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs group-hover:opacity-90 transition-opacity">
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
                    d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                  />
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold text-foreground tracking-tight">
                  Beverage<span className="text-primary">Order</span>
                </span>
                <span className="block text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  Ordering System
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                to="/stores"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive("/stores") || isActive("/")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Stores
              </Link>
              <Link
                to="/products"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive("/products") && !isActive("/admin") && !isActive("/staff")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Products
              </Link>

              {/* Customer Routes */}
              {isAuthenticated && (isCustomer || (!isAdmin && !isStaff)) && (
                <>
                  <Link
                    to="/orders"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive("/orders")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive("/profile")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}

              {/* Staff Routes */}
              {isStaff && (
                <div className="flex items-center gap-1 pl-2 border-l border-border">
                  <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded mr-1">
                    Staff
                  </span>
                  <Link
                    to="/staff/store"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive("/staff/store")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    My Store
                  </Link>
                  <Link
                    to="/staff/products"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive("/staff/products")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Manage Products
                  </Link>
                </div>
              )}

              {/* Admin Routes */}
              {isAdmin && (
                <div className="flex items-center gap-1 pl-2 border-l border-border">
                  <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded mr-1">
                    Admin
                  </span>
                  <Link
                    to="/admin/stores"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive("/admin/stores")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Stores
                  </Link>
                  <Link
                    to="/admin/products"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive("/admin/products")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Products
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive("/admin/users")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive("/admin/dashboard")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Dashboard
                  </Link>
                </div>
              )}
            </nav>
          </div>

          {/* Right: User Profile & Auth Section */}
          <div className="flex items-center gap-3">
            <Link
              to="/orders"
              className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              title="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"
                />
              </svg>
            </Link>

            <div className="h-5 w-px bg-border hidden sm:block" />

            {/* Auth Buttons / Profile info */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-foreground leading-tight">
                    {user.fullName}
                  </span>
                  <span className="text-[10px] text-muted-foreground capitalize">{user.role}</span>
                </div>

                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs border border-primary/20">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-destructive hover:bg-destructive/10 text-xs h-8 px-2.5"
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
                  <Button variant="default" size="sm">
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
      <footer className="bg-background border-t border-border py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-muted-foreground space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-foreground">
            <span>BeverageOrder</span>
          </div>
          <p>© {new Date().getFullYear()} Beverage Ordering System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
