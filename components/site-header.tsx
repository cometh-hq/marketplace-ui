"use client"

import { useState } from "react"
import Link from "next/link"
import { useGetCollection } from "@/services/cometh-marketplace/collection"
import { cx } from "class-variance-authority"
import { X } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

import { ConnectButton } from "./connect-button"
import { MainNav } from "./main-nav"

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false)


  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="container mx-auto py-5 sm:py-10">
      <header className="flex items-center gap-x-5 md:justify-between">
        <div
          onClick={() => !isOpen && setIsOpen(true)}
          className={cx("w-[20px] cursor-pointer md:hidden", {
            block: isOpen,
          })}
        >
          <span
            className={cx(
              "my-[5px] block h-[2px] w-5 rounded-sm",
              isOpen ? "bg-white" : "bg-black"
            )}
          ></span>
          <span
            className={cx(
              "my-[5px] block h-[2px] w-5 rounded-sm",
              isOpen ? "bg-white" : "bg-black"
            )}
          ></span>
          <div
            className={cx(
              "bottom-0 left-0 right-0 top-0 z-50 h-full w-full overflow-hidden bg-primary p-5 text-primary-foreground",
              isOpen ? "fixed" : "hidden"
            )}
          >
            <div className="flex h-full flex-col">
              <div
                onClick={toggleMenu}
                className="mr-5 mt-2 w-[20px] cursor-pointer md:hidden"
              >
                <X className="" />
              </div>
              <MainNav
                items={siteConfig.mainNav}
                onLinkClick={() => setIsOpen(false)}
              />
            </div>
          </div>
        </div>

        <Link
          href="/marketplace"
          className={cx(
            "flex items-center space-x-2 text-2xl",
            isOpen && "text-primary-foreground"
          )}
        >
          <Icons.logo className="size-6 text-current" />
          <span className="mr-10 text-base font-bold opacity-90 md:inline md:text-lg">
            {siteConfig.name}
          </span>
        </Link>

        <div className="max-md:hidden">
          <MainNav
            items={siteConfig.mainNav}
            onLinkClick={() => setIsOpen(false)}
          />
        </div>

        <div className="ml-auto">
          <ConnectButton />
        </div>
      </header>
    </div>
  )
}
