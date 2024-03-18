import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { useAccount } from "wagmi"

import { cn } from "@/lib/utils/utils"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { AssetImage } from "@/components/ui/AssetImage"

export const AssetHeaderImage = ({
  asset,
}: {
  asset: SearchAssetWithTradeData | AssetWithTradeData
}) => {
  const account = useAccount()
  const viewerAddress = account.address
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
        "w-full overflow-hidden rounded-xl lg:w-[55%]",
        owner ? "bg-[#f4f2e8]" : "bg-muted"
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
            className="relative  size-full rounded-xl object-contain p-[10%]"
          />
        </div>
      </AspectRatio>
    </div>
  )
}
