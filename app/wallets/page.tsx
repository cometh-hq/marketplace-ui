"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { comethMarketplaceClient, cosmikClient } from "@/services/clients"
import { useAddExternalWallet } from "@/services/cosmik/external-addresses"
import { User } from "@/services/cosmik/signin"
import { useGetUserNonce } from "@/services/cosmik/user-nonce"
import { useWalletConnect } from "@/services/web3/use-wallet-connect"
import { SupportedNetworks } from "@cometh/connect-sdk"
import {
  AssetSearchFilters,
  SearchAssetResponse,
} from "@cometh/marketplace-sdk"
import { ethers } from "ethers"
import { SiweMessage } from "siwe"
import { Address } from "viem"

import { env } from "@/config/env"
import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SignInForm } from "@/components/signin-form"
import WalletList from "@/components/wallets/wallet-list"

function numberToHex(value: number): string {
  return `0x${value.toString(16)}`
}

export default function WalletsPage() {
  const { initOnboard, onboard } = useWeb3OnboardContext()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [assetsCounts, setAssetsCounts] = useState<{ [key: Address]: number }>(
    {}
  )
  const walletAddress = useRef<string | null>(null)
  const walletState = useRef<any | null>(null)
  const { mutateAsync: getUserNonceAsync } = useGetUserNonce()
  const { mutateAsync: addExternalWalletAsync } = useAddExternalWallet()

  const allAddresses = [
    user?.address,
    ...(user?.externalAddresses || []),
  ].filter(Boolean) as Address[]

  useEffect(() => {
    const fetchAssetsCounts = async () => {
      const counts = await fetchAssetsForAddresses(allAddresses)
      setAssetsCounts(counts)
    }

    if (user?.address || user?.externalAddresses?.length) {
      fetchAssetsCounts()
    }
  }, [user?.address, user?.externalAddresses])

  async function fetchAssetsForAddresses(addresses: Array<Address>) {
    const counts: { [key: string]: number } = {}
    const promises = addresses.map(async (address) => {
      const filters: AssetSearchFilters = {
        contractAddress: globalConfig.contractAddress,
        owner: address,
        limit: 1,
      }

      try {
        const response: SearchAssetResponse =
          await comethMarketplaceClient.asset.searchAssets(filters)
        counts[address] = response.total
      } catch (error) {
        console.error(
          "Erreur lors de la recherche d'assets pour l'adresse",
          address,
          error
        )
        counts[address] = 0
      }
    })

    await Promise.all(promises)
    return counts
  }

  function handleLoginSuccess(user: User) {
    setIsLoggedIn(true)
    setUser(user)
  }

  function getRefsValues() {
    return {
      walletAddress: walletAddress.current,
      wallet: walletState.current,
    }
  }

  function getSigner() {
    const { wallet } = getRefsValues()
    const provider = new ethers.providers.Web3Provider(wallet[0].provider)
    const signer = provider?.getSigner()
    if (!signer) {
      throw new Error("No signer")
    }

    return signer
  }

  async function getUserNonce() {
    const { walletAddress } = getRefsValues()
    if (!walletAddress) {
      throw new Error("No wallet address")
    }
    const { nonce } = await getUserNonceAsync({ walletAddress });

    return nonce
  }

  async function createMessage({
    nonce,
    statement,
  }: {
    nonce: string
    statement: string
  }) {
    const { wallet, walletAddress } = getRefsValues()

    if (!window || !wallet) {
      throw new Error("No window nor wallet")
    }

    const domain = window.location.host
    const uri = window.location.origin

    const message = new SiweMessage({
      domain,
      address: walletAddress as Address,
      statement,
      uri,
      version: "1",
      chainId: Number(
        numberToHex(env.NEXT_PUBLIC_NETWORK_ID) as SupportedNetworks
      ),
    })

    return message
  }

  async function handleAddExternalWallet() {
    try {
      // initOnboard({
      //   isComethWallet: false,
      // })

      const wallet = await onboard?.connectWallet()
      walletState.current = wallet

      const walletAddr = ethers.utils.getAddress(
        wallet?.[0].accounts[0]?.address as Address
      )
      walletAddress.current = walletAddr

      if (!walletAddr) {
        throw new Error("No wallet address found")
      }

      const nonce = await getUserNonce()
      const message = await createMessage({
        nonce,
        statement: "Connect to Ultimate Numbers",
      })

      if (!message) {
        throw new Error("No message")
      }

      const signer = getSigner()
      const messageToSign = message.prepareMessage()
      console.log("messageToSign", messageToSign)
      const signature = await signer.signMessage(messageToSign)
      console.log("signature", signature)

      if (!signature) {
        throw new Error("No signature")
      }

      addExternalWalletAsync({
        walletAddress: walletAddr as Address,
        nonce,
        signature,
        message,
      })
    } catch (error) {
      console.error("Error connecting wallet", error)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center gap-4 py-5 sm:py-6">
      {!isLoggedIn ? (
        <Dialog open={true}>
          <DialogContent
            className="sm:max-w-[400px]"
            shouldDisplayCloseBtn={false}
          >
            <DialogHeader>
              <Image
                className="mx-auto"
                src="/cosmik-logo.png"
                width="140"
                height="70"
                alt=""
              />
            </DialogHeader>
            <DialogDescription>
              Enter your Comsmik Battle credentials to view or add external
              wallets
            </DialogDescription>
            <SignInForm onLoginSuccess={handleLoginSuccess} />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={true}>
          <DialogContent
            className="sm:max-w-[400px]"
            shouldDisplayCloseBtn={false}
          >
            <DialogHeader className="flex-row items-center justify-between space-y-0">
              <DialogTitle className="normal-case">
                @{user?.userName}
              </DialogTitle>
            </DialogHeader>
            <ul className="space-y-3">
              <WalletList
                addresses={allAddresses}
                assetsCounts={assetsCounts}
              />
            </ul>
            <div className="text-muted-foreground">
              Add an external wallet to link existing assets to your cosmik
              Battle Account
            </div>
            <Button size="lg" onClick={() => handleAddExternalWallet()}>
              Add external wallet
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
