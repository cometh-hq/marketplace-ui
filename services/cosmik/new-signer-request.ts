import { cosmikClient } from "@/services/clients"
import { useMutation } from "@tanstack/react-query"

export const useNewSignerRequest = () => {
  return useMutation({
    mutationKey: ["cosmik, signin"],
    mutationFn: async (addSignerRequest: any) => {
      const { data } = await cosmikClient.post(
        "/new-signer-request",
        addSignerRequest
      )
      return data
    },
  })
}
