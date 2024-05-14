import { TokenType } from "@cometh/marketplace-sdk"
import { NftSwapV4 } from "@traderxyz/nft-swap-sdk"

export type CancelOrderParams = {
  nonce: string
  nftSwapSdk: NftSwapV4 | null
  tokenType: TokenType
}

export const cancelOrder = async ({ nonce, nftSwapSdk, tokenType }: CancelOrderParams) => {
  const tx = await nftSwapSdk?.cancelOrder(nonce, tokenType)
  return await tx?.wait()
}
