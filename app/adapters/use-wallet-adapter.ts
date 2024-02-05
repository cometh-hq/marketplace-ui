import { useEffect, useRef } from "react"

import { useIsComethWallet } from "@/lib/web3/auth"

import { useComethConnectTxs } from "./use-cometh-txs"
import { useEOATxs } from "./use-eoa-txs"
import { WalletAdapter } from "./wallet-adapter"

export function useWalletAdapter() {
  const walletAdapter = useRef<WalletAdapter | null>(null)
  const comethConnectTxs = useComethConnectTxs()
  const eoaTxs = useEOATxs()
  
  const isComethWallet = useIsComethWallet()

  function getWalletTxs() {
    return walletAdapter.current
  }

  useEffect(() => {
    walletAdapter.current = isComethWallet ? comethConnectTxs : eoaTxs
  }, [walletAdapter.current])


  return { getWalletTxs }
}
