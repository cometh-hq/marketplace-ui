import { AssetWithTradeData, SearchAssetWithTradeData } from "@cometh/marketplace-sdk"

import { cn } from "@/lib/utils/utils"
import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { AssetImage } from "@/components/ui/asset-image"

export const AssetHeaderImage = ({ asset }: { asset: SearchAssetWithTradeData | AssetWithTradeData }) => {
  const viewerAddress = useCurrentViewerAddress()
  const owner = asset.owner === viewerAddress

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
        "w-full overflow-hidden rounded-xl lg:w-[65%]",
        owner ? "bg-[#f4f2e8]" : "bg-muted"
      )}
    >
      <AspectRatio ratio={1}>
        <div className="relative flex h-full w-full items-center justify-center">
          <AssetImage
            src={asset.cachedImageUrl}
            fallback={asset.metadata.image}
            imageData={asset.metadata.image_data}
            height={380}
            width={320}
            className="relative  h-full w-full rounded-xl object-contain p-[10%]"
          />
        </div>
      </AspectRatio>
    </div>
  )
}
