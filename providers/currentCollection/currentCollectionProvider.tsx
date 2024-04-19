import React, { ReactNode, useCallback, useState } from "react"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { useNFTFilters } from "@/lib/utils/nftFilters"

import { CurrentCollectionContext } from "./currentCollectionContext" // Adjust the import path as necessary

interface CollectionProviderProps {
  children: ReactNode
}

export const CurrentCollectionProvider: React.FC<CollectionProviderProps> = ({
  children,
}) => {
  const [currentCollectionAddress, setCurrentCollection] = useState<Address>(
    globalConfig.defaultContractAddress
  )

  const switchCollection = useCallback(
    (collectionAddress: Address) => {
      setCurrentCollection(collectionAddress)
    },
    [setCurrentCollection]
  )

  return (
    <CurrentCollectionContext.Provider
      value={{ currentCollectionAddress, switchCollection }}
    >
      {children}
    </CurrentCollectionContext.Provider>
  )
}
