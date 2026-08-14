import { Link } from "react-router-dom";
import type { StoreResponseDto } from "@/types/store.type";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface StoreCardProps {
  store: StoreResponseDto;
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between gap-4 group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform shrink-0">
              🏪
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                {store.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mt-0.5">
                <span>⭐ {store.rating ? store.rating.toFixed(1) : "5.0"}</span>
              </div>
            </div>
          </div>
          <div>
            {store.isOpen ? (
              <Badge variant="success">Open</Badge>
            ) : (
              <Badge variant="danger">Closed</Badge>
            )}
          </div>
        </div>

        <div className="space-y-2 mt-4 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <span className="shrink-0 text-gray-400">📍</span>
            <span className="line-clamp-2">{store.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-gray-400">📞</span>
            <span>{store.phone}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <span className="text-[11px] text-gray-400">
          Created: {new Date(store.createdAt).toLocaleDateString("vi-VN")}
        </span>
        <Link to={`/stores/${store.id}`}>
          <Button variant="primary" size="sm">
            View Menu & Details →
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default StoreCard;
