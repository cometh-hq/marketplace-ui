import { useCallback, useEffect } from "react"
import { useNeedsToWrap } from "@/services/exchange/wrapService"
import { useWrapToken } from "@/services/exchange/wrapTokenService"
import { BigNumber } from "ethers"
import { useAccount } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/Button"
import { Price } from "@/components/ui/Price"
import { ButtonLoading } from "@/components/ButtonLoading"

export type WrapStepProps = {
  price: BigNumber | null
  onValid: () => void
}

export function WrapStep({ price, onValid }: WrapStepProps) {
  const { mutateAsync: wrapToken, isPending } = useWrapToken()
  const account = useAccount()
  const viewerAddress = account.address

  const needsToWrap = useNeedsToWrap({
    price,
    address: viewerAddress,
  })

  useEffect(() => {
    if (!needsToWrap) onValid()
  }, [needsToWrap, onValid])

  const onConfirm = useCallback(async () => {
    if (!price) return
    await wrapToken({ amount: price })
    onValid()
  }, [onValid, price, wrapToken])

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-md my-[32px] text-center">
        You are about to buy this NFT for <Price amount={price} isNativeToken={false} /> but you do
        not have enough{" "}
        <strong>{globalConfig.network.wrappedNativeToken.symbol}</strong> in
        your wallet. You need to wrap some{" "}
        {globalConfig.network.nativeToken.symbol} first as a purchase offer
        cannot be opened with native tokens.
      </p>

      {isPending ? (
        <ButtonLoading />
      ) : (
        <Button className="flex gap-1" onClick={onConfirm}>
          Wrap <Price amount={price} isNativeToken={true} />
        </Button>
      )}
    </div>
  )
}
