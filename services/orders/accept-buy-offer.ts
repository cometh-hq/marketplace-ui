import { useMemo } from "react"
import { manifest } from "@/manifests"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ContractTransaction } from "ethers"
import { Address, isAddressEqual } from "viem"

import { BuyOffer } from "@/types/buy-offers"
import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { toast } from "@/components/ui/toast/use-toast"

import { handleOrderbookError } from "../errors"

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
    if (
      !isAddressEqual(
        viewer,
        (offer.asset?.owner as Address) ?? offer.owner.address
      )
    )
      return false
    if (isAddressEqual(offer.emitter.address, viewer)) return false
    return true
  }, [offer.asset?.owner, offer.emitter.address, offer.owner.address, viewer])
}

export const useAcceptBuyOffer = () => {
  const client = useQueryClient()
  const nftSwapSdk = useNFTSwapv4()

  return useMutation(
    ["accept-buy-offer"],
    async ({ offer }: AcceptBuyOfferOptions) => {
      if (!nftSwapSdk) throw new Error("Could not initialize SDK")

      const signature = offer.trade.signature || {
        signatureType: 4,
        v: 0,
        r: "0x0000000000000000000000000000000000000000000000000000000000000000",
        s: "0x0000000000000000000000000000000000000000000000000000000000000000",
      }

      const fillTx: ContractTransaction = await nftSwapSdk.fillSignedOrder({
        direction: 1,
        maker: offer.trade.maker,
        taker: offer.trade.taker,
        expiry: new Date(offer.trade.expiry).getTime() / 1000,
        nonce: offer.trade.nonce,
        erc20Token: offer.trade.erc20Token,
        erc20TokenAmount: offer.trade.erc20TokenAmount,
        fees: [
          {
            recipient: offer.trade.fees[0].recipient,
            amount: offer.trade.fees[0].amount,
            feeData: offer.trade.fees[0].feeData!,
          },
        ],
        erc721Token: manifest.contractAddress,
        erc721TokenId: offer.trade.tokenId,
        erc721TokenProperties: [],
        signature: signature,
      })

      const fillTxReceipt = await fillTx.wait()
      console.log(
        `🎉 🥳 Order filled (accept-buy-offer). TxHash: ${fillTxReceipt.transactionHash}`
      )
      return fillTxReceipt
    },
    {
      onSuccess: (_, { offer }) => {
        client.invalidateQueries(["cometh", "assets", offer.asset?.tokenId])
        client.invalidateQueries([
          "cometh",
          "ReceivedBuyoffers",
          offer.owner.address,
        ])
        toast({
          title: "Order filled!",
        })
      },
      onError: (error: Error) => {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: handleOrderbookError(error.message, {
            400: "Bad request",
            404: "Order not found",
            401: "Unauthorized",
            403: "Forbidden",
            500: "Internal orderbook server error",
          }),
        })
      },
    }
  )
}
