import { useCallback } from "react"
import { manifest } from "@/manifests"
import { useWrappedTokenAllow } from "@/services/allowance/wrapped-token-allowance"
import { BigNumberish } from "ethers"

import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"
import { ButtonLoading } from "@/components/button-loading"

export type AllowanceStepProps = {
  price: BigNumberish
  onValid: () => void
}

export function AllowanceStep({ price, onValid }: AllowanceStepProps) {
  const { mutateAsync: approveToken, isLoading } = useWrappedTokenAllow(price)

  const approve = useCallback(async () => {
    await approveToken()
    onValid()
  }, [approveToken, onValid])

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-md mb-[32px] mt-[40px] text-center">
        Let {manifest.name} spend your{" "}
        <strong>{manifest.currency.wrapped.name}</strong> to buy this NFT.
      </p>

      {isLoading ? (
        <ButtonLoading />
      ) : (
        <Button className="flex gap-1" onClick={approve} disabled={isLoading}>
          Allow <Price amount={price} />
        </Button>
      )}
    </div>
  )
}
