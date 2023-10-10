"use client"

import { useDisconnect, useWallet } from "@/lib/web3/auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function AccountLogAction() {
  const wallet = useWallet()
  const disconnect = useDisconnect()

  return (
    <div className="absolute right-4 top-4">
      <TooltipProvider delayDuration={200}>
        <Tooltip defaultOpen={false}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="hover:bg-ghost text-primary"
              size="icon"
              onClick={() => wallet && disconnect(wallet)}
            >
              <LogOut size="14" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-bold">
              Logout
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
