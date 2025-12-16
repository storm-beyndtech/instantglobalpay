import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Marketing Primary (Green gradient with glow)
        primary:
          "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow-green hover:shadow-glow-green hover:from-primary-600 hover:to-primary-700 active:scale-[0.98]",

        // Dashboard Primary (Purple gradient)
        "primary-purple":
          "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-ambient-purple hover:from-accent-600 hover:to-accent-700 active:scale-[0.98]",

        // Outline variant
        outline:
          "border-2 border-input bg-background hover:bg-accent/10 hover:border-accent active:scale-[0.98]",

        // Subtle variant (Dashboard)
        subtle:
          "bg-accent/10 text-accent-foreground hover:bg-accent/15 border border-accent/20 active:scale-[0.98]",

        // Ghost variant
        ghost:
          "hover:bg-accent/10 hover:text-accent-foreground active:scale-[0.98]",

        // Glass variant (Apple-style translucent)
        glass:
          "bg-glass border-glass shadow-glass backdrop-blur-xl hover:bg-glass-hover hover:border-glass-strong active:scale-[0.98]",

        // Gradient variant (Custom gradients)
        gradient:
          "bg-gradient-to-r from-accent-500 via-primary-500 to-accent-600 text-white shadow-depth-md hover:shadow-depth-lg active:scale-[0.98]",

        // Destructive
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]",

        // Link
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
