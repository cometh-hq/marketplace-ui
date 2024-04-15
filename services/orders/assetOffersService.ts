import {
  AssetWithTradeData,
  FilterDirection,
  OrderWithAsset,
  SearchOrdersRequest,
  SearchOrdersSortOption,
  TradeDirection,
} from "@cometh/marketplace-sdk"
import { DateTime } from "luxon"
import { Address } from "viem"
import { useAccount } from "wagmi"

import { UnknownUser } from "@/types/user"

import {
  useReceivedBuyOffers,
  useSentBuyOffers,
} from "../cometh-marketplace/buyOffersService"
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

const skeletonTrade = (trade: OrderWithAsset, asset?: AssetWithTradeData) => {
  const { asset: tradeAsset, maker, erc20TokenAmount, signedAt } = trade

  return {
    trade,
    owner: { address: tradeAsset?.owner } as UnknownUser,
    emitter: { address: maker } as UnknownUser,
    amount: erc20TokenAmount,
    date: DateTime.fromISO(signedAt),
    ...(asset && { asset }),
  }
}



export const useUserPurchaseOffers = (isMaker: boolean) => {
  const account = useAccount()
  const userAddress = account?.address
  const searchOffersParams: SearchOrdersRequest = {

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
