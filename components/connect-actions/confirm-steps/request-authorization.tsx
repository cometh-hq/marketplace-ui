import React, { useState } from "react"
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
  const [isLoading, setIsLoading] = useState(false)

  const handleNewSignerRequest = async () => {
    setIsLoading(true)
    try {
      const addSignerRequest = await initNewSignerRequest(userAddress)
      const response = await cosmikClient.post(
        "new-signer-request",
        addSignerRequest
      )
      if (response.data.success) {
        onValid()
      }
    } catch (error: any) {
      console.error("Error sending the authorization request", error)
      toast({
        title: "Error",
        description: error?.message || "There was an error sending the authorization request.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
      <Button size="lg" onClick={handleNewSignerRequest} isLoading={isLoading}>
        Request Authorization
      </Button>
    </>
  )
}
