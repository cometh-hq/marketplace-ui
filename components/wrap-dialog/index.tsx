import { manifest } from "@/manifests"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { WrapDialogForm } from "./form"
import { Separator } from "../ui/separator"

export type WrapDialogProps = {
  children?: React.ReactNode
  asChild?: boolean
  open?: boolean
  onClose: () => void
  isUnwrap?: boolean
  onToggleMode?: () => void
}

export function WrapDialog({
  children,
  asChild,
  open,
  onClose,
  isUnwrap,
  onToggleMode
}: WrapDialogProps) {
  return (
    <Dialog open={open} modal onOpenChange={(v) => !v && onClose()}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Convert Your Tokens
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className="font-medium">
            Easily convert your {manifest.currency.main.name} in one click. <br />
            This allows you to use your MATIC across various platforms more efficiently.
          </p>
        </DialogDescription>
        <Separator />
        <WrapDialogForm
          onClose={() => onClose()}
          isUnwrap={isUnwrap}
          onToggleMode={onToggleMode}
        />
      </DialogContent>
    </Dialog>
  )
}
