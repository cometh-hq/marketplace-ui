import { useMemo } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ContractTransaction } from "ethers"
import { Address, isAddressEqual } from "viem"
import { useAccount } from "wagmi"

import { BuyOffer } from "@/types/buy-offers"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { toast } from "@/components/ui/toast/hooks/useToast"

export type AcceptBuyOfferOptions = {
  offer: BuyOffer
}

export type UseCanAcceptBuyOfferParams = {
  offer: BuyOffer
}

export const useCanAcceptBuyOffer = ({ offer }: UseCanAcceptBuyOfferParams) => {
  const account = useAccount()
  const viewer = account.address
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

  return useMutation({
    mutationKey: ["accept-buy-offer"],
    mutationFn: async ({ offer }: AcceptBuyOfferOptions) => {
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
        fees: offer.trade.fees.map((fee) => {
          return {
            recipient: fee.recipient,
            amount: fee.amount,
            feeData: fee.feeData || "0x",
          }
        }),
        erc721Token: offer.trade.tokenAddress,
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

    onSuccess: (_, { offer }) => {
      client.invalidateQueries({
        queryKey: ["cometh", "assets", offer.asset?.tokenId],
      })
      client.invalidateQueries({ queryKey: ["cometh", "search"] })
      client.invalidateQueries({
        queryKey: ["cometh", "received-buy-offers", offer.owner.address],
      })
      toast({
        title: "Purchased order filled!",
      })
    },
  })
}
