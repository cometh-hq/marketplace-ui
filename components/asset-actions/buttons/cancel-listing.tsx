"use client"

import { useCallback } from "react"
import { useCancelListing } from "@/services/orders/cancel-listing"
import { AssetWithTradeData } from '@cometh/marketplace-sdk'

import { Button } from "@/components/ui/button"
import { ButtonLoading } from "@/components/button-loading"
import { SwitchNetwork } from "./switch-network"

export type CancelListingButtonProps = {
  asset: AssetWithTradeData
}

export function CancelListingButton({ asset }: CancelListingButtonProps) {
  const { mutateAsync: cancel, isLoading } = useCancelListing()

  const onConfirm = useCallback(async () => {
    const tx = await cancel(asset)
  }, [asset, cancel])

  return (
    <>
      {isLoading ? (
        <ButtonLoading size="lg" />
      ) : (
      <SwitchNetwork
        callbackChildren={
          <Button className="w-full" size="lg" disabled>
            Cancel Listing
          </Button>
        }
      >
        <Button className="w-full" size="lg" onClick={onConfirm}>Cancel Listing</Button>
      </SwitchNetwork>
    )}
    </>
  )
}
