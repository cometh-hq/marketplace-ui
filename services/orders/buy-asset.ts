import { AssetWithTradeDataCore } from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ContractTransaction } from "ethers"

import globalConfig from "@/config/globalConfig"
import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"

import { getFirstListing } from "../cometh-marketplace/offers"

export type BuyAssetOptions = {
  asset: AssetWithTradeDataCore
}

export const useBuyAsset = () => {
  const client = useQueryClient()
  const nftSwapSdk = useNFTSwapv4()
  const viewerAddress = useCurrentViewerAddress()

  return useMutation({
    mutationKey: ["buy-asset"],
    mutationFn: async ({ asset }: BuyAssetOptions) => {
      if (!nftSwapSdk || !viewerAddress)
        throw new Error("Could not initialize SDK")

      const order = await getFirstListing(asset.tokenId)

      const signature = order.signature ? order.signature :  {
        signatureType: 4,
        v: 0,
        r: "0x0000000000000000000000000000000000000000000000000000000000000000",
        s: "0x0000000000000000000000000000000000000000000000000000000000000000",
      }

      const formattedZeroXOrder = {
        direction: 0,
        maker: order.maker,
        taker: order.taker,
        expiry: new Date(order.expiry).getTime() / 1000,
        nonce: order.nonce,
        erc20Token: order.erc20Token,
        erc20TokenAmount: order.erc20TokenAmount,
        fees: order.fees.map((fee) => {
          return {
            recipient: fee.recipient,
            amount: fee.amount,
            feeData: fee.feeData || "0x",
          }
        }),
        erc721Token: globalConfig.contractAddress,
        erc721TokenId: order.tokenId,
        erc721TokenProperties: [],
        signature: signature,
      }

      const fillTx: ContractTransaction = await nftSwapSdk.fillSignedOrder(
        formattedZeroXOrder
      )

      const fillTxReceipt = await fillTx.wait()
      console.log(
        `🎉 🥳 Order filled (buy-asset). TxHash: ${fillTxReceipt.transactionHash}`
      )
      return fillTxReceipt
    },
    onSuccess: (_, { asset }) => {
      client.invalidateQueries({
        queryKey: ["cometh", "assets", asset.tokenId],
      })
    }
  })
}
