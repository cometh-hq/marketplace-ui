import { useMemo } from "react"
import { manifest } from "@/manifests"
import { fetchBalance } from "@wagmi/core"
import { Address, useBalance } from "wagmi"

import { useCurrentViewerAddress } from "@/lib/web3/auth"

import { balanceToBigNumber, balanceToString } from "./format"
import globalConfig from "@/config/globalConfig"

export const fetchWrappedBalance = async (
  address: Address,
  wrappedAddress: Address
) =>
  fetchBalance({
    address,
    token: wrappedAddress,
  }).then(balanceToBigNumber)

export const useWrappedBalance = (address: Address) => {
  const { data: balance } = useBalance({
    chainId: globalConfig.network.chainId,
    address,
    token: globalConfig.network.wrappedNativeToken.address,
    watch: true,
  })

  return useMemo(() => balanceToBigNumber(balance), [balance])
}

export const useFormatWrappedBalance = () => {
  const address = useCurrentViewerAddress()
  const balance = useWrappedBalance(address as `0x${string}`)

  return useMemo(() => balanceToString(balance), [balance])
}
