import { manifest } from "@/manifests"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BigNumber, Signer } from "ethers"
import { Address } from "viem"

import { IWETH__factory } from "@/lib/generated/contracts/weth/IWETH__factory"
import { useCurrentViewerAddress, useSigner } from "@/lib/web3/auth"
import { toast } from "@/components/ui/toast/use-toast"

import { handleOrderbookError } from "../errors"

export type WrapTokenOptions = {
  amount: BigNumber
  account: Address
  signer: Signer
  wrapContractAddress: Address
}

export function wrapToken({
  amount,
  account,
  signer,
  wrapContractAddress,
}: WrapTokenOptions) {
  const contract = IWETH__factory.connect(wrapContractAddress, signer)
  return contract?.deposit({
    from: account,
    value: amount,
  })
}

export type WrapTokenMutationOptions = {
  amount: BigNumber
}

export const useWrapToken = () => {
  const viewerAddress = useCurrentViewerAddress()
  const signer = useSigner()

  return useMutation(
    ["wrap"],
    async ({ amount }: WrapTokenMutationOptions) => {
      if (!viewerAddress || !signer || !manifest.currency.wrapped.address) {
        throw new Error("Could not wrap token")
      }

      return wrapToken({
        amount,
        account: viewerAddress!,
        signer,
        wrapContractAddress: manifest.currency.wrapped.address,
      })
    },
    {
      onSuccess: () => {
        toast({
          title: "Token wrapped!",
          description: "Your token has been wrapped.",
        })
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: handleOrderbookError(error, {
            400: "Bad request",
            500: "Internal orderbook server error",
          }),
        })
      },
    }
  )
}
