"use client"

import { User } from "@/services/cosmik/signin"
import { SignInDialog } from "@/components/signin/signin-dialog"
import { WalletsDialog } from "@/components/wallets-dialog"
import { useState } from "react"

export default function WalletsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  function handleLoginSuccess(user: User) {
    setIsLoggedIn(true)
    setUser(user)
  }

  return (
    <div className="container mx-auto flex items-center justify-center gap-4 py-5 sm:py-6">
      {!isLoggedIn ? (
        <SignInDialog onLoginSuccess={handleLoginSuccess} />
      ) : (
        <WalletsDialog user={user!} />
      )}
    </div>
  )
}
