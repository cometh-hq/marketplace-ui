import { useMemo } from "react"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
  TokenType,
} from "@cometh/marketplace-sdk"

export const useAssetIs1155 = (
  asset: AssetWithTradeData | SearchAssetWithTradeData
) => {
  return useMemo(() => asset.tokenType === TokenType.ERC1155, [asset.tokenType])
}
