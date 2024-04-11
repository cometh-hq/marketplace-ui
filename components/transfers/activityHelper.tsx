"use client"

import { TradeStatus } from "@cometh/marketplace-sdk"

import {
  AssetActivity,
  ORDER_TYPE,
  OrderActivity,
  TRANSFER_TYPE,
  TransferActivity,
} from "./AssetActivityTypes"

export const isTransferActivity = (
  assetActivity: AssetActivity
): assetActivity is TransferActivity => {
  return assetActivity.activityType === TRANSFER_TYPE
}
export const isOrderActivity = (
  assetActivity: AssetActivity
): assetActivity is OrderActivity => {
  return assetActivity.activityType === ORDER_TYPE
}

export const getActivityTimestamp = (assetActivity: AssetActivity) => {
  if (isTransferActivity(assetActivity)) {
    return assetActivity.transfer.timestamp
  } else if (isOrderActivity(assetActivity)) {
    const { order } = assetActivity
    let dateToUse = order.signedAt

    if (order.orderStatus === TradeStatus.FILLED) {
      dateToUse = order.lastFilledAt as string
    }
    return new Date(dateToUse).getTime()
  } else {
    throw new Error("Unknown activity type")
  }
}
