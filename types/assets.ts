export type AssetStatus = "listed" | "not-listed"

export type CardFiltersRaw = {
  orderBy?: string
  direction?: string
  isOnSale?: boolean
  ownerAddress?: string
}