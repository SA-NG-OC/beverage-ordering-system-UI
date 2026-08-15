import { Link, Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-muted/40 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header section with branding */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between py-4 px-2">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
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
      </header>

      {/* Main content container */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer section */}
      <footer className="w-full max-w-7xl mx-auto text-center py-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Beverage Ordering System. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default AuthLayout
