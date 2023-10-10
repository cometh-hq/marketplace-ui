import { useMemo } from "react"
import Image, { ImageProps } from "next/image"
import { AssetWithTradeData } from "@alembic/nft-api-sdk"

import { cn } from "@/lib/utils/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { AssetImage } from "@/components/ui/asset-image"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentViewerAddress } from "@/lib/web3/auth"

export const AssetHeaderImage = ({ asset }: { asset: AssetWithTradeData }) => {
  const viewerAddress = useCurrentViewerAddress()

  const owner = useMemo(() => {
    return asset.owner === viewerAddress
  }, [viewerAddress, asset.owner])

  if (!asset.cachedImageUrl) {
    return null
  }

  return (
    <div
      className={cn("w-full lg:w-[55%] overflow-hidden rounded-xl", owner ? "bg-[#f4f2e8]" : "bg-ghost")}
    >
      <AspectRatio ratio={1}>
        <div className="relative flex h-full w-full items-center justify-center">
          <Skeleton className={cn("absolute inset-0 z-0 h-full w-full", owner && "bg-[#f4f2e8]")} />
          <AssetImage
            src={asset.cachedImageUrl}
            fallback={asset.metadata.image}
            height={380}
            width={320}
            className="relative z-10 h-full w-full rounded-xl object-contain p-[10%]"
          />
        </div>
      </AspectRatio>
    </div>
  )
}
