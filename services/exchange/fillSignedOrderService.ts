import { useCallback } from "react"
import zeroExAbi from "@/abis/zeroExAbi"
import { ETH_ADDRESS_AS_ERC20 } from "@traderxyz/nft-swap-sdk"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"

import globalConfig from "@/config/globalConfig"

import { ViemSignedOrder } from "./viemOrderTypes"

const SELL_ORDER_DIRECTION = 0

const isErc20NativeToken = (order: ViemSignedOrder): boolean => {
  return order.erc20Token.toLowerCase() === ETH_ADDRESS_AS_ERC20
}


(BigInt.prototype as any).toJSON = function() {
  return this.toString()
} 

// Fork from NFT swap SDK to allow custom erc1155BuyAmount. Can be improved
export const useFillSignedOrder = () => {
  const { data: walletClient } = useWalletClient()
  const viemPublicClient = usePublicClient()
  const account = useAccount()
  const userAddress = account.address
  return useCallback(
    async (
      signedOrder: ViemSignedOrder,
      erc1155BuyAmount: bigint,
      transactionValue: bigint
    ) => {
      if (!walletClient || !viemPublicClient) {
        throw new Error("Not properly connected")
      }

      // Only Sell orders can be filled with ETH
      const canOrderTypeBeFilledWithNativeToken =
        signedOrder.direction === SELL_ORDER_DIRECTION
      // Is ERC20 being traded the native token
      const isNativeToken = isErc20NativeToken(signedOrder)
      const needsEthAttached =
        isNativeToken && canOrderTypeBeFilledWithNativeToken
      console.log("useFillSignedOrder", {
        signedOrder,
        erc1155BuyAmount,
        transactionValue,
        needsEthAttached,
        walletClient,
        exchange: globalConfig.network.zeroExExchange,
      })
      const { signature, ...order } = signedOrder
      // do fill
      if ("erc1155Token" in order) {
        // If maker is selling an NFT, taker wants to 'buy' nft
        if (signedOrder.direction === SELL_ORDER_DIRECTION) {
          return await walletClient.writeContract({
            address: globalConfig.network.zeroExExchange,
            abi: zeroExAbi,
            functionName: "buyERC1155",
            args: [order, signature, erc1155BuyAmount, "0x"],
            value: needsEthAttached ? transactionValue : undefined,
            
          })
        } else {
          // TODO(detect if erc20 token is wrapped token, then switch true. if true when not wrapped token, tx will fail)
          let unwrapNativeToken: boolean = false

          try {
            const { request } = await viemPublicClient.simulateContract({
              address: globalConfig.network.zeroExExchange,
              abi: zeroExAbi,
              functionName: "sellERC1155",
              args: [
                order,
                signature,
                order.erc1155TokenId,
                erc1155BuyAmount,
                unwrapNativeToken,
                "0x",
              ],
              account: userAddress,
            })
            const txHash = await walletClient.writeContract(request)

            return txHash
          } catch (error) {
            console.log("error tx", JSON.stringify(error))
            throw error
          }
        }
      } else if ("erc721Token" in order) {
        // If maker is selling an NFT, taker wants to 'buy' nft
        if (signedOrder.direction === SELL_ORDER_DIRECTION) {
          return await walletClient.writeContract({
            address: globalConfig.network.zeroExExchange,
            abi: zeroExAbi,
            functionName: "buyERC721",
            args: [order, signature, "0x"],
            value: needsEthAttached ? transactionValue : undefined,
          })
        } else {
          // TODO(detect if erc20 token is wrapped token, then switch true. if true when not wrapped token, tx will fail)
          let unwrapNativeToken: boolean = false
          return await walletClient.writeContract({
            address: globalConfig.network.zeroExExchange,
            abi: zeroExAbi,
            functionName: "sellERC721",
            args: [
              order,
              signature,
              order.erc721TokenId,
              unwrapNativeToken,
              "0x",
            ],
          })
        }
      }
      console.log("unsupported order", signedOrder)
      throw new Error("unsupport signedOrder type")
    },
    [walletClient, viemPublicClient]
  )
}
