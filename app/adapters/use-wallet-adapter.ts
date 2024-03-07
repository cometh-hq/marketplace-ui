import { useEffect, useRef } from "react"


import { useComethConnectTxs } from "./use-cometh-txs"
import { useEOATxs } from "./use-eoa-txs"
import { WalletAdapter } from "./wallet-adapter"
import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"

export function useWalletAdapter() {
  const walletAdapter = useRef<WalletAdapter | null>(null)
  const comethConnectTxs = useComethConnectTxs()
  const eoaTxs = useEOATxs()

  const isComethWallet = useIsComethConnectWallet()

  function getWalletTxs() {
    return walletAdapter.current
  }

  useEffect(() => {
    walletAdapter.current = isComethWallet ? comethConnectTxs : eoaTxs
  }, [walletAdapter.current])

  return { getWalletTxs }
}
