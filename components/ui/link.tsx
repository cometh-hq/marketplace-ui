import { ComponentProps } from "react"
import NextLink from "next/link"

import { cn } from "@/lib/utils/utils"

export const Link = ({
  className,
  ...props
}: ComponentProps<typeof NextLink>) => (
  <NextLink
    className={cn(
      "text-foreground/60 hover:text-secondary-foreground inline text-base font-medium",
      className
    )}
    {...props}
  />
)
