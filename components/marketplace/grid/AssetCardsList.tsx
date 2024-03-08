"use client"

export type AssetCardsListProps = {
  children: React.ReactNode[] | React.ReactNode | null
}

export function AssetCardsList({ children }: AssetCardsListProps) {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-[repeat(auto-fill,minmax(300px,_1fr))] md:gap-12">
      {children}
    </div>
  )
}
