import { User } from "@/services/cosmik/signin"

import { useStepper } from "@/lib/utils/stepper"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Case, Switch } from "@/components/utils/Switch"

import { RefreshStep } from "../confirm-steps/refresh"
import { RequestAuthorizationStep } from "../confirm-steps/request-authorization"

const authorizationSteps = [
  { label: "Request for Items Authorization", value: "request-authorization" },
  { label: "Access Authorization", value: "refresh" },
]

export type AuthorizationProcessProps = {
  isOpen: boolean
  onClose: () => void
  user: User
}

export function AuthorizationProcess({
  isOpen,
  onClose,
  user,
}: AuthorizationProcessProps) {
  const { currentStep, nextStep } = useStepper({
    steps: authorizationSteps,
  })

  if (!currentStep || !user) return null

  return (
    <Dialog open={isOpen}>
      <DialogContent shouldDisplayCloseBtn={false}>
        <DialogHeader>
          <DialogTitle>{currentStep.label}</DialogTitle>
        </DialogHeader>
        <Switch value={currentStep.value}>
          <Case value="request-authorization">
            <RequestAuthorizationStep
              userAddress={user.address}
              onValid={nextStep}
            />
          </Case>
          <Case value="refresh">
            <RefreshStep userAddress={user.address} onValid={onClose} />
          </Case>
        </Switch>
      </DialogContent>
    </Dialog>
  )
}
