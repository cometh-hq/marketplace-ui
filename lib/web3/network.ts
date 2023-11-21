import { useEffect, useState } from "react"
import { manifest } from "@/manifests"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { ethers } from "ethers"

import { useWallet } from "./auth"

export const useCorrectNetwork = () => {
  const { onboard } = useWeb3OnboardContext()
  const [isChainSupported, setIsChainSupported] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const supportedChain = ethers.utils.hexValue(manifest.network.chainId)
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
    } catch (error) {
      console.error("Error switching network:", error)
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
