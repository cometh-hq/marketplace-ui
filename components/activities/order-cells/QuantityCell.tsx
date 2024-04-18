import { OrderWithAsset, TokenType } from "@cometh/marketplace-sdk"
import { Row } from "@tanstack/react-table"

import TokenQuantity from "@/components/erc1155/TokenQuantity"

export type QuantityCellProps = { row: Row<OrderWithAsset> }

export const QuantityCell = ({ row }: QuantityCellProps) => {
  return (
    <span className="font-bold">
      {row.original.tokenType === TokenType.ERC721 ? (
        <>Unique</>
      ) : (
        <TokenQuantity value={row.original.tokenQuantityRemaining} />
      )}
    </span>
  )
}
