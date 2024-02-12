"use client"

import { useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"

import { siteConfig } from "@/config/site"
import { env } from "@/config/env"
import { cx } from "class-variance-authority"

import { ConnectButton } from "./connect-button"
import { MainNav } from "./main-nav"

import Image from "next/image"
import { usePathname } from 'next/navigation'

export function SiteHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  if (pathname === "/wallets") {
    return null
  }

  return (
    <div className="container mx-auto py-5 sm:py-10">
      <header className="flex items-center gap-x-10 md:justify-between">
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

        <div className="max-md:hidden">
          <MainNav
            items={siteConfig.mainNav}
            onLinkClick={() => setIsOpen(false)}
          />
        </div>

        <Link
          href="/marketplace"
          className={cx(
            "flex items-center space-x-2 text-2xl hover:transform hover:scale-105 transition-transform duration-300 ease-in-out",
            isOpen && "text-primary-foreground"
          )}
        >
          <Image
            src={`${env.NEXT_PUBLIC_BASE_PATH}/cosmik-logo.png`}
            alt=""
            width={140}
            height={56}
          />
        </Link>

        <div className="">
          <ConnectButton />
        </div>
      </header>
    </div>
  )
}
