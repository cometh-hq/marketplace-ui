"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useFilterableNFTsQuery } from "@/services/cometh-marketplace/searchAssetsService"
import { AssetSearchFilters } from "@cometh/marketplace-sdk"
import { useInView } from "react-intersection-observer"
import { useWindowSize } from "usehooks-ts"

import {
  deserializeFilters,
  SerializedMarketplacePanelFilters,
} from "@/lib/utils/seed"
import { Loading } from "@/components/ui/Loading"

import { AssetCard } from "./AssetCard"
import { AssetCardsList } from "./AssetCardsList"
import { AssetsSearchEmpty } from "./AssetSearchEmpty"
import { FiltersDropdown } from "./Filters/FiltersDropdown"
import FiltersFullscreen from "./Filters/FiltersFullscreen"
import { FiltersResetBtn } from "./Filters/FiltersResetBtn"
import { NFTStateFilters } from "./NftStateFilters"
import { SearchAsset } from "./SearchAsset"
import { MarketplaceSortDropdown } from "./SortDropdown"

export type AssetsSearchGridProps = {
  filters: SerializedMarketplacePanelFilters
  filteredBy?: Omit<AssetSearchFilters, "contractAddress">
}

export const AssetsSearchGrid = ({
  filters: filtersRaw,
  filteredBy = {},
}: any) => {
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.01,
    rootMargin: "0px 0px 2000px 0px",
  })
  const [search, setSearch] = useState("")
  const [initialResults, setInitialResults] = useState<number | null>(null)

  const attributesFilterOptions = useMemo(
    () => deserializeFilters(filtersRaw),
    [filtersRaw]
  )

  const {
    data: nfts,
    refetch,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useFilterableNFTsQuery({
    search,
    ...filteredBy,
  })

  const assets = useMemo(() => {
    return (nfts?.pages ?? []).map((r) => r?.nfts.assets).flat()
  }, [nfts?.pages])

  const totalNbAssets = useMemo(() => {
    return nfts?.pages[0]?.total ?? 0
  }, [nfts?.pages])

  useEffect(() => {
    if (totalNbAssets && initialResults === null) {
      setInitialResults(totalNbAssets)
    }
  }, [totalNbAssets, initialResults, setInitialResults])

  useEffect(() => {
    if (inView && !isLoading) fetchNextPage()
  }, [inView, isLoading, fetchNextPage])

  const { width } = useWindowSize()
  const isMobile = width < 768

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="relative flex w-full flex-wrap items-center justify-between gap-4">
        <Suspense>
          <NFTStateFilters assets={assets} results={totalNbAssets} />
        </Suspense>
        <div className="flex items-center justify-between gap-3 max-md:w-full">
          <SearchAsset onChange={setSearch} />
          <div className="flex gap-3">
            {isMobile ? (
              <FiltersFullscreen
                attributeFilterOptions={attributesFilterOptions}
              />
            ) : (
              <>
                <FiltersDropdown
                  attributeFilterOptions={attributesFilterOptions}
                />
                <FiltersResetBtn />
              </>
            )}
            <Suspense>
              <MarketplaceSortDropdown />
            </Suspense>
          </div>
        </div>
      </div>
      <p className="mb-10 mt-3 w-full pl-2 text-left text-sm">
        <strong>
          {totalNbAssets} asset{totalNbAssets > 1 && "s"}
        </strong>{" "}
        matching your search
      </p>

      {isLoading && <Loading />}

      {!isLoading && assets.length === 0 ? (
        <AssetsSearchEmpty />
      ) : (
        <>
          <AssetCardsList>
            {assets.map((asset) => (
              <AssetCard key={asset.tokenId} asset={asset} />
            ))}
          </AssetCardsList>
          <div ref={loadMoreRef} className="py-10">
            {isFetchingNextPage ? (
              <div className="text-muted-foreground flex flex-col items-center font-medium ">
                <div>Loading more NFTs... </div>
                <Loading />
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
