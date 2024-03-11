import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useChainId, useSwitchChain } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { toast } from "@/components/ui/toast/hooks/useToast"

export const useCorrectNetwork = () => {
  const { switchChain } = useSwitchChain()
  const currentChainId = useChainId()

  const [isChainSupported, setIsChainSupported] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const supportedChainHex = ethers.utils.hexValue(globalConfig.network.chainId)
  const supportedChainId = parseInt(supportedChainHex, 16)

  useEffect(() => {
    if (!currentChainId) {
      setIsChainSupported(false)
      return
    }
    setIsChainSupported(currentChainId === supportedChainId)
  }, [currentChainId, supportedChainId])

  const switchNetwork = async () => {
    setIsLoading(true)
    try {
      await switchChain({
        chainId: supportedChainId,
      })
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.message || "An error occured while switching network",
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
