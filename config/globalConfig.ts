import { manifest } from "@/manifests"
import { Address } from "viem"

import networks, { NetworkConfig } from "@/config/networks"

type GlobalConfig = {
  contractAddress: Address
  useNativeForOrders: boolean
  ordersErc20: {
    name: string
    symbol: string
    address: Address
  }
  network: NetworkConfig
}

export const NATIVE_TOKEN_ADDRESS_AS_ERC20 =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"

if (
  !manifest.contractAddress ||
  manifest.contractAddress.indexOf("0x") !== 0
) {
  throw new Error("Contract address is not correctly defined in the manifest")
}
if (!manifest.useNativeTokenForOrders && !manifest.erc20) {
  throw new Error(
    "Incompatible settings. erc20 should be defined if useNativeTokenForOrders is false "
  )
}

const network = networks[manifest.chainId]

const ordersErc20 =
  !manifest.useNativeTokenForOrders && manifest.erc20 !== null
    ? manifest.erc20
    : network.wrappedNativeToken

const globalConfig: GlobalConfig = {
  contractAddress: manifest.contractAddress as Address,
  useNativeForOrders: manifest.useNativeTokenForOrders,
  ordersErc20: {
    name: ordersErc20.name,
    symbol: ordersErc20.symbol,
    address: ordersErc20.address as Address,
  },
  network,
}

export default globalConfig
