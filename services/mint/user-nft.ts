"use client"

import { useCallback, useEffect } from "react"
import { manifest } from "@/manifests"
import { AssetWithTradeData } from "@alembic/nft-api-sdk"
import { useQuery } from "@tanstack/react-query"
import { atom, useAtomValue, useSetAtom } from "jotai"
import { atomFamily } from "jotai/utils"
import { Address } from "viem"

import { useCurrentViewerAddress } from "@/lib/web3/auth"

import { search } from "../alembic/search-assets"

const OPTIMISTIC_KEY = "optimistic-user-asset"

const getLocalStorageValue = (address: Address) => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(`${OPTIMISTIC_KEY}-${address}`)
}

export const setLocalStorageValue = (address: Address, value: string) => {
  if (typeof window === "undefined") return
  localStorage.setItem(`${OPTIMISTIC_KEY}-${address}`, value)
}

const optimisticUserAssetAtomFamily = atomFamily((address: Address) =>
  atom<AssetWithTradeData | null>(null)
)

const optimisticUserAssetAtomFamilyWithPersistence = atomFamily(
  (address?: Address | null) =>
    atom(
      (get) => {
        if (!address) return null
        return (
          get(optimisticUserAssetAtomFamily(address)) ??
          deserializeAsset(getLocalStorageValue(address))
        )
      },
      (_, set, asset: AssetWithTradeData) => {
        if (!address) return
        set(optimisticUserAssetAtomFamily(address), asset)
        setLocalStorageValue(asset.owner as Address, serializeAsset(asset))
      }
    )
)

export const useSetUserOptimisticAsset = () => {
  const viewerAddress = useCurrentViewerAddress()
  const set = useSetAtom(
    optimisticUserAssetAtomFamilyWithPersistence(viewerAddress)
  )
  const setAsset = useCallback(
    (asset: AssetWithTradeData) => {
      set(asset)
    },
    [set]
  )

  return setAsset
}

export const useViewerAsset = () => {
  const viewerAddress = useCurrentViewerAddress()
  const optimisticAsset = useAtomValue(
    optimisticUserAssetAtomFamilyWithPersistence(viewerAddress)
  )

  const query = useQuery(["optimistic-user-asset", viewerAddress], async () => {
    if (!viewerAddress) return null
    const assets = await search({
      filters: {
        contractAddress: manifest.contractAddress,
        limit: 1,
        owner: viewerAddress,
      },
      page: 1,
    })
    return assets.assets[0] ?? optimisticAsset ?? null
  })

  const { refetch } = query
  useEffect(() => {
    if (optimisticAsset) {
      refetch()
    }
  }, [optimisticAsset, refetch])

  return query
}

export function serializeAsset(asset: AssetWithTradeData) {
  return JSON.stringify(asset)
}

export function deserializeAsset(
  str: string | null
): AssetWithTradeData | null {
  if (!str) return null
  try {
    return JSON.parse(str) as AssetWithTradeData
  } catch (e) {
    return null
  }
}
