"use client"

import { useCallback } from "react"
import { LogOut } from "lucide-react"
import { useDisconnect } from "wagmi"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function AccountLogoutAction() {
  const { disconnect } = useDisconnect()
  const handleLogout = useCallback(async () => {
    localStorage.removeItem("selectedWallet")
    disconnect()
  }, [disconnect])

  return (
    <div className="absolute right-4 top-4">
      <TooltipProvider delayDuration={200}>
        <Tooltip defaultOpen={false}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
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
