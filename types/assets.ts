import { Bignumber, Metadata, TokenType } from "@cometh/marketplace-sdk"

export type AssetStatus = "listed" | "not-listed"

export type CardFiltersRaw = {
  orderBy?: string
  direction?: string
  isOnSale?: boolean
  ownerAddress?: string
}

// TODO: Use SDK type instead once an OrderAsset type is possible there 
export type OrderAsset = {
  contractAddress: string;
  tokenId: string;
  owner: string | null;
  supply: Bignumber;
  numberOwners: Bignumber;
  tokenType: TokenType;
  metadata: Metadata;
  cachedImageUrl: string | null;
}