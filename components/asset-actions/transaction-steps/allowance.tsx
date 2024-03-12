import { useCallback } from "react"
import { manifest } from "@/manifests"
import { useERC20Allow } from "@/services/allowance/wrapped-token-allowance"
import { BigNumberish } from "ethers"

import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"
import { ButtonLoading } from "@/components/button-loading"

export type AllowanceStepProps = {
  price: BigNumberish
  onValid: () => void
  refetchSteps?: () => void
}

export function AllowanceStep({
  price,
  onValid,
  refetchSteps,
}: AllowanceStepProps) {
  const { mutateAsync: approveToken, isPending } = useERC20Allow(price, {
    onSuccess: () => {
      refetchSteps?.()
    },
  })

  const approve = useCallback(async () => {
    await approveToken()
    onValid()
  }, [approveToken, onValid])

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-md mb-[32px] mt-[40px] text-center">
        Let {manifest.collectionName} spend your{" "}
        <strong>{globalConfig.ordersErc20.name}</strong> to buy this Digital Collectibles.
      </p>

      {isPending ? (
        <ButtonLoading />
      ) : (
        <Button className="flex gap-1" onClick={approve} disabled={isPending}>
          Allow <Price amount={price} isNativeToken={true} />
        </Button>
      )}
    </div>
  )
}
