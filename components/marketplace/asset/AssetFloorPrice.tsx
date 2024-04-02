import { useMemo } from "react"
import { useSearchAssets } from "@/services/cometh-marketplace/searchAssetsService"
import {
  AssetAttributeSearch,
  AssetWithTradeData,
  FilterDirection,
  FilterOrderBy,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { Card, CardContent } from "@/components/ui/Card"
import { Link } from "@/components/ui/Link"
import { Price } from "@/components/ui/Price"

type AssetFloorPriceProps = {
  asset: AssetWithTradeData
}

function FloorPriceAsset({
  floorPriceAsset,
  pageAsset,
}: {
  floorPriceAsset: SearchAssetWithTradeData
  pageAsset: AssetWithTradeData
}) {
  return floorPriceAsset.orderbookStats.lowestListingPrice ? (
    <div className="flex flex-wrap after:items-center">
      <div className="grow">
        <Link
          href={`/nfts/${floorPriceAsset.contractAddress}/${floorPriceAsset.tokenId}`}
          className="ml-1 font-semibold"
        >
          {floorPriceAsset.metadata.name}
        </Link>
      </div>
      <div>
        <Price
          size="lg"
          amount={floorPriceAsset.orderbookStats.lowestListingPrice}
          shouldDisplayFiatPrice={true}
        />
      </div>
    </div>
  ) : (
    <div className="text-center  font-medium">
      No equivalent NFT is on sale.
    </div>
  )
}

export default function AssetFloorPrice({ asset }: AssetFloorPriceProps) {
  const floorPriceAttributeTypes = useMemo(() => {
    return globalConfig.collectionSettingsByAddress[
      asset.contractAddress.toLowerCase() as Address
    ].floorPriceAttributeTypes
  }, [asset.contractAddress])

  const attributeFilters = useMemo(() => {
    const filters: AssetAttributeSearch = {}
    floorPriceAttributeTypes.forEach((type) => {
      const matchingAttribute = asset.metadata.attributes.find(
        (attribute) => attribute.trait_type === type
      )
      if (matchingAttribute && matchingAttribute.value) {
        filters[matchingAttribute.trait_type] = [matchingAttribute.value]
      }
    })
    return [filters]
  }, [asset.metadata.attributes, floorPriceAttributeTypes])

  const floorPriceSearch = useSearchAssets({
    contractAddress: asset.contractAddress,
    orderBy: FilterOrderBy.PRICE,
    direction: FilterDirection.ASC,
    attributes: attributeFilters,
    limit: 1,
  })
  const floorPriceAsset = useMemo(() => {
    return floorPriceSearch.data?.assets[0]
  }, [floorPriceSearch.data?.assets])

  if (floorPriceAttributeTypes.length === 0) {
    return null
  }

  return (
    <Card className="mt-4">
      <CardContent className="py-[22px]">
        <div className="">
          <div className="mb-2 font-semibold">
            Floor price for equivalent NFTs
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            {Object.entries(attributeFilters[0]).map(([key, value]) => (
              <div
                className="bg-card rounded-lg border p-2 text-sm shadow-sm"
                key={key}
              >
                <span className="text-foreground/60 font-medium">{key}:</span>{" "}
                <span className="ml-1 font-medium">{value[0].toString()}</span>
              </div>
            ))}
          </div>
          {floorPriceSearch.isLoading ? (
            <div className="text-center font-medium">
              Loading floor price...
            </div>
          ) : (
            <div className="">
              {floorPriceAsset ? (
                <FloorPriceAsset
                  floorPriceAsset={floorPriceAsset}
                  pageAsset={asset}
                />
              ) : (
                <div className="text-center font-medium">
                  No equivalent NFT found.
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
