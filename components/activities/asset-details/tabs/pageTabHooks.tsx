import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function useUpdateTabQueryParam(): (newTab: string) => void {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return useCallback(
    (newTab: string) => {
      router.push(pathname + "?" + createQueryString("tab", newTab), {
        scroll: false,
      })
    },
    [router, pathname, createQueryString]
  )
}

export function useQueryParamTab(
  defaultTab: string
): [string, (newTab: string) => void] {
  const searchParams = useSearchParams()
  const tabParam = useMemo(() => searchParams.get("tab"), [searchParams])
  const updateTabQueryParam = useUpdateTabQueryParam()
  const [hasManuallyOverriddenTab, setHasManuallyOverriddenTab] =
    useState<boolean>(false)
  const [currentTabValue, setCurrentTabValue] = useState<string>(() => {
    return tabParam || defaultTab
  })

  useEffect(() => {
    if (hasManuallyOverriddenTab && tabParam === currentTabValue) {
      setHasManuallyOverriddenTab(false)
    } else if (
      tabParam &&
      tabParam !== currentTabValue &&
      !hasManuallyOverriddenTab
    ) {
      setCurrentTabValue(tabParam)
    }
  }, [tabParam, currentTabValue, hasManuallyOverriddenTab])

  const setTabValue = useCallback(
    (newTab: string) => {
      if (newTab !== currentTabValue) {
        setCurrentTabValue(newTab)
        updateTabQueryParam(newTab)
        setHasManuallyOverriddenTab(true)
      }
    },
    [
      currentTabValue,
      updateTabQueryParam,
      setHasManuallyOverriddenTab,
      setCurrentTabValue,
    ]
  )

  return [currentTabValue, setTabValue]
}
