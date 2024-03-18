type FiltersBadgeCounterProps = {
  counter: number
}

export const FiltersBadgeCounter = ({ counter }: FiltersBadgeCounterProps) => {
  return (
    counter > 0 && (
      <span className="bg-primary absolute -right-1 -top-2 inline-flex size-5 items-center justify-center rounded-full text-xs font-bold text-white">
        {counter}
      </span>
    )
  )
}
