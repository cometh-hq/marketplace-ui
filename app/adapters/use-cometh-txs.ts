import { MakeBuyOfferOptions } from "@/services/orders/make-buy-offer"
import { ERC721OrderStruct } from "@traderxyz/nft-swap-sdk"

import { IZeroEx__factory } from "@/lib/generated/contracts/factories/IZeroEx__factory"

import {
  CancelOrderParams,
  MakeBuyOfferParams,
  SellAssetOptions,
} from "./types"
import { WalletAdapter } from "./wallet-adapter"

export const useComethConnectTxs = (): WalletAdapter => {
  async function makeBuyOffer({ signer, order }: MakeBuyOfferParams) {
    const contract = IZeroEx__factory.connect(
      process.env.NEXT_PUBLIC_ZERO_EX_CONTRACT_ADDRESS!,
      signer
    )
    const tx = await contract.preSignERC721Order(order as ERC721OrderStruct)
    const txReceipt = await tx.wait()

    return txReceipt
  }

  async function cancelOrder({ nonce, nftSwapSdk }: CancelOrderParams) {
    const tx = await nftSwapSdk?.cancelOrder(nonce, "ERC721")
    return await tx?.wait()
  }

  async function sellAsset({ order, signer }: SellAssetOptions) {
    const contract = IZeroEx__factory.connect(
      process.env.NEXT_PUBLIC_ZERO_EX_CONTRACT_ADDRESS!,
      signer
    )

    const tx = await contract.preSignERC721Order(order as ERC721OrderStruct)
    const txResponse = await tx.wait()

    return txResponse
  }

  return { makeBuyOffer, cancelOrder, sellAsset }
}
