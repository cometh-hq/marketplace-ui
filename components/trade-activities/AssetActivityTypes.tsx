"use client"

import {
  AssetTransfer,
  OrderFilledEventWithAsset,
  OrderWithAsset,
} from "@cometh/marketplace-sdk"

export const TRANSFER_TYPE = "transfer"
export const ORDER_TYPE = "order"
export const FILLED_EVENT_TYPE = "filledEvent"

export type TransferActivity = {
  activityType: "transfer"
  transfer: AssetTransfer
}

export type OrderActivity = {
  activityType: "order"
  order: OrderWithAsset
}
export type FilledEventActivity = {
  activityType: "filledEvent"
  filledEvent: OrderFilledEventWithAsset
}

export type AssetActivity =
  | TransferActivity
  | OrderActivity
  | FilledEventActivity
