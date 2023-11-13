"use client"

import { useState } from "react"
import { manifest } from "@/manifests"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { ConnectOptions, OnboardAPI, WalletState } from "@web3-onboard/core"
import { ethers } from "ethers"
import { COMETH_CONNECT_LABEL } from "@/config/site"

export interface ConnectParams {
  isAlembicWallet?: boolean;
}

async function _selectdCorrectChain(onboard: OnboardAPI, wallet: WalletState) {
  const requiredChaindId = ethers.utils.hexlify(manifest.network.chainId)
  if (wallet.chains?.[0].id !== requiredChaindId) {
    await onboard.setChain({ chainId: requiredChaindId })
  }
}

export function useWalletConnect(): {
  // connect: (options?: ConnectOptions) => Promise<WalletState>
  connect: ({ isAlembicWallet }: ConnectParams) => Promise<WalletState>
  connecting: boolean
} {
  const { onboard } = useWeb3OnboardContext()
  const [connecting, setConnecting] = useState(false)

  // async function connect(options?: ConnectOptions): Promise<WalletState> {
  async function connect({
    isAlembicWallet = false,
  }: ConnectParams): Promise<WalletState> {
    setConnecting(true)
    console.log('in useWalletConnect connect', isAlembicWallet)
    if (!onboard) throw new Error("Cannot connect to wallet")
    console.log("after !onboard ", onboard)
    try {
      console.log('in try ')
      // const wallets = await onboard?.connectWallet(options)
      const wallets = await onboard?.connectWallet(
        isAlembicWallet
          ? {
              autoSelect: {
                label: COMETH_CONNECT_LABEL,
                disableModals: true,
              },
            }
          : undefined
      )
      console.log('wallets', wallets)
      if (wallets?.[0]) {
        console.log('wallets?.[0]', wallets?.[0])
        await _selectdCorrectChain(onboard, wallets[0])
        localStorage.setItem("selectedWallet", JSON.stringify(wallets[0].label))
        setConnecting(false)
        return wallets[0]
      } else {
        console.log('in else')
        setConnecting(false)
        throw new Error("Cannot connect to wallet")
      }
    } catch (error) {
      console.log('Error in try-catch:', error)
      setConnecting(false)
      throw new Error("Cannot connect to wallet")
    }
  }

  return {
    connect,
    connecting,
  }
}
