
export const AssetsSearchEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-center text-2xl font-bold">
        No assets found.
      </h1>
      <p className="mt-2 text-center text-sm">
        Try adjusting your search or filters.
      </p>
    </div>
  )
}