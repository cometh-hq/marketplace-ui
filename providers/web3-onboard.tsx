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
  ComethWallet,
  ConnectAdaptor,
  ConnectOnboardConnector,
  NewSignerRequestBody,
  NewSignerRequestType,
  SupportedNetworks,
} from "@cometh/connect-sdk"

import "@web3-onboard/common"
import { useStorageWallet } from "@/services/web3/use-storage-wallet"
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
  initNewSignerRequest: (walletAddress: string) => Promise<NewSignerRequestBody>
  retrieveWalletAddressFromSigner: (walletAddress: string) => Promise<void>
}>({
  onboard: null,
  initOnboard: () => {},
  isConnected: false,
  setIsconnected: () => {},
  reconnecting: false,
  initNewSignerRequest: () => Promise.resolve({
    walletAddress: "",
    signerAddress: "",
    deviceData: {
      browser: "",
      os: "",
      platform: "",
    },
    type: NewSignerRequestType.WEBAUTHN,
  }),
    retrieveWalletAddressFromSigner: () => Promise.resolve(),
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
  const { comethWalletAddressInStorage } = useStorageWallet()

  const initNewSignerRequest = async (walletAddress: string) => {
    const connectAuthAdaptor = new ConnectAdaptor({
      chainId: SupportedNetworks.MUSTER_TESTNET,
      apiKey: process.env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
      baseUrl: process.env.NEXT_PUBLIC_COMETH_CONNECT_BASE_URL!,
    });

    return await connectAuthAdaptor.initNewSignerRequest(walletAddress);
  }

  const retrieveWalletAddressFromSigner = async (walletAddress: string) => {
    const connectAuthAdaptor = new ConnectAdaptor({
      chainId: SupportedNetworks.MUSTER_TESTNET,
      apiKey: process.env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
      baseUrl: process.env.NEXT_PUBLIC_COMETH_CONNECT_BASE_URL!,
    });

    const wallet = new ComethWallet({
      authAdapter: connectAuthAdaptor,
      apiKey: process.env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
    })

    console.log("walletAddress", walletAddress);
    await wallet.connect(walletAddress);
    console.log("wallet connected", walletAddress);
  }

  const initOnboard = useCallback((options: SetOnboardOptions) => {
    const wallets = [injectedModule()]
    if (options.isComethWallet) {
      wallets.push(
        ConnectOnboardConnector({
          apiKey: process.env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
          authAdapter: new ConnectAdaptor({
            chainId: SupportedNetworks.MUSTER_TESTNET,
            apiKey: process.env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
          }),
          ...(options.walletAddress && {
            walletAddress: options.walletAddress,
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
    const currentWalletInStorage = localStorage.getItem("selectedWallet")
    console.log("currentWalletInStorage ", currentWalletInStorage)
    const isComethWallet =
      currentWalletInStorage === COMETH_CONNECT_STORAGE_LABEL
    if (isComethWallet) {
      initOnboard({
        isComethWallet,
        walletAddress: comethWalletAddressInStorage!,
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
  }, [initOnboard, onboard, comethWalletAddressInStorage])

  return (
    <Web3OnboardContext.Provider
      value={{
        onboard,
        initOnboard,
        isConnected,
        setIsconnected,
        reconnecting,
        initNewSignerRequest,
        retrieveWalletAddressFromSigner
      }}
    >
      {children}
    </Web3OnboardContext.Provider>
  )
}
