import { coingeckoClient } from "@/services/coingecko/client"

export const revalidate = 60 * 10

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const { id, currency } = Object.fromEntries(searchParams)

  if (!id || !currency) {
    throw new Error("Invalid request")
  }

  const res = await coingeckoClient.get(
    `/simple/price?ids=${id}&vs_currencies=${currency}`
  )

  const currentFiatPrice = res.data

  return Response.json({ currentFiatPrice }, { status: 200 })
}
