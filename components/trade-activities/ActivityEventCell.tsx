"use client"

import React from "react"
import { TradeDirection, TradeStatus } from "@cometh/marketplace-sdk"
import { ethers } from "ethers"
import {
  AlarmClockOffIcon,
  ArrowLeftRightIcon,
  BanIcon,
  HelpingHandIcon,
  ImagePlusIcon,
  ScrollTextIcon,
  ShoppingCartIcon,
} from "lucide-react"

import {
  isFilledEventActivity,
  isOrderActivity,
  isTransferActivity,
} from "./activityHelper"
import { AssetActivity } from "./AssetActivityTypes"
import { GenericActivityEventCell } from "./TradeActivitiesTable"

export const ActivityEventCell = ({
  activity,
}: {
  activity: AssetActivity
}) => {
  if (isTransferActivity(activity)) {
    if (activity.transfer.fromAddress === ethers.constants.AddressZero) {
      return <GenericActivityEventCell Icon={ImagePlusIcon} label="Mint" />
    } else {
      return (
        <GenericActivityEventCell Icon={ArrowLeftRightIcon} label="Transfer" />
      )
    }
  } else if (isOrderActivity(activity)) {
    let icon = ScrollTextIcon
    let label = ""
    if (activity.order.orderStatus === TradeStatus.FILLED) {
      label =
        activity.order.direction === TradeDirection.BUY
          ? "Filled purchase offer"
          : "Sale"
      icon = ShoppingCartIcon
    } else if (activity.order.orderStatus === TradeStatus.OPEN) {
      label =
        activity.order.direction === TradeDirection.BUY
          ? "Sent purchase offer"
          : "Listed"
      icon =
        activity.order.direction === TradeDirection.BUY
          ? HelpingHandIcon
          : ScrollTextIcon
    } else if (activity.order.orderStatus === TradeStatus.EXPIRED) {
      label =
        activity.order.direction === TradeDirection.BUY
          ? "Expired purchase offer"
          : "Expired listing"
      icon = AlarmClockOffIcon
    } else {
      label =
        activity.order.direction === TradeDirection.BUY
          ? "Cancelled purchase offer"
          : "Cancelled listing"
      icon = BanIcon
    }

    return <GenericActivityEventCell Icon={icon} label={label} />
  } else if (isFilledEventActivity(activity)) {
    const label =
      activity.filledEvent.direction === TradeDirection.BUY
        ? "Filled purchase offer"
        : "Sale"
    return <GenericActivityEventCell Icon={ShoppingCartIcon} label={label} />
  }
}
