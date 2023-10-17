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
import { calculateFeesAmount, totalFeesFromCollection } from "@/lib/utils/fees"

export type BuildBuyOfferOrderOptions = {
  asset: AssetWithTradeData
  price: BigNumber
  validity: string
  collection: Collection & { collectionFees: CollectionFees }
}
export const useBuildBuyOfferOrder = () => {
  const viewer = useCurrentViewerAddress()
  const sdk = useNFTSwapv4()

  return useCallback(
    ({ asset, price, validity, collection }: BuildBuyOfferOrderOptions) => {
      if (!sdk || !viewer || !collection.collectionFees ) return null

      const expiry = DateTime.now()
        .plus({ days: parseInt(validity) })
        .toJSDate()

      const fees: UserFacingFeeStruct[] = collection.collectionFees.map(fee => {
        return {
          amount: calculateFeesAmount(price, fee.feePercentage),
          recipient: fee.recipientAddress,
        }
      })
    
      const erc721Asset: UserFacingERC721AssetDataSerializedV4 = {
        tokenAddress: asset.contractAddress,
        tokenId: asset.tokenId,
        type: "ERC721",
      }

      const erc20Asset: UserFacingERC20AssetDataSerializedV4 = {
        tokenAddress: manifest.currency.wrapped.address,
        amount: price.sub(totalFeesFromCollection(fees)).toString(),
        type: "ERC20",
      }

      return sdk.buildNftAndErc20Order(erc721Asset, erc20Asset, "buy", viewer, {
        fees,
        expiry,
        taker: ethers.constants.AddressZero,
      })
    },
    [manifest, sdk, viewer]
  )
}