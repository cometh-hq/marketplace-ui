import { useEffect, useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { fetchBalance } from "@wagmi/core"
import { Address } from "viem"
import { useBalance, useBlockNumber } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { useCurrentViewerAddress } from "@/lib/web3/auth"

import { balanceToBigNumber, balanceToString } from "./format"

export const useMainBalance = (address: Address) => {
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const { data: balance, queryKey } = useBalance({
    chainId: globalConfig.network.chainId,
    address,
  })
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey })
  }, [blockNumber, queryClient, queryKey])

  return useMemo(() => balanceToBigNumber(balance?.value), [balance])
}

export const useFormatMainBalance = () => {
  const address = useCurrentViewerAddress()
  const balance = useMainBalance(address as `0x${string}`)

  return useMemo(() => balanceToString(balance), [balance])
}
