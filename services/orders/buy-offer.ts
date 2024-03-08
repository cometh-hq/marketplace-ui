import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { useSignOrder } from "@/services/orders/sign-order"
import {
  AssetWithTradeData,
  NewOrder,
  TokenType,
  TradeDirection,
} from "@cometh/marketplace-sdk"
import { Provider } from "@ethersproject/providers"
import {
  ERC721OrderStruct,
  NftOrderV4Serialized,
  SignedNftOrderV4,
} from "@traderxyz/nft-swap-sdk"
import { BigNumber, Signer } from "ethers"
import { DateTime } from "luxon"

import globalConfig from "@/config/globalConfig"
import { IZeroEx__factory } from "@/lib/generated/contracts/factories/IZeroEx__factory"

import { comethMarketplaceClient } from "../cometh-marketplace/client"

export type OrderParams = {
  signer: Signer | Provider
  signedOrder?: SignedNftOrderV4
  order: NftOrderV4Serialized
  tradeDirection?: TradeDirection.BUY | TradeDirection.SELL
}

export type BuyOfferParams = {
  asset: AssetWithTradeData
} & OrderParams

export const useBuyOffer = () => {
  const isComethWallet = useIsComethConnectWallet()
  const signBuyOfferOrder = useSignOrder()

  async function buyOfferConnect({ signer, order }: BuyOfferParams) {
    const contract = IZeroEx__factory.connect(
      globalConfig.network.zeroExExchange,
      signer
    )
    const tx = await contract.preSignERC721Order(order as ERC721OrderStruct)
    const txReceipt = await tx.wait()

    return txReceipt
  }

  async function buyOfferEOA({
    asset,
    order,
    tradeDirection = TradeDirection.BUY,
  }: BuyOfferParams) {
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

  if (isComethWallet) {
    return { buyOffer: buyOfferConnect }
  }

  return { buyOffer: buyOfferEOA }
}
