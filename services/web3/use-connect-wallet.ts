"use client"

import { useMemo } from "react"
import { DisconnectOptions, WalletState } from "@web3-onboard/core"

import { useWalletConnect } from "./use-wallet-connect"
import { useWalletDisconnect } from "./use-wallet-disconnect"
import { useGetWalletState } from "./use-wallet-state"

export function useConnectWallet(): [
  { wallet: WalletState | null; connecting: boolean },
  ({ isComethWallet }: { isComethWallet: boolean }) => Promise<WalletState>,
  (wallet: DisconnectOptions) => Promise<WalletState[] | undefined>,
] {
  const getWalletState = useGetWalletState()
  const { connect, connecting } = useWalletConnect()
  const { disconnect } = useWalletDisconnect()

  const wallet = getWalletState()

  return useMemo(() => {
    return [{ wallet, connecting }, connect, disconnect]
  }, [wallet, connecting, connect, disconnect])
}
