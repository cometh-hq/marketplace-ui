import { MakeBuyOfferOptions } from "@/services/orders/make-buy-offer"
import { SignBuyOfferOrderOptions } from "@/services/orders/sign-buy-offer-order"
import { AssetWithTradeData } from "@alembic/nft-api-sdk"
import { Provider } from "@ethersproject/providers"
import { NftOrderV4Serialized } from "@traderxyz/nft-swap-sdk"
import { ContractReceipt, Signer } from "ethers"

export type MakeBuyOfferParams = {
  asset: AssetWithTradeData
  signer: Signer | Provider
  order: NftOrderV4Serialized
}

export interface WalletAdapter {
  makeBuyOffer: ({ asset, signer, order }: MakeBuyOfferParams) => Promise<any> // TODO: return ContractReceipt ?
}