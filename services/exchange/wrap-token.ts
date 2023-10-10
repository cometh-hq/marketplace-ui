import { manifest } from "@/manifests"
import { useMutation } from "@tanstack/react-query"
import { BigNumber, Signer } from "ethers"
import { Address } from "viem"

import { IWETH__factory } from "@/lib/generated/contracts/weth/IWETH__factory"
import { useCurrentViewerAddress, useSigner } from "@/lib/web3/auth"

export type WrapTokenOptions = {
  amount: BigNumber
  account: Address
  signer: Signer
  wrapContractAddress: Address
}

export async function wrapToken({
  amount,
  account,
  signer,
  wrapContractAddress,
}: WrapTokenOptions) {
  if (!signer._isSigner) throw new Error("Signer not initialized")
  const contract = IWETH__factory.connect(wrapContractAddress, signer)
  const transaction = await contract?.deposit({
    from: account ?? undefined,
    value: amount,
  })
  
  await transaction.wait()

  return transaction
}

export type WrapTokenMutationOptions = {
  amount: BigNumber
}

export const useWrapToken = () => {
  const viewerAddress = useCurrentViewerAddress()
  const signer = useSigner()

  return useMutation(["wrap"], async ({ amount }: WrapTokenMutationOptions) => {
    if (!viewerAddress || !signer || !manifest?.currency?.wrapped?.address) {
      throw new Error("Could not wrap token")
    }

    return wrapToken({
      amount,
      account: viewerAddress!,
      signer: signer!,
      wrapContractAddress: manifest.currency.wrapped.address,
    })
  })
}
