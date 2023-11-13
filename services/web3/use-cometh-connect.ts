import { useRef, useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useQueryClient } from "@tanstack/react-query"
import { ethers } from "ethers"

import { COMETH_CONNECT_LABEL } from "@/config/site"
import { useConnect } from "@/lib/web3/auth"
import { toast } from "@/components/ui/toast/use-toast"

import { handleOrderbookError } from "../errors"
import { useWalletConnect } from "./use-wallet-connect"

export type RegisterFields = {
  email: string
  userName: string
}

export function useComethConnect() {
  const { connect: connectWallet } = useWalletConnect()
  const [shouldRegister, setShouldRegister] = useState(false)
  const walletAddress = useRef<string | null>(null)
  const walletState = useRef<any | null>(null)
  const { initOnboard } = useWeb3OnboardContext()
  // const isComethWallet = localStorage.getItem("selectedWallet") === COMETH_CONNECT_LABEL

  async function connect({
    isAlembicWallet = false,
    existingWalletAddress,
  }: {
    isAlembicWallet?: boolean
    existingWalletAddress?: string
  }) {
    try {
      if (isAlembicWallet) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "You need to connect your wallet first",
          duration: Infinity,
        })
      }
      await initOnboard({
        isComethWallet: isAlembicWallet,
        ...(existingWalletAddress && { walletAddress: existingWalletAddress }),
      })
      console.log("isAlembicWallet ", isAlembicWallet)
      const wallet = await connectWallet({ isAlembicWallet })
      walletState.current = wallet
      console.log("wallet :>> ", walletState.current)

      const walletAddr = ethers.utils.getAddress(wallet.accounts[0].address)
      walletAddress.current = walletAddr
      console.log("walletAddr :>> ", walletAddress.current)

      if (!walletAddr) {
        throw new Error("No wallet address")
      }

      toast({
        title: "Wallet connected",
        description: "Your wallet is connected",
      })

      return true
    } catch (e) {
      console.log("e :>> ", e)
      // _handleError(e as Error)
      return false
    } finally {
      // toast.dismiss("cometh-connect");
    }
  }

  return {
    connect,
    shouldRegister,
    setShouldRegister,
  }
}
