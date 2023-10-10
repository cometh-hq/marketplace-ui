import { Address } from "viem"

export type UnknownUser = {
  address: Address
}

export type KnownUser = {
  username: string
  address: Address
}

export type AnyUser = UnknownUser | KnownUser
