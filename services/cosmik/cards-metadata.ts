import { cosmikClient } from "@/services/clients"
import { useQuery } from "@tanstack/react-query"

interface CardMetadata {
  name: string;
  typeId: string;
  cost: number;
  tags: string[];
  crew: string[];
  cardTargets: any[];
  effects: Effect[];
  version: string;
}

interface Effect {
  type: string;
  additionalParam?: {
    type: string;
  };
  executionCount: number;
  turnFromNow: number;
  targetType: string;
  source?: {
    type: string;
    value: number;
  };
}

export function useGetCardsMetadata() {
  const { data, isLoading } = useQuery({
    queryKey: ["cosmik", "cards-metadata"],
    queryFn: async () => {
      const response = await cosmikClient.get<CardMetadata[]>('/cards/en_EN')
      return response.data
    },
  })

  return {
    cardsMetadata: data,
    isLoading,
  }
}