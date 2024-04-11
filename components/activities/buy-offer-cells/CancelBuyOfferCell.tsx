import { useCanAcceptBuyOffer } from "@/services/orders/acceptBuyOfferService"
import {
  useCanCancelBuyOffer,
  useCancelBuyOffer,
} from "@/services/orders/cancelBuyOfferService"
import { Row } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"
import { Button } from "@/components/ui/Button"
import { AcceptBuyOfferButton } from "@/components/asset-actions/buttons/AcceptBuyOfferButton"

export type CTACellProps = {
  row: Row<BuyOffer>
}

const CancelBuyOfferCell = ({ row }: CTACellProps) => {
  const { mutateAsync: cancel, isPending } = useCancelBuyOffer()

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

export const CTACell = ({ row }: CTACellProps) => {
  const canAcceptBuyOffer = useCanAcceptBuyOffer({ offer: row.original })
  const canCancelBuyOffer = useCanCancelBuyOffer({ offer: row.original })

  if (canAcceptBuyOffer) return <AcceptBuyOfferButton offer={row.original} />
  if (canCancelBuyOffer) return <CancelBuyOfferCell row={row} />

  return null
}
