import { Link } from "react-router-dom";
import type { StoreResponseDto } from "@/types/store.type";
import { Button } from "@/components/ui/Button";

interface StoreCardProps {
  store: StoreResponseDto;
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top subtle accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 sm:p-6 space-y-4">
        {/* Header: Store Icon, Name & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {/* Store Icon Avatar */}
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/80 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
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
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                {store.name}
              </h3>
              {/* Rating badge */}
              <div className="flex items-center gap-1 mt-1">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-semibold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-amber-500 fill-amber-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>{store.rating ? store.rating.toFixed(1) : "5.0"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Pill */}
          <div>
            {store.isOpen ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Open
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Closed
              </span>
            )}
          </div>
        </div>

        {/* Address & Phone details */}
        <div className="space-y-2 text-xs sm:text-sm text-gray-600 pt-1">
          <div className="flex items-start gap-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-400 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-2 text-gray-600">{store.address}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="text-gray-600 font-medium">{store.phone}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 sm:p-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium text-gray-400">
          Added {new Date(store.createdAt).toLocaleDateString("vi-VN")}
        </span>
        <Link to={`/stores/${store.id}`}>
          <Button variant="primary" size="sm" className="shadow-xs group/btn">
            <span>View Menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default StoreCard;
