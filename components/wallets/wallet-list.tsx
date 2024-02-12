import React from "react"
import { Address } from "viem"

import { shortenAddress } from "@/lib/utils/addresses"

type WalletListProps = {
  wallets: { address: string; items: number }[]
}

const WalletList = ({ wallets }: WalletListProps) => {
  return (
    <>
      {wallets.map(({ address, items }) => (
        <li key={address} className="border-b border-white/10 pb-3">
          Wallet ({shortenAddress(address as Address)}): <br />
          <div className="font-bold">
            You have <span className="underline">{items ?? "..."}</span> items
            attached to your Cosmik Battle Account through
          </div>
        </li>
      ))}
    </>
  )
}

export default WalletList
