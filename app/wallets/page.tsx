"use client"

import { useState } from "react"
import Image from "next/image"
import { wagmiConfig } from "@/providers/wagmi"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { cosmikClient } from "@/services/clients"
import { User } from "@/services/cosmik/signin"
import { SupportedNetworks } from "@cometh/connect-sdk"
import { getAccount, signMessage } from "@wagmi/core"
import { ethers } from "ethers"
import { SiweMessage } from "siwe"

import { env } from "@/config/env"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SignInForm } from "@/components/signin-form"

function numberToHex(value: number): string {
  return `0x${value.toString(16)}`
}

export default function WalletsPage() {
  const { initOnboard, onboard } = useWeb3OnboardContext()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  console.log("user", user)
  const handleLoginSuccess = (user: User) => {
    setIsLoggedIn(true)
    setUser(user)
  }

  const handleAddExternalWallet = async () => {
    console.log("handleAddExternalWallet")
    initOnboard({
      isComethWallet: false,
    })

    console.log("onboard", onboard)

    if (!onboard) {
      console.error("Onboard not initialized")
      return
    }

    const wallets = await onboard?.connectWallet()
    const walletAddress = wallets?.[0].accounts[0]?.address

    if (!walletAddress) {
      console.error("No wallet address found")
      return
    }

    let nonce

    try {
      nonce = await cosmikClient.post("/auth/init", {
        walletAddress,
      })
      console.log("nonce", nonce)
    } catch (error) {
      console.error("Error adding new device", error)
    }

    const domain = window.location.host
    const origin = window.location.origin

    const message = new SiweMessage({
      domain,
      address: "0xaCAEeda102b64678F6B9cc06FBE7B8E813acdb44",
      statement:
        "Add external wallet to link existing assets to your cosmik Battle Account",
      uri: origin,
      version: "1",
      chainId: Number(
        numberToHex(env.NEXT_PUBLIC_NETWORK_ID) as SupportedNetworks
      ),
    })
    console.log("message", message)
    // const signer = _getSigner();

    const ethersProvider = new ethers.providers.Web3Provider(
      wallets[0].provider,
      "any"
    )

    const signer = ethersProvider.getSigner()

    console.log("signer", signer)
    // return siweMessage.prepareMessage();

    const messageToSign = message.prepareMessage()
    const signature = await signer.signMessage(messageToSign)
    console.log("signature", signature)

    try {
      const verifyResponse = await cosmikClient.patch(
        "/me/external-addresses",
        {
          walletAddress,
          nonce: nonce?.data.nonce,
          signature,
          message,
        }
      )

      console.log("verifyResponse", verifyResponse)
    } catch (error) {
      console.error("Error adding new device", error)
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
              <div className="font-medium">
                Enter your Comsmik Battle credential to...
              </div>
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
              <Button size="sm">Logout</Button>
            </DialogHeader>
            <DialogDescription>
              Internal address (@{user?.address.substring(0, 6)}...): <br />
              <div className="font-bold">
                You have <span className="underline">{"34"} items</span>
                &nbsp;attached to your Cosmik Battle Account through
              </div>
            </DialogDescription>
            <DialogDescription>
              Add an external wallet to link existing assets to your cosmik
              Battle Account
            </DialogDescription>
            {/* <SignInForm onLoginSuccess={handleLoginSuccess} /> */}
            <Button size="lg" onClick={() => handleAddExternalWallet()}>
              Add external wallet
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
