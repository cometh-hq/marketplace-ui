"use client"

import { ComponentProps, memo, useMemo } from "react"
import { User } from "lucide-react"
import { isAddressEqual } from "viem"
import { useAccount } from "wagmi"

import { AnyUser } from "@/types/user"
import { shortenAddress } from "@/lib/utils/addresses"
import { isKnownUser } from "@/lib/utils/user"
import { cn } from "@/lib/utils/utils"

import { Button } from "./Button"
import { Link } from "./Link"

export type UserButtonProps = {
  user: AnyUser
  icon?: (props: AnyUser) => React.ReactNode | null
  forceDisplayAddress?: boolean
} & ComponentProps<typeof Button>

export const useContent = (
  user: AnyUser,
  forceDisplayAddress: Boolean | undefined
) => {
  const account = useAccount()
  const viewerAddress = account.address

  return useMemo(() => {
    if (!forceDisplayAddress) {
      if (viewerAddress && isAddressEqual(user.address as any, viewerAddress)) {
        return "You"
      }
    }

    if (isKnownUser(user) && user.username) {
      return user.username
    }
    return shortenAddress(user.address, 4)
  }, [forceDisplayAddress, user, viewerAddress])
}

export const UserLink = memo(function UserLink({
  user,
  className,
  hideIcon,
  forceDisplayAddress = false,
  ...rest
}: Omit<UserButtonProps, "icon"> &
  Omit<ComponentProps<typeof Link>, "href"> & {
    hideIcon?: boolean
    forceDisplayAddress?: boolean
  }) {
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
})

export const UserButton = function UserButton({
  user,
  variant,
  icon = () => <User className="mr-2 size-4" />,
  forceDisplayAddress = false,
  ...props
}: UserButtonProps) {
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
