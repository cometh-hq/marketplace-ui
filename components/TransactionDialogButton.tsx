import { cn } from "@/lib/utils/utils"
import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog"
import { Step, Stepper } from "@/components/ui/Stepper"

export type TransactionDialogProps<T extends Step> = {
  label: string | React.ReactNode
  steps: T[]
  currentStep: T
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onClose: () => void
  children: React.ReactNode[] | React.ReactNode
  isLoading?: boolean
  isDisabled?: boolean
} & React.ComponentProps<typeof Button>

export function TransactionDialogButton<T extends Step>({
  open,
  label,
  steps,
  children,
  currentStep,
  onOpenChange,
  onClose,
  isLoading,
  isDisabled,
  size = "lg",
}: TransactionDialogProps<T>) {
  const componentOnOpenChange = (newOpen: boolean) => {
    onOpenChange?.(newOpen)
    if (!newOpen) onClose()
  }
  return (
    <Dialog open={open} modal onOpenChange={componentOnOpenChange}>
      <DialogTrigger asChild>
        <Button
          size={size}
          className={cn(size === "sm" && "min-w-[64px]")}
          disabled={isDisabled}
          isLoading={isLoading}
        >
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(event) => {
          if (
            event.target instanceof HTMLElement &&
            event.target.closest("#cometh-gas-modal-wrapper")
          ) {
            event.preventDefault()
          }
        }}
      >
        <Stepper value={currentStep.value} steps={steps} />
        {children}
      </DialogContent>
    </Dialog>
  )
}
