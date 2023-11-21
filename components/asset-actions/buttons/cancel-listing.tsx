"use client"

import { useCallback } from "react"
import { useCancelListing } from "@/services/orders/cancel-listing"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"

import { Button } from "@/components/ui/button"

export type CancelListingButtonProps = {
  asset: AssetWithTradeData
}

export function CancelListingButton({ asset }: CancelListingButtonProps) {
  const { mutateAsync: cancel, isLoading } = useCancelListing()

  const onConfirm = useCallback(async () => {
    await cancel(asset)
  }, [asset, cancel])

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={onConfirm}
      disabled={isLoading}
      isLoading={isLoading}
    >
      Cancel Listing
    </Button>
  )
}
