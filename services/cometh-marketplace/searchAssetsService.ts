import { useMemo } from "react"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
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

import { comethMarketplaceClient } from "@/lib/clients"
import { useNFTFilters } from "@/lib/utils/nftFilters"
import { findAssetInSearchResults } from "@/lib/utils/search"

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
  limit: 200,
}

const ASSETS_PER_PAGE = 20

export async function getAssetsPaginated(
  filters: AssetSearchFilters,
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

export const useSearchAssets = (searchFilters: Partial<AssetSearchFilters>) => {
  return useQuery({
    queryKey: ["assets", "search", JSON.stringify(searchFilters)],
    queryFn: async () => {
      const contractAddress = searchFilters.contractAddress
      if (contractAddress === undefined) {
        return undefined
      }
      return await comethMarketplaceClient.asset.searchAssets({
        ...searchFilters,
        contractAddress,
      })
    },
  })
}

const NON_ATTRIBUTE_PARAM_FILTERS = [
  "isOnSale",
  "orderBy",
  "direction",
  "owner",
  "contractAddress",
]

export const useCurrentAttributesFilters = () => {
  const { filters } = useNFTFilters()
  const currentAttributeFilters = useMemo(() => {
    const attributeKeys = Object.keys(filters).filter(
      (key) => !NON_ATTRIBUTE_PARAM_FILTERS.includes(key)
    )
    const attributeFilters: [Record<string, string[]>] = [{}]
    attributeKeys.forEach((key) => {
      const value = filters[key]
      if (value) {
        attributeFilters[0][key] = value
      }
    })

    if (Object.keys(attributeFilters[0]).length === 0) {
      attributeFilters.pop()
    }

    return attributeFilters
  }, [filters])

  return currentAttributeFilters
}

export const useFilterableNFTsQuery = (options?: UseSearchOptions) => {
  const { filters } = useNFTFilters()
  const { currentCollectionAddress } = useCurrentCollectionContext()

  const currentAttributesFilters = useCurrentAttributesFilters()

  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "cometh",
      "search",
      currentCollectionAddress,
      JSON.stringify(filters),
      options?.page,
      options?.search,
      options?.owner,
    ],
    queryFn: ({ pageParam }) => {
      return getAssetsPaginated(
        {
          contractAddress: currentCollectionAddress,
          isOnSale: filters.isOnSale,
          orderBy: filters.orderBy ?? FilterOrderBy.LISTING_DATE,
          direction: filters.direction ?? FilterDirection.DESC,
          ...(currentAttributesFilters.length > 0
            ? { attributes: currentAttributesFilters }
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

export const useGetAsset = (contractAddress: Address, assetId: string) => {
  return useQuery({
    queryKey: ["cometh", "getAsset", assetId],
    queryFn: () => fetchAsset({ contractAddress, assetId }),
  })
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
    refetchInterval: 2000,
  })
}
