import { manifest } from "@/manifests"
import { useMutation } from "@tanstack/react-query"
import { BigNumber, Signer } from "ethers"
import { Address } from "viem"

import { IWETH__factory } from "@/lib/generated/contracts/weth/IWETH__factory"
import { useCurrentViewerAddress, useSigner } from "@/lib/web3/auth"

export type UnwrapTokenOptions = {
  amount: BigNumber
  account: Address
  signer: Signer
  wrapContractAddress: Address
}

export async function unwrapToken({
  amount,
  account,
  signer,
  wrapContractAddress,
}: UnwrapTokenOptions) {
  if (!signer._isSigner) throw new Error("Signer not initialized")
  const contract = IWETH__factory.connect(wrapContractAddress, signer)

  const transaction = await contract?.withdraw(amount, {
    from: account ?? undefined,
  })

  await transaction.wait()

  return transaction
}

export type UnwrapTokenMutationOptions = {
  amount: BigNumber
}

export const useUnwrapToken = () => {
  const viewerAddress = useCurrentViewerAddress()
  const signer = useSigner()

  return useMutation(["unwrap"], async ({ amount }: UnwrapTokenMutationOptions) => {
    if (!viewerAddress || !signer || !manifest?.currency?.wrapped?.address) {
      throw new Error("Could not unwrap token")
    }

    return unwrapToken({
      amount,
      account: viewerAddress,
      signer: signer,
      wrapContractAddress: manifest.currency.wrapped.address,
    })
  })
}
