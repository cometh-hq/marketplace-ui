"use client"

import { useCallback, useEffect, useState } from "react"
import { loadStripeOnramp, StripeOnramp } from "@stripe/crypto"
import { useQuery } from "@tanstack/react-query"
import { set } from "lodash"
import { useCall } from "wagmi"

import { Button } from "../ui/Button"

const PUBLIC_KEY =
  "pk_test_51OESzHIVzbOzFT4xhIlRNO55PJlwnABjpujWOSZvbhReskemV6kEjvpf124jjFqX5pp0eFLIpMDyuhc12rbz1e1B00QIEi0XGC"

const createOnRampSessionKey = async () => {
  return "cos_1PdqFjIVzbOzFT4xdWL3UaYi_secret_EdwQBvJP7GCByXTyHCyjRgxIf000ukCjxdG"
}

export default function StripeOnRamp() {
  const [stripeOnramp, setStripeOnramp] = useState<StripeOnramp | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    loadStripeOnramp(PUBLIC_KEY).then((onramp) => {
      setStripeOnramp(onramp)
    })
  }, [])

  const redirectToNewSession = useCallback(() => {
    setIsLoading(true)
    createOnRampSessionKey().then((clientSecret) => {
      if (stripeOnramp) {
        const session = stripeOnramp.createSession({
          clientSecret,
        })
        session.mount("#onramp-element")
      }
      setIsLoading(false)
    })
  }, [stripeOnramp])

  return (
    <div>
      <Button
        onClick={redirectToNewSession}
        isLoading={isLoading || !stripeOnramp}
        disabled={isLoading || !stripeOnramp}
      >
        Create new session
      </Button>
      <div id="onramp-element"></div>
    </div>
  )
}
