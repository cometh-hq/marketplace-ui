import { OrderWithAsset, TokenType } from "@cometh/marketplace-sdk"
import { Row } from "@tanstack/react-table"

import { Price } from "@/components/ui/Price"
import { Progress, ProgressIndicator } from "@/components/ui/Progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import TokenQuantity from "@/components/erc1155/TokenQuantity"

export type OrderProgressCellProps = { row: Row<OrderWithAsset> }

export const OrderProgressCell = ({ row }: OrderProgressCellProps) => {
  if (row.original.tokenType === TokenType.ERC721)
    return <div className="font-bold">Open</div>

  return (
    <div>
      <TooltipProvider delayDuration={200}>
        <Tooltip defaultOpen={false}>
          <TooltipTrigger asChild>
            <Progress
              value={Number(row.original.tokenQuantityFilled)}
              max={Number(row.original.tokenQuantity)}
              className="border-muted-foreground relative h-6 w-full transform-gpu overflow-hidden rounded-full border"
              getValueLabel={(value, max) => value.toString()}
            >
              <ProgressIndicator
                style={{
                  transform: `translateX(-${100 - (Number(row.original.tokenQuantityFilled) * 100) / Number(row.original.tokenQuantity)}%)`,
                }}
                className="bg-primary size-full transition-transform duration-700 ease-in-out"
              ></ProgressIndicator>
            </Progress>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <p className="text-muted-foreground font-bold">Order progress</p>
              <p>
                <span className="font-medium">Quantity filled: </span>
                <span className="font-bold">
                  <TokenQuantity value={row.original.tokenQuantityFilled} />
                </span>
                <br />

                <span className="font-medium">Total quantity in order: </span>

                <span className="font-bold">
                  <TokenQuantity value={row.original.tokenQuantity} />
                </span>
              </p>
              <p className="text-muted-foreground mt-2 font-bold">
                Value Progress
              </p>
              <p>
                <span className="font-medium">Value filled: </span>
                <Price amount={row.original.erc20TokenAmountFilled} />
                <br />
                <span className="font-medium">Total value in order: </span>

                <Price amount={row.original.erc20TokenAmount} />
                <br />
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="text-muted-foreground mt-1 w-full text-center text-sm font-medium">
        <TokenQuantity value={row.original.tokenQuantityFilled} /> /{" "}
        <TokenQuantity value={row.original.tokenQuantity} />
      </div>
    </div>
  )
}
