import { useMemo } from "react"
import {
  useEthersProvider,
  useEthersSigner,
} from "@/providers/authentication/viemToEthersHelper"
import { BaseProvider } from "@ethersproject/providers"
import { NftSwapV4 } from "@traderxyz/nft-swap-sdk"

import globalConfig from "@/config/globalConfig"

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
