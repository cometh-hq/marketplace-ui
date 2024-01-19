import { useMutation } from "@tanstack/react-query"
import { BigNumber, Signer } from "ethers"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { IWETH__factory } from "@/lib/generated/contracts/weth/IWETH__factory"
import { useCurrentViewerAddress, useSigner } from "@/lib/web3/auth"
import { toast } from "@/components/ui/toast/use-toast"

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
  const contract = IWETH__factory.connect(wrapContractAddress, signer)
  const tx = await contract?.deposit({
    from: account,
    value: amount,
  })
  await tx.wait()
}

export type WrapTokenMutationOptions = {
  amount: BigNumber
}

export const useWrapToken = () => {
  const viewerAddress = useCurrentViewerAddress()
  const signer = useSigner()

  return useMutation({
    mutationKey: ["wrap"],
    mutationFn: async ({ amount }: WrapTokenMutationOptions) => {
      if (
        !viewerAddress ||
        !signer ||
        !globalConfig.network.wrappedNativeToken.address
      ) {
        throw new Error("Could not wrap token")
      }

      return wrapToken({
        amount,
        account: viewerAddress!,
        signer,
        wrapContractAddress: globalConfig.network.wrappedNativeToken.address,
      })
    },

    onSuccess: () => {
      toast({
        title: "Token wrapped!",
        description: "Your token has been wrapped.",
      })
    }
  })
}
