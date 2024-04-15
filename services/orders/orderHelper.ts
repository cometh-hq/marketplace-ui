import { OrderWithAsset, TokenType, TradeDirection } from "@cometh/marketplace-sdk"
import { SignedERC1155OrderStruct, SignedERC721OrderStruct, SignedNftOrderV4 } from "@traderxyz/nft-swap-sdk"

export const getSDKSignedOrderFromOrder = (
    order: OrderWithAsset
  ): SignedNftOrderV4 => {
    const signature = order.signature || {
      signatureType: 4,
      v: 0,
      r: "0x0000000000000000000000000000000000000000000000000000000000000000",
      s: "0x0000000000000000000000000000000000000000000000000000000000000000",
    }
    const fees = order.fees.map((fee) => {
      return {
        recipient: fee.recipient,
        amount: fee.amount,
        feeData: fee.feeData || "0x",
      }
    })
    const expiry = new Date(order.expiry).getTime() / 1000
    const direction = order.direction === TradeDirection.BUY ? 1 : 0
  
    if (order.tokenType === TokenType.ERC721) {
      const erc721Order: SignedERC721OrderStruct = {
        direction,
        maker: order.maker,
        taker: order.taker,
        expiry,
        nonce: order.nonce,
        erc20Token: order.erc20Token,
        erc20TokenAmount: order.erc20TokenAmount,
        fees,
        erc721Token: order.tokenAddress,
        erc721TokenId: order.tokenId,
        erc721TokenProperties: [],
        signature,
      }
      return erc721Order
    } else {
      const erc1155Order: SignedERC1155OrderStruct = {
        direction,
        maker: order.maker,
        taker: order.taker,
        expiry,
        nonce: order.nonce,
        erc20Token: order.erc20Token,
        erc20TokenAmount: order.erc20TokenAmount,
        fees,
        erc1155Token: order.tokenAddress,
        erc1155TokenId: order.tokenId,
        erc1155TokenAmount: order.tokenQuantity,
        erc1155TokenProperties: [],
        signature,
      }
      return erc1155Order
    }
  }