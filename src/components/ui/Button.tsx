import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-sm)] transition-all focus-visible:outline-2 focus-visible:outline-navy disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-navy text-navy-fg hover:bg-navy-light active:scale-[0.98]": variant === "primary",
            "bg-surface text-fg border border-border hover:bg-muted active:scale-[0.98]": variant === "secondary",
            "text-fg hover:bg-muted": variant === "ghost",
            "bg-danger text-white hover:opacity-90": variant === "danger",
          },
          {
            "text-sm px-3 py-1.5 h-8": size === "sm",
            "text-sm px-4 py-2 h-10": size === "md",
            "text-base px-6 py-3 h-12": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
