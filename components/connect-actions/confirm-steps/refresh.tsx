import { useEffect, useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useStorageWallet } from "@/services/web3/use-storage-wallet"
import { useWalletConnect } from "@/services/web3/use-wallet-connect"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast/use-toast"

export type RefreshStepProps = {
  userAddress: string
  onValid: () => void
}

export const RefreshStep: React.FC<RefreshStepProps> = ({
  userAddress,
  onValid,
}) => {
  const { initOnboard, retrieveWalletAddressFromSigner, setIsconnected } =
    useWeb3OnboardContext()
  const [isLoading, setIsLoading] = useState(false)
  const { connect: connectWallet } = useWalletConnect()
  const { comethWalletAddressInStorage } = useStorageWallet()
  const [canRefresh, setCanRefresh] = useState(false)

  useEffect(() => {
    const retrieveWalletAddress = async () => {
      await retrieveWalletAddressFromSigner(userAddress)
      setCanRefresh(true)
    }

    // polling to check if the user has authorized the device
    const interval = setInterval(retrieveWalletAddress, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await retrieveWalletAddressFromSigner(userAddress)
      
      try {
        initOnboard({
          isComethWallet: true,
          walletAddress: comethWalletAddressInStorage!,
        })
        await connectWallet({ isComethWallet: true })
        setIsconnected(true)
        onValid()
      } catch (error) {
        console.error("Error connecting wallet", error)
      }

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
        disabled={isLoading || !canRefresh}
      >
        Refresh
      </Button>
    </>
  )
}
