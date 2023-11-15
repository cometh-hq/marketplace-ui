import { AssetWithTradeData, OrderWithAsset } from "@alembic/nft-api-sdk"
import { DateTime } from "luxon"
import { Address } from "viem"

import { UnknownUser } from "@/types/user"

import { useReceivedBuyOffers, useSentBuyOffers } from "../cometh-marketplace/offers"

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
    owner: { address: tradeAsset.owner } as UnknownUser,
    emitter: { address: maker } as UnknownUser,
    amount: erc20TokenAmount,
    date: DateTime.fromISO(signedAt),
    ...(asset && { asset }),
  }
}

export const useAssetOffers = (
  props: UseBuyOffersOptions,
  useOffers: (address: Address) => {
    data: OrderWithAsset[]
    isLoading: boolean
  }
) => {
  if (isMakerBuyOffersOptions(props)) {
    return []
  }

  const address = props.asset?.owner || props.owner
  const { data: trades, isLoading } = useOffers(address as Address)

  // if (isLoading) {
  //   return []
  // }

  return trades.map((trade) => skeletonTrade(trade, props.asset))
}

export const useAssetReceivedOffers = (props: UseBuyOffersOptions) =>
  useAssetOffers(props, useReceivedBuyOffers)

export const useAssetSentOffers = (props: UseBuyOffersOptions) =>
  useAssetOffers(props, useSentBuyOffers)
