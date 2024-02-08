import { MakeBuyOfferOptions } from "@/services/orders/make-buy-offer"
import { ERC721OrderStruct } from "@traderxyz/nft-swap-sdk"

import globalConfig from "@/config/globalConfig"
import { IZeroEx__factory } from "@/lib/generated/contracts/factories/IZeroEx__factory"

import { CancelOrderParams, MakeOfferParams } from "./types"
import { WalletAdapter } from "./wallet-adapter"

export const useComethConnectTxs = (): WalletAdapter => {
  async function makeBuyOffer({ signer, order }: MakeOfferParams) {
    const contract = IZeroEx__factory.connect(
      globalConfig.network.zeroExExchange,
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

  return { makeBuyOffer, cancelOrder }
}
