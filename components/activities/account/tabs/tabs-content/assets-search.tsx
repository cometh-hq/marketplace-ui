"use client"

import { TabsContent } from "@/components/ui/tabs"

export const AssetsSearchTabContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <TabsContent value="search-assets" className="w-full">
      {children}
    </TabsContent>
  )
}
