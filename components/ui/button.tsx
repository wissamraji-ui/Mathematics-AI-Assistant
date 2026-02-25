import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

const variants: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-muted text-foreground hover:bg-muted/80",
  ghost: "hover:bg-muted",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  asChild = false,
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const disabled = Boolean(props.disabled);
  const classes = cn(
    "inline-flex items-center justify-center rounded-md border border-transparent font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (asChild) {
    const onlyChild = React.Children.only(children) as React.ReactElement<{ className?: string; tabIndex?: number }>;
    const { disabled: _disabled, ...rest } = props;

    return React.cloneElement(onlyChild, {
      ...rest,
      className: cn(classes, disabled ? "pointer-events-none opacity-50" : "", onlyChild.props.className),
      "aria-disabled": disabled || (rest as unknown as { "aria-disabled"?: boolean })["aria-disabled"],
      tabIndex: disabled ? -1 : onlyChild.props.tabIndex,
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
