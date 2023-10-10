export type AssetStatus = "listed" | "auction" | "bought" | "not-listed"

export type CardFiltersRaw = {
  orderBy?: string
  direction?: string
  isOnSale?: boolean
  ownerAddress?: string
}