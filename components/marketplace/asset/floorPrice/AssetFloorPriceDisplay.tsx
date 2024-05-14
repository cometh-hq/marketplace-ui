import { useMemo } from "react"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Link } from "@/components/ui/Link"
import { Price } from "@/components/ui/Price"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"

import { useAssetFloorPriceAttributes } from "./FloorPriceHook"

export function AssetFloorPriceDisplay({
  floorPriceAsset,
  pageAsset,
}: {
  floorPriceAsset?: SearchAssetWithTradeData
  pageAsset: AssetWithTradeData
}) {
  const assetFloorPriceAttributes = useAssetFloorPriceAttributes(pageAsset)

  const attributeQueryFilters = useMemo(() => {
    let queryFilters = "?orderBy=PRICE&direction=ASC&"
    const queryFiltersItems: string[] = []
    assetFloorPriceAttributes.forEach((attribute) => {
      if (attribute && attribute.value) {
        queryFiltersItems.push(`${attribute.trait_type}=${attribute.value}`)
      }
    })
    queryFilters += queryFiltersItems.join("&")
    return queryFilters
  }, [assetFloorPriceAttributes])



  return (
    <div className="flex flex-wrap items-center gap-2">
      <div>
        {floorPriceAsset && floorPriceAsset.orderbookStats.lowestListingPrice ? (
          <Price
            size="lg"
            amount={floorPriceAsset.orderbookStats.lowestListingPrice}
            shouldDisplayFiatPrice={true}
          />
        ) : (
          <div className="text-center  font-medium">No listing</div>
        )}
      </div>
      <div>
        <TooltipProvider delayDuration={200}>
          <Tooltip defaultOpen={false}>
            <TooltipTrigger asChild>
              <Link
                href={`/nfts/${pageAsset.contractAddress}${attributeQueryFilters}`}
                className="ml-1 font-semibold"
              >
                <Button variant="secondary" size="sm">
                  <SearchIcon size={16} />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent>
                <p className="text-sm font-bold">
                  Search cheapest equivalent NFTs
                </p>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
