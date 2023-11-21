import { AssetWithTradeData, OrderWithAsset } from "@alembic/nft-api-sdk"
import { DateTime } from "luxon"

import { AnyUser } from "./user"

export type BuyOffer = {
  trade: OrderWithAsset
  asset?: AssetWithTradeData
  owner: AnyUser
  emitter: AnyUser
  amount: string
  date: DateTime
}
