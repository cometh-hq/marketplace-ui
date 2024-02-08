"use client"

import { useEffect, useState } from "react"
import { User } from "@/services/cometh-marketplace/cosmik/signin"

import { SignUpForm } from "@/components/signup-form"

export default function WalletsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const handleLoginSuccess = (user: User) => {
    setIsLoggedIn(true)
    setUser(user)
  }

  return (
    <div className="container mx-auto flex items-center justify-center gap-4 py-5 sm:py-6">
      {!isLoggedIn ? (
        <SignUpForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>User : {user?.userName} </>
      )}
    </div>
  )
}
