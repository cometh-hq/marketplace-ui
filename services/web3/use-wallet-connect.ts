import { useState } from "react"
import { manifest } from "@/manifests"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { OnboardAPI, WalletState } from "@web3-onboard/core"
import { ethers } from "ethers"

import { COMETH_CONNECT_STORAGE_LABEL } from "@/config/site"

export type RegisterFields = {
  email: string
  userName: string
}

export interface ConnectParams {
  isAlembicWallet?: boolean
}

async function _selectdCorrectChain(onboard: OnboardAPI, wallet: WalletState) {
  const requiredChaindId = ethers.utils.hexlify(manifest.network.chainId)
  if (wallet.chains?.[0].id !== requiredChaindId) {
    await onboard.setChain({ chainId: requiredChaindId })
  }
}

export function useWalletConnect(): {
  connect: ({ isAlembicWallet }: ConnectParams) => Promise<WalletState>
  connecting: boolean
} {
  const { onboard } = useWeb3OnboardContext()
  const [connecting, setConnecting] = useState(false)

  async function connect({
    isAlembicWallet = false,
  }: ConnectParams): Promise<WalletState> {
    setConnecting(true)

    if (!onboard) throw new Error("Onboard is not initialized")

    try {
      const wallets = await onboard.connectWallet(
        isAlembicWallet
          ? {
              autoSelect: {
                label: COMETH_CONNECT_STORAGE_LABEL,
                disableModals: true,
              },
            }
          : undefined
      )

      if (wallets?.[0]) {
        await _selectdCorrectChain(onboard, wallets[0])
        localStorage.setItem("selectedWallet", JSON.stringify(wallets[0].label))
        return wallets[0]
      } else {
        throw new Error("No wallet selected")
      }
    } catch (error) {
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