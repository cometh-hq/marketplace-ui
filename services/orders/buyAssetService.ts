import { AssetWithTradeData, SearchAssetWithTradeData } from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ContractTransaction } from "ethers"
import { useAccount } from "wagmi"

import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"

import { getFirstListing } from "../cometh-marketplace/buyOffersService"
import { useInvalidateAssetQueries } from "@/components/marketplace/asset/AssetDataHook"
import { getSDKSignedOrderFromOrder } from "./orderHelper"

export type BuyAssetOptions = {
  asset: AssetWithTradeData | SearchAssetWithTradeData
}

export const useBuyAsset = () => {
  const client = useQueryClient()
  const nftSwapSdk = useNFTSwapv4()
  const account = useAccount()
  const viewerAddress = account.address
  const invalidateAssetQueries = useInvalidateAssetQueries()

  return useMutation({
    mutationKey: ["buy-asset"],
    mutationFn: async ({ asset }: BuyAssetOptions) => {
      if (!nftSwapSdk || !viewerAddress)
        throw new Error("Could not initialize SDK")

      const order = await getFirstListing(asset.tokenId)
      const formattedZeroXOrder = getSDKSignedOrderFromOrder(order)

      const fillTx: ContractTransaction =
        await nftSwapSdk.fillSignedOrder(formattedZeroXOrder)

      const fillTxReceipt = await fillTx.wait()
      console.log(
        `🎉 🥳 Order filled (buy-asset). TxHash: ${fillTxReceipt.transactionHash}`
      )
      return fillTxReceipt
    },
    onSuccess: (_, { asset }) => {
      invalidateAssetQueries(
        asset.contractAddress as string,
        asset.tokenId,
        asset.owner
      )
      client.invalidateQueries({ queryKey: ["cometh", "search"] })
    },
  })
}
