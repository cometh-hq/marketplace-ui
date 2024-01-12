import { useEffect, useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { ethers } from "ethers"

import globalConfig from "@/config/globalConfig"

import { useWallet } from "./auth"
import { toast } from "@/components/ui/toast/use-toast"

export const useCorrectNetwork = () => {
  const { onboard } = useWeb3OnboardContext()
  const [isChainSupported, setIsChainSupported] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const supportedChain = ethers.utils.hexValue(globalConfig.network.chainId)
  const wallet = useWallet()?.chains[0]?.id

  useEffect(() => {
    setIsChainSupported(wallet?.toString() === supportedChain)
  }, [])

  useEffect(() => {
    if (onboard) {
      const wallets = onboard.state.select("wallets")
      const subscribe = wallets.subscribe((wallet) => {
        const currentChainId =
          wallet && wallet[0] ? wallet[0].chains[0].id : null
          console.warn("currentChainId", currentChainId)
          console.warn("supportedChain", supportedChain)
          console.warn("config chainid", globalConfig.network.chainId)

        setIsChainSupported(currentChainId === supportedChain)
      })

      return () => {
        subscribe.unsubscribe()
      }
    }
  }, [])

  const switchNetwork = async () => {
    setIsLoading(true)
    try {
      await onboard?.setChain({ chainId: supportedChain })
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "An error occured while switching network"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isChainSupported,
    switchNetwork,
    switchNetworkLoading: isLoading,
  }
}
