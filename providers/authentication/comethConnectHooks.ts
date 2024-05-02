import { useCallback, useMemo } from "react"
import { manifest } from "@/manifests/manifests"
import { comethConnectConnector } from "@cometh/connect-sdk-viem"
import { useAccount, useConnect } from "wagmi"

import { env } from "@/config/env"

export const useIsComethConnectWallet = () => {
  const { connector } = useAccount()
  return useMemo(() => connector?.type === "cometh", [connector])
}

export const useComethConnectLogin = () => {
  const { connect } = useConnect()

  return useCallback(() => {
    if (!env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY) {
      throw new Error("COMETH_CONNECT_API_KEY is not set")
    }
    const connector = comethConnectConnector({
      apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY,
      rpcUrl: manifest.rpcUrl,
    })
    connect({ connector: connector as any })
  }, [connect])
}
