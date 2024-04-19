import { useCancelOrder } from "@/services/orders/cancelOrderHooks"
import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { Row } from "@tanstack/react-table"
import { useAccount } from "wagmi"

import { Button } from "@/components/ui/Button"
import { BuyAssetButton } from "@/components/asset-actions/buttons/BuyAssetButton"

export type ListingCTAsCellProps = {
  row: Row<OrderWithAsset>
}

const CancelListingButton = ({ row }: ListingCTAsCellProps) => {
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

export const ListingCTAsCell = ({ row }: ListingCTAsCellProps) => {
  const account = useAccount()
  const userAddress = account.address?.toLowerCase()
  const isListingMaker = row.original.maker.toLowerCase() === userAddress

  const asset = row.original.asset

  if (!asset) {
    return null
  }

  return (
    <>
      {isListingMaker ? (
        <CancelListingButton row={row} />
      ) : (
        <BuyAssetButton size="sm" asset={asset} listing={row.original} />
      )}
    </>
  )
}
