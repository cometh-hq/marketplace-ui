import {
  FilterDirection,
  FilterOrderBy,
} from "@cometh/marketplace-sdk"

export const FILTERS_SORT = [
  {
    label: "Low to High",
    orderBy: FilterOrderBy.PRICE,
    direction: FilterDirection.ASC,
  },
  {
    label: "High to Low",
    orderBy: FilterOrderBy.PRICE,
    direction: FilterDirection.DESC,
  },
  {
    label: "Newest Listings",
    orderBy: FilterOrderBy.LISTING_DATE,
    direction: FilterDirection.DESC,
  },
  {
    label: "Oldest Listings",
    orderBy: FilterOrderBy.LISTING_DATE,
    direction: FilterDirection.ASC,
  },
]