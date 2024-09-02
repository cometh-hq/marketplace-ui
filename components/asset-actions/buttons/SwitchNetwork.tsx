"use client"

import { cx } from "class-variance-authority"
import { Loader } from "lucide-react"

import { useCorrectNetwork } from "@/lib/web3/network"
import { Button } from "@/components/ui/Button"

type SwitchNetworkProps = {
  variant?: "link"
  children?: React.ReactNode
}

export const SwitchNetwork = ({
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
              ) : (
                "Switch to correct network"
              )}
            </span>
          </Button>
        </>
      )}
    </>
  )
}
