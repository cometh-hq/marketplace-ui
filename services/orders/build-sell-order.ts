import { useCallback } from "react"
import { manifest } from "@/manifests"
import {
  AssetWithTradeData,
  Collection,
  CollectionFees,
} from "@cometh/marketplace-sdk"
import {
  UserFacingERC20AssetDataSerializedV4,
  UserFacingERC721AssetDataSerializedV4,
  UserFacingFeeStruct,
} from "@traderxyz/nft-swap-sdk"
import { BigNumber, ethers } from "ethers"
import { DateTime } from "luxon"

import {
  calculateAmountWithoutFees,
  calculateFeesAmount,
  totalFeesFromCollection
} from "@/lib/utils/fees"
import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"

export type BuildSellOrderOptions = {
  asset: AssetWithTradeData
  price: BigNumber
  validity: string
  collection: Collection & { collectionFees: CollectionFees }
}

export const useBuildSellOrder = () => {
  const viewer = useCurrentViewerAddress()
  const nftSwapSdk = useNFTSwapv4()

  return useCallback(
    ({ asset, price, validity, collection }: BuildSellOrderOptions) => {
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

      const erc721Asset: UserFacingERC721AssetDataSerializedV4 = {
        tokenAddress: asset.contractAddress,
        tokenId: asset.tokenId,
        type: "ERC721",
      }

      const erc20Asset: UserFacingERC20AssetDataSerializedV4 = {
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        amount: price.sub(totalFeesFromCollection(fees)).toString(),
        type: "ERC20",
      }

      return nftSwapSdk.buildNftAndErc20Order(
        erc721Asset,
        erc20Asset,
        "sell",
        viewer,
        {
          fees,
          expiry,
          taker: ethers.constants.AddressZero,
        }
      )
    },
    [nftSwapSdk, viewer]
  )
}
