import { useCallback } from "react"
import { manifest } from "@/manifests/manifests"
import {
  useERC20Allow,
  useNeededAllowanceValue,
} from "@/services/allowance/allowanceService"
import { BigNumber, BigNumberish } from "ethers"
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

  const sumOfOffers = allowanceValue
    ? allowanceValue.sub(BigNumber.from(price))
    : BigNumber.from(0)

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
        <div className="mb-6 flex flex-col gap-5">
          <p className="text-lg">
            To proceed, you&apos;ll need to authorize {manifest.marketplaceName}{" "}
            to spend up to{" "}
            <strong>
              <Price isNativeToken={false} amount={allowanceValue} />
            </strong>{" "}
            on your behalf for all your active offers. If your offer is
            accepted, <Price isNativeToken={false} amount={price} /> will be
            deducted.
          </p>
          <hr></hr>
          <p>
            This amount covers the cost of your new offer as well as all other
            active offers which are worth{" "}
            {sumOfOffers && sumOfOffers !== BigNumber.from(0) && (
              <Price isNativeToken={false} amount={sumOfOffers} />
            )}
            .{" "}
          </p>
          <p>
            As offers are accepted, your allowance will decrease accordingly. If
            your allowance or balance falls below the required amount for any of
            your offers, those offers will be <b>automatically canceled</b>. To
            avoid this, it&apos;s important to keep your allowance adequately
            funded.
          </p>
          <p>
            Please note that your allowance can be higher than your current
            token balance. The allowance grants permission to a{" "}
            <b>decentralized, publicly audited smart contract</b> to spend your
            tokens, but only with your explicit approval.
          </p>
        </div>
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
