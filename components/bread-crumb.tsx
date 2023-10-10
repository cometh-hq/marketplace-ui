import { ComponentProps, forwardRef } from "react"

import { Link } from "./ui/link"

export const BreadcrumbContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className="flex items-center gap-2 text-sm text-gray-500"
      {...props}
    >
      {children}
    </div>
  )
})

BreadcrumbContainer.displayName = "BreadcrumbContainer"

export const BreadcrumbElement = forwardRef<
  HTMLAnchorElement,
  ComponentProps<typeof Link>
>(({ children, ...props }, ref) => {
  return (
    <Link ref={ref} {...props}>
      {children}
    </Link>
  )
})

BreadcrumbElement.displayName = "BreadcrumbElement"
