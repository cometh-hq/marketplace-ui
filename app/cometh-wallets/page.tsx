"use client"

import { use, useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

const COMETH_PASSKEY_PREFIX = "cometh-connect-"
const COMETH_BRUNER_PREFIX = "cometh-connect-fallback-"

type LocalStorageWallets = {
  burnerWallets: string[]
  passkeyWallets: string[]
}

const getLocalStorageWallets = (): LocalStorageWallets => {
  const burnerWallets = []
  const passkeyWallets = []
  for (var i = 0, len = localStorage.length; i < len; ++i) {
    const key = localStorage.key(i)
    console.log("Storage key: " + key)
    if (key?.startsWith(COMETH_PASSKEY_PREFIX)) {
      const keySplit = key.split(COMETH_PASSKEY_PREFIX)
      console.log("Key split: " + keySplit)
      if (keySplit.length > 1) {
        passkeyWallets.push(keySplit[1])
      }
    }
    if (key?.startsWith(COMETH_BRUNER_PREFIX)) {
      const keySplit = key.split(COMETH_BRUNER_PREFIX)
      console.log("Key split: " + keySplit)
      if (keySplit.length > 1) {
        burnerWallets.push(keySplit[1])
      }
    }
  }

  console.log("Burner wallets: ", {
    burnerWallets,
    passkeyWallets,
  })
  return { burnerWallets, passkeyWallets }
}

export default function ComethWallets() {
  const [localStorageWallets, setLocalStorageWallets] =
    useState<LocalStorageWallets>({
      burnerWallets: [],
      passkeyWallets: [],
    })
  const [newWalletAddress, setNewWalletAddress] = useState("")

  useEffect(() => {
    setLocalStorageWallets(getLocalStorageWallets())
  }, [])

  const refresh = useCallback(() => {
    setLocalStorageWallets(getLocalStorageWallets())
  }, [])

  const logInSpecificWallet = useCallback(() => {
    console.log("Logi in wallet: ", newWalletAddress)
  }, [newWalletAddress])

  return (
    <div className="p-5">
      <div className="text-xl font-bold">Cometh Wallets</div>
      <Button onClick={refresh}>Load wallets</Button>
      <div className="mt-5 text-lg font-bold">Passkey Wallets</div>
      <ul>
        {localStorageWallets.passkeyWallets.map((wallet) => (
          <li key={wallet}>{wallet}</li>
        ))}
      </ul>
      <div className="text-lg font-bold">Burner Wallets</div>
      <ul>
        {localStorageWallets.burnerWallets.map((wallet) => (
          <li key={wallet}>{wallet}</li>
        ))}
      </ul>
      <div className="mt-5">
        <div className="text-xl font-bold">Change connected wallet</div>
        <Input inputUpdateCallback={setNewWalletAddress}></Input>
        <Button onClick={logInSpecificWallet}>
          Cometh connect log into wallet
        </Button>
      </div>
    </div>
  )
}
