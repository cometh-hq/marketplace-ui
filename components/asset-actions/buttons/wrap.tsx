import { Button } from "@/components/ui/button"
import { WrapDialog } from "@/components/wrap-dialog"
import { manifest } from "@/manifests"
import { useState } from "react"

type WrapButtonProps = {
  isUnwrap?: boolean
  onToggleMode?: () => void
}

export function WrapButton({ isUnwrap, onToggleMode }: WrapButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <WrapDialog
      open={isOpen}
      onClose={handleClose}
      isUnwrap={isUnwrap}
      onToggleMode={onToggleMode}
      asChild
    >
      <Button
        variant="secondary"
        onClick={() => setIsOpen(true)}
      >
        Swap {manifest.currency.wrapped.name}
      </Button>
    </WrapDialog>
  )
}