"use client"

import { useState } from "react"
import Image from "next/image"
import { wagmiConfig } from "@/providers/wagmi"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { cosmikClient } from "@/services/cometh-marketplace/client"
import { User } from "@/services/cometh-marketplace/cosmik/signin"
import { signMessage } from "@wagmi/core"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SignUpForm } from "@/components/signup-form"

export default function WalletsPage() {
  const { initOnboard, onboard } = useWeb3OnboardContext()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const handleLoginSuccess = (user: User) => {
    setIsLoggedIn(true)
    setUser(user)
  }

  const handleAddExternalWallet = async () => {
    initOnboard({
      isComethWallet: false,
    })

    if (!onboard) {
      console.error("Onboard not initialized")
      return
    }

    const walletState = await onboard?.connectWallet()
    console.log("walletState", walletState)
    const walletAddress = walletState?.[0].accounts[0]?.address
    console.log("walletAddress", walletAddress)
    // const nonceResponse = await fetch('https://api.develop.cosmikbattle.com/api/auth/init');
    // const { nonce } = await nonceResponse.json();

    if (!walletAddress) {
      console.error("No wallet address found")
      return
    }

    let nonce;

    try {
      nonce = await cosmikClient.post("/auth/init", {
        walletAddress,
      })
      console.log("nonce", nonce);
    } catch (error) {
      console.error("Error adding new device", error)
    }

    const message = "Veuillez signer ce message pour vérifier votre identité."
    const sign = await signMessage(wagmiConfig, { message: message })

    console.log("sign", sign)

    try {
      const verifyResponse = await cosmikClient.patch(
        "/me/external-addresses",
        {
          walletAddress,
          nonce: nonce?.data.nonce,
          signature: sign,
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
        <Dialog open={true} modal>
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
            <SignUpForm onLoginSuccess={handleLoginSuccess} />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={true} modal>
          <DialogContent
            className="sm:max-w-[400px]"
            shouldDisplayCloseBtn={false}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 normal-case">
                @{user?.userName}
                {/* <small>{user?.address}</small> */}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              {/* <p className="font-medium">
                internal address: {user?.address.substring(0, 6)}...
              </p> */}
              <div className="font-medium">
                Add an external wallet to link existing assets to your cosmik
                Battle Account
              </div>
            </DialogDescription>
            {/* <SignUpForm onLoginSuccess={handleLoginSuccess} /> */}
            <Button
              size="lg"
              className="w-full"
              onClick={() => handleAddExternalWallet()}
            >
              Add external wallet
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
