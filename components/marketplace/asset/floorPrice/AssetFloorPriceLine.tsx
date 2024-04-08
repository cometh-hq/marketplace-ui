import { use, useMemo } from "react"
import { useGetAsset } from "@/services/cometh-marketplace/searchAssetsService"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { Loader } from "lucide-react"
import { Address } from "viem"

import { AssetFloorPriceDisplay } from "./AssetFloorPriceDisplay"
import {
  useFloorPriceAsset,
} from "./FloorPriceHook"

const isAssetWithTradeData = (
  asset: AssetWithTradeData | SearchAssetWithTradeData
): asset is AssetWithTradeData => {
  return (asset.metadata as any).attributes !== undefined
}

export default function AssetFloorPriceLine({
  asset,
}: {
  asset: AssetWithTradeData | SearchAssetWithTradeData
}) {
  const { data: fullAsset } = useGetAsset(
    asset.contractAddress as Address,
    asset.tokenId
  )
  const assetWithAttributes = useMemo(() => {
    if (isAssetWithTradeData(asset)) {
      return asset
    } else {
      return fullAsset
    }
  }, [asset, fullAsset])
  const assetFloorPriceAttributes = useAssetFloorPriceAttributes(assetWithAttributes)

  const { isLoading, floorPriceAsset } = useFloorPriceAsset(assetWithAttributes)

  if (!assetWithAttributes || !assetFloorPriceAttributes.length) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center">
      <div className="grow">Floor price:</div>
      {isLoading ? (
        <div className="text-center font-medium">
          <Loader size={16} className="mr-1.5 animate-spin" />
        </div>
      ) : (
        <div className="">
          <AssetFloorPriceDisplay
            floorPriceAsset={floorPriceAsset}
            pageAsset={assetWithAttributes}
          />
        </div>
      )}
    </div>
  )
}
