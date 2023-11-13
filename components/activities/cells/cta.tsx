import { useCanAcceptBuyOffer } from "@/services/orders/accept-buy-offer"
import {
  useCanCancelBuyOffer,
  useCancelBuyOffer,
} from "@/services/orders/cancel-buy-offer"
import { Row } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"
import { Button } from "@/components/ui/button"
import { AcceptBuyOfferButton } from "@/components/asset-actions/buttons/accept-buy-offer"

export type CTACellProps = {
  row: Row<BuyOffer>
}

const CancelBuyOfferCell = ({ row }: CTACellProps) => {
  const { mutateAsync: cancel, isLoading } = useCancelBuyOffer()

  return (
    <Button
      variant="link"
      onClick={async () => await cancel({ offer: row.original })}
      isLoading={isLoading}
      disabled={isLoading}
    >
      Cancel
    </Button>
  )
}

export const CTACell = ({ row }: CTACellProps) => {
  const canAcceptBuyOffer = useCanAcceptBuyOffer({ offer: row.original })
  const canCancelBuyOffer = useCanCancelBuyOffer({ offer: row.original })

  if (canAcceptBuyOffer) return <AcceptBuyOfferButton offer={row.original} />
  if (canCancelBuyOffer) return <CancelBuyOfferCell row={row} />

  return null
}
