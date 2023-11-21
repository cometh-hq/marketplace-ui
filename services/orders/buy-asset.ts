import {
  AssetWithTradeData,
} from '@cometh/marketplace-sdk'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ContractTransaction } from "ethers"

import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"

import { getFirstListing } from "../alembic/offers"
import { manifest } from "@/manifests"
import { toast } from "@/components/ui/toast/use-toast"
import { handleOrderbookError } from "../errors"

export type BuyAssetOptions = {
  asset: AssetWithTradeData
}

export const useBuyAsset = () => {
  const client = useQueryClient()
  const sdk = useNFTSwapv4()
  const viewerAddress = useCurrentViewerAddress()

  return useMutation(["buy-asset"], async ({ asset }: BuyAssetOptions) => {
    if (!sdk || !viewerAddress) throw new Error("Could not initialize SDK")

    const order = await getFirstListing(asset.tokenId)

    try {
      const fillTx: ContractTransaction = await sdk.fillSignedOrder({
        direction: 0,
        maker: order.maker,
        taker: order.taker,
        expiry: new Date(order.expiry).getTime() / 1000,
        nonce: order.nonce,
        erc20Token: order.erc20Token,
        erc20TokenAmount: order.erc20TokenAmount,
        fees: [{
          recipient: order.fees[0].recipient,
          amount: order.fees[0].amount,
          feeData: order.fees[0].feeData!
        }],
        erc721Token: manifest.contractAddress,
        erc721TokenId: order.tokenId,
        erc721TokenProperties: [],
        signature: {
          signatureType: order.signature.signatureType!,
          v: order.signature.v,
          r: order.signature.r,
          s: order.signature.s
        }
      })
      
      const fillTxReceipt = await sdk.awaitTransactionHash(fillTx.hash)
      console.log(`🎉 🥳 Order filled (buy-asset). TxHash: ${fillTxReceipt.transactionHash}`);
      return fillTxReceipt
    } catch (e) {
      handleOrderbookError(e, {
        400: "Bad request",
        500: "Internal orderbook server error",
      })
    }
  },
  {
    onSuccess: (_, { asset }) => {
      client.invalidateQueries(["alembic", "assets", asset.tokenId])
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      })
    }
  }
)}
