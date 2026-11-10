import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-200",
        secondary:
          "border-zinc-800 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700",
        destructive:
          "border-transparent bg-red-950/80 text-red-300 border border-red-800/50 hover:bg-red-900",
        outline: "border-zinc-800 text-zinc-300 hover:border-zinc-700",
        success:
          "border-emerald-800/60 bg-emerald-950/50 text-emerald-300",
        warning:
          "border-amber-800/60 bg-amber-950/50 text-amber-300",
        info:
          "border-sky-800/60 bg-sky-950/50 text-sky-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
