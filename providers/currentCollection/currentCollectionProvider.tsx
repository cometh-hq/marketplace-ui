import React, { ReactNode, useState } from "react"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"

import { CurrentCollectionContext } from "./currentCollectionContext" // Adjust the import path as necessary
import { useNFTFilters } from "@/lib/utils/nft-filters"

interface CollectionProviderProps {
  children: ReactNode
}

export const CurrentCollectionProvider: React.FC<CollectionProviderProps> = ({
  children,
}) => {
  const [currentCollectionAddress, setCurrentCollection] = useState<Address>(
    globalConfig.defaultContractAddress
  )
  const { reset } = useNFTFilters()

  const switchCollection = (collectionAddress: Address) => {
    setCurrentCollection(collectionAddress)
    reset()
  }

  return (
    <CurrentCollectionContext.Provider
      value={{ currentCollectionAddress, switchCollection }}
    >
      {children}
    </CurrentCollectionContext.Provider>
  )
}
