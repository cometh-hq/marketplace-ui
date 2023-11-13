import { Loader } from "lucide-react"

import { Button } from "@/components/ui/button"

type ButtonLoadingProps = {
  size?: "default" | "lg"
  variant?: "default" | "link"
  className?: string
}

export function ButtonLoading({
  size = "default",
  variant,
  className,
}: ButtonLoadingProps) {
  return (
    <Button disabled size={size} variant={variant} className={className}>
      <Loader size={16} className="mr-2 animate-spin" />
      Please wait
    </Button>
  )
}
