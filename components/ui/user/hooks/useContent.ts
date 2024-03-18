"use client"

import { useMemo } from "react"
import { isAddressEqual } from "viem"
import { useAccount } from "wagmi"

import { AnyUser } from "@/types/user"
import { shortenAddress } from "@/lib/utils/addresses"
import { isKnownUser } from "@/lib/utils/user"

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
