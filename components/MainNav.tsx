"use client"

import * as React from "react"
import Link from "next/link"
import { useGetCollection } from "@/services/cometh-marketplace/collectionService"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { usePathname } from "@/lib/utils/router"
import { cn } from "@/lib/utils/utils"

interface MainNavProps {
  items?: {
    title: string
    href?: string
    disabled?: boolean
    external?: boolean
  }[]
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

  function CollectionLink({
    collectionAddress,
  }: {
    collectionAddress: Address
  }) {
    const { data: collection } = useGetCollection(collectionAddress)
    const href = `/nfts/${collectionAddress.toLowerCase()}`
    if (!collection) {
      return <></>
    }
    return (
      <Link
        href={href}
        className={cn(
          `text-lg font-bold opacity-75 ${
            isActiveLink(href) &&
            "max-md:text-primary-foreground underline underline-offset-2 opacity-100"
          }`
        )}
        onClick={onLinkClick}
      >
        {collection.name}
      </Link>
    )
  }

  return (
    <>
      {
        <nav className="flex flex-col gap-6 max-md:mt-12 max-md:flex-1 max-md:overflow-y-auto md:flex-row">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    `text-lg font-bold opacity-75 ${
                      isActiveLink(item.href) &&
                      "max-md:text-primary-foreground opacity-100"
                    }`
                  )}
                  onClick={onLinkClick}
                >
                  {item.title}
                </Link>
              )
          )}
          {globalConfig.contractAddresses.map((collectionAddress) => (
            <CollectionLink
              key={collectionAddress}
              collectionAddress={collectionAddress as Address}
            />
          ))}
        </nav>
      }
    </>
  )
}
