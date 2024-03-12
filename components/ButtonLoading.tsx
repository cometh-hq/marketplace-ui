import { Loader } from "lucide-react"

import { Button } from "@/components/ui/Button"

type ButtonLoadingProps = {
} & React.ComponentProps<typeof Button>

export function ButtonLoading({
  size = "sm",
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
