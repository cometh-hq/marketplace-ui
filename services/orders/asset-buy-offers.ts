import { AssetWithTradeData } from '@cometh/marketplace-sdk'
import { DateTime } from "luxon"
import { Address } from "viem"

import { UnknownUser } from "@/types/user"

import { useReceivedBuyOffers, useSentBuyOffers } from "../alembic/offers"

export type UseMakerBuyOffersOptions = {
  maker: Address
}

export type useAssetReceivedOffersOptions = {
  asset?: AssetWithTradeData
  owner?: Address
}

export type UseBuyOffersOptions =
  | UseMakerBuyOffersOptions
  | useAssetReceivedOffersOptions

export const isMakerBuyOffersOptions = (
  options: UseBuyOffersOptions
): options is UseMakerBuyOffersOptions => {
  return (options as UseMakerBuyOffersOptions).maker !== undefined
}

export const useAssetReceivedOffers = (props: UseBuyOffersOptions) => {
  if (isMakerBuyOffersOptions(props)) {
    return []
  }

  const { data: trades, isLoading } = useReceivedBuyOffers(
    props.asset?.owner as Address
  )

  if (isLoading) {
    return []
  }

  return trades.map((trade) => ({
    trade,
    owner: { address: trade.asset.owner } as UnknownUser,
    emitter: { address: trade.maker } as UnknownUser,
    amount: trade.erc20TokenAmount,
    date: DateTime.fromISO(trade.signedAt),
    asset: props?.asset,
  }))
}

export const useAccountReceivedOffers = (props: any) => {
  const { data: trades, isLoading } = useReceivedBuyOffers(
    props.owner as Address
  )

  if (isLoading) {
    return []
  }

  return trades.map((trade) => ({
    trade,
    owner: { address: trade.asset.owner } as UnknownUser,
    emitter: { address: trade.maker } as UnknownUser,
    amount: trade.erc20TokenAmount,
    date: DateTime.fromISO(trade.signedAt),
  }))
}

export const useAssetSentOffers = (props: UseBuyOffersOptions) => {
  if (isMakerBuyOffersOptions(props)) {
    return []
  }
  const { data: trades, isLoading } = useSentBuyOffers(
    props.owner as Address
  )

  if (isLoading) {
    return []
  }

  return trades.map((trade) => ({
    trade,
    owner: { address: trade.asset.owner } as UnknownUser,
    emitter: { address: trade.maker } as UnknownUser,
    amount: trade.erc20TokenAmount,
    date: DateTime.fromISO(trade.signedAt),
  }))
}