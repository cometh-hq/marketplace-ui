"use client"

import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { manifest } from "@/manifests"
import {
  ConnectAdaptor,
  ConnectOnboardConnector,
  SupportedNetworks,
} from "@cometh/connect-sdk"

import "@web3-onboard/common"
import Onboard, { OnboardAPI } from "@web3-onboard/core"
import injectedModule from "@web3-onboard/injected-wallets"

import { COMETH_CONNECT_STORAGE_LABEL } from "@/config/site"

export interface SetOnboardOptions {
  isComethWallet: boolean
  walletAddress?: string
}

const Web3OnboardContext = createContext<{
  onboard: OnboardAPI | null
  initOnboard: (options: SetOnboardOptions) => void
  isConnected: boolean
  setIsconnected: Dispatch<SetStateAction<boolean>>
  reconnecting: boolean
  comethWalletAddress: string | undefined
}>({
  onboard: null,
  initOnboard: () => {},
  isConnected: false,
  setIsconnected: () => {},
  reconnecting: false,
  comethWalletAddress: undefined,
})

export function useWeb3OnboardContext() {
  return useContext(Web3OnboardContext)
}

export function Web3OnboardProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [onboard, setOnboard] = useState<OnboardAPI | null>(null)
  const [isConnected, setIsconnected] = useState<boolean>(false)
  const [reconnecting, setReconnecting] = useState<boolean>(false)
  const [comethWalletAddress, setComethWalletAddress] = useState<string>()

  const initOnboard = useCallback(
    ({ isComethWallet, walletAddress }: SetOnboardOptions) => {
      const wallets = [injectedModule()]

      if (isComethWallet && walletAddress) {
        wallets.push(
          ConnectOnboardConnector({
            apiKey: process.env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
            authAdapter: new ConnectAdaptor({
              chainId: SupportedNetworks.POLYGON,
              apiKey: process.env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
            }),
            ...(walletAddress && { walletAddress }),
          })
        )
      }

      const web3OnboardInstance = Onboard({
        wallets,
        chains: [
          {
            id: "0x89",
            token: "MATIC",
            label: "Polygon",
          },
        ],
        appMetadata: {
          name: manifest.name,
          description: "Description",
          icon: `/icons/un.svg`,
          logo: `/icons/metamask.svg`,
          recommendedInjectedWallets: [
            { name: "MetaMask", url: "https://metamask.io" },
          ],
        },
        theme: manifest.web3Onboard?.theme,
        accountCenter: {
          desktop: {
            enabled: false,
          },
          mobile: {
            enabled: false,
          },
        },
      })

      setOnboard(web3OnboardInstance)
    },
    []
  )

  useEffect(() => {
    initOnboard({ isComethWallet: false })
  }, [])

  useEffect(() => {
    const currentWalletInStorage = JSON.parse(
      localStorage.getItem("selectedWallet")!
    )

    /* If currentWalletInStorage is null, it means that the user has never logged into the site or has cleared their localstorage (on logout for example)
     * Check if there is a Cometh Connect keys in the localstorage
     * If there is one, set the currentWalletInStorage to the cometh wallet
     */
    const keysInStorage = Object.keys(localStorage)
    for (let key of keysInStorage) {
      if (key.startsWith("cometh-connect-")) {
        setComethWalletAddress(key.split("-")[2])
        break
      }
    }

    const isComethWallet =
      currentWalletInStorage === COMETH_CONNECT_STORAGE_LABEL &&
      !!comethWalletAddress

    if (isComethWallet) {
      initOnboard({
        isComethWallet,
        walletAddress: comethWalletAddress,
      })
    }

    if (currentWalletInStorage) {
      setReconnecting(true)
      onboard
        ?.connectWallet({
          autoSelect: {
            label: currentWalletInStorage,
            disableModals: true,
          },
        })
        .then((res) => {
          if (res?.length) {
            setIsconnected(true)
            setReconnecting(false)
          }
        })
    }
  }, [initOnboard, onboard, comethWalletAddress])

  return (
    <Web3OnboardContext.Provider
      value={{
        onboard,
        initOnboard,
        isConnected,
        setIsconnected,
        reconnecting,
        comethWalletAddress,
      }}
    >
      {children}
    </Web3OnboardContext.Provider>
  )
}