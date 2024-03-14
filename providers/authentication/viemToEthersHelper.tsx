import { useMemo } from "react"
import { providers } from "ethers"
import type { Account, Chain, Client, Transport } from "viem"
import { useAccount, useClient, useConnectorClient } from "wagmi"

function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    )
  return new providers.JsonRpcProvider(transport.url, network)
}

export function useEthersProvider() {
  const client = useClient()
  return useMemo(() => client && clientToProvider(client as any), [client])
}

function clientToSigner(
  client: Client<Transport, Chain>,
  accountAddress: string
) {
  const { chain, transport } = client

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(accountAddress)
  return signer
}

export function useEthersSigner() {
  const { data: client } = useConnectorClient()
  const { address } = useAccount()
  return useMemo(
    () => (client && address ? clientToSigner(client as any, address) : undefined),
    [client, address]
  )
}
