import { MakeBuyOfferOptions } from "@/services/orders/make-buy-offer"
import { ERC721OrderStruct } from "@traderxyz/nft-swap-sdk"

import { IZeroEx__factory } from "@/lib/generated/contracts/factories/IZeroEx__factory"

import { CancelBuyOfferParams, CancelListingParams, MakeBuyOfferParams, WalletAdapter } from "./wallet-adapter"

export const useComethConnectTxs = (): WalletAdapter => {
  async function makeBuyOffer({
    signer,
    order,
  }: MakeBuyOfferParams) {
    const contract = IZeroEx__factory.connect(
      process.env.NEXT_PUBLIC_ZERO_EX_CONTRACT_ADDRESS!,
      signer
    )
    const tx = await contract.preSignERC721Order(order as ERC721OrderStruct)
    await tx.wait()
  }

  async function cancelListing({ nonce, sdk}: CancelListingParams) {
    const tx = await sdk?.cancelOrder(nonce, "ERC721")
    return await tx?.wait()
  }

  async function cancelBuyOffer({ nonce, offer, sdk }: CancelBuyOfferParams) {
    const tx = await sdk?.cancelOrder(nonce, "ERC721")
    const txReceipt = await tx?.wait()

    return txReceipt
  }

  return { makeBuyOffer, cancelListing, cancelBuyOffer }
}
