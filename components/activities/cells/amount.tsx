import { Row } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"
import { Price } from "@/components/ui/price"
import { BigNumber } from "ethers"

export type AmountCellProps = {
  row: Row<BuyOffer>
}

export const AmountCell = ({ row }: AmountCellProps) => {
  const amount = row.original.amount
  const fees = row.original.trade.totalFees
  const amountWithFees = BigNumber.from(amount).add(fees).toString()
  
  return <Price size="sm" amount={amountWithFees} className="font-semibold" />
}
