import React from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { cosmikClient } from "@/services/clients"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast/use-toast"

export type RequestAuthorizationStepProps = {
  userAddress: string
  onValid: () => void
}

export const RequestAuthorizationStep: React.FC<
  RequestAuthorizationStepProps
> = ({ userAddress, onValid }) => {
  const { initNewSignerRequest } = useWeb3OnboardContext()

  const handleNewSignerRequest = async () => {
    try {
      const addSignerRequest = await initNewSignerRequest(userAddress)
      const response = await cosmikClient.post(
        "new-signer-request",
        addSignerRequest
      )
      if (response.data.success) {
        console.log("response", response)
        onValid()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error sending the authorization request.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <p className="text-muted-foreground">
        The Cosmik Battle marketplace requires permission to access your
        collectible items. This will allow you to manage them directly from the
        markertplace. This step is mandatory to link to your Cosmik Battle
        account.
      </p>
      <Button size="lg" onClick={handleNewSignerRequest}>
        Request Authorization
      </Button>
    </>
  )
}
