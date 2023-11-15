import { CancelBuyOfferParams, CancelListingParams, MakeBuyOfferParams, WalletAdapter } from "./wallet-adapter";
import { useSignBuyOfferOrder } from "@/services/orders/sign-buy-offer-order";
import { comethMarketplaceClient } from "@/services/cometh-marketplace/client";
import { AssetWithTradeData, CancelOrderRequest, NewOrder, TokenType, TradeDirection } from "@alembic/nft-api-sdk";
import { manifest } from "@/manifests";
import { BigNumber } from "@ethersproject/bignumber";
import { DateTime } from "luxon";
import { splitSignature } from "ethers/lib/utils";

export function useEOATxs(): WalletAdapter {
  // const signBuyOfferOrder = useSignBuyOfferOrder() // doesn't work, i don't know why
  
  async function makeBuyOffer({ asset, signedOrder, order }: MakeBuyOfferParams) {
    // const signedOrder = await signBuyOfferOrder({ order })

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

  async function cancelListing({ nonce, signer}: CancelListingParams) {
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

  async function cancelBuyOffer({ nonce, offer, signer }: CancelBuyOfferParams) {
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

  return { makeBuyOffer, cancelListing, cancelBuyOffer }
}