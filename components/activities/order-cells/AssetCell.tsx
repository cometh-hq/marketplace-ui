import Link from "next/link"
import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { Row } from "@tanstack/react-table"
import { ExternalLink } from "lucide-react"

import { shortenTokenId } from "@/lib/utils/formatToken"
import { Button } from "@/components/ui/Button"

export type AssetCellProps = {
  row: Row<OrderWithAsset>
}

export const AssetCell = ({ row }: AssetCellProps) => {
  const assetName = row.original.asset?.metadata.name
  const tokenId = row.original.tokenId
  const tokenAddress = row.original.tokenAddress

  return (
    <Link href={`/nfts/${tokenAddress}/${tokenId}`}>
      <Button variant="ghost" className="gap-x-2 font-medium">
        {`${assetName} #${shortenTokenId(tokenId, 7)}`}{" "}
        <ExternalLink size="16" />
      </Button>
    </Link>
  )
}
