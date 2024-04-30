import { useMemo } from "react"
import { useSearchOrders } from "@/services/cometh-marketplace/searchOrdersService"
import {
  AssetWithTradeData,
  FilterDirection,
  SearchOrdersRequest,
  SearchOrdersSortOption,
  TradeDirection,
} from "@cometh/marketplace-sdk"
import { Address } from "viem"

export type BuyOfferSearchParams = {
  asset?: AssetWithTradeData
  maker?: Address
  owner?: Address
  filteredOutMaker?: Address
}

export const useBuyOffersSearch = ({
  asset,
  maker,
  owner,
  filteredOutMaker: filterMaker,
}: BuyOfferSearchParams) => {
  const searchOffersParams = useMemo(() => {
    const searchOffersParams: SearchOrdersRequest = {
      direction: TradeDirection.BUY,
      limit: 999,
      orderBy: SearchOrdersSortOption.SIGNED_AT,
      orderByDirection: FilterDirection.DESC,
    }
    if (asset) {
      searchOffersParams.tokenAddress = asset.contractAddress
      searchOffersParams.tokenIds = [asset.tokenId]
    }
    if (maker) {
      searchOffersParams.maker = maker
    }
    if (owner) {
      searchOffersParams.assetOwner = owner
    }
    return searchOffersParams
  }, [asset, maker, owner])

  const { data: offersSearch, isPending } = useSearchOrders(searchOffersParams)

  const filteredOrders = useMemo(() => {
    if (!filterMaker) {
      return offersSearch?.orders
    }
    return offersSearch?.orders?.filter(
      (order) => order.maker.toLowerCase() !== filterMaker.toLowerCase()
    )
  }, [offersSearch?.orders, filterMaker])

  return { offers: filteredOrders, isPending }
}
