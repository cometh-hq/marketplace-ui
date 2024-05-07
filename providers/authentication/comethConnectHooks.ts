import { useCallback, useMemo } from "react"
import { manifest } from "@/manifests/manifests"
import { comethConnectConnector } from "@cometh/connect-sdk-viem"
import { useAccount, useConnect } from "wagmi"

import { env } from "@/config/env"

export const useIsComethConnectWallet = () => {
  const { connector } = useAccount()
  return useMemo(() => connector?.type === "cometh", [connector])
}

export const useComethConnectConnector = (userWalletAddress?: string) => {
  return useMemo(() => {
    if (!env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY || typeof window === 'undefined') {
      return undefined
    }
    return comethConnectConnector({
      apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY,
      rpcUrl: manifest.rpcUrl,
      walletAddress: userWalletAddress,
    })
  }, [userWalletAddress])
}

export const useComethConnectLogin = (
  userWalletAddress?: string,
  onConnectError?: (error: Error) => void
) => {
  const handleConnectError = useCallback(
    (error: Error) => {
      console.error("Error connecting with Cometh Connect", error)
      if (onConnectError) {
        onConnectError(error)
      } else {
        throw error
      }
    },
    [onConnectError]
  )
  const { connect } = useConnect({
    mutation: {
      onError: handleConnectError,
    },
  })

  const comethConnectConnector = useComethConnectConnector(userWalletAddress)

  return useCallback(() => {
    connect({ connector: comethConnectConnector as any })
  }, [connect, comethConnectConnector])
}
