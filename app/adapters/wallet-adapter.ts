import {
  CancelOrderParams,
  MakeOfferParams
} from "./types"

export interface WalletAdapter {
  makeBuyOffer: ({ asset, signer, order }: MakeOfferParams) => Promise<any>
  cancelOrder: ({ nonce, nftSwapSdk }: CancelOrderParams) => Promise<any>
}