import { manifest } from "@/manifests"
import { comethMarketplaceClient } from "@/services/cometh-marketplace/client"
import {
  AssetWithTradeData,
  CancelOrderRequest,
  NewOrder,
  TokenType,
  TradeDirection,
} from "@cometh/marketplace-sdk"
import { BigNumber } from "@ethersproject/bignumber"
import { splitSignature } from "ethers/lib/utils"
import { DateTime } from "luxon"

import {
  CancelOrderParams,
  MakeBuyOfferParams,
  SellAssetOptions,
} from "./types"
import { WalletAdapter } from "./wallet-adapter"

export function useEOATxs(): WalletAdapter {
  async function makeBuyOffer({
    asset,
    signedOrder,
    order,
  }: MakeBuyOfferParams) {
    const buyOffer: NewOrder = {
      tokenAddress: manifest.contractAddress,
      tokenId: asset.tokenId,
      tokenProperties: [],
      tokenQuantity: BigNumber.from(1).toString(),
      tokenType: TokenType.ERC721,
      direction: TradeDirection.BUY,
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

  async function cancelOrder({ nonce, signer }: CancelOrderParams) {
    const signedPrefix = await signer!.signMessage(`Nonce: ${nonce}`)
    const signature = splitSignature(signedPrefix)
    const { r, s, v } = signature

    const body: CancelOrderRequest = {
      signature: {
        signatureType: 2,
        r,
        s,
        v,
      },
    }

    return await comethMarketplaceClient.order.cancelOrder(nonce, body)
  }

  async function sellAsset({ asset, order, signedOrder }: SellAssetOptions) {
    const sellOrder: NewOrder = {
      tokenAddress: manifest.contractAddress,
      tokenId: asset.tokenId,
      tokenProperties: [],
      tokenQuantity: BigNumber.from(1).toString(),
      tokenType: TokenType.ERC721,
      direction: TradeDirection.SELL,
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

    return await comethMarketplaceClient.order.createOrder(sellOrder)
  }

  return { makeBuyOffer, cancelOrder, sellAsset }
}
