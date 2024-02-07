import { cn } from "@/lib/utils/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Step, Stepper } from "@/components/ui/stepper"

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
  isVariantLink?: boolean
  variant?: string
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
  isVariantLink,
  variant,
  ...props
}: TransactionDialogProps<T>) {

  const componentOnOpenChange = (newOpen: boolean) => {
    onOpenChange?.(newOpen)
    if(!newOpen) onClose()
  } 

  return (
    <Dialog
      open={open}
      modal
      onOpenChange={componentOnOpenChange}
    >
      <DialogTrigger asChild>
        <Button
          size={isVariantLink ? "default" : "lg"}
          variant={isVariantLink ? "link" : variant || "default"}
          className={cn(isVariantLink && "h-auto p-0", "!bg-muted")}
          disabled={isDisabled}
          isLoading={isLoading}
          {...props}
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
