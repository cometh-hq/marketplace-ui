import { TabsContent } from "@/components/ui/tabs"
import { Address } from "viem"

export function CollectionAssetsSearchTabContent({
    children,
    contractAddress,
  }: {
    children: React.ReactNode
    contractAddress: Address
  }) {
    return (
      <TabsContent value={"collection-" + contractAddress} className="w-full">
        {children}
      </TabsContent>
    )
  }