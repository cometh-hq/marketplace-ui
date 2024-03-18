"use client"

import { ComponentProps, useMemo } from "react"
import { User } from "lucide-react"

import { AnyUser } from "@/types/user"

import { Button } from "../Button"
import { Link } from "../Link"
import { useContent } from "./hooks/useContent"

export type UserButtonProps = {
  user: AnyUser
  icon?: (props: AnyUser) => React.ReactNode | null
  forceDisplayAddress?: boolean
} & ComponentProps<typeof Button>

export const UserButton = ({
  user,
  variant,
  icon = () => <User className="mr-2 size-4" />,
  forceDisplayAddress = false,
  ...props
}: UserButtonProps) => {
  const content = useContent(user, forceDisplayAddress)

  const userProfileHref = useMemo(() => {
    return `/profile/${user.address}`
  }, [user])

  return (
    <Link href={userProfileHref}>
      <Button variant={variant ?? "ghost"} className="font-medium" {...props}>
        {icon(user)} {content}
      </Button>
    </Link>
  )
}
