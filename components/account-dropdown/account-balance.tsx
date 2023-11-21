import { useState } from "react"
import Image from "next/image"
import { manifest } from "@/manifests"
import { useFormatMainBalance } from "@/services/balance/main"
import { useFormatWrappedBalance } from "@/services/balance/wrapped"

import { WrapButton } from "../asset-actions/buttons/wrap"
import { Button } from "../ui/button"

export function AccountBalance() {
  const balance = useFormatMainBalance()
  const wBalance = useFormatWrappedBalance()

  const [isUnwrap, setIsUnwrap] = useState(false)

  return (
    <div>
      <div className="mb-3 space-y-3 rounded-md border border-border p-3">
        <div className="flex items-center justify-between">
          <AccountBalanceLine
            balance={balance}
            currency={manifest.currency.main.name}
          />
        </div>
        <div className="flex items-center justify-between">
          <AccountBalanceLine
            balance={wBalance}
            currency={manifest.currency.wrapped.name}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <WrapButton
          isUnwrap={isUnwrap}
          onToggleMode={() => setIsUnwrap(!isUnwrap)}
        />
        <Button variant="secondary">Add found</Button>
      </div>
    </div>
  )
}

type AccountBalanceLineProps = {
  balance: string
  currency: string
}

export function AccountBalanceLine({
  balance,
  currency,
}: AccountBalanceLineProps) {
  return (
    <div className="text-[15px] font-semibold">
      <Image
        src="/icons/chains/polygon.svg"
        alt=""
        width={24}
        height={24}
        className="inline-block"
      />
      {balance} {currency}
    </div>
  )
}
