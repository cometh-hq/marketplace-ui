"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cx } from "class-variance-authority"
import { X } from "lucide-react"

import { env } from "@/config/env"
import { siteConfig } from "@/config/site"

import { ConnectButton } from "./connect-button"
import { MainNav } from "./main-nav"
import { useMediaQuery } from "usehooks-ts"

export function SiteHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

console.log(isDesktop)
  const toggleMenu = () => setIsOpen(!isOpen)

  if (pathname === "/wallets") {
    return null
  }

  return (
    <div className="container mx-auto py-5 sm:py-10">
      <header className="relative flex items-center justify-between gap-x-5 md:gap-x-10">
        <div
          onClick={() => !isOpen && setIsOpen(true)}
          className={cx("w-[20px] cursor-pointer md:hidden", {
            block: isOpen,
          })}
        >
          <span
            className={cx(
              "my-[5px] block h-[2px] w-5 rounded-sm",
              isOpen ? "bg-white" : "bg-white"
            )}
          ></span>
          <span
            className={cx(
              "my-[5px] block h-[2px] w-5 rounded-sm",
              isOpen ? "bg-white" : "bg-white"
            )}
          ></span>
          <div
            className={cx(
              "bottom-0 left-0 right-0 top-0 z-50 h-full w-full overflow-hidden bg-background p-5 text-white",
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

        <div className="max-md:hidden">
          <MainNav
            items={siteConfig.mainNav}
            onLinkClick={() => setIsOpen(false)}
          />
        </div>

        <Link
          href="/marketplace"
          className={cx(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-2 text-2xl hover:transform hover:scale-105 transition-transform duration-300 ease-in-out",
            isOpen && "text-primary-foreground"
          )}
        >
          <Image
            src={`${env.NEXT_PUBLIC_BASE_PATH}/cosmik-logo.png`}
            alt=""
            width={isDesktop ? 120 : 100}
            height={isDesktop ? 56 : 40}
          />
        </Link>

        <div className="">
          <ConnectButton />
        </div>
      </header>
    </div>
  )
}
