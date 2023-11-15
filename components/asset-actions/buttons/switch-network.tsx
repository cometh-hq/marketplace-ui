"use client"

import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { AlertCircle, Loader } from "lucide-react"

import { useCorrectNetwork } from "@/lib/web3/network"
import { ConnectButton } from "@/components/connect-button"

import { Button } from "../../ui/button"

type SwitchNetworkProps = {
  callbackChildren?: React.ReactNode
  children?: React.ReactNode
}

export const SwitchNetwork = ({
  callbackChildren,
  children,
}: SwitchNetworkProps) => {
  const { isConnected } = useWeb3OnboardContext()
  const { isChainSupported, switchNetwork, switchNetworkLoading } =
    useCorrectNetwork()

  return (
    <>
      {isConnected && isChainSupported ? (
        children
      ) : (
        <>
          {callbackChildren ?? children}
          <div className="flex items-center justify-center gap-2 text-destructive">
            <AlertCircle size="16" />
            {isConnected ? (
              <>
                <span className="text-sm font-medium">
                  Network not supported.
                </span>
                <Button
                  variant="destructive"
                  className="h-8 px-3 font-medium"
                  onClick={switchNetwork}
                  disabled={switchNetworkLoading}
                >
                  <span className="flex items-center gap-2">
                    {switchNetworkLoading ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Switching
                      </>
                    ) : (
                      "Switch now"
                    )}
                  </span>
                </Button>
              </>
            ) : (
              <span className="text-sm font-medium">
                Please, connect your wallet.
              </span>
            )}
          </div>
        </>
      )}
    </>
  )
}
