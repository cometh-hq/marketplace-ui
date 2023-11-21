import { Loader } from "lucide-react"

export const Loading = () => {
  return (
    <div className="flex justify-center py-[100px]">
      <div className="h-12 w-12">
        <Loader size={22} className="animate-spin" />
      </div>
    </div>
  )
}