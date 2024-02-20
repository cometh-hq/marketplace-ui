import { cosmikClient } from "@/services/clients"
import { useQuery } from "@tanstack/react-query"

export function useGetCardsMetadata() {
  const { data, isLoading } = useQuery({
    queryKey: ["cosmik", "cards-metadata"],
    queryFn: async () => {
      const response = await cosmikClient.get('/cards/en_EN')
      return response.data
    },
  })

  return {
    cardsMetadata: data,
    isLoading,
  }
}