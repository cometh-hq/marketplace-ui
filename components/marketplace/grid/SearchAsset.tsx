import { useCallback, useRef } from "react"
import debounce from "lodash/debounce"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/Input"

type SearchAssetProps = {
  onChange: (name: string) => void
}

export function SearchAsset({ onChange }: SearchAssetProps) {
  const SearchRef = useRef<HTMLInputElement>(null)

  const handleChange = useCallback(
    debounce(() => {
      onChange(SearchRef?.current?.value as string)
    }, 300),
    [onChange, SearchRef]
  )

  return (
    <Input
      ref={SearchRef}
      type="text"
      placeholder="Search name"
      className="h-[40px]"
      icon={<Search size="16" className={"min-w-[17px] opacity-40"} />}
      inputUpdateCallback={handleChange}
    />
  )
}
