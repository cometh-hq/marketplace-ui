import { useCallback, useEffect } from "react"
import { useNeedsToUnwrap } from "@/services/exchange/needs-to-unwrap"
import { useUnwrapToken } from "@/services/exchange/unwrap-token"
import { BigNumber } from "ethers"

import globalConfig from "@/config/globalConfig"
import { useCurrentViewerAddress, useIsComethWallet } from "@/lib/web3/auth"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"
import { ButtonLoading } from "@/components/button-loading"

export type UnwrapStepProps = {
  price: BigNumber | null
  onValid: () => void
}

export function UnwrapStep({ price, onValid }: UnwrapStepProps) {
  const { mutateAsync: unwrapToken, isPending } = useUnwrapToken()
  const viewerAddress = useCurrentViewerAddress()
  const isComethWallet = useIsComethWallet()

  const { data: needsToUnwrapData } = useNeedsToUnwrap({
    price,
    address: viewerAddress,
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
        You are about to buy this NFT for{" "}
        <span className="inline-flex translate-y-1.5 items-center">
          <Price amount={price} />
        </span>{" "}
        but you are missing{" "}
        <strong>
          <Price amount={needsToUnwrapData?.balanceToUnwrap} />
        </strong>{" "}
        in your wallet.
        {globalConfig.areContractsSponsored && isComethWallet && (
          <>
            The minimum amount of native token includes{" "}
            <Price amount={globalConfig.minimumBalanceForGas} /> which are
            necessary to pay for gas. It seems that you have wrapped some native
            token, you need to unwrap some{" "}
            {globalConfig.network.wrappedNativeToken.symbol} first as a sales
            listing cannot be filled with wrapped tokens.
          </>
        )}
      </p>

      {isPending ? (
        <ButtonLoading size="lg" />
      ) : (
        <Button className="flex gap-1" size="lg" onClick={onConfirm}>
          Unwrap <Price amount={needsToUnwrapData?.balanceToUnwrap} />{" "}
          {globalConfig.network.nativeToken.symbol}
        </Button>
      )}
    </div>
  )
}
