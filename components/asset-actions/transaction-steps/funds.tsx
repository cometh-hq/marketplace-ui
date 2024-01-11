import { useEffect } from "react"
import {
  fetchHasSufficientFunds,
  useHasSufficientFunds,
} from "@/services/balance/has-sufficient-funds"
import { BigNumber } from "ethers"

import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"

export type FundsStepProps = {
  price: BigNumber
  onValid: () => void
}

export function FundsStep({ price, onValid }: FundsStepProps) {
  const viewer = useCurrentViewerAddress()

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
    if (!viewer) return
    const { hasSufficientFunds} = await fetchHasSufficientFunds({
      address: viewer,
      price,
    })
    if (hasSufficientFunds) {
      onValid()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-8">
      <h3 className="text-xl font-semibold">Top up your wallet</h3>
      <p className="text-center">
        Looks like you don&rsquo;t have enough funds to complete this
        transaction. You are missing <Price amount={missingBalance} />. 
        Once you have funded your wallet, please refresh your balance.
      </p>
      <p>
        Wallet address: <strong>{viewer}</strong>
      </p>
      <Button onClick={checkBalance}>Refresh balance</Button>
    </div>
  )
}
