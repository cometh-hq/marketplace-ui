import { manifest } from "@/manifests"
import { fetchCollectionAttributes } from "@/services/cometh-marketplace/collection-attributes"
import { type CollectionAttributes } from "@cometh/marketplace-sdk"

export type SerializedMarketplacePanelFilters = {
  values: Record<MarketplaceFilterKey, { values: string[] }>
  order: MarketplaceFilterKey[]
}

export type MarketplaceFilterKey = (typeof filterPanelColumns)[number]

export type MarketplacePanelFilters = Map<
  MarketplaceFilterKey,
  {
    values: Set<string>
  }
>

export const formattedAttributes =
  manifest.pages?.asset?.excludedAttributesInFilters?.map((attribute) =>
    attribute.toLowerCase()
  ) ?? []

export const marketplaceFiltersDescription = new Map<
  MarketplaceFilterKey,
  { values: Set<string> }
>()

export const seedFilters = async (collectionAddress: string): Promise<
  typeof marketplaceFiltersDescription
> => {
  const filters = new Map<MarketplaceFilterKey, { values: Set<string> }>()
  let attributes: CollectionAttributes = {}

  try {
    attributes = await fetchCollectionAttributes(collectionAddress)
  } catch (e) {
    console.error("Cannot fetch collection attributes")
  }

  const excludedAttributes = new Set(formattedAttributes)

  for (const [type, valueCounts] of Object.entries(attributes)) {
    if (!excludedAttributes.has(type.toLowerCase())) {
      const attributeValues: string[] = Object.keys(valueCounts)
      filters.set(type, { values: new Set(attributeValues) })
    }
  }

  return filters
}

export const filterPanelColumns = formattedAttributes

export function serializeFilters(
  filters: MarketplacePanelFilters
): SerializedMarketplacePanelFilters {
  const entries = [...filters.entries()]

  return entries.reduce(
    (acc, [key, filter]) => {
      return {
        ...acc,
        values: {
          ...acc.values,
          [key]: {
            values: [...filter.values],
          },
        },
      }
    },
    {
      values: {},
      order: entries.map(([key]) => key),
    } as SerializedMarketplacePanelFilters
  )
}

export function deserializeFilters(
  filters: SerializedMarketplacePanelFilters
): MarketplacePanelFilters {
  const entries = Object.entries(filters.values)
    .sort(
      (a, b) =>
        filters.order.indexOf(a[0] as MarketplaceFilterKey) -
        filters.order.indexOf(b[0] as MarketplaceFilterKey)
    )
    .map(([key, value]) => [
      key as MarketplaceFilterKey,
      {
        values: new Set(value.values),
      },
    ]) as [MarketplaceFilterKey, { values: Set<string> }][]

  return new Map(entries)
}
