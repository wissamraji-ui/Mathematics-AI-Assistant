import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary";

const variants: Record<BadgeVariant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
};

export function Badge({
  className,
  variant = "secondary",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium shadow-sm",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

