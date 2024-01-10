import { useMemo } from "react"
import { manifest } from "@/manifests"
import { BaseProvider } from "@ethersproject/providers"
import { NftSwapV4 } from "@traderxyz/nft-swap-sdk"

import { env } from "@/config/env"

import { useSigner, useWalletProvider } from "./auth"
import globalConfig from "@/config/globalConfig"

export const useNFTSwapv4 = () => {
  const provider = useWalletProvider()
  const signer = useSigner()

  return useMemo(() => {
    if (!provider || !signer) return null
    return new NftSwapV4(
      provider as unknown as BaseProvider,
      signer,
      globalConfig.network.chainId,
      {
        zeroExExchangeProxyContractAddress:
          env.NEXT_PUBLIC_ZERO_EX_CONTRACT_ADDRESS,
      }
    )
  }, [provider, signer])
}
