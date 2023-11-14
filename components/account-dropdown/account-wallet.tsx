import { useState } from "react"
import Image from "next/image"
import { manifest } from "@/manifests"
import { useFormatMainBalance } from "@/services/balance/main"
import { useFormatWrappedBalance } from "@/services/balance/wrapped"

import { WrapButton } from "../asset-actions/buttons/wrap"
import { Button } from "../ui/button"

type AccountWalletProps = {
  name: string
  icon: string
  isComethWallet: boolean
  handleConnect?: (isAlembicWallet: boolean) => Promise<void>
}

export function AccountWallet({
  name,
  icon,
  isComethWallet,
  handleConnect,
}: AccountWalletProps) {
  return (
    <div>
      {!isComethWallet && (
        <div className="mb-1 text-sm font-semibold">External wallet</div>
      )}
      <Button
        variant="secondary"
        className="h-12 w-full justify-start gap-2 font-extrabold"
        onClick={() => handleConnect && handleConnect(name === "Cometh")}
      >
        <Image
          src={icon}
          width={30}
          height={30}
          alt={name}
          className="rounded-full"
        />
        <span className="text-base font-semibold">{name}</span>
      </Button>
    </div>
  )
}
