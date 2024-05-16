import { useEffect, useState } from "react"
import {
  useERC20Balance,
  useNativeBalance,
} from "@/services/balance/balanceService"
import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"

import { useNFTSwapv4 } from "../nft-swap-sdk"
import { validateBuyOffer, ValidateBuyOfferResult } from "../flows/validateOrder"

export const useValidateBuyOffer = (order: OrderWithAsset, isOpen: boolean) => {
  const [validationResult, setValidationResult] =
    useState<ValidateBuyOfferResult | null>(null)
  const nftSwapSdk = useNFTSwapv4()
  const { balance: nativeBalance } = useNativeBalance(order.maker as Address)
  const { balance: erc20Balance } = useERC20Balance(
    globalConfig.ordersErc20.address,
    order.maker as Address
  )

  useEffect(() => {
    async function validate() {
      if (order.totalPrice && nftSwapSdk) {
        const validationResults = await validateBuyOffer({
          order,
          erc20Balance,
          nativeBalance,
          nftSwapSdk,
        })
        setValidationResult(validationResults)
      }
    }
    if (isOpen) {
      validate()
    } else {
      setValidationResult(null)
    }
  }, [order, nativeBalance, nftSwapSdk, erc20Balance, isOpen])

  return validationResult
}
