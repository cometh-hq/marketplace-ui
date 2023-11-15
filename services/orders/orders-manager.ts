import { AssetWithTradeData, CancelOrderRequest, NewOrder, TokenType, TradeDirection } from "@alembic/nft-api-sdk"
import { ERC721OrderStruct, NftSwapV4 } from "@traderxyz/nft-swap-sdk"
import { splitSignature } from "ethers/lib/utils"

import { comethMarketplaceClient } from "../cometh-marketplace/client"
import { getFirstListing } from "../cometh-marketplace/offers"
import { IZeroEx__factory } from "@traderxyz/nft-swap-sdk/dist/contracts"
import { useSignBuyOfferOrder } from "./sign-buy-offer-order"
import { manifest } from "@/manifests"
import { BigNumber } from "@ethersproject/bignumber"
import { DateTime } from "luxon/src/datetime"

export type CancelBuyOfferParams = {
  offer: any
  signer: any
  isComethWallet: boolean
  sdk: NftSwapV4 | null
}

export const cancelBuyOffer = async ({
  offer,
  signer,
  isComethWallet,
  sdk,
}: CancelBuyOfferParams) => {
  const nonce = offer.trade.nonce

  if (isComethWallet) {
    const tx = await sdk?.cancelOrder(nonce, "ERC721")
    return await tx?.wait()
  } else {
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
}

export type CancelListingParams = {
  asset: AssetWithTradeData,
  signer: any,
  isComethWallet: boolean,
  sdk: NftSwapV4 | null
}

export const cancelListing = async ({ asset, signer, isComethWallet, sdk }: CancelListingParams) => {
  const nonce = (await getFirstListing(asset.tokenId)).nonce
  if (!nonce) throw new Error("No nonce found on asset")

  if (isComethWallet) {
    const tx = await sdk?.cancelOrder(nonce, "ERC721")
    return await tx?.wait()
  } else {
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
}

export type MakeBuyOfferParams = {
  signer: any
  isComethWallet: boolean
  signBuyOfferOrder: any
  order: any
}

export const makeBuyOffer = async ({ signer, isComethWallet, signBuyOfferOrder, order }: MakeBuyOfferParams) => {
 
  if (isComethWallet) {
    const contract = IZeroEx__factory.connect(
      process.env.NEXT_PUBLIC_ZERO_EX_CONTRACT_ADDRESS!,
      signer
    )

    const tx = await contract.preSignERC721Order(order as ERC721OrderStruct)
    return await tx.wait()
  } else {
    const signedOrder = await signBuyOfferOrder({ order })

    const buyOffer: NewOrder = {
      tokenAddress: manifest.contractAddress,
      tokenId: order.tokenId,
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
}

export type SellAssetParams = {
  signer: any
  isComethWallet: boolean
  signSellOrder: any
  order: any
}

export const sellAsset = async ({ signer, isComethWallet, signSellOrder, order }: SellAssetParams) => {
  if (isComethWallet) {
    const contract = IZeroEx__factory.connect(
      process.env.NEXT_PUBLIC_ZERO_EX_CONTRACT_ADDRESS!,
      signer
    )

    const tx = await contract.preSignERC721Order(order as ERC721OrderStruct)
    return await tx.wait()
  } else {
    const signedOrder = await signSellOrder({ order })

    const sellOrder: NewOrder = {
      tokenAddress: manifest.contractAddress,
      tokenId: order.tokenId,
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
}