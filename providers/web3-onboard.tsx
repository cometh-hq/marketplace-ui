"use client"

import {
  Dispatch,
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
import { SetStateAction } from "react"
import Onboard, { OnboardAPI } from "@web3-onboard/core"
import injectedModule from "@web3-onboard/injected-wallets"

import { COMETH_CONNECT_LABEL } from "@/config/site"
import { useCurrentViewerAddress, useIsComethWallet } from "@/lib/web3/auth"

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
}>({
  onboard: null,
  initOnboard: () => {},
  isConnected: false,
  setIsconnected: () => {},
  reconnecting: false,
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
  const isComethWallet = useIsComethWallet()
  const viewerAddress = useCurrentViewerAddress()

  const initOnboard = useCallback((options: SetOnboardOptions) => {
    const wallets = [injectedModule()]

    if (options.isComethWallet && options.walletAddress) {
      wallets.push(
        ConnectOnboardConnector({
          apiKey: process.env.NEXT_PUBLIC_ALEMBIC_API_KEY!,
          baseUrl: process.env.NEXT_PUBLIC_COMETH_CONNECT_URL,
          walletAddress: options.walletAddress,
          authAdapter: new ConnectAdaptor({
            chainId: SupportedNetworks.POLYGON,
            apiKey: process.env.NEXT_PUBLIC_ALEMBIC_API_KEY!,
            baseUrl: process.env.NEXT_PUBLIC_COMETH_CONNECT_URL,
          }),
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
        icon: `${process.env.NEXT_PUBLIC_BASE_PATH}/icons/un.svg`,
        logo: `${process.env.NEXT_PUBLIC_BASE_PATH}/icons/metamask.svg`,
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
  }, [])

  useEffect(() => {
    initOnboard({ isComethWallet: false })
  }, [])

  useEffect(() => {
    // const isComethWallet = profile?.isAlembicKeyStore || false
    const isComethWallet =
      localStorage.getItem("selectedWallet") === COMETH_CONNECT_LABEL

    if (isComethWallet) {
      initOnboard({
        isComethWallet,
        ...(isComethWallet && {
          // walletAddress: profile.walletAddress?.toString(),
          walletAddress: viewerAddress?.toString(),
        }),
      })
    }

    const wallet = localStorage.getItem("selectedWallet")
    if (wallet) {
      setReconnecting(true)
      onboard
        ?.connectWallet({
          autoSelect: {
            label: isComethWallet ? COMETH_CONNECT_LABEL : JSON.parse(wallet),
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
  }, [initOnboard, isComethWallet, onboard, viewerAddress])

  return (
    <Web3OnboardContext.Provider
      value={{
        onboard,
        initOnboard,
        isConnected,
        setIsconnected,
        reconnecting,
      }}
    >
      {children}
    </Web3OnboardContext.Provider>
  )
}
