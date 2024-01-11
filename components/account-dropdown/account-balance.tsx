import { useState } from "react"
import Image from "next/image"
import { useFormatMainBalance } from "@/services/balance/main"
import { useFormatWrappedBalance } from "@/services/balance/wrapped"

import { env } from "@/config/env"
import globalConfig from "@/config/globalConfig"
import { Separator } from "@/components/ui/separator"

import { WrapButton } from "../asset-actions/buttons/wrap"

export function AccountBalance() {
  const balance = useFormatMainBalance()
  const wBalance = useFormatWrappedBalance()

  const [isUnwrap, setIsUnwrap] = useState(false)
  console.log("globalConfig.ordersErc20", globalConfig.ordersErc20)
  return (
    <div>
      <div className="mb-3 space-y-3 rounded-md border border-border p-3">
        <div className="flex flex-col gap-2">
          <AccountBalanceLine
            balance={balance}
            currency={globalConfig.ordersDisplayCurrency.symbol}
          />
          {globalConfig.useNativeForOrders && (
            <>
              <Separator />
              <AccountBalanceLine
                balance={wBalance}
                currency={globalConfig.ordersErc20.symbol}
              />
            </>
          )}
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
