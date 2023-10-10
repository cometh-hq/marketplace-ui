type FiltersBadgeCounterProps = {
  counter: number
}

export const FiltersBadgeCounter = ({
  counter,
}: FiltersBadgeCounterProps) => {
  return (
    counter > 0 && (
      <span className="absolute -right-1 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
        {counter}
      </span>
    )
  )
}