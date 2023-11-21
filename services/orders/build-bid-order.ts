import { useCallback } from "react"
import { manifest } from "@/manifests"
import { AssetWithTradeData } from '@cometh/marketplace-sdk'
import { ERC721OrderStruct } from "@traderxyz/nft-swap-sdk"
import { BigNumber, ethers } from "ethers"

import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"

export type BuildBidOrderOptions = {
  asset: AssetWithTradeData
  price: BigNumber
  nonce: string
}

export const useBuildBidOrder = () => {
  const viewer = useCurrentViewerAddress()
  const sdk = useNFTSwapv4()

  return useCallback(
    ({ asset, nonce, price }: BuildBidOrderOptions) => {
      if (!sdk || !viewer) return null
      const order: ERC721OrderStruct = {
        direction: 1,
        maker: viewer.toLowerCase(),
        taker: ethers.constants.AddressZero,
        nonce,
        erc721Token: manifest.contractAddress,
        erc721TokenId: asset.tokenId,
        erc721TokenProperties: [],
        erc20Token: manifest.currency.wrapped.address,
        erc20TokenAmount: price,
        expiry: Math.floor(Date.now() / 1_000) + 60 * 60 * 24 * 30, // in 30 days from now // TODO auction unmock
        fees: [],
      }

      return order
    },
    [sdk, viewer]
  )
}
