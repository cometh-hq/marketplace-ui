type FiltersBadgeCounterProps = {
  counter: number
}

export const FiltersBadgeCounter = ({
  counter,
}: FiltersBadgeCounterProps) => {
  return (
    counter > 0 && (
      <span className="ml-1 inline-flex items-center justify-center text-xs font-bold text-white">
        ({counter})
      </span>
    )
  )
}