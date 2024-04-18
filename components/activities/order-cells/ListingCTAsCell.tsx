import { useIsViewerAnOwner } from "@/services/cometh-marketplace/assetOwners"
import { useCanAcceptBuyOffer } from "@/services/orders/acceptBuyOfferService"
import {
  useCanCancelBuyOffer,
  useCancelBuyOffer,
} from "@/services/orders/cancelBuyOfferService"
import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { Row } from "@tanstack/react-table"
import { useAccount } from "wagmi"

import { Button } from "@/components/ui/Button"
import { AcceptBuyOfferButton } from "@/components/asset-actions/buttons/AcceptBuyOfferButton"
import { CancelListingButton } from "@/components/asset-actions/buttons/CancelListingButton"

export type OfferCTAsCellProps = {
  row: Row<OrderWithAsset>
}

const CancelBuyOfferButton = ({ row }: OfferCTAsCellProps) => {
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

export const OfferCTAsCell = ({ row }: OfferCTAsCellProps) => {
  const account = useAccount()
  const userAddress = account.address?.toLowerCase()
  const isListingMaker = row.original.maker.toLowerCase() === userAddress

// TODO: Make simple button to cancel listing
// TODO: Add quantity in BuyStep

  if (isListingMaker)
    return <CancelListingButton />
  if (canCancelBuyOffer) return 

  return null
}
