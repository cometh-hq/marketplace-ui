import { Row } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export type LinkCellProps = {
  row: Row<BuyOffer>
}

export const LinkCell = ({ row }: LinkCellProps) => {
  // @ts-ignore
  const assetName = row.original.trade.asset.metadata.name
  const tokenId = row.original.trade.tokenId

  return (
    <Link href={`/marketplace/${tokenId}`} target="_blank" rel="noreferrer">
      <Button variant="ghost" className="font-medium gap-x-2">
      {`${assetName} #${tokenId}`} <ExternalLink size="16" />
      </Button>
    </Link>
  )
}
