import Link from "next/link"
import { Row } from "@tanstack/react-table"
import { ExternalLink } from "lucide-react"

import { BuyOffer } from "@/types/buy-offers"
import { env } from "@/config/env"
import { shortenTokenId } from "@/lib/utils/token"

export type AssetCellProps = {
  row: Row<BuyOffer>
}

export const AssetCell = ({ row }: AssetCellProps) => {
  const assetName = row.original.trade.asset?.metadata.name
  const tokenId = row.original.trade.tokenId

  return (
    <Link
      href={`${env.NEXT_PUBLIC_BASE_PATH}/marketplace/${tokenId}`}
      className="relative z-[1] inline-flex items-center gap-x-2 font-medium transition-colors hover:text-white"
    >
      {`${assetName} #${shortenTokenId(tokenId, 7)}`} <ExternalLink size="16" />
    </Link>
  )
}
