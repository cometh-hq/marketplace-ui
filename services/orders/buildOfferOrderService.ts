import { useCallback } from "react"
import {
  AssetWithTradeData,
  Collection,
  CollectionFees,
  SearchAssetWithTradeData,
  TokenType,
  TradeDirection,
} from "@cometh/marketplace-sdk"
import {
  UserFacingERC20AssetDataSerializedV4,
  UserFacingERC721AssetDataSerializedV4,
  UserFacingERC1155AssetDataSerialized,
  UserFacingERC1155AssetDataSerializedV4,
  UserFacingFeeStruct,
} from "@traderxyz/nft-swap-sdk"
import { BigNumber, ethers } from "ethers"
import { DateTime } from "luxon"
import { useAccount } from "wagmi"

import globalConfig from "@/config/globalConfig"
import {
  calculateAmountWithoutFees,
  calculateFeesAmount,
  totalFeesFromCollection,
} from "@/lib/utils/fees"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"

export type BuildOfferOrderOptions = {
  asset: AssetWithTradeData | SearchAssetWithTradeData
  price: BigNumber
  validity: string
  collection: Collection & { collectionFees: CollectionFees }
  quantity?: string
}

const isSerializedERC1155Asset = (
  serializedAsset:
    | UserFacingERC721AssetDataSerializedV4
    | UserFacingERC1155AssetDataSerializedV4
): serializedAsset is UserFacingERC1155AssetDataSerializedV4 => {
  return serializedAsset.type === TokenType.ERC1155
}

export const useBuildOrder = ({
  tradeDirection,
}: {
  tradeDirection: TradeDirection
}) => {
  const account = useAccount()
  const viewer = account.address
  const nftSwapSdk = useNFTSwapv4()

  return useCallback(
    ({
      asset,
      price,
      validity,
      collection,
      quantity,
    }: BuildOfferOrderOptions) => {
      if (!nftSwapSdk || !viewer || !collection.collectionFees) return null

      const expiry = DateTime.now()
        .plus({ days: parseInt(validity) })
        .toJSDate()

      const sumOfFeesPercentages = collection.collectionFees.reduce(
        (sum, fee) => sum + fee.feePercentage,
        0
      )

      const priceWithoutFees = calculateAmountWithoutFees(
        price,
        sumOfFeesPercentages
      )

      const fees: UserFacingFeeStruct[] = collection.collectionFees.map(
        (fee) => {
          return {
            amount: calculateFeesAmount(priceWithoutFees, fee.feePercentage),
            recipient: fee.recipientAddress,
          }
        }
      )

      const serializedAsset:
        | UserFacingERC721AssetDataSerializedV4
        | UserFacingERC1155AssetDataSerializedV4 = {
        tokenAddress: asset.contractAddress,
        tokenId: asset.tokenId,
        type: asset.tokenType,
      }

      if (isSerializedERC1155Asset(serializedAsset) && quantity) {
        serializedAsset.amount = quantity
      }

      const tokenAddress =
        tradeDirection === TradeDirection.SELL
          ? globalConfig.ordersTokenAddress
          : globalConfig.ordersErc20.address

      const erc20Asset: UserFacingERC20AssetDataSerializedV4 = {
        tokenAddress,
        amount: price.sub(totalFeesFromCollection(fees)).toString(),
        type: "ERC20",
      }

      return nftSwapSdk.buildNftAndErc20Order(
        serializedAsset,
        erc20Asset,
        tradeDirection,
        viewer,
        {
          fees,
          expiry,
          taker: ethers.constants.AddressZero,
        }
      )
    },
    [nftSwapSdk, viewer, tradeDirection]
  )
}
