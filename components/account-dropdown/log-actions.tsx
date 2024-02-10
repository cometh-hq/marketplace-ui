"use client"

import { LogOut } from "lucide-react"

import { useDisconnect, useWallet } from "@/lib/web3/auth"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function AccountLogAction() {
  const wallet = useWallet()
  const logout = useDisconnect()

  async function handleLogout() {
    await logout({
      label: wallet!.label,
    })
  }

  return (
    <div className="absolute right-4 top-4">
      <TooltipProvider delayDuration={200}>
        <Tooltip defaultOpen={false}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
            >
              <LogOut size="14" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-bold">Logout</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
