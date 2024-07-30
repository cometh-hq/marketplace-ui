import { useCallback } from "react"
import { manifest } from "@/manifests/manifests"
import {
  useERC20Allow,
  useNeededAllowanceValue,
} from "@/services/allowance/allowanceService"
import { BigNumberish } from "ethers"
import { Loader } from "lucide-react"
import { useAccount } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/Button"
import { Price } from "@/components/ui/Price"
import { ButtonLoading } from "@/components/ButtonLoading"

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
  const account = useAccount()
  const userAddress = account.address
  const { data: allowanceValue, isLoading: isLoadingAllowance } =
    useNeededAllowanceValue(
      userAddress,
      globalConfig.ordersErc20.address,
      price
    )

  const { mutateAsync: approveToken, isPending } = useERC20Allow(
    allowanceValue || 0,
    {
      onSuccess: () => {
        refetchSteps?.()
      },
    }
  )

  const approve = useCallback(async () => {
    await approveToken()
    onValid()
  }, [approveToken, onValid])

  return (
    <div className="flex flex-col items-center justify-center">
      {isLoadingAllowance ? (
        <div className="flex items-center justify-center">
          <Loader size={22} className="mr-1.5 animate-spin" />
        </div>
      ) : (
        <p>
          You need to allow{" "}
          <strong>
            <Price isNativeToken={false} amount={allowanceValue} />
          </strong>{" "}
          to be spent by {manifest.marketplaceName} once your offer is accepted.
          This value includes the price of this new offer as well as all your
          currently active offers.
        </p>
      )}

      {isPending || isLoadingAllowance ? (
        <ButtonLoading />
      ) : (
        <Button className="flex gap-1" onClick={approve} disabled={isPending}>
          Allow <Price amount={allowanceValue} />
        </Button>
      )}
    </div>
  )
}
