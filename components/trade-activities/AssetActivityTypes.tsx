"use client"

import { AssetTransfer, Order, OrderWithAsset } from "@cometh/marketplace-sdk"

export const TRANSFER_TYPE = "transfer"
export const ORDER_TYPE = "order"

export type TransferActivity = {
  activityType: "transfer"
  transfer: AssetTransfer
}

export type OrderActivity = {
  activityType: "order"
  order: OrderWithAsset
}

export type AssetActivity = TransferActivity | OrderActivity
