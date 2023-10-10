import type { AssetWithTradeData } from "@alembic/nft-api-sdk"
import { QueryKey, UseInfiniteQueryResult } from "@tanstack/react-query"

/**
 * Helper function to quickly find an asset in the search results.
 * It will look in all the pages of all the queries for the asset.
 * I am using it in order to populate the initial data of the asset details page
 * so it appears instantly when navigating from the search page.
 */
export const findAssetInSearchResults = (
  search: [
    QueryKey,
    UseInfiniteQueryResult<AssetWithTradeData[]> | undefined
  ][],
  tokenId: string
) => {
  for (const [_, result] of search) {
    const assets = result?.data?.pages?.flat()
    const asset = assets?.find((asset) => asset.tokenId === tokenId)
    if (asset) {
      return asset
    }
  }
}
