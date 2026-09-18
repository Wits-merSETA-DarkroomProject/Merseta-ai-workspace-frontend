import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-200 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-navy text-white hover:bg-navy-light shadow-xs active:translate-y-px",
        primary: "bg-navy text-white hover:bg-navy-light shadow-xs active:translate-y-px",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-xs",
        outline:
          "border border-line bg-surface text-ink shadow-2xs hover:bg-surface-muted hover:border-gold/40",
        secondary: "bg-surface border border-line text-ink shadow-2xs hover:bg-surface-muted",
        accent: "bg-gold text-slate-950 hover:bg-gold-light shadow-xs font-bold",
        ghost: "text-muted-text hover:text-ink hover:bg-surface-muted",
        link: "text-gold underline-offset-4 hover:underline p-0 h-auto",
        textAction: "text-gold hover:text-gold-light font-bold p-0 h-auto gap-1.5 transition-all",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6 text-sm sm:text-base",
        icon: "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
