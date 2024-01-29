import { manifest } from "@/manifests"
import { Address, parseEther } from "viem"

import networks, { NetworkConfig } from "@/config/networks"

type GlobalConfig = {
  contractAddress: Address
  useNativeForOrders: boolean
  ordersErc20: {
    name: string
    symbol: string
    address: Address
    decimals: number
    thumb?:
      | string
      | {
          native: string
          wrapped: string
        }
  }
  ordersTokenAddress: Address
  network: NetworkConfig
  ordersDisplayCurrency: {
    name: string
    symbol: string
    thumb?: string
  }
  areContractsSponsored: boolean
  minimumBalanceForGas: bigint
  decimals: {
    displayMaxSmallDecimals: number
    inputMaxDecimals: number
    nativeTokenDecimals: number
  }
}

export const NATIVE_TOKEN_ADDRESS_AS_ERC20 =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" as Address

const { useNativeTokenForOrders } = manifest

if (!manifest.contractAddress || manifest.contractAddress.indexOf("0x") !== 0) {
  throw new Error("Contract address is not correctly defined in the manifest")
}
if (!useNativeTokenForOrders && !manifest.erc20) {
  throw new Error(
    "Incompatible settings. erc20 should be defined if useNativeTokenForOrders is false "
  )
}

const network = networks[manifest.chainId]

const rawOrdersErc20 =
  !useNativeTokenForOrders && manifest.erc20 !== null
    ? manifest.erc20
    : network.wrappedNativeToken

const ordersErc20 = {
  ...rawOrdersErc20,
  address: rawOrdersErc20.address as Address,
}

const ordersDisplayCurrency = {
  name: ordersErc20.name,
  symbol: ordersErc20.symbol,
  thumb: ordersErc20.thumb,
}
if (useNativeTokenForOrders) {
  ordersDisplayCurrency.name = network.nativeToken.name
  ordersDisplayCurrency.symbol = network.nativeToken.symbol
  ordersDisplayCurrency.thumb = network.nativeToken.thumb
}

const minimumBalanceForGas = manifest.areContractsSponsored
  ? BigInt(0)
  : network.minimumBalanceForGas

const globalConfig: GlobalConfig = {
  contractAddress: manifest.contractAddress as Address,
  useNativeForOrders: useNativeTokenForOrders,
  ordersErc20: {
    name: ordersErc20.name,
    symbol: ordersErc20.symbol,
    address: ordersErc20.address,
    decimals: ordersErc20.decimals,
    thumb: ordersErc20.thumb,
  },
  ordersTokenAddress: useNativeTokenForOrders
    ? NATIVE_TOKEN_ADDRESS_AS_ERC20
    : ordersErc20.address,
  ordersDisplayCurrency,
  network,
  areContractsSponsored: manifest.areContractsSponsored,
  minimumBalanceForGas,
  decimals: {
    displayMaxSmallDecimals: 4,
    inputMaxDecimals: 18,
    nativeTokenDecimals: 18
  },
}

export default globalConfig
