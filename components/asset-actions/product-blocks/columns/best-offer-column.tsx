import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { ExternalLink } from "lucide-react"

import { Price } from "@/components/ui/price"
import {
  ProductBlockDividedColumn,
  ProductBlockLabel,
} from "@/components/product-block"

export type BestOfferColumnProps = {
  asset: AssetWithTradeData
}

export const BestOfferColumn = ({ asset }: BestOfferColumnProps) => {
  return (
    <ProductBlockDividedColumn>
      <ProductBlockLabel>
        <span className="inline-flex items-center">
          Best Offer
        </span>
      </ProductBlockLabel>
      <Price variant="accent" amount={asset.orderbookStats.highestOfferPrice} />
    </ProductBlockDividedColumn>
  )
}
