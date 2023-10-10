import { KnownUser, UnknownUser } from "@/types/user"

/**
 * TODO: Add a proper rule when defining the data model
 * Like, take the user id instead for example
 */
export const isKnownUser = (
  user: UnknownUser | KnownUser
): user is KnownUser => {
  return (user as KnownUser).username !== undefined
}

export const isUnknownUser = (
  user: UnknownUser | KnownUser
): user is UnknownUser => {
  return !isKnownUser(user)
}
