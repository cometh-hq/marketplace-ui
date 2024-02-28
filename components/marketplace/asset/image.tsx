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
        "btn-default relative w-full overflow-hidden text-accent before:bg-transparent after:content-none lg:w-[55%]",
        owner ? "bg-[#f4f2e8]" : "bg-primary/20"
      )}
    >
      <AspectRatio ratio={1}>
        <div className="relative flex size-full items-center justify-center">
          <AssetImage
            src={asset.cachedImageUrl}
            fallback={asset.metadata.image}
            imageData={asset.metadata.image_data}
            height={879}
            width={560}
            className="size-full rounded-xl object-contain p-[3.5%]"
          />
        </div>
      </AspectRatio>
    </div>
  )
}
