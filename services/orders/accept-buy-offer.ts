import { useMemo } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Address, isAddressEqual } from "viem"

import { BuyOffer } from "@/types/buy-offers"
import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { manifest } from "@/manifests"
import { ContractTransaction } from "ethers"

import { handleOrderbookError } from "../errors"
import { toast } from "@/components/ui/toast/use-toast"

export type AcceptBuyOfferOptions = {
  offer: BuyOffer
}

export type UseCanAcceptBuyOfferParams = {
  offer: BuyOffer
}

export const useCanAcceptBuyOffer = ({ offer }: UseCanAcceptBuyOfferParams) => {
  const viewer = useCurrentViewerAddress()
  return useMemo(() => {
    if (!viewer) return false
    if (!isAddressEqual(viewer, offer.asset?.owner as Address ?? offer.owner.address)) return false
    if (isAddressEqual(offer.emitter.address, viewer)) return false
    return true
  }, [offer.asset?.owner, offer.emitter.address, viewer])
}

export const useAcceptBuyOffer = () => {
  const client = useQueryClient()
  const sdk = useNFTSwapv4()

  return useMutation(
    ["accept-buy-offer"],
    async ({ offer }: AcceptBuyOfferOptions) => {
      if (!sdk) throw new Error("Could not initialize SDK")

      try {
        const fillTx: ContractTransaction = await sdk.fillSignedOrder({
          direction: 1,
          maker: offer.trade.maker,
          taker: offer.trade.taker,
          expiry: new Date(offer.trade.expiry).getTime() / 1000,
          nonce: offer.trade.nonce,
          erc20Token: offer.trade.erc20Token,
          erc20TokenAmount: offer.trade.erc20TokenAmount,
          fees: [{
            recipient: offer.trade.fees[0].recipient,
            amount: offer.trade.fees[0].amount,
            feeData: offer.trade.fees[0].feeData!
          }],
          erc721Token: manifest.contractAddress,
          erc721TokenId: offer.trade.tokenId,
          erc721TokenProperties: [],
          signature: {
            signatureType: offer.trade.signature.signatureType!,
            v: offer.trade.signature.v,
            r: offer.trade.signature.r,
            s: offer.trade.signature.s
          }
        })
      
        const fillTxReceipt = await sdk.awaitTransactionHash(fillTx.hash)
        console.log(`🎉 🥳 Order filled (accept-buy-offer). TxHash: ${fillTxReceipt.transactionHash}`)
        return fillTxReceipt
      } catch (e) {
        handleOrderbookError(e, {
          400: "Bad request",
          404: "Order not found",
          401: "Unauthorized",
          403: "Forbidden",
          500: "Internal orderbook server error",
        })
      }
    },
    {
      onSuccess: (_, { offer }) => {
        client.invalidateQueries(["alembic", "assets", offer.asset?.tokenId])
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
  )
}
