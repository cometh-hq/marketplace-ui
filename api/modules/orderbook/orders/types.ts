import { NftOrderV4Serialized } from "@traderxyz/nft-swap-sdk"
import { z } from "zod"

export const OrderByIdSchema = z.object({
  tokenId: z.string(),
})

export type OrderByIdInput = z.infer<typeof OrderByIdSchema>

export const CancelListingSchema = z.object({
  nonce: z.string(),
  signature: z.object({
    signatureType: z.literal(2),
    r: z.string(),
    s: z.string(),
    v: z.number(),
  }),
})

export const SellAssetSchema = z.object({
  maker: z.string(),
  taker: z.string(),
  expiry: z.string(),
  nonce: z.string(),
  erc20Token: z.string(),
  erc20TokenAmount: z.string(),
  erc721Token: z.string(),
  erc721TokenId: z.string(),
  fees: z.array(
    z.object({
      recipient: z.string(),
      amount: z.string(),
      feeData: z.string(),
    })
  ),
  erc721TokenProperties: z.array(
    z.object({
      propertyValidator: z.string(),
      propertyData: z.union([z.string(), z.array(z.number())]),
    })
  ),
  signature: z.object({
    signatureType: z.number(),
    r: z.string(),
    s: z.string(),
    v: z.number(),
  }),
})

export const AcceptBuyOfferAssetSchema = z.object({
  nonce: z.string(),
  txHash: z.string(),
})

export const CancelBuyOfferSchema = z.object({
  nonce: z.string(),
  signature: z.object({
    signatureType: z.literal(2),
    r: z.string(),
    s: z.string(),
    v: z.number(),
  }),
})

export const MakeBuyOfferAssetSchema = z.object({
  maker: z.string(),
  taker: z.string(),
  expiry: z.string(),
  nonce: z.string(),
  erc20Token: z.string(),
  erc20TokenAmount: z.string(),
  erc721Token: z.string(),
  erc721TokenId: z.string(),
  fees: z.array(
    z.object({
      recipient: z.string(),
      amount: z.string(),
      feeData: z.string(),
    })
  ),
  erc721TokenProperties: z.array(
    z.object({
      propertyValidator: z.string(),
      propertyData: z.union([z.string(), z.array(z.number())]),
    })
  ),
  signature: z.object({
    signatureType: z.number(),
    r: z.string(),
    s: z.string(),
    v: z.number(),
  }),
})

export const BuyAssetSchema = z.object({
  nonce: z.string(),
  txHash: z.string(),
})

export type CancelBuyOfferInput = z.infer<typeof CancelBuyOfferSchema>

export type BuyAssetInput = z.infer<typeof BuyAssetSchema>

export type AcceptBuyOfferAssetInput = z.infer<typeof AcceptBuyOfferAssetSchema>

export type SellAssetInput = z.infer<typeof SellAssetSchema>

export type CancelListingInput = z.infer<typeof CancelListingSchema>
