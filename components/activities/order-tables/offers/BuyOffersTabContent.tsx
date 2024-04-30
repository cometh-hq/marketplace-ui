"use client"

import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Address } from "viem"

import { TabsContent } from "@/components/ui/Tabs"
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"
import { useBuyOffersSearch } from "@/components/trade-activities/activityDataHooks"

import { BuyOffersTable } from "./BuyOffersTable"

export type ActivitiesBuyOffersTabContentProps = {
  asset?: AssetWithTradeData
  maker?: Address
  owner?: Address
  tabKey?: string
  filteredOutMaker?: Address
}

export const BuyOffersTabContent = ({
  asset,
  maker,
  owner,
  tabKey = "buy-offers",
  filteredOutMaker,
}: ActivitiesBuyOffersTabContentProps) => {
  const isErc1155 = useAssetIs1155(asset) || !asset

  const { offers, isPending } = useBuyOffersSearch({
    asset,
    maker,
    owner,
    filteredOutMaker,
  })

  return (
    <TabsContent value={tabKey} className="w-full">
      {offers && !isPending ? (
        <BuyOffersTable
          offers={offers}
          isErc1155={isErc1155}
          isSpecificAsset={!!asset}
        />
      ) : (
        <div className="w-full p-4 text-center">Loading purchase offers...</div>
      )}
    </TabsContent>
  )
}
