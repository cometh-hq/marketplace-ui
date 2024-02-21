import { useQuery, useQueryClient } from "@tanstack/react-query"

import { cosmikClient } from "../clients"

export const useUsername = (walletAddress: string) => {
  const { data, isFetching } = useQuery({
    queryKey: ["user", "username", walletAddress],
    queryFn: () => cosmikClient.get(`/users?address=${walletAddress}`),
    retry: false,
    enabled: !!walletAddress,
  })

  return {
    username: data?.data.userName,
    isFetchingUsername: isFetching,
  }
}

export const useUsernames = (addresses: string[]) => {
  const queryClient = useQueryClient()

  const queryKey = ["user", "usernames"]

  // filter addresses to determine which are not already in cache
  const addressesToFetch = addresses.filter((address) => {
    const allUsernames =
      queryClient.getQueryData<Record<string, string>>(queryKey) || {}
    return (
      address.toLowerCase() !== "0x0000000000000000000000000000000000000000" &&
      !allUsernames[address.toLowerCase()]
    )
  })

  // fetch usernames for addresses not found in cache
  const fetchUsernames = async (addresses: string[]) => {
    const response = await cosmikClient.post("/users/usernames", { addresses })
    const newUsernames = response.data.reduce(
      (
        acc: Record<string, string>,
        user: { address: string; userName: string }
      ) => {
        acc[user.address.toLowerCase()] = user.userName
        return acc
      },
      {}
    )

    // update the global cache of usernames
    const allUsernames = queryClient.getQueryData(queryKey) || {}
    const updatedUsernames = { ...allUsernames, ...newUsernames }
    queryClient.setQueryData(queryKey, updatedUsernames)

    return updatedUsernames
  }

  // use useQuery to fetch missing usernames
  const { isFetching } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchUsernames(addressesToFetch),
    enabled: addressesToFetch.length > 0
  })

  // retrieve all usernames from cache, including new ones
  const allUsernames = queryClient.getQueryData(queryKey) || {}

  // filter to get only the requested usernames
  const usernames = addresses.reduce((acc, address) => {
    // @ts-ignore
    acc[address.toLowerCase()] = allUsernames[address.toLowerCase()]
    return acc
  }, {})

  return { usernames, isFetchingUsernames: isFetching }
}
