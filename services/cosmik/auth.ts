export enum AuthStatus {
  Unknow = 0,
  Authenticated = 1,
  Guest = 2,
}

export const useCosmikAuth = () => {
  const account = null as null | undefined

  let status = AuthStatus.Unknow

  switch (account) {
    case null:
      status = AuthStatus.Guest
      break
    case undefined:
      status = AuthStatus.Unknow
      break
    default:
      status = AuthStatus.Authenticated
      break
  }

  return {
    status,
    account,
  }
}