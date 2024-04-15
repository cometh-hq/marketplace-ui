import Link from "next/link"
import { useGetCollection } from "@/services/cometh-marketplace/collectionService"
import { Row } from "@tanstack/react-table"
import { Address } from "viem"

import { Button } from "@/components/ui/Button"
import { OrderWithAsset } from "@cometh/marketplace-sdk"

export type CollectionCellProps = {
  row: Row<OrderWithAsset>
}

export const CollectionCell = ({ row }: CollectionCellProps) => {
  const tokenAddress = row.original.tokenAddress
  const { data: collection } = useGetCollection(tokenAddress as Address)

  return (
    <Link href={`/nfts/${tokenAddress}`}>
      <Button variant="ghost" className="gap-x-2 font-medium">
        {collection?.name || "Collection"}
      </Button>
    </Link>
  )
}
