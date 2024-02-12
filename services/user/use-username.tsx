import { useQuery } from "@tanstack/react-query"

import { KnownUser } from "@/types/user"

import { cosmikClient } from "../clients"

export const useUsername = (walletAddress: string) => {
  const { data, isFetching } = useQuery({
    queryKey: ["user", "username", walletAddress],
    queryFn: ()  => cosmikClient.get(`/users?address=${walletAddress}`),
    retry: false,
    enabled: !!walletAddress,
  })

  return {
    username: data?.data.userName,
    isFetchingUsername: isFetching,
  }
}

export const useUsernames = (addresses: string[]) => {
  const { data, isFetching } = useQuery({
    queryKey: ["user", "usernames", ...addresses],
    queryFn: () => cosmikClient.post("/users/usernames", { walletAddresses: addresses }),
    enabled: addresses.length > 0,
    select: (data) => data?.data?.users.reduce(
      (acc: Record<string, string>, user: KnownUser) => {
        const { walletAddress: address } = user as any
        acc[address.toLowerCase()] = user.username
        return acc
      }, {}),
    })

  return {
    usernames: data || [],
    isFetchingUsernames: isFetching,
  }
}