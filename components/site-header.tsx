"use client"

import { cx } from "class-variance-authority"
import { useState } from "react"
import { siteConfig } from "@/config/site"
import { MainNav } from "./main-nav"
import Link from "next/link"
import { Icons } from "@/components/icons"
import { ConnectButton } from "./connect-button"
import { X } from "lucide-react"

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="container mx-auto py-5 sm:py-10">
      <header className="flex items-center md:justify-between gap-x-5">
        <div
          onClick={() => !isOpen && setIsOpen(true)}
          className={cx('w-[20px] cursor-pointer md:hidden', {
            "block": isOpen,
          })}
        >
          <span className={cx("rounded-sm h-[2px] w-5 block my-[5px]", isOpen ? "bg-white" : "bg-black")}></span>
          <span className={cx("rounded-sm h-[2px] w-5 block my-[5px]", isOpen ? "bg-white" : "bg-black")}></span>
          <div
            className={cx(
              'bg-primary text-primary-foreground top-0 right-0 bottom-0 left-0 h-full w-full z-50 overflow-hidden p-5',
              isOpen ? 'fixed' : 'hidden',
            )}
          >
            <div className="flex flex-col h-full">
              <div
                onClick={toggleMenu}
                className="md:hidden w-[20px] mr-5 mt-2 cursor-pointer"
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
            
        <Link href="/" className={cx("flex items-center space-x-2 z-[100]", isOpen && "text-primary-foreground")}>
          <Icons.logo className="text-current h-10 w-10" />
          <span className="text-base font-bold md:inline mr-10 opacity-90">{siteConfig.name}</span>
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
