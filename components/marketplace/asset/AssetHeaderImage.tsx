import { useIsViewerAnOwner } from "@/services/cometh-marketplace/assetOwners"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { useAccount } from "wagmi"

import { OrderAsset } from "@/types/assets"
import { cn } from "@/lib/utils/utils"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { AssetImage } from "@/components/ui/AssetImage"

export const AssetHeaderImage = ({
  asset,
}: {
  asset: SearchAssetWithTradeData | AssetWithTradeData | OrderAsset
}) => {
  const isViewerAnOwner = useIsViewerAnOwner(asset)

  if (
    !asset.cachedImageUrl &&
    !asset.metadata.image &&
    !asset.metadata.image_data
  ) {
    return null
  }

  return (
    <div
      className={cn(
        "bg-muted w-full overflow-hidden rounded-xl border lg:w-[55%]",
        isViewerAnOwner ? "border-owner" : "border-muted"
      )}
    >
      <AspectRatio ratio={1}>
        <div className="relative flex size-full items-center justify-center">
          <AssetImage
            src={asset.cachedImageUrl}
            fallback={asset.metadata.image}
            imageData={asset.metadata.image_data}
            height={380}
            width={320}
            className="relative  size-full rounded-xl object-contain p-[5%]"
          />
        </div>
      </AspectRatio>
    </div>
  )
}
