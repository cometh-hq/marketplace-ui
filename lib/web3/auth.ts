import { useMemo } from "react"
import { useConnectWallet } from "@web3-onboard/react"
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
  const provider = useWallet()?.provider
  return useMemo(() => {
    if (!provider) return null
    return new ethers.providers.Web3Provider(provider, "any")
  }, [provider])
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

// export const useViewerBalance = () => {
//   const currentAccountIndex = useCurrentAccountIndexValue()
//   return useAvailableAccounts()[currentAccountIndex]?.balance
// }

export const useIsConnected = () => {
  return !!useCurrentViewerAddress()
}
