import { useMemo } from "react"
import { fetchBalance } from "@wagmi/core"
import { Address, useBalance } from "wagmi"

import { balanceToBigNumber, balanceToString } from "./format"
import { useCurrentViewerAddress } from "@/lib/web3/auth"

export const fetchMainBalance = (address: Address) =>
  fetchBalance({
    address,
  }).then(balanceToBigNumber)

export const useMainBalance = (address: Address) => {
  const { data: balance } = useBalance({
    address,
    watch: true,
  })
  return useMemo(() => balanceToBigNumber(balance), [balance])
}

export const useFormatMainBalance = () => {
  const address = useCurrentViewerAddress()
  const balance = useMainBalance(address as `0x${string}`)
  
  return useMemo(() => balanceToString(balance), [balance])
}