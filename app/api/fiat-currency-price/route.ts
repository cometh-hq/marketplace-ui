import { coingeckoClient } from "@/services/coingecko/client"

export const revalidate = 60 * 10

// /api/fiat-currency-price?id=bitcoin&currency=usd

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const currency = searchParams.get("currency")

  try {
    if (!id || !currency) {
      throw new Error("Invalid request")
    }

    const res = await coingeckoClient.get(
      `/simple/price?ids=${id}&vs_currencies=${currency}`
    )

    const currentFiatPrice = res.data

    return new Response(JSON.stringify({ currentFiatPrice }), {
      headers: {
        "content-type": "application/json",
      },
    })
  } catch (e) {
    console.error(e)
    return new Response(e.message, {
      status: 400,
    })
  }
  // const res = await coingeckoClient.get(
  //   `/simple/price?ids=${id}&vs_currencies=${currency}`
  // )

  // const currentFiatPrice = res.data

  // return Response.json({ currentFiatPrice })
}
