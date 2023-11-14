import { useRef } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { ethers } from "ethers"

import { toast } from "@/components/ui/toast/use-toast"

import { handleOrderbookError } from "../errors"
import { useWalletConnect } from "./use-wallet-connect"

export type RegisterFields = {
  email: string
  userName: string
}

export function useConnect() {
  const { connect: connectWallet } = useWalletConnect()
  const walletAddress = useRef<string | null>(null)
  const walletState = useRef<any | null>(null)
  const { initOnboard } = useWeb3OnboardContext()

  async function connect({
    isAlembicWallet = false,
    existingWalletAddress,
  }: {
    isAlembicWallet?: boolean
    existingWalletAddress?: string
  }) {
    try {
      initOnboard({
        isComethWallet: isAlembicWallet,
        ...(existingWalletAddress && { walletAddress: existingWalletAddress }),
      })
      const wallet = await connectWallet({ isAlembicWallet })
      walletState.current = wallet

      const walletAddr = ethers.utils.getAddress(wallet.accounts[0].address)
      walletAddress.current = walletAddr
      if (!walletAddr) {
        throw new Error("No wallet address")
      }

      toast({
        title: "Your wallet is connected",
      })

      return true
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: handleOrderbookError(error, {
          400: "Bad request",
          500: "Internal orderbook server error",
        }),
      })
      return false
    }
  }

  return {
    connect,
  }
}
