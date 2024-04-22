"use client"

import React, { useMemo } from "react"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useGetCollection } from "@/services/cometh-marketplace/collectionService"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"

import { AssetImageContainer } from "../marketplace/grid/AssetCard"
import { AssetImage } from "../ui/AssetImage"
import { Link } from "../ui/Link"
import { isOrderActivity, isTransferActivity } from "./activityHelper"
import { AssetActivity } from "./AssetActivityTypes"

export function ActivityAssetCell({ activity }: { activity: AssetActivity }) {
  const currentCollectionContext = useCurrentCollectionContext()
  const activityContractAddress = useMemo(() => {
    return isOrderActivity(activity)
      ? activity.order.tokenAddress
      : activity.transfer.contractAddress
  }, [activity])
  const imageAspectRatio =
    globalConfig.collectionSettingsByAddress[
      activityContractAddress.toLowerCase() as Address
    ].imageAspectRatio
  const { data: collection } = useGetCollection(
    activityContractAddress as Address
  )

  if (isTransferActivity(activity)) {
    return (
      <Link
        href={`/nfts/${activity.transfer.contractAddress}/${activity.transfer.tokenId}`}
      >
        #{activity.transfer.tokenId}
      </Link>
    )
  } else if (isOrderActivity(activity)) {
    const asset = activity.order.asset
    if (!asset) return null

    return (
      <div className="flex h-12 items-center gap-2">
        <div className="h-full ">
          <Link href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}>
            <AssetImageContainer imageAspectRatio={imageAspectRatio}>
              <AssetImage
                src={asset.cachedImageUrl}
                fallback={asset.metadata.image}
                imageData={asset.metadata.image_data}
                fill
                className="z-20 size-full  object-cover"
              />
            </AssetImageContainer>
          </Link>
        </div>
        <div>
          <Link href={`/nfts/${asset.contractAddress}`}>
            <div className="font-medium">{collection?.name}</div>
          </Link>
          <Link href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}>
            <div className="font-bold">{asset.metadata.name}</div>
          </Link>
        </div>
      </div>
    )
  } else {
    return null // Or return some default UI for other types of activities
  }
}
