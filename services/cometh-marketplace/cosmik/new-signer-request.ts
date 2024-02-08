import { useMutation } from '@tanstack/react-query'
import { cosmikClient } from '../client'
import { useWeb3OnboardContext } from '@/providers/web3-onboard'
import { toast } from "@/components/ui/toast/use-toast"

export const useNewSignerRequest = () => {
  const { initNewSignerRequest } = useWeb3OnboardContext()

  return useMutation({
    mutationKey: ['cosmik, signin'],
    mutationFn: async (addSignerRequest: any) => {
      const { data } = await cosmikClient.post('/new-signer-request', addSignerRequest)
      return data
    },
    onSuccess: async (data) => {
      console.log("data in useNewSignerRequest", data)
    },
    onError: (error: any) => {
      console.log("error in useNewSignerRequest", error)
    },
  })
}