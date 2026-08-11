import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header section with branding */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between py-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-blue-500/20">
            ☕
          </div>
          <div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">
              Beverage<span className="text-blue-600">Order</span>
            </span>
            <span className="block text-xs text-gray-500 font-medium">Ordering System</span>
          </div>
        </div>
      </header>

      {/* Main content container where child auth routes (login, register) are rendered */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md relative">
          {/* Subtle background glow effect */}
          <div className="absolute -inset-1 rounded-3xl blur-xl opacity-50 pointer-events-none" />
          <div className="relative">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer section */}
      <footer className="w-full max-w-7xl mx-auto text-center py-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Beverage Ordering System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AuthLayout;
