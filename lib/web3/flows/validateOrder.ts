import { fetchNeedsMoreAllowance } from "@/services/allowance/allowanceService"
import { computeHasSufficientFunds } from "@/services/balance/fundsService" // Assuming this is a non-hook version
import {
  AssetWithTradeData,
  OrderWithAsset,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { NftSwapV4 } from "@traderxyz/nft-swap-sdk"
import { BigNumber } from "ethers"
import { Address } from "viem"

import { OrderAsset } from "@/types/assets"
import globalConfig from "@/config/globalConfig"
import { comethMarketplaceClient } from "@/lib/clients"

export type ValidateOrderOptions = {
  order: OrderWithAsset
  erc20Balance: bigint | undefined
  nativeBalance: bigint | undefined
  nftSwapSdk: NftSwapV4 | null
}

export type ValidateBuyOfferResult = {
  hasSufficientFunds: boolean
  missingBalance: BigNumber | undefined
  allowance: boolean
}

export type ValidateSellListingResult = {
  isOwner: boolean
  allowance: boolean
}

export const validateBuyOffer = async ({
  order,
  erc20Balance,
  nativeBalance,
  nftSwapSdk,
}: ValidateOrderOptions): Promise<ValidateBuyOfferResult> => {
  const { hasSufficientFunds, missingBalance } = computeHasSufficientFunds({
    price: BigNumber.from(order.totalPrice),
    erc20Balance,
    nativeBalance,
  })
  const allowance = await fetchNeedsMoreAllowance({
    address: order?.maker as Address,
    spender: nftSwapSdk?.exchangeProxyContractAddress! as Address,
    price: BigNumber.from(order.totalPrice),
    contractAddress: globalConfig.ordersErc20.address,
  })

  return {
    hasSufficientFunds,
    missingBalance,
    allowance,
  }
}

export const validateSellListing = async ({
  order,
  erc20Balance,
  nftSwapSdk,
}: ValidateOrderOptions): Promise<ValidateSellListingResult> => {

  const assetOwnersResponse =
    await comethMarketplaceClient.asset.getAssetOwners(
      order?.tokenAddress || "",
      order?.tokenId.toString() || "",
      order?.maker || "",
      999999
    )
  const isOwner = assetOwnersResponse.some(
    (owner) => owner.owner.toLowerCase() === order?.maker.toLowerCase()
  )
  const allowance = await fetchNeedsMoreAllowance({
    address: order?.maker as Address,
    spender: nftSwapSdk?.exchangeProxyContractAddress! as Address,
    price: BigNumber.from(order?.totalPrice || 0),
    contractAddress: globalConfig.ordersErc20.address,
  })

  return {
    isOwner,
    allowance,
  }
}
