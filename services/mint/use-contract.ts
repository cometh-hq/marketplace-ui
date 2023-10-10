import { useMemo } from "react"
import { manifest } from "@/manifests"
import { ethers } from "ethers"

import { useSigner } from "@/lib/web3/auth"

import abi from "./abi.json"

export const useMintContract = () => {
  const signer = useSigner()
  return useMemo(() => {
    if (!signer) return null
    return new ethers.Contract(manifest.contractAddress, abi, signer)
  }, [signer])
}
