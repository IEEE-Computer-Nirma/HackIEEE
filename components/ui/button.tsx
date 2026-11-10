import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-200 active:bg-zinc-300",
        destructive:
          "bg-red-600 text-zinc-50 shadow-sm hover:bg-red-700 active:bg-red-800",
        outline:
          "border border-zinc-800 bg-zinc-950/50 text-zinc-200 shadow-sm hover:bg-zinc-900 hover:text-zinc-50 hover:border-zinc-700 active:bg-zinc-800",
        secondary:
          "bg-zinc-800 text-zinc-100 shadow-sm hover:bg-zinc-700 active:bg-zinc-600",
        ghost:
          "text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 active:bg-zinc-800",
        link: "text-zinc-100 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
