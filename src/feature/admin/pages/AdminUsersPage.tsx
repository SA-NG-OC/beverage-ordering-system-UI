import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function AdminUsersPage() {
    const {
        users,
        meta,
        isLoading,
        error,
        search,
        setSearch,
        role,
        setRole,
        isBanned,
        setIsBanned,
        page,
        setPage,
        handleLockUnlock,
    } = useAdminUsers(10);

    const getRoleBadgeVariant = (userRole: string) => {
        switch (userRole) {
            case "admin":
                return "info";
            case "staff":
                return "warning";
            case "customer":
            default:
                return "neutral";
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* 1. Header & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-500">
                        View customer and staff accounts, filter by role and lock status.
                    </p>
                </div>
            </div>

            {/* 2. Filters & Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
                {/* Tìm kiếm free-text (Email/Họ tên) */}
                <div className="relative flex-1 w-full">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm"
                    />
                </div>

                {/* Lọc theo Vai trò (Role) */}
                <select
                    value={role || ""}
                    onChange={(e) => setRole(e.target.value || undefined)}
                    className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                    <option value="">All Roles</option>
                    <option value="customer">Customer</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                </select>

                {/* Lọc theo Trạng thái (Active / Locked) */}
                <select
                    value={isBanned === undefined ? "" : isBanned ? "true" : "false"}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") setIsBanned(undefined);
                        else setIsBanned(val === "true");
                    }}
                    className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                    <option value="">All Statuses</option>
                    <option value="false">Active Only</option>
                    <option value="true">Locked Only</option>
                </select>
            </div>

            {/* 3. Lỗi từ Server (nếu có) */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                    {error}
                </div>
            )}

            {/* 4. Bảng danh sách Người dùng */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-semibold text-gray-500">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Created At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-x divide-gray-100">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-48 mb-1" />
                                            <div className="h-3 bg-gray-100 rounded w-32" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-5 bg-gray-200 rounded-full w-16" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-5 bg-gray-200 rounded-full w-16" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-24" />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="h-8 bg-gray-200 rounded w-20 ml-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No users found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => {
                                    const isAdminAccount = u.role === "admin";
                                    return (
                                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{u.fullName}</div>
                                                <div className="text-xs text-gray-500">{u.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getRoleBadgeVariant(u.role)}>
                                                    <span className="capitalize">{u.role}</span>
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.isBanned ? (
                                                    <Badge variant="danger">Locked</Badge>
                                                ) : (
                                                    <Badge variant="success">Active</Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {isAdminAccount ? (
                                                    <span className="text-xs text-gray-400 font-medium italic" title="Admin accounts cannot be locked">
                                                        Protected Admin
                                                    </span>
                                                ) : (
                                                    <Button
                                                        variant={u.isBanned ? "primary" : "secondary"}
                                                        size="sm"
                                                        onClick={() => handleLockUnlock(u.id, u.isBanned)}
                                                    >
                                                        {u.isBanned ? "Unlock" : "Lock"}
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 5. Phân trang (Pagination) */}
                {meta && meta.totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            Showing page {meta.page} of {meta.totalPages} ({meta.totalItems} users)
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={page >= meta.totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUsersPage;