import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export function FormField({
  label,
  required,
  error,
  hint,
  className,
  children,
  id,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label htmlFor={id} className="text-xs font-semibold text-foreground">
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </Label>
          {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
        </div>
      )}
      {children}
      {error && (
        <p className="text-xs font-medium text-destructive animate-in fade-in-50">{error}</p>
      )}
    </div>
  );
}
