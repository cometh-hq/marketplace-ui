import { memo, useMemo } from "react"

import { AnyUser } from "@/types/user"
import { isKnownUser } from "@/lib/utils/user"

import { Avatar, AvatarFallback } from "./avatar"

export type UserAvatarProps = {
  user: AnyUser
}

export const UserAvatar = memo(function UserAvatar({ user }: UserAvatarProps) {
  const content = useMemo(() => {
    if (isKnownUser(user) && user.username) {
      return user.username.charAt(0)
    }
    return "0x"
  }, [user])

  return (
    <Avatar>
      {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
      <AvatarFallback>{content}</AvatarFallback>
    </Avatar>
  )
})
