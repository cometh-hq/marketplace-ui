import { MakeBuyOfferOptions } from "@/services/orders/make-buy-offer"
import { SignBuyOfferOrderOptions } from "@/services/orders/sign-buy-offer-order"
import { AssetWithTradeData } from "@alembic/nft-api-sdk"
import { Provider, Web3Provider } from "@ethersproject/providers"
import { NftOrderV4Serialized, SignedNftOrderV4 } from "@traderxyz/nft-swap-sdk"
import { ContractReceipt, Signer } from "ethers"
import { EIP1193Provider } from "viem"

export type MakeBuyOfferParams = {
  asset: AssetWithTradeData
  signer: Signer | Provider
  signedOrder: SignedNftOrderV4
  order: NftOrderV4Serialized
}

export type CancelListingParams = {
  nonce: string
  signer: any
  sdk: any
}

export type CancelBuyOfferParams = {
  nonce: string
  offer: any
  signer: any
  sdk: any
}

export interface WalletAdapter {
  makeBuyOffer: ({ asset, signer, signedOrder, order }: MakeBuyOfferParams) => Promise<any> // TODO: return ContractReceipt ?
  cancelListing: ({ nonce, signer, sdk }: CancelListingParams) => Promise<any>
  cancelBuyOffer: ({ nonce, offer, signer, sdk }: CancelBuyOfferParams) => Promise<any> // TODO: return ContractReceipt ?
}