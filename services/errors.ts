import { isAxiosError } from "axios"

export type ErrorMessageType = {
  [key: number]: string
} & {
  500: string
}

export const handleOrderbookError = (
  error: any,
  messages: ErrorMessageType
) => {
  if (isAxiosError(error)) {
    const errorMessage =
      messages[error.response?.data?.statusCode ?? error.status ?? 500] ??
      messages[500]

    throw new Error(errorMessage)
  }

  if (error instanceof Error) {
    return error.message;
  }

  throw new Error("Internal server error")
}
