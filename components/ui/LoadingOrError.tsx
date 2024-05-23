import React from "react"
import { Loader } from "lucide-react"

type ErrorMessageDisplayProps = {
  title: string
  message: string
}

const ErrorMessageDisplay = ({ title, message }: ErrorMessageDisplayProps) => {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="w-full text-center text-xl font-semibold">{title}</h3>
      <p className="w-full text-center">{message}</p>
    </div>
  )
}

type LoadingOrErrorProps = {
  isLoading: boolean
  errorMessages: { title: string; message: string }
  children: React.ReactNode
}

export function LoadingOrError({
  isLoading,
  errorMessages,
  children,
}: LoadingOrErrorProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader size={22} className="animate-spin" />
      </div>
    )
  }

  if (errorMessages.title) {
    return (
      <ErrorMessageDisplay
        title={errorMessages.title}
        message={errorMessages.message}
      />
    )
  }

  return <>{children}</>
}
