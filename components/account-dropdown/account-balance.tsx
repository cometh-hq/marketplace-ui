import { useState } from "react"
import Image from "next/image"
import { useBalance } from "@/services/balance/balance"

import { env } from "@/config/env"
import globalConfig from "@/config/globalConfig"
import { Separator } from "@/components/ui/separator"

import { WrapButton } from "../asset-actions/buttons/wrap"

export function AccountBalance() {
  const balance = useBalance()
  const [isUnwrap, setIsUnwrap] = useState(false)

  return (
    <div>
      <div className="mb-3 space-y-3 rounded-md border border-border p-3">
        <div className="flex flex-col gap-2">
          <AccountBalanceLine
            balance={balance.native}
            currency={globalConfig.network.nativeToken.symbol}
          />
          <Separator />
          <AccountBalanceLine
            balance={
              globalConfig.useNativeForOrders ? balance.wrapped : balance.ERC20
            }
            currency={globalConfig.ordersErc20.symbol}
          />
        </div>
      </div>

      {globalConfig.useNativeForOrders && (
        <div className="grid">
          <WrapButton
            isUnwrap={isUnwrap}
            onToggleMode={() => setIsUnwrap(!isUnwrap)}
          />
        </div>
      )}
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
        src={`${env.NEXT_PUBLIC_BASE_PATH}/icons/chains/polygon.svg`}
        alt=""
        width={24}
        height={24}
        className="inline-block"
      />
      {balance} {currency}
    </div>
  )
}
