import { useMemo } from "react"
import { useAccount } from "wagmi"

export const useIsComethConnectWallet = () => {
  const { connector } = useAccount()
  return useMemo(() => connector?.type === "cometh", [connector])
}
