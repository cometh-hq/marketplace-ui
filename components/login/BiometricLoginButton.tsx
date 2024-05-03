import { useCallback } from "react"
import { useComethConnectLogin } from "@/providers/authentication/comethConnectHooks"
import { cx } from "class-variance-authority"
import { FingerprintIcon } from "lucide-react"
import { useAccount } from "wagmi"

import { Button } from "../ui/Button"

export const BiometricLoginButton = ({
  onPreClick = () => {},
}: {
  onPreClick?: () => void
}) => {
  const account = useAccount()
  // Can define user wallet and error handling here
  const comethConnectLogin = useComethConnectLogin(undefined, undefined)

  const biometricLogin = useCallback(() => {
    onPreClick()
    comethConnectLogin()
  }, [onPreClick, comethConnectLogin])

  return (
    <Button
      className={cx({
        "border-r-2 border-muted w-full": true,
      })}
      isLoading={account.isReconnecting}
      disabled={account.isReconnecting}
      size="lg"
      onClick={biometricLogin}
    >
      <FingerprintIcon className="mr-2 " size="20" />
      Biometric Login
    </Button>
  )
}
