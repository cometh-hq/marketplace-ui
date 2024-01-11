import { useMemo } from "react"
import { manifest } from "@/manifests"
import { BaseProvider } from "@ethersproject/providers"
import { NftSwapV4 } from "@traderxyz/nft-swap-sdk"

import { env } from "@/config/env"
import globalConfig from "@/config/globalConfig"

import { useSigner, useWalletProvider } from "./auth"

export const useNFTSwapv4 = () => {
  const provider = useWalletProvider()
  const signer = useSigner()

  console.warn('HEREEEEE')
  console.warn(globalConfig.network.chainId)
  console.warn(globalConfig.network.zeroExExchange)

  return useMemo(() => {
    if (!provider || !signer) return null
    return new NftSwapV4(
      provider as unknown as BaseProvider,
      signer,
      globalConfig.network.chainId,
      {
        zeroExExchangeProxyContractAddress: globalConfig.network.zeroExExchange,
      }
    )
  }, [provider, signer])
}
