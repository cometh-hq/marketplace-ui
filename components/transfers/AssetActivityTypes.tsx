"use client"

import { AssetTransfer, Order } from "@cometh/marketplace-sdk"

export const TRANSFER_TYPE = "transfer"
export const ORDER_TYPE = "order"

export type TransferActivity = {
  activityType: "transfer"
  transfer: AssetTransfer
}

export type OrderActivity = {
  activityType: "order"
  order: Order
}

export type AssetActivity = TransferActivity | OrderActivity
