import { useEffect, useState } from "react"
import {
  fetchHasEnoughGas,
  useHasEnoughGas,
} from "@/services/balance/has-enough-gas"

import globalConfig from "@/config/globalConfig"
import { useCurrentViewerAddress, useIsComethWallet } from "@/lib/web3/auth"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"

export type AddGasStepProps = {
  onValid: () => void
}

export function AddGasStep({ onValid }: AddGasStepProps) {
  const viewer = useCurrentViewerAddress()
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false)
  const isComethWallet = useIsComethWallet()

  const { data } = useHasEnoughGas(viewer)

  const checkBalance = async () => {
    setIsRefreshingBalance(true)

    if (!viewer) return
    const { hasEnoughGas } = await fetchHasEnoughGas(viewer, isComethWallet)
    if (hasEnoughGas) {
      onValid()
    }
    setIsRefreshingBalance(false)
  }

  useEffect(() => {
    if (data?.hasEnoughGas === true) {
      return onValid()
    }
  }, [data?.hasEnoughGas, onValid])

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-8">
      <h3 className="text-xl font-semibold">Top up your wallet</h3>
      <p>
        Looks like you <strong>don&rsquo;t have enough native tokens</strong> to pay for
        transaction gas. Whenever you make a transaction on the blockchain, you
        need to pay a small fee to the miners who process it.
      </p>
      <p>
        Please add <Price amount={globalConfig.minimumBalanceForGas}/> <strong>{globalConfig.network.nativeToken.name}</strong>{" "}
        to your wallet, and then refresh your balance. Your transactions will not cost as much but we need an minimum amount to be sure you can pay for gas.
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
