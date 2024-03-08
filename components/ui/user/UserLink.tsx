"use client"

import { ComponentProps, useMemo } from "react"
import { User } from "lucide-react"

import { AnyUser } from "@/types/user"
import { cn } from "@/lib/utils/utils"

import { Button } from "../Button"
import { Link } from "../Link"
import { useContent } from "./hooks/useContent"

export type UserLinkProps = {
  user: AnyUser
  className?: string
  hideIcon?: boolean
  forceDisplayAddress?: boolean
}

export const UserLink = ({
  user,
  className,
  hideIcon,
  forceDisplayAddress = false,
  ...rest
}: UserLinkProps) => {
  const content = useContent(user, forceDisplayAddress)

  const userProfileHref = useMemo(() => {
    return `/profile/${user.address}`
  }, [user])

  return (
    <Link
      {...rest}
      href={userProfileHref}
      className={cn("flex items-center font-semibold", className)}
    >
      {!hideIcon && <User className="mr-2 size-4" />} {content}
    </Link>
  )
}
