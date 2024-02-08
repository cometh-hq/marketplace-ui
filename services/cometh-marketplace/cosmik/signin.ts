import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useMutation } from "@tanstack/react-query"

import { toast } from "@/components/ui/toast/use-toast"

import { cosmikClient } from "../client"

interface LoginCredentials {
  username: string
  password: string
}

interface LoginResponse {
  success: boolean
  user?: User
  errorKey?: string
}

export type User = {
  id: string
  address: string
  userName: string
  email: string
  coins: number
  aurium: number
}

export const useCosmikSignin = () => {
  const { retrieveWalletAddressFromSigner } = useWeb3OnboardContext()

  return useMutation({
    mutationKey: ["cosmik, signin"],
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await cosmikClient.post<LoginResponse>(
        "/login",
        credentials
      )
      return data
    },
    onSuccess: async (data) => {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
        // Tenter de récupérer l'adresse du portefeuille à partir du signataire
        try {
          await retrieveWalletAddressFromSigner(data.user.address)
        } catch (error) {
          throw new Error("Error while retrieving wallet address from signer")
        }
      }
    },
    onError: (error: any) => {
      console.log("error in useCosmikSignin", error)
      if (error.response?.status === 400) {
        toast({
          title: "Login failed",
          description: "Please check your username and password",
          variant: "destructive",
          duration: 5000,
        })
      }
    },
  })
}
