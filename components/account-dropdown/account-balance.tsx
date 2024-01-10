import Image from "next/image"
import { useState } from "react"
import { useFormatWrappedBalance } from "@/services/balance/wrapped"
import { useFormatMainBalance } from "@/services/balance/main"

import { env } from "@/config/env"
import globalConfig from "@/config/globalConfig"

import { WrapButton } from "../asset-actions/buttons/wrap"

export function AccountBalance() {
  const balance = useFormatMainBalance()
  const wBalance = useFormatWrappedBalance()

  const [isUnwrap, setIsUnwrap] = useState(false)

  return (
    <div>
      <div className="mb-3 space-y-3 rounded-md border border-border p-3">
        <div className="flex items-center justify-between">
          <AccountBalanceLine
            balance={globalConfig.useNativeForOrders ? wBalance : balance}
            currency={
              globalConfig.useNativeForOrders
                ? globalConfig.network.wrappedNativeToken.symbol
                : globalConfig.network.nativeToken.symbol
            }
          />
        </div>
      </div>

      <div className="grid  text-right">
        <WrapButton
          isUnwrap={isUnwrap}
          onToggleMode={() => setIsUnwrap(!isUnwrap)}
        />
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
