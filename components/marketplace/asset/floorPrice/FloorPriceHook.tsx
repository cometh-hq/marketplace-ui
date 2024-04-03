import { useMemo } from "react"
import { useSearchAssets } from "@/services/cometh-marketplace/searchAssetsService"
import {
  AssetAttribute,
  AssetAttributeSearch,
  AssetWithTradeData,
  FilterDirection,
  FilterOrderBy,
} from "@cometh/marketplace-sdk"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"

const isAttributeDefined = (
  attribute: AssetAttribute | undefined
): attribute is AssetAttribute => {
  return attribute !== undefined
}

export const useAssetFloorPriceAttributes = (asset: AssetWithTradeData | undefined) => {
  return useMemo(() => {
    if(!asset) return []

    const floorPriceAttributeTypes =
      globalConfig.collectionSettingsByAddress[
        asset.contractAddress.toLowerCase() as Address
      ].floorPriceAttributeTypes

    const allAttributes = floorPriceAttributeTypes.map((type) => {
      const matchingAttribute = asset.metadata.attributes.find(
        (attribute) => attribute.trait_type === type
      )
      return matchingAttribute
    })

    const definedAttributes: AssetAttribute[] = allAttributes.filter(isAttributeDefined)
    return definedAttributes
  }, [asset])
}

export const useFloorPriceAsset = (asset: AssetWithTradeData | undefined) => {
  const assetFloorPriceAttributes = useAssetFloorPriceAttributes(asset)

  const attributeFilters = useMemo(() => {
    const filters: AssetAttributeSearch = {}
    assetFloorPriceAttributes.forEach((floorPriceAttribute) => {
      if (floorPriceAttribute && floorPriceAttribute.value) {
        filters[floorPriceAttribute.trait_type] = [floorPriceAttribute.value]
      }
    })

    return [filters]
  }, [assetFloorPriceAttributes])

  const floorPriceSearch =  useSearchAssets({
    contractAddress: asset?.contractAddress,
    orderBy: FilterOrderBy.PRICE,
    direction: FilterDirection.ASC,
    attributes: attributeFilters,
    isOnSale: true,
    limit: 1,
  }) 
  const floorPriceAsset = useMemo(() => {
    return floorPriceSearch.data?.assets[0]
  }, [floorPriceSearch.data?.assets])

  return { isLoading: floorPriceSearch.isLoading, floorPriceAsset }
}
