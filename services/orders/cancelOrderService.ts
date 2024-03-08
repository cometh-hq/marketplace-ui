import { NftSwapV4 } from "@traderxyz/nft-swap-sdk"

export type CancelOrderParams = {
  nonce: string
  nftSwapSdk: NftSwapV4 | null
}

export const cancelOrder = async ({ nonce, nftSwapSdk }: CancelOrderParams) => {
  const tx = await nftSwapSdk?.cancelOrder(nonce, "ERC721")
  return await tx?.wait()
}
