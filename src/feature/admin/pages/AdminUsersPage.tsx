import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchToolbar } from "@/components/SearchToolbar";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/format";

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
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="default" className="text-[10px] uppercase font-bold tracking-wider">
            Admin
          </Badge>
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">User Management</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          View customer and staff accounts, filter by role and lock status.
        </p>
      </div>

      {/* 2. Filters & Toolbar */}
      <SearchToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by name or email..."
      >
        {/* Lọc theo Vai trò (Role) */}
        <select
          value={role || ""}
          onChange={(e) => setRole(e.target.value || undefined)}
          className="h-9 px-3 border border-border rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
          className="h-9 px-3 border border-border rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Statuses</option>
          <option value="false">Active Only</option>
          <option value="true">Locked Only</option>
        </select>
      </SearchToolbar>

      {/* 3. Lỗi từ Server */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {/* 4. Bảng danh sách Người dùng */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs font-semibold">User</TableHead>
              <TableHead className="text-xs font-semibold">Role</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Created At</TableHead>
              <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-36 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-7 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <EmptyState
                    title="No users found"
                    description="No user accounts match your search query or filter selection."
                    className="border-0 bg-transparent p-4"
                  />
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => {
                const isAdminAccount = u.role === "admin";
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="font-semibold text-foreground text-xs sm:text-sm">
                        {u.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(u.role)}>
                        <span className="capitalize">{u.role}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {u.isBanned ? (
                        <Badge variant="danger">Locked</Badge>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {isAdminAccount ? (
                        <span
                          className="text-[11px] text-muted-foreground font-medium italic"
                          title="Admin accounts cannot be locked"
                        >
                          Protected Admin
                        </span>
                      ) : (
                        <Button
                          variant={u.isBanned ? "default" : "outline"}
                          size="xs"
                          onClick={() => handleLockUnlock(u.id, u.isBanned)}
                        >
                          {u.isBanned ? "Unlock" : "Lock"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* 5. Phân trang (Pagination) */}
        {meta && (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
            itemName="users"
            isLoading={isLoading}
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  );
}

export default AdminUsersPage;
