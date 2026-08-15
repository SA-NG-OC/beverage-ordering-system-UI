import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 px-4">
      <div className="text-center max-w-md space-y-4">
        {/* 404 Code */}
        <h1 className="text-8xl font-black text-primary/20 tracking-tighter select-none">404</h1>

        <div className="flex justify-center -mt-6">
          <Badge variant="outline" className="text-xs px-3 py-1 font-semibold">
            Page Not Found
          </Badge>
        </div>

        {/* Headline & Description */}
        <div className="space-y-2 pt-2">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl tracking-tight">
            Page does not exist
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The page you are looking for doesn't exist, has been removed, or the link is invalid.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
