import { useMutation } from "@tanstack/react-query"
import { BigNumber, Signer } from "ethers"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { IWETH__factory } from "@/lib/generated/contracts/weth/IWETH__factory"
import { useCurrentViewerAddress, useSigner } from "@/lib/web3/auth"
import { toast } from "@/components/ui/toast/use-toast"

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
  const contract = IWETH__factory.connect(wrapContractAddress, signer)
  const tx =  await contract?.withdraw(amount, {
    from: account,
  })
  await tx.wait()
}

export type UnwrapTokenMutationOptions = {
  amount: BigNumber
}

export const useUnwrapToken = () => {
  const viewerAddress = useCurrentViewerAddress()
  const signer = useSigner()

  return useMutation({
    mutationKey: ["unwrap"],
    mutationFn: async ({ amount }: UnwrapTokenMutationOptions) => {
      if (!viewerAddress || !signer) {
        throw new Error("Could not unwrap token")
      }

      return unwrapToken({
        amount,
        account: viewerAddress,
        signer,
        wrapContractAddress: globalConfig.network.wrappedNativeToken.address,
      })
    },

    onSuccess: () => {
      toast({
        title: "Token unwrapped!",
      })
    }
  })
}
