import { AssetWithTradeData, Auction, Order, OrderWithAsset } from '@cometh/marketplace-sdk'
import { DateTime } from "luxon"

import { AnyUser } from "./user"

export type BuyOffer = {
  trade: Order | OrderWithAsset | Auction
  asset?: AssetWithTradeData
  owner: AnyUser
  emitter: AnyUser
  amount: string
  date: DateTime
}