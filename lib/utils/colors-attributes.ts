import { useMemo } from "react"
import {
  AssetAttribute,
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"

const COLORS: Record<string, string> = {
  Limited: "!bg-gradient-to-r !from-[#64FF9E]/20 !to-[#2B6F85]/20",
  green: "!bg-gradient-to-r !from-[#E526FC]/20 !to-[#2B4FFC]/20",
  yellow: "!bg-gradient-to-r !from-[#FFE4B7]/20 !to-[#B1B437]/20",
}

export const getAssetColor = (
  asset:
    | AssetWithTradeData
    | (SearchAssetWithTradeData & {
        metadata: {
          attributes?: AssetAttribute[]
        }
      })
) => {
  const colorAttribute = asset.metadata.attributes?.find(
    (attr: { trait_type: string }) => attr.trait_type === "Scarcity"
  )?.value as string | null | undefined
  
  return colorAttribute ? COLORS[colorAttribute] : null
}
