import {
  FilterDirection,
  FilterOrderBy,
} from '@cometh/marketplace-sdk'

export const FILTERS_SORT = [
  {
    label: "Sort by Price: Low to High",
    orderBy: FilterOrderBy.PRICE,
    direction: FilterDirection.ASC,
  },
  {
    label: "Sort by Price: High to Low",
    orderBy: FilterOrderBy.PRICE,
    direction: FilterDirection.DESC,
  },
  {
    label: "Sort by Newest Listings",
    orderBy: FilterOrderBy.LISTING_DATE,
    direction: FilterDirection.ASC,
  },
  {
    label: "Sort by Oldest Listings",
    orderBy: FilterOrderBy.LISTING_DATE,
    direction: FilterDirection.DESC,
  },
]