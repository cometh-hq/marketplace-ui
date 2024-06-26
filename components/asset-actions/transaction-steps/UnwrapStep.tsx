import { useCallback, useEffect } from "react"
import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { useNeedsToUnwrap } from "@/services/exchange/unwrapService"
import { useUnwrapToken } from "@/services/exchange/unwrapTokenService"
import { BigNumber } from "ethers"
import { useAccount } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/Button"
import { Price } from "@/components/ui/Price"
import { ButtonLoading } from "@/components/ButtonLoading"

export type UnwrapStepProps = {
  price: BigNumber | null
  onValid: () => void
}

export function UnwrapStep({ price, onValid }: UnwrapStepProps) {
  const { mutateAsync: unwrapToken, isPending } = useUnwrapToken()
  const isComethWallet = useIsComethConnectWallet()

  const needsToUnwrapData = useNeedsToUnwrap({
    price,
  })

  useEffect(() => {
    if (needsToUnwrapData && !needsToUnwrapData.needsToUnwrap) onValid()
  }, [needsToUnwrapData, needsToUnwrapData?.needsToUnwrap, onValid])

  const onConfirm = useCallback(async () => {
    if (!needsToUnwrapData?.balanceToUnwrap) return
    await unwrapToken({ amount: needsToUnwrapData?.balanceToUnwrap })
    onValid()
  }, [onValid, needsToUnwrapData?.balanceToUnwrap, unwrapToken])

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-md my-[32px] text-center">
        You are about to buy this NFT for <Price amount={price} />
        but you are missing{" "}
        <Price amount={needsToUnwrapData?.balanceToUnwrap} />
        in your wallet.
        {(!globalConfig.areContractsSponsored || !isComethWallet) && (
          <>
            The minimum amount of native token includes{" "}
            <Price amount={globalConfig.minimumBalanceForGas} isNativeToken /> which are
            necessary to pay for gas. It seems that you have wrapped some native
            token, you need to unwrap some{" "}
            {globalConfig.network.wrappedNativeToken.symbol} first as a sales
            listing cannot be filled with wrapped tokens.
          </>
        )}
      </p>

      {isPending ? (
        <ButtonLoading />
      ) : (
        <Button className="flex gap-1" onClick={onConfirm}>
          Unwrap{" "}
          <Price
            amount={needsToUnwrapData?.balanceToUnwrap}
            isNativeToken={false}
          />
        </Button>
      )}
    </div>
  )
}
