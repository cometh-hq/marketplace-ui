import { useEffect, useState } from "react"
import {
  AssetWithTradeData,
  OrderWithAsset,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"

import { OrderAsset } from "@/types/assets"

import {
  validateSellListing,
  ValidateSellListingResult,
} from "../flows/validateOrder"
import { useNFTSwapv4 } from "../nft-swap-sdk"

export const useValidateSellListing = (
  asset: SearchAssetWithTradeData | AssetWithTradeData | OrderAsset,
  order: OrderWithAsset,
  isErc1155: boolean,
  isOpen: boolean
) => {
  const [validationResult, setValidationResult] =
    useState<ValidateSellListingResult | null>(null)
  const nftSwapSdk = useNFTSwapv4()

  // console.log({ asset })
  // console.log({ order })
  //   console.log({isErc1155})

  useEffect(() => {
    async function validate() {
      if (order?.totalPrice && nftSwapSdk) {
        console.log("===> THERE")
        const validationResults = await validateSellListing({
          asset,
          isErc1155,
          order,
          nftSwapSdk,
        })
        setValidationResult(validationResults)
      }
    }
    validate()

    if (isOpen) {
      validate()
    } else {
      setValidationResult(null)
    }
  }, [order, asset, nftSwapSdk, isErc1155, isOpen])

  return validationResult
}
