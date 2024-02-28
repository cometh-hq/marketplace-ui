import {
  CancelOrderParams,
  MakeOfferParams
} from "./types"

export interface WalletAdapter {
  makeBuyOffer: ({ asset, signer, order }: MakeOfferParams) => Promise<any>
  cancelOrder: ({ nonce, signer, nftSwapSdk }: CancelOrderParams) => Promise<any>
}