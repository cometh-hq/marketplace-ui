import { fetchNeedsMoreAllowance } from "@/services/allowance/allowanceService"
import { computeHasSufficientFunds } from "@/services/balance/fundsService" // Assuming this is a non-hook version

import { fetchHasApprovedCollection } from "@/services/token-approval/approveCollectionService"
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
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"

import { useNFTSwapv4 } from "../nft-swap-sdk"

export type ValidateBuyOfferOptions = {
  order: OrderWithAsset
  erc20Balance?: bigint | undefined
  nativeBalance?: bigint | undefined
  nftSwapSdk: NonNullable<ReturnType<typeof useNFTSwapv4>>
}

export type ValidateSellListingOptions = ValidateBuyOfferOptions & {
  asset: SearchAssetWithTradeData | AssetWithTradeData | OrderAsset
  isErc1155: boolean
}

export type ValidateBuyOfferResult = {
  hasSufficientFunds: boolean
  missingBalance: BigNumber | undefined
  allowance: boolean
}

export type ValidateSellListingResult = {
  quantity: string
  hasApprovedCollection: boolean
}

export const validateBuyOffer = async ({
  order,
  erc20Balance,
  nativeBalance,
  nftSwapSdk,
}: ValidateBuyOfferOptions): Promise<ValidateBuyOfferResult> => {
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
  asset,
  order,
  nftSwapSdk,
}: ValidateSellListingOptions): Promise<ValidateSellListingResult> => {
  const assetOwnersResponse =
    await comethMarketplaceClient.asset.getAssetOwners(
      asset.contractAddress,
      asset.tokenId,
      order.maker,
      999999
    )

  const hasApprovedCollection = await fetchHasApprovedCollection({
    address: order?.maker as Address,
    tokenId: order.tokenId,
    nftSwapSdk,
    contractAddress: order.tokenAddress as Address,
    tokenType: order.tokenType,
  })

  return {
    quantity: assetOwnersResponse[0].quantity,
    hasApprovedCollection,
  }
}
