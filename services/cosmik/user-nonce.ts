import { cosmikClient } from "@/services/clients"
import { useMutation } from "@tanstack/react-query"

export type GetUserNonceOptions = {
  walletAddress: string
}

export const useGetUserNonce = () => {
  return useMutation({
    mutationKey: ["cosmik", "nonce"],
    mutationFn: async ({ walletAddress }: GetUserNonceOptions) => {
      const { data } = await cosmikClient.post(
        "/auth/init",
        {
          address: walletAddress,
        }
      )
      return data
    },
  })
}
