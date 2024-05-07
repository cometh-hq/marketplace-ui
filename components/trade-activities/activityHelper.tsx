"use client"

import {
  AssetTransfers,
  Order,
  TradeDirection,
  TradeStatus,
} from "@cometh/marketplace-sdk"
import { Address, isAddressEqual } from "viem"

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
      dateToUse = order.filledAt as string
    }
    return new Date(dateToUse).getTime()
  } else {
    throw new Error("Unknown activity type")
  }
}

export const getUsername = (address: Address, viewerAddress?: Address) => {
  if (viewerAddress && isAddressEqual(address, viewerAddress)) {
    return "You"
  }
}

export const getFormattedUser = (
  userAddress: Address,
  viewerAddress?: Address
) => {
  return {
    username: getUsername(userAddress as Address, viewerAddress),
    address: userAddress,
  }
}


export const getActivityNftOwner = (
  assetActivity: AssetActivity,
  viewerAddress?: Address
) => {
  if (isTransferActivity(assetActivity)) {
    return getFormattedUser(
      assetActivity.transfer.fromAddress as Address,
      viewerAddress
    )
  } else if (isOrderActivity(assetActivity)) {
    return getFormattedUser(
      (assetActivity.order.direction === TradeDirection.SELL
        ? assetActivity.order.maker
        : assetActivity.order.taker) as Address,
      viewerAddress
    )
  } else {
    throw new Error("Unknown activity type")
  }
}

export const getActivityNftReceiver = (
  assetActivity: AssetActivity,
  viewerAddress?: Address
) => {
  if (isTransferActivity(assetActivity)) {
    return getFormattedUser(
      assetActivity.transfer.toAddress as Address,
      viewerAddress
    )
  } else if (isOrderActivity(assetActivity)) {
    return getFormattedUser(
      (assetActivity.order.direction === TradeDirection.SELL
        ? assetActivity.order.taker
        : assetActivity.order.maker) as Address,
      viewerAddress
    )
  } else {
    throw new Error("Unknown activity type")
  }
}

export const getActivityId = (assetActivity: AssetActivity) => {
  if (isTransferActivity(assetActivity)) {
    return TRANSFER_TYPE + assetActivity.transfer.id
  } else if (isOrderActivity(assetActivity)) {
    return ORDER_TYPE + assetActivity.order.id
  } else {
    throw new Error("Unknown activity type")
  }
}

export const getMergedActivities = (
  assetTransfers: AssetTransfers,
  assetOrders: Order[],
  maxActivitiesToShow?: number
): AssetActivity[] => {
  const transferActivites = assetTransfers.map((asset) => ({
    activityType: TRANSFER_TYPE,
    transfer: asset,
  }))
  const orderActivities = assetOrders.map((order) => ({
    activityType: ORDER_TYPE,
    order,
  }))
  const activities = [
    ...transferActivites,
    ...orderActivities,
  ] as AssetActivity[]
  activities.sort((activity1, activity2) => {
    const activity1Timestamp = getActivityTimestamp(activity1)
    const activity2Timestamp = getActivityTimestamp(activity2)

    return activity2Timestamp - activity1Timestamp
  })
  return activities.slice(0, maxActivitiesToShow)
}
