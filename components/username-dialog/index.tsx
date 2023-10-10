import { manifest } from "@/manifests"
import { User } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { UsernameDialogForm } from "./form"
import { UsernameFormValues } from "./types"

export type UsernameDialogProps = {
  onSubmit: (values: UsernameFormValues) => void
  children?: React.ReactNode
  asChild?: boolean
  open?: boolean
  onClose?: () => void
}

export function UsernameDialog({
  onSubmit,
  children,
  asChild,
  open,
  onClose,
}: UsernameDialogProps) {
  return (
    <Dialog modal open={open} onOpenChange={(v) => !v && onClose?.()}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User size={16} />
            Connect to {manifest.name}
          </DialogTitle>
          <DialogDescription>
            Enter your username to connect to the app, or create a new account.
          </DialogDescription>
        </DialogHeader>
        <UsernameDialogForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}
