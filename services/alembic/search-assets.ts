import {
  AssetWithTradeData,
  FilterDirection,
  FilterOrderBy,
  type AssetSearchFilters,
} from "@alembic/nft-api-sdk"
import {
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { Address } from "viem"

import { useNFTFilters } from "@/lib/utils/nft-filters"
import { findAssetInSearchResults } from "@/lib/utils/search"

import { comethMarketplaceClient } from "./client"

const ALEMBIC_PAGE_SIZE = 24

export type SearchOptions = {
  filters: AssetSearchFilters
  page: number
}

export type UseSearchOptions = {
  filters: AssetSearchFilters
}

export const search = async ({ filters, page }: SearchOptions) => {
  const { limit, skip } = {
    limit: ALEMBIC_PAGE_SIZE,
    skip: (page - 1) * ALEMBIC_PAGE_SIZE,
  }

  return comethMarketplaceClient.asset.searchAssets({
    limit,
    skip,
    ...filters,
  })
}

export const useSearchAssets = ({ filters }: UseSearchOptions) => {
  const { filters: qs } = useNFTFilters()

  const upperKey = (key: string) => key.charAt(0).toUpperCase() + key.slice(1)

  const excludedKeys = (key: string) => {
    return (
      key !== "isOnSale" &&
      key !== "orderBy" &&
      key !== "direction" &&
      key !== "ownerAddress" &&
      key !== "contractAddress"
    )
  }

  const parsedAttributes: [Record<string, string[]>] = [{}]

  Object.keys(qs).forEach((key) => {
    if (excludedKeys(key)) {
      const value = qs[key]
      if (value) {
        parsedAttributes[0][upperKey(key)] =
          typeof value === "string" ? [value] : value
      }
    }
  })

  if (Object.keys(parsedAttributes[0]).length === 0) {
    parsedAttributes.pop()
  }

  return useInfiniteQuery(
    ["alembic", "search", filters],
    ({ pageParam = 1 }) => {
      return search({
        filters: {
          ...filters,
          isOnSale: (qs.isOnSale),
          orderBy: (qs.orderBy) ?? FilterOrderBy.PRICE,
          direction: (qs.direction) ?? FilterDirection.ASC,
          ...(parsedAttributes.length > 0
            ? { attributes: parsedAttributes }
            : {}),
        },
        page: pageParam
      })
    },
    {
      cacheTime: 0,
      getNextPageParam: (lastPage, allPages) => {
        return allPages.length + 1
      },
    }
  )
}

export type FetchAssetOptions = {
  contractAddress: Address
  assetId: string
}

export const fetchAsset = async ({
  contractAddress,
  assetId,
}: FetchAssetOptions) => {
  return comethMarketplaceClient.asset.getAsset(contractAddress, assetId)
}

export const useAssetDetails = (contractAddress: Address, assetId: string) => {
  const client = useQueryClient()

  return useQuery(
    ["alembic", "assets", assetId],
    () => fetchAsset({ contractAddress, assetId }),
    {
      initialData: () => {
        const search = client.getQueriesData<
          UseInfiniteQueryResult<AssetWithTradeData[]>
        >(["alembic", "search"])
        return findAssetInSearchResults(search, assetId)
      },
    }
  )
}