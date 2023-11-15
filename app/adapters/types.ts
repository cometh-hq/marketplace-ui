import { BuyOffer } from "@/types/buy-offers"
import { AssetWithTradeData } from "@alembic/nft-api-sdk"
import { Provider } from "@ethersproject/providers"
import { NftOrderV4Serialized, NftSwapV4, SignedNftOrderV4 } from "@traderxyz/nft-swap-sdk"
import { Signer } from "ethers"

export type OrderParams = {
  signer: Signer | Provider
  signedOrder: SignedNftOrderV4
  order: NftOrderV4Serialized
}

export type MakeBuyOfferParams = {
  asset: AssetWithTradeData
} & OrderParams

export type CancelListingParams = {
  nonce: string
  signer: Signer
  nftSwapSdk: NftSwapV4 | null
}

export type CancelBuyOfferParams = {
  nonce: string
  offer: BuyOffer
  signer: Signer
  nftSwapSdk: NftSwapV4 | null
}

export type SellAssetOptions = {
  asset: AssetWithTradeData
} & OrderParams