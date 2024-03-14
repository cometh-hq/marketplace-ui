import { useMemo } from "react"
import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { ComethProvider, ComethWallet } from "@cometh/connect-sdk"
import { useQuery } from "@tanstack/react-query"
import { providers } from "ethers"
import type { Address, Chain, Client, Transport } from "viem"
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
function useComethWallet(address?: Address) {
  const { connector } = useAccount()
  const isComethWallet = useIsComethConnectWallet()
  const queryResult = useQuery({
    queryKey: ["useComethWallet", isComethWallet, address],
    queryFn: async () => {
      if (!isComethWallet) return null
      const wallet = await (connector as any).getComethWallet()
      return wallet as ComethWallet
    },
  })
  return queryResult.data
}
export function useEthersSigner() {
  const { data: client } = useConnectorClient()
  const { address, connector } = useAccount()
  const isComethWallet = useIsComethConnectWallet()
  const comethWallet = useComethWallet(address)
  return useMemo(() => {
    if (isComethWallet && comethWallet && connector) {
      const provider = new ComethProvider(comethWallet)
      return provider.getSigner()
    } else {
      return client && address
        ? clientToSigner(client as any, address)
        : undefined
    }
  }, [client, address, isComethWallet, comethWallet, connector])
}
