import { useState } from "react"

import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/button"
import { WrapDialog } from "@/components/wrap-dialog"

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
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Swap {globalConfig.network.wrappedNativeToken.name}
      </Button>
    </WrapDialog>
  )
}
