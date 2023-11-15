import { MakeBuyOfferParams, WalletAdapter } from "./wallet-adapter";
import { useSignBuyOfferOrder } from "@/services/orders/sign-buy-offer-order";
import { comethMarketplaceClient } from "@/services/cometh-marketplace/client";
import { NewOrder, TokenType, TradeDirection } from "@alembic/nft-api-sdk";
import { manifest } from "@/manifests";
import { BigNumber } from "@ethersproject/bignumber";
import { DateTime } from "luxon";

export function useEOATxs(): WalletAdapter {
  const signBuyOfferOrder = useSignBuyOfferOrder()
  
  async function makeBuyOffer({ asset, order }: MakeBuyOfferParams) {
    const signedOrder = await signBuyOfferOrder({ order })

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

  return { makeBuyOffer }
}