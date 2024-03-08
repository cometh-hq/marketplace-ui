import Link from "next/link"
import { Row } from "@tanstack/react-table"
import { ExternalLink } from "lucide-react"

import { BuyOffer } from "@/types/buy-offers"
import { shortenTokenId } from "@/lib/utils/formatToken"
import { Button } from "@/components/ui/Button"

export type AssetCellProps = {
  row: Row<BuyOffer>
}

export const AssetCell = ({ row }: AssetCellProps) => {
  const assetName = row.original.trade.asset?.metadata.name
  const tokenId = row.original.trade.tokenId
  const tokenAddress = row.original.trade.tokenAddress

  return (
    <Link href={`/nfts/${tokenAddress}/${tokenId}`}>
      <Button variant="ghost" className="gap-x-2 font-medium">
        {`${assetName} #${shortenTokenId(tokenId, 7)}`}{" "}
        <ExternalLink size="16" />
      </Button>
    </Link>
  )
}
