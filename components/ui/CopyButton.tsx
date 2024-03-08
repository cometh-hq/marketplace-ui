"use client"

import { cx } from "class-variance-authority"
import { Copy } from "lucide-react"

import { useClipboard } from "@/lib/utils/clipboard"

import { Button } from "./Button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip"

type CopyButtonProps = {
  size?: string
  textToCopy: string
}

export function CopyButton({ size = "sm", textToCopy }: CopyButtonProps) {
  const [_, copy] = useClipboard()

  const variants = {
    sm: "h-7 w-7",
    lg: "h-10 w-10",
  } as Record<string, string>

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip defaultOpen={false}>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            className={cx(`${variants[size]}`, "bg-muted")}
            size="icon"
            onClick={() => copy(textToCopy)}
          >
            <Copy
              size={
                {
                  sm: 12,
                  lg: 15,
                }[size]
              }
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm font-bold">Copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
