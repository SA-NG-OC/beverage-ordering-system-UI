import { memo } from "react";
import { Link } from "react-router-dom";
import type { StoreResponseDto } from "@/types/store.type";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/utils/format";

interface StoreCardProps {
  store: StoreResponseDto;
}

export const StoreCard = memo(function StoreCard({ store }: StoreCardProps) {
  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md border-border bg-card">
      <CardContent className="p-5 space-y-4">
        {/* Header: Store Icon, Name & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Store Icon */}
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009 9.35c.692 0 1.345-.233 1.875-.626.53.393 1.183.626 1.875.626.692 0 1.345-.233 1.875-.626a2.993 2.993 0 003.375.626"
                />
              </svg>
            </div>

            <div>
              <Link to={`/stores/${store.id}`}>
                <h3 className="font-semibold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-1">
                  {store.name}
                </h3>
              </Link>
              {/* Rating pill */}
              <div className="flex items-center gap-1 mt-0.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                  <span>Rating: {store.rating ? store.rating.toFixed(1) : "5.0"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Status Pill */}
          <div>
            {store.isOpen ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Open
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Closed
              </span>
            )}
          </div>
        </div>

        {/* Address & Phone details */}
        <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
          <div className="flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <span className="line-clamp-2">{store.address}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-muted-foreground shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
            <span>{store.phone}</span>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-between gap-3">
        <span className="text-[11px] text-muted-foreground">{formatDate(store.createdAt)}</span>
        <Link to={`/stores/${store.id}`}>
          <Button variant="default" size="sm">
            View Menu
          </Button>
        </Link>
      </div>
    </Card>
  );
});

export default StoreCard;
