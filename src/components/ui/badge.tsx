import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-colors select-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-navy text-white",
        secondary: "bg-surface-muted text-ink border border-line",
        outline: "border border-line text-ink bg-surface",
        destructive: "bg-red-500/10 text-red-400 border border-red-500/20",
        verified: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
        emerging: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
        observed: "bg-navy/20 text-blue-300 border border-navy/30",
        inferred: "bg-gold/15 text-gold border border-gold/35",
        uncertain: "bg-surface-muted text-muted-text border border-line",
        gold: "bg-gold/20 text-gold border border-gold/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
