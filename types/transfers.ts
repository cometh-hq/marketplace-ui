import { BigNumber } from "@ethersproject/bignumber"
import { DateTime } from "luxon"

import { AnyUser } from "./user"

export type TransferListLine = {
  id: string
  createdAt: DateTime
  emitter: AnyUser
  receiver: AnyUser
  amount: BigNumber
  txHash: string
}
