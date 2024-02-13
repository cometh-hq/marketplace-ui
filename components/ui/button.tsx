import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader } from "lucide-react"

import { cn } from "@/lib/utils/utils"

const buttonVariants = cva(
  "overflow-hidden relative shrink-0 inline-flex items-center justify-center whitespace-nowrap font-semibold focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        neutral: "",
        default: "btn-default",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        secondary:
          "btn-default bg-primary/60 before:bg-primary/20 hover:bg-primary/40 after:content-none text-accent",
        third:
          "btn-default bg-third-foreground before:bg-third hover:bg-third-foreground/80 after:content-none text-accent hover:text-white",
        ghost:
          "hover:btn-default hover:bg-primary/[.5] hover:before:bg-transparent hover:text-current",
        muted: "bg-muted/80 text-muted-foreground hover:bg-muted",
        link: "underline-offset-4 hover:underline text-white",
        linkDestructive: "underline-offset-4 hover:underline text-destructive",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-10 px-3 font-medium",
        lg: "h-12 px-8",
        icon: "h-10 w-10 active:scale-95",
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
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      groupPosition,
      variant,
      size,
      asChild = false,
      isLoading,
      ...props
    },
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
      >
        <>
          {isLoading && <Loader size={16} className="mr-1.5 animate-spin" />}
          {props.children}
        </>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
