import {
  OrderWithAsset,
  TokenType,
  TradeDirection,
} from "@cometh/marketplace-sdk"
import { Address, Hash } from "viem"

import {
  ViemFeeStruct,
  ViemSignatureStruct,
  ViemSigned721Order,
  ViemSigned1155Order,
} from "./viemOrderTypes"

export const getViemSignedOrderFromOrder = (
  order: OrderWithAsset
): ViemSigned1155Order | ViemSigned721Order => {
  const signature: ViemSignatureStruct = order.signature
    ? {
        signatureType: order.signature.signatureType,
        v: order.signature.v,
        r: order.signature.r as Hash,
        s: order.signature.s as Hash,
      }
    : {
        signatureType: 4, // Assuming pre-signed
        v: 0,
        r: "0x0000000000000000000000000000000000000000000000000000000000000000",
        s: "0x0000000000000000000000000000000000000000000000000000000000000000",
      }

  const fees: ViemFeeStruct[] = order.fees.map((fee) => ({
    recipient: fee.recipient as Address,
    amount: BigInt(fee.amount),
    feeData: (fee.feeData as Hash) || "0x",
  }))

  const expiry = BigInt(Math.floor(new Date(order.expiry).getTime() / 1000))
  const direction = order.direction === TradeDirection.BUY ? 1 : 0

  if (order.tokenType === TokenType.ERC721) {
    const erc721Order: ViemSigned721Order = {
      direction,
      maker: order.maker as Address,
      taker: order.taker as Address,
      expiry,
      nonce: BigInt(order.nonce),
      erc20Token: order.erc20Token as Address,
      erc20TokenAmount: BigInt(order.erc20TokenAmount),
      fees,
      signature: signature,
      erc721Token: order.tokenAddress as Address,
      erc721TokenId: BigInt(order.tokenId),
      erc721TokenProperties: [], // Assuming no properties are specified
    }
    return erc721Order
  } else {
    const erc1155Order: ViemSigned1155Order = {
      direction,
      maker: order.maker as Address,
      taker: order.taker as Address,
      expiry,
      nonce: BigInt(order.nonce),
      erc20Token: order.erc20Token as Address,
      erc20TokenAmount: BigInt(order.erc20TokenAmount),
      fees,
      signature: signature,
      erc1155Token: order.tokenAddress as Address,
      erc1155TokenId: BigInt(order.tokenId),
      erc1155TokenAmount:  BigInt(order.tokenQuantity),
      erc1155TokenProperties: [], // Assuming no properties are specified
    }
    return erc1155Order
  }
}
