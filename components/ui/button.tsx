import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 rounded-md px-3 text-sm",
  md: "h-10 rounded-md px-4 text-sm",
  lg: "h-11 rounded-md px-5 text-sm",
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
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (asChild) {
    const onlyChild = React.Children.only(children) as React.ReactElement<any>;
    const { disabled: _disabled, ...rest } = props;

    return React.cloneElement(onlyChild, {
      ...rest,
      className: cn(classes, disabled ? "pointer-events-none opacity-50" : "", onlyChild.props.className),
      "aria-disabled": disabled || onlyChild.props["aria-disabled"],
      tabIndex: disabled ? -1 : onlyChild.props.tabIndex,
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
