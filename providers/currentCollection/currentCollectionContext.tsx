import globalConfig from "@/config/globalConfig"
import  { createContext, useContext } from "react"
import { Address } from "viem"

interface CurrentCollectionContextType {
  currentCollectionAddress: Address
  switchCollection: (newAddress: Address) => void
}

const defaultContextValue: CurrentCollectionContextType = {
  currentCollectionAddress: globalConfig.defaultContractAddress,
  switchCollection: () => {},
}

export const CurrentCollectionContext =
  createContext<CurrentCollectionContextType>(defaultContextValue)

export const useCurrentCollectionContext = () => useContext(CurrentCollectionContext)
