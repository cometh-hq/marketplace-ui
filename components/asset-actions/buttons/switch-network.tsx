"use client"

import cx from "classnames"
import { AlertCircle, Loader } from "lucide-react"

import { useCorrectNetwork } from "@/lib/web3/network"

import { Button } from "../../ui/button"

type SwitchNetworkProps = {
  callbackChildren?: React.ReactNode
  variant?: "link"
  children?: React.ReactNode
}

export const SwitchNetwork = ({
  callbackChildren,
  variant,
  children,
}: SwitchNetworkProps) => {
  const { isChainSupported, switchNetwork, switchNetworkLoading } =
    useCorrectNetwork()

  return (
    <>
      {isChainSupported ? (
        children
      ) : (
        <>
          {callbackChildren ?? children}
          <div className="flex items-center justify-center gap-2 text-destructive">
            <AlertCircle size="16" />
            {variant !== "link" && (
              <span className="text-sm font-medium max-sm:hidden">
                Network not supported.
              </span>
            )}
            <Button
              variant={variant === "link" ? "link" : "destructive"}
              className={cx(
                "h-8 px-3 font-medium",
                variant === "link" && "text-destructive px-0 font-semibold"
              )}
              onClick={switchNetwork}
              disabled={switchNetworkLoading}
            >
              <span className="flex items-center gap-2">
                {switchNetworkLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Switching
                  </>
                ) : variant === "link" ? (
                  "Switch network"
                ) : (
                  "Switch now"
                )}
              </span>
            </Button>
          </div>
        </>
      )}
    </>
  )
}
