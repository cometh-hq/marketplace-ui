import { useMutation } from "@tanstack/react-query"
import { BigNumber } from "ethers"

import globalConfig from "@/config/globalConfig"
import { toast } from "@/components/ui/toast/hooks/useToast"
import {  usePublicClient, useWalletClient } from "wagmi"
import wethAbi from "@/abis/wethAbi" 


export type UnwrapTokenMutationOptions = {
  amount: BigNumber
}

export const useUnwrapToken = () => {
  const viemPublicClient = usePublicClient()
  const { data: viemWalletClient }  = useWalletClient()

  return useMutation({
    mutationKey: ["unwrap"],
    mutationFn: async ({ amount }: UnwrapTokenMutationOptions) => {
      if (!viemWalletClient || !viemPublicClient) {
        throw new Error("Could not unwrap token")
      }

      const txHash = await viemWalletClient.writeContract({
        address: globalConfig.ordersErc20.address,
        abi: wethAbi,
        functionName: 'withdraw',
        args: [BigInt(amount.toString())],
        account: viemWalletClient.account
      })
      const transaction = await viemPublicClient.waitForTransactionReceipt( 
        { hash: txHash }
      )
      return transaction
    },

    onSuccess: () => {
      toast({
        title: "Token unwrapped!",
      })
    },
  })
}
