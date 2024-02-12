import React from "react"
import { Address } from "viem"

import { shortenAddress } from "@/lib/utils/addresses"

type WalletListProps = {
  addresses: Address[];
  assetsCounts: { [key: string]: number };
}

const WalletList = ({ addresses, assetsCounts }: WalletListProps) => {
  return (
    <>
      {addresses.map((address) => (
        <li key={address} className="border-b border-white/10 pb-3">
          Wallet ({shortenAddress(address)}): <br />
          <div className="font-bold">
            You have{" "}
            <span className="underline">
              {assetsCounts[address] ?? "..."}
            </span>{" "}
            items attached to your Cosmik Battle Account through
          </div>
        </li>
      ))}
    </>
  )
}

export default WalletList
