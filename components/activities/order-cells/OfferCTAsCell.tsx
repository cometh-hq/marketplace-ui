import { useCanAcceptBuyOffer } from "@/services/orders/acceptBuyOfferService"
import {
  useCanCancelBuyOffer,
  useCancelOrder,
} from "@/services/orders/cancelOrderHooks"
import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/Button"
import { AcceptBuyOfferButton } from "@/components/asset-actions/buttons/AcceptBuyOfferButton"

export type OfferCTAsCellProps = {
  row: Row<OrderWithAsset>
}

const CancelBuyOfferButton = ({ row }: OfferCTAsCellProps) => {
  const { mutateAsync: cancel, isPending } = useCancelOrder()

  return (
    <Button
      variant="link"
      onClick={async () => await cancel({ offer: row.original })}
      isLoading={isPending}
      disabled={isPending}
    >
      Cancel
    </Button>
  )
}

export const OfferCTAsCell = ({ row }: OfferCTAsCellProps) => {
  const canAcceptBuyOffer = useCanAcceptBuyOffer({ offer: row.original })
  const canCancelBuyOffer = useCanCancelBuyOffer({ offer: row.original })

  if (canAcceptBuyOffer)
    return <AcceptBuyOfferButton size="sm" offer={row.original} />
  if (canCancelBuyOffer) return <CancelBuyOfferButton row={row} />

  return null
}
