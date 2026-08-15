import { memo } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  itemName?: string;
  isLoading?: boolean;
  onPageChange: (newPage: number) => void;
  className?: string;
}

export const Pagination = memo(function Pagination({
  page,
  totalPages,
  totalItems,
  itemName = "items",
  isLoading = false,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-card/50 text-xs text-muted-foreground",
        className
      )}
    >
      <div>
        Page <strong className="font-semibold text-foreground">{page}</strong> of{" "}
        <strong className="font-semibold text-foreground">{totalPages}</strong>
        {totalItems !== undefined && (
          <span>
            {" "}
            ({totalItems} {itemName})
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <div className="flex items-center gap-1 px-1">
          <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-primary/10 px-2 text-xs font-semibold text-primary">
            {page}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
});

export default Pagination;
