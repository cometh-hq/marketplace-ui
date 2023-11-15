import { useMemo } from "react"
import { useConnectWallet } from "@/services/web3/use-connect-wallet"
import { ethers } from "ethers"
import { atom, useAtom, useSetAtom } from "jotai"
import { Address } from "viem"

const connectModalOpen = atom(false)
export const useSetConnectModalOpen = () => useSetAtom(connectModalOpen)
export const useConnectModalOpen = () => useAtom(connectModalOpen)

export const currentAccountIndexAtom = atom(0)
export const useCurrentAccountIndex = () => useAtom(currentAccountIndexAtom)
export const useCurrentAccountIndexValue = () => useCurrentAccountIndex()[0]
export const useSetCurrentAccountIndex = () => useCurrentAccountIndex()[1]

export const useAuth = () => {
  return useConnectWallet()
}

export const useConnect = () => {
  return useAuth()[1]
}

export const useDisconnect = () => {
  return useAuth()[2]
}

export const useWallet = () => {
  return useAuth()[0].wallet
}

export const useIsConnecting = () => {
  return useAuth()[0].connecting
}

export const useWalletProvider = () => {
  const wallet = useWallet()
  const isComethWallet = wallet?.label === "Connect SDK" ?? false

  const provider: any = useMemo(
    () =>
      isComethWallet
        ? wallet?.provider
        : wallet?.provider
        ? new ethers.providers.Web3Provider(wallet?.provider, "any")
        : null,
    [isComethWallet, wallet?.provider]
  )

  return provider
}

export const useSigner = () => {
  return useWalletProvider()?.getSigner()
}

export const useChain = () => {
  return useWallet()?.chains[0]
}

export const useAvailableAccounts = () => {
  return useWallet()?.accounts ?? []
}

export const useCurrentViewerAddress = () => {
  const currentAccountIndex = useCurrentAccountIndexValue()
  const availableAccounts = useAvailableAccounts()
  return availableAccounts[currentAccountIndex]?.address as Address | undefined
}

export const useIsConnected = () => {
  return !!useCurrentViewerAddress()
}

export const useIsComethWallet = () => {
  const wallet = useWallet()
  return wallet?.label === "Connect SDK" ?? false
}
