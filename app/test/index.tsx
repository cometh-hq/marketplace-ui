"use client"

import { useState } from "react"
import {
  useAssets,
  useAthlete,
  useMintAthlete,
  useMintRewardPoints,
} from "@/services/joca/jocaHooks"
import { useAccount } from "wagmi"

import { Button } from "@/components/ui/Button"
import { PriceInput } from "@/components/ui/PriceInput"
import { BiometricLoginButton } from "@/components/login/BiometricLoginButton"

export default function TestPage({}: {}) {
  const account = useAccount()

  const { athlete, isPending: isPendingAthlete } = useAthlete()
  const { assets } = useAssets()
  const { mintAthlete, isPending: isPendingMintAthlete } = useMintAthlete()
  const { mintRewardsPoints, isPending: isPendingMintRewardPoints } =
    useMintRewardPoints()

  const [erc20MintQuantity, setErc20Quantity] = useState("0")

  console.log("assets", assets)

  return (
    <div className="container mx-auto flex w-full flex-col items-start gap-4 py-4 max-sm:pt-2">
      {account.isConnected ? (
        <div>
          <div className="mb-2 mt-3 text-xl">Athlète: </div>
          <Button
            onClick={mintAthlete}
            disabled={isPendingMintAthlete}
            isLoading={isPendingMintAthlete}
          >
            Mint athlète
          </Button>
          <div className="mt-3">
            <pre>
              {isPendingAthlete
                ? "Chargement..."
                : JSON.stringify(athlete, null, 2)}
            </pre>
          </div>
          <div>
            <div className="mb-2 mt-3 text-xl">Mint CAT (ERC20)</div>
            <PriceInput onInputUpdate={setErc20Quantity} />
            <Button
              onClick={() => mintRewardsPoints(erc20MintQuantity)}
              disabled={isPendingMintRewardPoints}
              isLoading={isPendingMintRewardPoints}
            >
              Mint CAT
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div>Page de connexion</div>
          <BiometricLoginButton />
        </div>
      )}
    </div>
  )
}
