import { Address } from "viem"

import { TabsContent } from "@/components/ui/Tabs"

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
