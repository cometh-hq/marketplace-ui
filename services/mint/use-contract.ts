import { useMemo } from "react"
import { ethers } from "ethers"

import { useSigner } from "@/lib/web3/auth"

import abi from "./abi.json"
import globalConfig from "@/config/globalConfig"

export const useMintContract = () => {
  const signer = useSigner()
  return useMemo(() => {
    if (!signer) return null
    return new ethers.Contract(globalConfig.contractAddress, abi, signer)
  }, [signer])
}
