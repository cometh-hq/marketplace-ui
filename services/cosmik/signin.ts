import { cosmikClient } from "@/services/clients"
import { useMutation } from "@tanstack/react-query"

import { toast } from "@/components/ui/toast/use-toast"

interface SignInBody {
  username: string
  password: string
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
  return useMutation({
    mutationKey: ["cosmik, signin"],
    mutationFn: async (credentials: SignInBody) => {
      const { data } = await cosmikClient.post("/login", credentials)
      return data
    },
    onSuccess: async (data) => {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }
    },
    onError: (error: any) => {
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
