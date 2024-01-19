import { Input } from "@/components/ui/input";
import { useCallback, useRef } from "react";
import debounce from 'lodash/debounce'
import { Search } from "lucide-react";

type SearchAssetProps = {
  onChange: (name: string) => void
}

export function SearchAsset({ onChange }: SearchAssetProps) {
  const SearchRef = useRef<HTMLInputElement>(null)

  const handleChange = useCallback(
    debounce(() => {
      onChange(SearchRef?.current?.value as string)
    }, 300),
    [SearchRef, onChange],
  )

  return (
    <Input
      ref={SearchRef}
      type="text"
      placeholder="Search name"
      className="h-[40px]"
      icon={
        <Search size="16" className={"min-w-[17px] opacity-40"} />
      }
      onInputUpdate={handleChange}
    />
  )
}