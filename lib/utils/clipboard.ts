import { useToast } from "@/components/ui/toast/use-toast"
import { useState } from "react"

type CopiedValue = string | null
type CopyFn = (text: string) => Promise<boolean>

export const useClipboard = (): [CopiedValue, CopyFn] => {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)
  const { toast } = useToast()

  const copy: CopyFn = async (text: string) => {
    if (!navigator.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      toast({
        title: "Copied!",
        description: text,
        duration: 3000,
      })
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      setCopiedText(null)
      return false
    }
  }

  return [copiedText, copy]
} 