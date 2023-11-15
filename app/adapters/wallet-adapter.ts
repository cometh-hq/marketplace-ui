import {
  CancelBuyOfferParams,
  CancelListingParams,
  MakeBuyOfferParams,
  SellAssetOptions
} from "./types"

export interface WalletAdapter {
  makeBuyOffer: ({ asset, signer, signedOrder, order }: MakeBuyOfferParams) => Promise<any>
  cancelListing: ({ nonce, signer, nftSwapSdk }: CancelListingParams) => Promise<any>
  cancelBuyOffer: ({ nonce, offer, signer, nftSwapSdk }: CancelBuyOfferParams) => Promise<any>
  sellAsset: ({ asset, signer, signedOrder, order }: SellAssetOptions) => Promise<any>
}