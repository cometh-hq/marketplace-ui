import { useCallback } from "react"
import { manifest } from "@/manifests"
import { AssetWithTradeData, Collection, CollectionFees } from "@alembic/nft-api-sdk"
import {
  UserFacingERC20AssetDataSerializedV4,
  UserFacingERC721AssetDataSerializedV4,
  UserFacingFeeStruct,
} from "@traderxyz/nft-swap-sdk"
import { BigNumber, ethers } from "ethers"
import { DateTime } from "luxon"

import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { calculateFeesAmount } from "@/lib/utils/fees"

export type BuildSellOrderOptions = {
  asset: AssetWithTradeData
  price: BigNumber
  validity: string
  collection: Collection & { collectionFees: CollectionFees }
}

export const useBuildSellOrder = () => {
  const viewer = useCurrentViewerAddress()
  const sdk = useNFTSwapv4()

  return useCallback(
    ({ asset, price, validity, collection }: BuildSellOrderOptions) => {
      if (!sdk || !viewer || !collection.collectionFees ) return null

      const expiry = DateTime.now()
        .plus({ days: parseInt(validity) })
        .toJSDate()

      const fees: UserFacingFeeStruct[] = [
        {
          amount: calculateFeesAmount(price, collection.collectionFees[0].feePercentage),
          recipient: collection.collectionFees[0].recipientAddress,
        },
      ]

      const erc721Asset: UserFacingERC721AssetDataSerializedV4 = {
        tokenAddress: asset.contractAddress,
        tokenId: asset.tokenId,
        type: "ERC721",
      }

      const erc20Asset: UserFacingERC20AssetDataSerializedV4 = {
        tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        amount: price.sub(fees[0].amount).toString(),
        type: "ERC20",
      }

      return sdk.buildNftAndErc20Order(
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
    [sdk, viewer, manifest]
  )
}