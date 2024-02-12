import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useNewSignerRequest } from "@/services/cosmik/new-signer-request"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User } from "@/components/account-dropdown/signin-dropdown"
import axios from "axios"
import { toast } from "./toast/use-toast"
import { cosmikClient } from "@/services/clients"

type AddNewDeviceDialogProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>
  onClose: () => void
}

export function AddNewDeviceDialog({
  setIsOpen,
  onClose,
}: AddNewDeviceDialogProps) {
  const { initNewSignerRequest, retrieveWalletAddressFromSigner } = useWeb3OnboardContext()
  const {
    mutateAsync: newSignerRequest,
    isPending,
    isSuccess,
  } = useNewSignerRequest()
  const [user, setUser] = useState<User | null>(null)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem("user")
    if (userFromLocalStorage) {
      const user: User = JSON.parse(userFromLocalStorage)
      setUser(user)
    }
  }, [isSuccess])

  const handleNewSignerRequest = async () => {
    try {
      console.log(user!.address)
      const addSignerRequest = await initNewSignerRequest(user!.address)
      const response = await cosmikClient.post(
        "/new-signer-request",
        addSignerRequest,
        {
          withCredentials: true,
        }
      )
      // setIsOpen(false)
      if (response.data.success && step === 0) {
        setStep(1)
      } else if (response.data.success && step === 1) {
        console.log("response", response.data)
        setIsOpen(false)
      }
    } catch (error) {
      console.error("Error in handleNewSignerRequest", error)
      // setIsOpen(false)
    }
  }

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const retrieveWalletAddress = await retrieveWalletAddressFromSigner(user?.address!)
      console.log("retrieveWalletAddress", retrieveWalletAddress)
      // display toast 
      toast({
        title: "Device succesfully Authorized!",
        description: "Your Cosmik Battle account has been successfully linked to the marketplace.",
        variant: "default"
      })
      setIsOpen(false)
    } catch (error) {
      console.error("Error in handleRefresh", error)
      setIsOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog modal open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 0
              ? "Request for Items Authorization"
              : "Access Authorization"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {step === 0 ? (
            <>
              The Cosmik Battle marketplace requires permission to access your
              collectible items. This will allow you to manage them directly
              from the markertplace. This step is mandatory to link to your
              Cosmik Battle account.
            </>
          ) : (
            <>
              Please log-in to Cosmik Battle and validate this device to
              retrieve your items. Once this device is validated, please press
              refresh to update your inventory.
            </>
          )}
        </DialogDescription>
        {step === 0 ? (
          <Button
            size="lg"
            onClick={handleNewSignerRequest}
            isLoading={isPending}
            disabled={isPending}
          >
            Request Authorization
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleRefresh}
            isLoading={loading}
            disabled={loading}
          >
            Refresh
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
