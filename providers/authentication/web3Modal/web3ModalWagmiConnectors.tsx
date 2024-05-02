"use client"

import { CreateConnectorFn } from "wagmi"
import * as connectors from "wagmi/connectors"

import { env } from "@/config/env"

export const wagmiConnectors: CreateConnectorFn[] = [
  connectors.walletConnect({
    projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    showQrModal: false,
  }),
  connectors.injected(),
]
