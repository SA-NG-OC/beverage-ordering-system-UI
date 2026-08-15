import { memo, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  children?: ReactNode;
  className?: string;
}

export const SearchToolbar = memo(function SearchToolbar({
  search,
  onSearchChange,
  placeholder = "Search...",
  children,
  className,
}: SearchToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3 rounded-xl border border-border bg-card shadow-xs",
        className
      )}
    >
      <div className="relative flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <Input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9 h-9 text-xs sm:text-sm bg-background"
        />
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
});

export default SearchToolbar;
