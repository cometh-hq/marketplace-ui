import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Loader } from "lucide-react"

import { Card, CardContent } from "@/components/ui/Card"

import { AssetFloorPriceDisplay } from "./AssetFloorPriceDisplay"
import {
  useAssetFloorPriceAttributes,
  useFloorPriceAsset,
} from "./FloorPriceHook"

type AssetFloorPriceProps = {
  asset: AssetWithTradeData
}

export default function AssetFloorPricePanel({ asset }: AssetFloorPriceProps) {
  const assetFloorPriceAttributes = useAssetFloorPriceAttributes(asset)

  const { isLoading, floorPriceAsset } = useFloorPriceAsset(asset)

  if (assetFloorPriceAttributes.length === 0) {
    return null
  }

  return (
    <Card className="mt-4">
      <CardContent className="py-[22px]">
        <div className="">
          <div className="mb-2 font-semibold">Floor price:</div>
          <div className="flex gap-4">
            <div className="flex grow flex-wrap gap-2">
              {assetFloorPriceAttributes.map((attribute) => (
                <div
                  className="bg-card rounded-lg border p-2 text-sm shadow-sm"
                  key={attribute.trait_type}
                >
                  <span className="text-foreground/60 font-medium">
                    {attribute.trait_type}:
                  </span>{" "}
                  <span className="ml-1 font-medium">
                    {attribute.value
                      ? attribute.value.toString()
                      : JSON.stringify(attribute.value)}
                  </span>
                </div>
              ))}
            </div>
            <div>
              {isLoading ? (
                <div className="text-center font-medium">
                  <Loader size={16} className="mr-1.5 animate-spin" />
                </div>
              ) : (
                <div className="">
                  <AssetFloorPriceDisplay
                    floorPriceAsset={floorPriceAsset}
                    pageAsset={asset}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
