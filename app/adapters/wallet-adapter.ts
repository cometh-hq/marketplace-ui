import {
  CancelOrderParams,
  MakeBuyOfferParams,
  SellAssetOptions
} from "./types"

export interface WalletAdapter {
  makeBuyOffer: ({ asset, signer, signedOrder, order }: MakeBuyOfferParams) => Promise<any>
  cancelOrder: ({ nonce, signer, nftSwapSdk }: CancelOrderParams) => Promise<any>
  sellAsset: ({ asset, signer, signedOrder, order }: SellAssetOptions) => Promise<any>
}