"use client"

import { Copy } from "lucide-react"

import { useClipboard } from "@/lib/utils/clipboard"

import { Button } from "./button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"
import { cx } from "class-variance-authority"

type CopyButtonProps = {
  size?: string,
  textToCopy: string
}

export function CopyButton({ size = 'sm', textToCopy }: CopyButtonProps) {
  const [_, copy] = useClipboard()

  const variants = {
    sm: "h-8 w-8",
    lg: "h-10 w-10"
  } as Record<string, string>

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip defaultOpen={false}>
        <TooltipTrigger asChild>
          <Button
            variant="neutral"
            className={cx(`${variants[size]}`, "")}
            size="icon"
            onClick={() => copy(textToCopy)}
          >
            <Copy
              size={{
                sm: 12,
                lg: 15
              }[size]}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm font-bold">
            Copy
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
