import Image from "next/image"
import { User } from "@/services/cosmik/signin"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"

import { SignInForm } from "./signin-form"

type SignInFormProps = {
  onLoginSuccess: (user: User) => void
}

export function SignInDialog({ onLoginSuccess }: SignInFormProps) {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[400px]" shouldDisplayCloseBtn={false}>
        <DialogHeader>
          <Image
            className="mx-auto"
            src="/cosmik-logo.png"
            width="140"
            height="70"
            alt=""
          />
        </DialogHeader>
        <DialogDescription>
          Enter your Comsmik Battle credentials to view or add external wallets
        </DialogDescription>
        <SignInForm onLoginSuccess={onLoginSuccess}  />
      </DialogContent>
    </Dialog>
  )
}
