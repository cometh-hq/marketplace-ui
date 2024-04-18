import { Address, Hash } from "viem"

export type ViemFeeStruct = {
  recipient: Address
  amount: bigint
  feeData: Hash
}

export type ViemPropertyStruct = {
  propertyValidator: Address
  propertyData: Hash
}

export type ViemSignatureStruct = {
  signatureType: number // 2 for EIP-712, 4 for PRESIGNED
  v: number
  r: Hash
  s: Hash
}

export type ViemSigned1155Order = {
  direction: number
  maker: Address
  taker: Address
  expiry: bigint
  nonce: bigint
  erc20Token: Address
  erc20TokenAmount: bigint
  fees: ViemFeeStruct[]
  signature: ViemSignatureStruct
  erc1155Token: Address
  erc1155TokenId: bigint
  erc1155TokenProperties: ViemPropertyStruct[]
  erc1155TokenAmount: bigint
}

export type ViemSigned721Order = {
  direction: number
  maker: Address
  taker: Address
  expiry: bigint
  nonce: bigint
  erc20Token: Address
  erc20TokenAmount: bigint
  fees: ViemFeeStruct[]
  signature: ViemSignatureStruct
  erc721Token: Address
  erc721TokenId: bigint
  erc721TokenProperties: ViemPropertyStruct[]
}

export type ViemSignedOrder = ViemSigned1155Order | ViemSigned721Order
