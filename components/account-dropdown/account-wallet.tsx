import Image from "next/image"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"

import { Button } from "../ui/button"

type AccountWalletProps = {
  name: string
  icon: string
  isComethWallet: boolean
  handleConnect?: (isComethWallet: boolean) => Promise<void>
}

export function AccountWallet({
  name,
  icon,
  isComethWallet,
  handleConnect,
}: AccountWalletProps) {
  return (
    <DropdownMenuItem className="outline-none">
      {!isComethWallet && (
        <div className="mb-1 text-sm font-semibold">External wallet</div>
      )}
      <Button
        variant="secondary"
        className="h-12 w-full justify-start gap-2 text-[15px]"
        onClick={() => handleConnect && handleConnect(name === "Cometh")}
      >
        <Image
          src={icon}
          width={30}
          height={30}
          alt={name}
          className="rounded-full"
        />
        {name}
      </Button>
    </DropdownMenuItem>
  )
}
