import { cn } from "@/lib/utils/utils"

import { Card, CardContent } from "./ui/card"

export type ProductBlockContainerProps = {
  children: React.ReactNode | React.ReactNode[]
}

export function ProductBlockContainer({
  children,
}: ProductBlockContainerProps) {
  return (
    <Card className="card-secondary">
      <CardContent className="py-[22px]">
        <div className="flex h-full flex-wrap items-stretch justify-between gap-4">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

export type ProductBlockDividedColumnProps = {
  children: [React.ReactNode, React.ReactNode]
  hideOnMobile?: boolean
}

export function ProductBlockDividedColumn({
  children,
  hideOnMobile,
}: ProductBlockDividedColumnProps) {
  return (
    <div
      className={cn(
        "flex-col items-start justify-between gap-2 flex",
        hideOnMobile ? "hidden md:flex" : "flex"
      )}
    >
      {children}
    </div>
  )
}

export type ProductBlockCenteredColumnProps = {
  children: React.ReactNode
}

export function ProductBlockCenteredColumn({
  children,
}: ProductBlockCenteredColumnProps) {
  return <div className="flex w-full flex-col gap-3">{children}</div>
}

export type ProductBlockColumnLabel = {
  children: React.ReactNode
}

export function ProductBlockLabel({ children }: ProductBlockColumnLabel) {
  return <span className="font-semibold">{children}</span>
}
