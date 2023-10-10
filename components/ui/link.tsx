import { ComponentProps } from "react"
import NextLink from "next/link"

import { cn } from "@/lib/utils/utils"

export const Link = ({
  className,
  ...props
}: ComponentProps<typeof NextLink>) => (
  <NextLink
    className={cn(
      "inline text-base text-foreground/60 hover:text-secondary-foreground font-medium",
      className
    )}
    {...props}
  />
)
