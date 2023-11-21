"use client"

import * as React from "react"
import Link from "next/link"

import { NavItem } from "@/types/nav"
import { usePathname } from "@/lib/utils/router"
import { cn } from "@/lib/utils/utils"

interface MainNavProps {
  items?: NavItem[]
  onLinkClick?: () => void
}

export function MainNav({ items, onLinkClick }: MainNavProps) {
  const pathname = usePathname()

  const isActiveLink = (href: string) => {
    if (pathname === href) return true

    const nextChar = pathname[href.length]
    return (
      pathname.startsWith(href) && (nextChar === "/" || nextChar === undefined)
    )
  }

  return (
    <>
      {items?.length ? (
        <nav className="
        flex flex-col gap-6 max-md:mt-12 max-md:flex-1 max-md:overflow-y-auto md:flex-row">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={
                    cn(`font-bold opacity-50 max-md:text-2xl ${isActiveLink(item.href) && 'opacity-100 max-md:text-primary-foreground'}`)
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