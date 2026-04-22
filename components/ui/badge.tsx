import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors border",
  {
    variants: {
      variant: {
        default: "border-transparent bg-white/10 text-foreground",
        primary:
          "border-transparent bg-indigo-500/20 text-indigo-200 ring-1 ring-inset ring-indigo-400/30",
        success:
          "border-transparent bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/30",
        warning:
          "border-transparent bg-amber-500/15 text-amber-200 ring-1 ring-inset ring-amber-400/30",
        outline: "text-foreground border-white/15",
        accent:
          "border-transparent bg-violet-500/20 text-violet-200 ring-1 ring-inset ring-violet-400/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
