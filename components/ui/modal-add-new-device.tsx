import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useNewSignerRequest } from "@/services/cometh-marketplace/cosmik/new-signer-request"

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

type AddNewDeviceDialogProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>
  onClose: () => void
}

export function AddNewDeviceDialog({
  setIsOpen,
  onClose,
}: AddNewDeviceDialogProps) {
  const { initNewSignerRequest } = useWeb3OnboardContext()
  const {
    mutateAsync: newSignerRequest,
    isPending,
    isSuccess,
  } = useNewSignerRequest()
  const [user, setUser] = useState<User | null>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem("user")
    if (userFromLocalStorage) {
      const user: User = JSON.parse(userFromLocalStorage)
      setUser(user)
    }
  }, [])

  const handleNewSignerRequest = async () => {
    const addSignerRequest = await initNewSignerRequest(user!.address)
    const response = await newSignerRequest(addSignerRequest)
    console.log("response in handleNewSignerRequest", response)
    if (response.success) {
      // setIsOpen(false)
      setStep(1)
    }
    // try {
    //   console.log(user!.address)
    //   const addSignerRequest = await initNewSignerRequest(user!.address)
    //   const response = await axios.post(
    //     "https://api.develop.cosmikbattle.com/api/new-signer-request",
    //     addSignerRequest,
    //     {
    //       withCredentials: true,
    //     }
    //   )
    //   setIsOpen(false)
    // } catch (error) {
    //   console.error("Error", error)
    //   setIsOpen(false)
    // }
  }

  const handleRefreshSignerRequest = async () => {
   
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
            onClick={handleRefreshSignerRequest}
            // isLoading={isPending}
            // disabled={isPending}
          >
            Refresh
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
