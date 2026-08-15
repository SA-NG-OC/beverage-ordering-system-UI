import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

interface PlaceholderPageProps {
  title: string;
  description: string;
  tag?: string;
}

export function PlaceholderPage({ title, description, tag }: PlaceholderPageProps) {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="border-border bg-card shadow-xs text-center">
        <CardContent className="p-8 sm:p-12 space-y-4">
          {tag && (
            <div className="flex justify-center">
              <Badge variant="outline" className="text-xs uppercase font-semibold tracking-wider">
                {tag}
              </Badge>
            </div>
          )}

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              {description}
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <Link to="/">
              <Button variant="outline" size="sm">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
