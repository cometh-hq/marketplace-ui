import { useMemo } from "react"
import { BaseProvider } from "@ethersproject/providers"
import { NftSwapV4 } from "@traderxyz/nft-swap-sdk"

import globalConfig from "@/config/globalConfig"

import { useEthersProvider, useEthersSigner } from "@/providers/authentication/viemToEthersHelper"

export const useNFTSwapv4 = () => {
  const provider = useEthersProvider()
  const signer = useEthersSigner()
  
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
