import { useEffect, useState } from "react"
import {
  fetchHasSufficientFunds,
  useHasSufficientFunds,
} from "@/services/balance/fundsService"
import { BigNumber } from "ethers"
import { useAccount } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/Button"
import { Price } from "@/components/ui/Price"

export type FundsStepProps = {
  price: BigNumber
  onValid: () => void
}

export function FundsStep({ price, onValid }: FundsStepProps) {
  const account = useAccount()
  const viewer = account.address
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false)

  const { data } = useHasSufficientFunds({
    address: viewer,
    price: price,
  })

  useEffect(() => {
    if (data?.hasSufficientFunds === true) {
      return onValid()
    }
  }, [data?.hasSufficientFunds, onValid])

  if (!data?.missingBalance) return null

  const { missingBalance } = data

  const checkBalance = async () => {
    setIsRefreshingBalance(true)
    if (!viewer) return
    const { hasSufficientFunds } = await fetchHasSufficientFunds({
      address: viewer,
      price,
    })
    if (hasSufficientFunds) {
      onValid()
    }
    setIsRefreshingBalance(false)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-8">
      <h3 className="text-xl font-semibold">Top up your wallet</h3>
      <p className="text-center">
        Looks like you don&rsquo;t have enough funds to complete this
        transaction. <br />
        You are missing <Price amount={missingBalance} hideSymbol={false} />.
        Once you have funded your wallet with some{" "}
        <strong>{globalConfig.ordersDisplayCurrency.name}</strong>, please
        refresh your balance.
      </p>
      <p>
        Wallet address: <strong>{viewer}</strong>
      </p>
      <Button isLoading={isRefreshingBalance} onClick={checkBalance}>
        Refresh balance
      </Button>
    </div>
  )
}
