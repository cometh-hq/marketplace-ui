"use client"

import { manifest } from "@/manifests"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@alembic/nft-api-sdk"
import { Share } from "lucide-react"

import { useClipboard } from "@/lib/utils/clipboard"
import { useTwitterShare } from "@/lib/utils/twitter"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

type ShareButtonProps = {
  size?: "default" | "sm" | "lg"
  textToShow?: string
  asset?: AssetWithTradeData | SearchAssetWithTradeData
}

export function ShareButton({ size = "sm", textToShow }: ShareButtonProps) {
  const [_, copy] = useClipboard()
  const { shareOnTwitter } = useTwitterShare()

  return (
    <DropdownMenu>
      <TooltipProvider delayDuration={200}>
        <Tooltip defaultOpen={false}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                size={size === "sm" ? "sm" : "default"}
                variant="secondary"
                className="!bg-muted"
              >
                {size === "lg" && "Share"}
                <Share size={16} className={size === "lg" ? "ml-2" : ""} />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-bold">Share</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => copy(window.location.href)}>
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            shareOnTwitter(
              `${textToShow ?? `Check out this item on`} ${manifest.name}`
            )
          }
        >
          Share on Twitter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
