import {
  AssetWithTradeData,
  FilterDirection,
  FilterOrderBy,
  type AssetSearchFilters,
} from "@cometh/marketplace-sdk"
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { useNFTFilters } from "@/lib/utils/nft-filters"
import { findAssetInSearchResults } from "@/lib/utils/search"

import { comethMarketplaceClient } from "../clients"

export type SearchOptions = {
  filters?: Omit<AssetSearchFilters, "contractAddress">
  page: number
  assetsPerPage: number
}

export type UseSearchOptions = {
  persistentFilters?: AssetSearchFilters
  search?: string
  page?: number
  owner?: string
}

const defaultFilters = {
  contractAddress: globalConfig.contractAddress,
  limit: 200,
}

const ASSETS_PER_PAGE = 20

export async function getAssetsPaginated(
  filters?: Omit<AssetSearchFilters, "contractAddress">,
  page: number = 1,
  assetsPerPage: number = ASSETS_PER_PAGE
) {
  const nfts = await comethMarketplaceClient.asset.searchAssets({
    ...defaultFilters,
    ...filters,
    skip: (page - 1) * assetsPerPage,
    limit: assetsPerPage,
  })

  const total = nfts.total
  const totalPages = Math.ceil(total / assetsPerPage)

  if (page && page >= totalPages) {
    return { nfts, total, nextPage: false }
  }

  return { nfts, total, nextPage: page + 1 }
}

export const useFilterableNFTsQuery = (options?: UseSearchOptions) => {
  const { filters } = useNFTFilters()

  const upperKey = (key: string) => key.charAt(0).toUpperCase() + key.slice(1)

  const excludedKeys = (key: string) => {
    return (
      key !== "isOnSale" &&
      key !== "orderBy" &&
      key !== "direction" &&
      key !== "owner" &&
      key !== "contractAddress"
    )
  }

  const parsedAttributes: [Record<string, string[]>] = [{}]

  Object.keys(filters).forEach((key) => {
    if (excludedKeys(key)) {
      const value = filters[key]
      if (value) {
        parsedAttributes[0][upperKey(key)] =
          typeof value === "string" ? [value] : value
      }
    }
  })

  if (Object.keys(parsedAttributes[0]).length === 0) {
    parsedAttributes.pop()
  }

  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["cometh", "search", JSON.stringify(filters), options?.page, options?.search],
    queryFn: ({ pageParam }) => {
      return getAssetsPaginated(
        {
          isOnSale: filters.isOnSale,
          orderBy: filters.orderBy ?? FilterOrderBy.LISTING_DATE,
          direction: filters.direction ?? FilterDirection.DESC,
          ...(parsedAttributes.length > 0
            ? { attributes: parsedAttributes }
            : {}),
          ...(options?.search && { name: options.search }),
          ...(options?.owner && { owner: options.owner }),
        },
        pageParam,
        ASSETS_PER_PAGE
      )
    },
    initialPageParam: 1,
    gcTime: 0,
    getNextPageParam: (_, lastPage) => {
      return lastPage.length + 1
    },
  })

  return {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }
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

  return useQuery({
    queryKey: ["cometh", "assets", assetId],
    queryFn: () => fetchAsset({ contractAddress, assetId }),

    initialData: () => {
      const search = client.getQueriesData<
        UseInfiniteQueryResult<AssetWithTradeData[]>
      >({ queryKey: ["cometh", "search"] })
      return findAssetInSearchResults(search, assetId)
    },
    refetchInterval: 2000
  })
}
