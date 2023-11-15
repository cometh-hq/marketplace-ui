"use client"

import {
  ConnectOptions,
  DisconnectOptions,
  WalletState,
} from "@web3-onboard/core"

import { useWalletDisconnect } from "./use-wallet-disconnect"
import { useGetWalletState } from "./use-wallet-state"
import { useWalletConnect } from "./use-wallet-connect";

export function useConnectWallet(): [
  { wallet: WalletState | null; connecting: boolean },
  ({ isComethWallet = false }) => Promise<WalletState>,
  (wallet: DisconnectOptions) => Promise<WalletState[] | undefined>,
] {
  const getWalletState = useGetWalletState()
  const { connect, connecting } = useWalletConnect()
  const { disconnect } = useWalletDisconnect()

  const wallet = getWalletState()

  return [{ wallet, connecting}, connect, disconnect]
}
