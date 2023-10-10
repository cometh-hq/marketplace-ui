import { wrap } from "module"
import { useCallback, useEffect } from "react"
import { useNeedsToWrap } from "@/services/exchange/needs-to-wrap"
import { useWrapToken } from "@/services/exchange/wrap-token"
import { BigNumber } from "ethers"

import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"
import { ButtonLoading } from "@/components/button-loading"
import { manifest } from "@/manifests"

export type WrapStepProps = {
  price: BigNumber | null
  onValid: () => void
}

export function WrapStep({ price, onValid }: WrapStepProps) {
  const { mutateAsync: wrapToken, isLoading } = useWrapToken()
  const viewerAddress = useCurrentViewerAddress()

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
        You are about to buy this NFT for{" "}
        <span className="inline-flex translate-y-1.5 items-center">
          <Price amount={price} />
        </span>{" "}
        but you do not have enough <strong>{manifest.currency.wrapped.name.toLocaleUpperCase()}</strong> in your wallet. You
        need to wrap some ETH first.
      </p>

      {isLoading ? (
        <ButtonLoading />
      ) : (
        <Button className="flex gap-1" onClick={onConfirm}>
          Wrap <Price amount={price} /> MATIC
        </Button>
      )}
    </div>
  )
}
