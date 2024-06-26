"use client"

import { useCallback } from "react"
import { useCancelListing } from "@/services/orders/cancelListingService"
import { AssetWithTradeData, SearchAssetWithTradeData } from "@cometh/marketplace-sdk"

import { Button } from "@/components/ui/Button"

export type CancelListingButtonProps = {
  asset: AssetWithTradeData | SearchAssetWithTradeData
}

export function CancelListingButton({ asset }: CancelListingButtonProps) {
  const { mutateAsync: cancel, isPending } = useCancelListing()

  const onConfirm = useCallback(async () => {
    await cancel(asset)
  }, [asset, cancel])

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={onConfirm}
      disabled={isPending}
      isLoading={isPending}
    >
      Cancel Listing
    </Button>
  )
}
