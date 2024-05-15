import { fetchNeedsMoreAllowance } from "@/services/allowance/allowanceService"
import { computeHasSufficientFunds } from "@/services/balance/fundsService" // Assuming this is a non-hook version
import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { NftSwapV4 } from "@traderxyz/nft-swap-sdk"
import { BigNumber } from "ethers"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { comethMarketplaceClient } from "@/lib/clients"

export const validateBuyOffer = async (
  order: OrderWithAsset,
  erc20Balance: bigint,
  nftSwapSdk: NftSwapV4
) => {
  const { hasSufficientFunds, missingBalance } = computeHasSufficientFunds({
    price: BigNumber.from(order.totalPrice || 0),
    erc20Balance: erc20Balance,
  })

  const needsMoreAllowance = await fetchNeedsMoreAllowance({
    address: `0x${order.maker}`,
    spender: nftSwapSdk?.exchangeProxyContractAddress! as Address,
    price: BigNumber.from(order.totalPrice || 0),
    contractAddress: globalConfig.ordersErc20.address,
  })

  return {
    hasSufficientFunds,
    missingBalance,
    needsMoreAllowance,
  }
}

export const validateSellListing = async (
  order: OrderWithAsset,
  nftSwapSdk: NftSwapV4
) => {
  const assetOwnersResponse =
    await comethMarketplaceClient.asset.getAssetOwners(
      order.tokenAddress,
      order.tokenId.toString(),
      order.maker,
      999999
    )

  const isOwner = assetOwnersResponse.some(
    (owner) => owner.owner.toLowerCase() === order.maker.toLowerCase()
  )

  const allowance = await fetchNeedsMoreAllowance({
    address: `0x${order.maker}`,
    spender: nftSwapSdk?.exchangeProxyContractAddress! as Address,
    price: BigNumber.from(order.totalPrice || 0),
    contractAddress: globalConfig.ordersErc20.address,
  })

  const hasApproval = BigNumber.from(allowance).gte(order.tokenQuantity)

  return {
    isOwner,
    hasApproval,
  }
}
