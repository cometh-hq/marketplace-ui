import { comethMarketplaceClient } from "@/services/cometh-marketplace/client"
import { useSignOrder } from "@/services/orders/sign-order"
import {
  CancelOrderRequest,
  NewOrder,
  TokenType,
  TradeDirection,
} from "@cometh/marketplace-sdk"
import { BigNumber } from "@ethersproject/bignumber"
import { splitSignature } from "ethers/lib/utils"
import { DateTime } from "luxon"

import { CancelOrderParams, MakeOfferParams } from "./types"
import { WalletAdapter } from "./wallet-adapter"

export function useEOATxs(): WalletAdapter {
  const signBuyOfferOrder = useSignOrder()

  async function makeBuyOffer({
    asset,
    order,
    tradeDirection = TradeDirection.BUY,
  }: MakeOfferParams) {
    const signedOrder = await signBuyOfferOrder({ order })

    const buyOffer: NewOrder = {
      tokenAddress: asset.contractAddress,
      tokenId: asset.tokenId,
      tokenProperties: [],
      tokenQuantity: BigNumber.from(1).toString(),
      tokenType: TokenType.ERC721,
      direction: tradeDirection,
      erc20Token: order.erc20Token,
      erc20TokenAmount: order.erc20TokenAmount,
      expiry: DateTime.fromSeconds(+order.expiry).toString(),
      fees: order.fees,
      maker: order.maker,
      nonce: order.nonce,
      signature: signedOrder.signature,
      signedAt: DateTime.now().toString(),
      taker: order.taker,
    }

    return await comethMarketplaceClient.order.createOrder(buyOffer)
  }

  // async function cancelOrder({ nonce, signer }: CancelOrderParams) {
  //   const signedPrefix = await signer!.signMessage(`Nonce: ${nonce}`)
  //   const signature = splitSignature(signedPrefix)
  //   const { r, s, v } = signature

  //   const body: CancelOrderRequest = {
  //     signature: {
  //       signatureType: 2,
  //       r,
  //       s,
  //       v,
  //     },
  //   }

  //   return await comethMarketplaceClient.order.cancelOrder(nonce, body)
  // }

  async function cancelOrder({ nonce, nftSwapSdk }: CancelOrderParams) {
    const tx = await nftSwapSdk?.cancelOrder(nonce, "ERC721")
    return await tx?.wait()
  }

  return { makeBuyOffer, cancelOrder }
}
