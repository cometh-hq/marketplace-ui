"use client"

export type AssetCardsListProps = {
  children: React.ReactNode[] | React.ReactNode | null
}

export function AssetCardsList({ children }: AssetCardsListProps) {
  return (
    <div className="grid sm:grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] w-full gap-4 md:gap-y-10">
      {children}
    </div>
  )
}
