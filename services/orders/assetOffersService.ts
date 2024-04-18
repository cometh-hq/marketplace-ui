import {
  AssetWithTradeData,
  SearchOrdersRequest,
  TradeDirection
} from "@cometh/marketplace-sdk"
import { Address } from "viem"
import { useAccount } from "wagmi"
import { useSearchOrders } from "../cometh-marketplace/searchOrdersService"

export type UseMakerBuyOffersOptions = {
  maker: Address
}

export type UseAssetBuyOffersOptions = {
  asset?: AssetWithTradeData
  owner?: Address
}

export type UseBuyOffersOptions =
  | UseMakerBuyOffersOptions
  | UseAssetBuyOffersOptions

export const isMakerBuyOffersOptions = (
  options: UseBuyOffersOptions
): options is UseMakerBuyOffersOptions => {
  return (options as UseMakerBuyOffersOptions).maker !== undefined
}

export const useUserPurchaseOffers = (isMaker: boolean) => {
  const account = useAccount()
  const userAddress = account?.address
  const searchOffersParams: SearchOrdersRequest = {
    direction: TradeDirection.BUY
  }

  if (userAddress) {
    if (isMaker) {
      searchOffersParams.maker = userAddress
    } else {
      searchOffersParams.assetOwner = userAddress
    }
  }

  const { data: offersSearch, isPending } = useSearchOrders(searchOffersParams)
  return offersSearch?.orders ?? null
}
