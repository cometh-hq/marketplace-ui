import * as React from "react"
import Link from "next/link"

import { NavItem } from "@/types/nav"
import { cn } from "@/lib/utils/utils"

import { usePathname } from "next/navigation"

interface MainNavProps {
  items?: NavItem[]
  onLinkClick?: () => void
}

export function MainNav({ items, onLinkClick }: MainNavProps) {
  const pathname = usePathname()

  const isActiveLink = (href: string) => {
    if (pathname === href) return true;
  
    const nextChar = pathname[href.length];
    return pathname.startsWith(href) && (nextChar === '/' || nextChar === undefined);
  }

  return (
    <>
      {items?.length ? (
        <nav className="flex flex-col md:flex-row gap-6 max-md:mt-12 max-md:flex-1 max-md:overflow-y-auto">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={
                    cn(`max-md:text-2xl opacity-50 font-bold ${isActiveLink(item.href) && 'max-md:text-primary-foreground opacity-100'}`)
                  }
                  onClick={onLinkClick}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </>
  )
}