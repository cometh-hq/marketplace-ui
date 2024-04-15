import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { useSignOrder } from "@/services/orders/signOrderService"
import {
  AssetWithTradeData,
  NewOrder,
  SearchAssetWithTradeData,
  TokenType,
  TradeDirection,
} from "@cometh/marketplace-sdk"
import { Provider } from "@ethersproject/providers"
import {
  ERC1155OrderStructSerialized,
  ERC721OrderStruct,
  NftOrderV4Serialized,
  SignedNftOrderV4,
} from "@traderxyz/nft-swap-sdk"
import { BigNumber, Signer } from "ethers"
import { DateTime } from "luxon"

import globalConfig from "@/config/globalConfig"
import { comethMarketplaceClient } from "@/lib/clients"
import { IZeroEx__factory } from "@/lib/generated/contracts/factories/IZeroEx__factory"

export type OrderParams = {
  signer: Signer | Provider
  signedOrder?: SignedNftOrderV4
  order: NftOrderV4Serialized
  tradeDirection?: TradeDirection.BUY | TradeDirection.SELL
}

export type BuyOfferParams = {
  asset: AssetWithTradeData | SearchAssetWithTradeData
} & OrderParams

export const usePresignOrder = () => {
  const isComethWallet = useIsComethConnectWallet()
  const signBuyOfferOrder = useSignOrder()

  async function presignOrderConnect({ signer, order }: BuyOfferParams) {
    const contract = IZeroEx__factory.connect(
      globalConfig.network.zeroExExchange,
      signer
    )
    const tx = await contract.preSignERC721Order(order as ERC721OrderStruct)
    const txReceipt = await tx.wait()

    return txReceipt
  }

  async function presignOrderEOA({
    asset,
    order,
    tradeDirection = TradeDirection.BUY,
  }: BuyOfferParams) {
    const signedOrder = await signBuyOfferOrder({ order })
    const isERC1155 = asset.tokenType === TokenType.ERC1155

    const buyOffer: NewOrder = {
      tokenAddress: asset.contractAddress,
      tokenId: asset.tokenId,
      tokenProperties: [],
      tokenQuantity: isERC1155
        ? (order as ERC1155OrderStructSerialized).erc1155TokenAmount
        : BigNumber.from(1).toString(),
      tokenType: asset.tokenType,
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
    return { presignOrder: presignOrderConnect }
  }

  return { presignOrder: presignOrderEOA }
}
