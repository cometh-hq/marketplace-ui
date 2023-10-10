import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { CardFiltersRaw } from "@/types/assets"

import _ from "lodash"

export const useNFTFilters = () => {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const filters = useMemo(() => {
    const attributes =
      Array.from(params.entries()).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: ["orderBy", "direction", "isOnSale"].includes(key) ? value : params.getAll(key)
      }), {} as any)

    const formatAttributes = {
      ...attributes,
      isOnSale: attributes.isOnSale === 'true' ? true : undefined
    }

    return formatAttributes
  }, [params])

  const update = useCallback((newFilters: CardFiltersRaw) => {
    const params = new URLSearchParams()
    const updatedFilters = { ...filters, ...newFilters }

    Object.entries(_.omitBy(updatedFilters, _.isUndefined)).forEach(([key, value]) => {
      (Array.isArray(value) ? value : [value]).forEach((v) =>
        params.append(key, v as string)
      )
    })

    router.push(`${pathname}?${params.toString()}`)
  }, [filters, pathname, router])

  const reset = useCallback(() => router.push(pathname), [pathname, router])

  const filtersCounter = useMemo(() => {
    const { isOnSale, orderBy, direction, ...rest } = filters
    return Object.values(rest).flat().length
  }, [filters])

  return {
    filters,
    filtersCounter,
    update,
    reset,
  }
}
