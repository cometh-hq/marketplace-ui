import { useConnect, useIsConnected } from "@/lib/web3/auth"
import { Button } from "./ui/button"

export function Connected({ children }: { children: React.ReactNode }) {
  const isConnected = useIsConnected()
  const connect = useConnect()
  if (!isConnected) return <Button size="lg" variant="default" onClick={() => connect()}>Connect&nbsp;<span className="max-md:hidden">wallet</span></Button>
  return <>{children}</>
}
