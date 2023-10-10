import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-bold transition-all duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none ring-offset-background whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        muted: "bg-muted/80 text-muted-foreground hover:bg-muted",
        link: "underline-offset-4 hover:underline text-primary",
        linkDestructive: "underline-offset-4 hover:underline text-destructive",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-10 px-3 font-medium",
        lg: "h-12 px-8",
        icon: "h-[36px] w-[36px] active:scale-95",
      },
      groupPosition: {
        isolated: "rounded-lg",
        first: "rounded-l-md",
        last: "rounded-r-md",
        middle: "rounded-none border-x-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      groupPosition: "isolated",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, groupPosition, variant, size, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className, groupPosition })
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
