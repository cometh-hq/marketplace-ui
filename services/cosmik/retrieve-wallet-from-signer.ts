// import { useWeb3OnboardContext } from "@/providers/web3-onboard"
// import { useMutation } from "@tanstack/react-query"

// import { toast } from "@/components/ui/toast/use-toast"

// import { cosmikClient } from "../client"

// interface SignInBody {
//   username: string
//   password: string
// }

// export type User = {
//   id: string
//   address: string
//   userName: string
//   email: string
//   coins: number
//   aurium: number
// }

// export const useRetrieveWalletFromSigner = () => {
//   const { retrieveWalletAddressFromSigner } = useWeb3OnboardContext()

//   return useMutation({
//     mutationKey: ["cosmik, signin"],
//     mutationFn: async (credentials: SignInBody) => {
//       const { data } = await cosmikClient.post(
//         "/login",
//         credentials
//       )
//       return data
//     },
//     onSuccess: async (data) => {
//       if (data.user) {
//         localStorage.setItem("user", JSON.stringify(data.user))
//         // On ne veut peut-être pas déclancher cette action sur la page /wallets (voir avec Fred). Peut-être qu'il faudra déplacer cette action dans le composant qui appelle useCosmikSignin
//         // Tenter de récupérer l'adresse du portefeuille à partir du signataire
//         try {
//           await retrieveWalletAddressFromSigner(data.user.address)
//         } catch (error) {
//           throw new Error("Error while retrieving wallet address from signer")
//         }
//       }
//     },
//     onError: (error: any) => {
//       console.log("error in useCosmikSignin", error)
//       if (error.response?.status === 400) {
//         toast({
//           title: "Login failed",
//           description: "Please check your username and password",
//           variant: "destructive",
//           duration: 5000,
//         })
//       }
//     },
//   })
// }
