import { useEffect, useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import {
  fetchHasEnoughGas,
  useHasEnoughGas,
} from "@/services/balance/has-enough-gas"

import globalConfig from "@/config/globalConfig"
import { useCurrentViewerAddress, useIsComethWallet } from "@/lib/web3/auth"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"
import { toast } from "@/components/ui/toast/use-toast"

export type RefreshStepProps = {
  userAddress: string
  onValid: () => void
}

export const RefreshStep: React.FC<RefreshStepProps> = ({
  userAddress,
  onValid,
}) => {
  const { initNewSignerRequest, retrieveWalletAddressFromSigner } =
    useWeb3OnboardContext()
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await retrieveWalletAddressFromSigner(userAddress)
      toast({
        title: "Device succesfully Authorized!",
        description:
          "Your Cosmik Battle account has been successfully linked to the marketplace.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error in handleRefresh", error)
    } finally {
      setIsLoading(false)
      onValid()
    }
  }

  return (
    <>
      <p className="text-muted-foreground">
        Please log-in to Cosmik Battle and validate this device to retrieve your
        items. Once this device is validated, please press refresh to update
        your inventory.
      </p>
      <Button
        size="lg"
        onClick={handleRefresh}
        isLoading={isLoading}
        disabled={isLoading}
      >
        Refresh
      </Button>
    </>
  )
}
