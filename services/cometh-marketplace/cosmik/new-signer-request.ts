import { useMutation } from '@tanstack/react-query'
import { cosmikClient } from '../client'

export const useNewSignerRequest = () => {
  return useMutation({
    mutationKey: ['cosmik, signin'],
    mutationFn: async (addSignerRequest: any) => {
      const { data } = await cosmikClient.post('/new-signer-request', addSignerRequest)
      console.log("data in useNewSignerRequest", data)
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