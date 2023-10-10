import { Input } from "@/components/ui/input";
import { useCallback, useRef } from "react";
import debounce from 'lodash/debounce'
import { Search } from "lucide-react";

type SearchAssetProps = {
  onNameChange: (name: string) => void
}

export function SearchAsset({ onNameChange }: SearchAssetProps) {
  const SearchRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    debounce(() => {
      onNameChange(SearchRef?.current?.value as string)
    }, 300),
    [SearchRef, onNameChange],
  )

  return (
    <Input
      ref={SearchRef}
      type="text"
      placeholder="Search NFT"
      className="h-[40px]"
      icon={
        <Search size="16" className={"opacity-40 min-w-[17px]"} />
      }
      onChange={handleChange}
    />
  )
}