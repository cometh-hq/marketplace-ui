import { wagmiConfig } from "@/providers/wagmi"
import { useMutation } from "@tanstack/react-query"
import { readContract } from "@wagmi/core"
import { BigNumberish } from "ethers"
import { Address, erc20Abi } from "viem"

import globalConfig from "@/config/globalConfig"
import { ERC20__factory } from "@/lib/generated/contracts"
import { useSigner } from "@/lib/web3/auth"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { toast } from "@/components/ui/toast/use-toast"

export const fetchWrappedAllowance = async ({
  address,
  spender,
  contractAddress,
}: {
  address: Address
  spender: Address
  contractAddress: Address
}) => {
  try {
    const result = await readContract(wagmiConfig, {
      address: contractAddress,
      abi: erc20Abi,
      functionName: "allowance",
      args: [address, spender],
    })
    return result
  } catch (error) {
    console.error("Error reading contract:", error)
    return null
  }
}

export type UseAllowanceParameters = {
  address: Address
  spender: Address
}

export type WrappedTokenAllowParams = {
  amount: BigNumberish
}

export const useERC20Allow = (
  price: BigNumberish,
  options?: {
    onSuccess?: () => void
  }
) => {
  const nftSwapSdk = useNFTSwapv4()
  const signer = useSigner()

  return useMutation({
    mutationKey: ["wrappedTokenAllow"],
    mutationFn: async () => {
      if (!signer || !nftSwapSdk) return
      const spender = nftSwapSdk?.exchangeProxyContractAddress!
      const erc20 = ERC20__factory.connect(
        globalConfig.ordersErc20.address,
        signer
      )
      const tx = await erc20.approve(spender, price)
      return tx.wait()
    },
    ...options,
    onSuccess: () => {
      options?.onSuccess?.()
    }
  })
}
