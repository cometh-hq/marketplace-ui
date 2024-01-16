import { DialogClose } from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Step, Stepper } from "@/components/ui/stepper"

export type TransactionDialogProps<T extends Step> = {
  label: string | React.ReactNode
  steps: T[]
  currentStep: T
  onClose: () => void
  open?: boolean
  children: React.ReactNode[] | React.ReactNode
  isLoading?: boolean
  isDisabled?: boolean
  isVariantLink?: boolean
} & React.ComponentProps<typeof Button>

export function TransactionDialogButton<T extends Step>({
  label,
  steps,
  children,
  currentStep,
  open,
  onClose,
  isLoading,
  isDisabled,
  isVariantLink,
  ...props
}: TransactionDialogProps<T>) {
  const isLastStep = currentStep.value === steps[steps.length - 1].value

  return (
    <Dialog open={open} modal onOpenChange={(v) => !v && onClose()}>
      <DialogTrigger asChild>
        <Button
          size={isVariantLink ? "default" : "lg"}
          variant={isVariantLink ? "link" : "default"}
          className={cn(isVariantLink && "h-auto p-0")}
          disabled={isDisabled}
          isLoading={isLoading}
          {...props}
        >
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Stepper value={currentStep.value} steps={steps} />
        {children}
        {isLastStep && (
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={onClose}
                className="flex gap-1"
                size="sm"
                variant="outline"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
