import { createContext, useContext, useEffect, useRef } from "react"

import { useIsComethWallet } from "@/lib/web3/auth"
import { useComethConnectTxs } from "@/app/adapters/use-cometh-txs"
import { useEOATxs } from "@/app/adapters/use-eoa-txs"
import { WalletAdapter } from "@/app/adapters/wallet-adapter"

const WalletsAdapterContext = createContext<{
  getWalletTxs: () => WalletAdapter | null
}>({
  getWalletTxs: () => null,
})

export function useWalletsAdapterContext() {
  return useContext(WalletsAdapterContext)
}

export function WalletsAdapterProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const walletTxs = useRef<WalletAdapter | null>(null)
  const isComethWallet = useIsComethWallet()
  const comethConnectTxs = useComethConnectTxs()
  const eoaTxs = useEOATxs()

  function getWalletTxs() {
    return walletTxs.current
  }

  useEffect(() => {
    walletTxs.current = isComethWallet ? comethConnectTxs : eoaTxs
  }, [comethConnectTxs, eoaTxs, isComethWallet])

  return (
    <WalletsAdapterContext.Provider value={{ getWalletTxs }}>
      {children}
    </WalletsAdapterContext.Provider>
  )
}
