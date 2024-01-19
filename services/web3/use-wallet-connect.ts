import { useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { OnboardAPI, WalletState } from "@web3-onboard/core"

import globalConfig from "@/config/globalConfig"
import { COMETH_CONNECT_STORAGE_LABEL } from "@/config/site"
import { useStorageWallet } from "./use-storage-wallet"

export type RegisterFields = {
  email: string
  userName: string
}

export interface ConnectParams {
  isComethWallet?: boolean
}

async function _selectdCorrectChain(onboard: OnboardAPI, wallet: WalletState) {
  const requiredChaindId = `0x${globalConfig.network.chainId.toString(16)}`
  const walletChain = `0x${parseInt(wallet.chains?.[0].id ?? "0", 16).toString(
    16
  )}`
  if (walletChain !== requiredChaindId) {
    await onboard.setChain({ chainId: requiredChaindId })
  }
}

export function useWalletConnect(): {
  connect: ({ isComethWallet }: ConnectParams) => Promise<WalletState>
  connecting: boolean
} {
  const { onboard } = useWeb3OnboardContext()
  const [connecting, setConnecting] = useState(false)

  async function connect({
    isComethWallet = false,
  }: ConnectParams): Promise<WalletState> {
    setConnecting(true)

    if (!onboard) throw new Error("Onboard is not initialized")

    let onboardConfig = undefined
    if (isComethWallet) {
     onboardConfig = {
      autoSelect: {
        label: COMETH_CONNECT_STORAGE_LABEL,
        disableModals: true,
      },
    }
    }

    try {
      const wallets = await onboard.connectWallet(
        onboardConfig
      )

      if (wallets?.[0]) {
        await _selectdCorrectChain(onboard, wallets[0])
        localStorage.setItem("selectedWallet", wallets[0].label)
        return wallets[0]
      } else {
        throw new Error("No wallet selected")
      }
    } catch (error) {
      console.error(error)
      throw new Error("Failed to connect wallet")
    } finally {
      setConnecting(false)
    }
  }

  return {
    connect,
    connecting,
  }
}
