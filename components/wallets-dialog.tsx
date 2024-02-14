import { useEffect, useRef, useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { comethMarketplaceClient } from "@/services/clients"
import { useAddExternalWallet } from "@/services/cosmik/external-addresses"
import { User } from "@/services/cosmik/signin"
import { useGetUserNonce } from "@/services/cosmik/user-nonce"
import { SupportedNetworks } from "@cometh/connect-sdk"
import { AssetSearchFilters } from "@cometh/marketplace-sdk"
import { ethers } from "ethers"
import { SiweMessage } from "siwe"

import { env } from "@/config/env"
import globalConfig from "@/config/globalConfig"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "./ui/button"
import WalletList from "./wallets/wallet-list"

function numberToHex(value: number): string {
  return `0x${value.toString(16)}`
}

type WalletsDialogProps = {
  user: User
}

export function WalletsDialog({ user }: WalletsDialogProps) {
  const { onboard } = useWeb3OnboardContext()

  const { mutateAsync: getUserNonceAsync } = useGetUserNonce()
  const { mutateAsync: addExternalWallet} = useAddExternalWallet()

  const walletAddress = useRef<string | null>(null)
  const walletState = useRef<any | null>(null)

  const [wallets, setWallets] = useState<{ address: string; items: number }[]>(
    []
  )

  useEffect(() => {
    const initialWallets = [
      { address: user.address, items: 0 },
      ...user.externalAddresses.map((address) => ({ address, items: 0 })),
    ]
    setWallets(initialWallets)
  }, [user])

  useEffect(() => {
    async function updateItemsCounts() {
      const promises = wallets.map(async (wallet) => {
        try {
          const filters: AssetSearchFilters = {
            contractAddress: globalConfig.contractAddress,
            owner: wallet.address,
            limit: 1,
          }
          const response =
            await comethMarketplaceClient.asset.searchAssets(filters)
          return { address: wallet.address, items: response.total }
        } catch (error) {
          console.error(
            "Error fetching assets count for address:",
            wallet.address,
            error
          )
          return { address: wallet.address, items: 0 }
        }
      })

      const results = await Promise.all(promises)
      setWallets(results)
    }

    updateItemsCounts()
  }, [wallets])

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
    const { nonce } = await getUserNonceAsync({ walletAddress })

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

    if (!window || !wallet || !walletAddress) {
      throw new Error("No window or wallet")
    }

    const domain = window.location.host
    const uri = window.location.origin

    const message = new SiweMessage({
      domain,
      address: walletAddress,
      statement,
      uri,
      version: "1",
      chainId: Number(
        numberToHex(env.NEXT_PUBLIC_NETWORK_ID) as SupportedNetworks
      ),
      nonce,
    })

    return message
  }

  async function handleAddExternalWallet() {
    try {
      const wallet = await onboard?.connectWallet()
      walletState.current = wallet

      if (!wallet) {
        throw new Error("No wallet")
      }

      const walletAddr = ethers.utils.getAddress(
        wallet?.[0].accounts[0]?.address
      )
      walletAddress.current = walletAddr

      const nonce = await getUserNonce()
      const message = await createMessage({
        nonce,
        statement: "Connect to Cosmik Battle to link your wallet.",
      })

      if (!message) {
        throw new Error("No message")
      }

      const signer = getSigner()
      const messageToSign = message.prepareMessage()
      const signature = await signer.signMessage(messageToSign)

      if (!signature) {
        throw new Error("No signature")
      }

      addExternalWallet(
        { walletAddress: walletAddr, nonce, signature, message },
        {
          onSuccess: () => {
            setWallets((prevWallets) => [
              ...prevWallets,
              { address: walletAddr, items: 0 },
            ])
          },
        }
      )
    } catch (error) {
      console.error("Error connecting wallet", error)
    }
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[400px]" shouldDisplayCloseBtn={false}>
        <DialogHeader className="flex-row items-center justify-between space-y-0">
          <DialogTitle className="normal-case">@{user?.userName}</DialogTitle>
        </DialogHeader>
        <ul className="space-y-3">
          <WalletList wallets={wallets} />
        </ul>
        <div className="text-muted-foreground">
          Add an external wallet to link existing assets to your cosmik Battle
          Account
        </div>
        <Button size="lg" onClick={() => handleAddExternalWallet()}>
          Add external wallet
        </Button>
      </DialogContent>
    </Dialog>
  )
}
