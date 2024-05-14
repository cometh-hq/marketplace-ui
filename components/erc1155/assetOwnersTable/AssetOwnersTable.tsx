import { AssetOwner } from "@cometh/marketplace-sdk"

import { TabsContent } from "@/components/ui/Tabs"
import { DataTable } from "@/components/DataTable"

import { assetOwnerTableColumns } from "./assetOwnerTableColumns"

export type AssetOwnersTableProps = {
  owners: AssetOwner[]
}

export function AssetOwnersTable({ owners }: AssetOwnersTableProps) {
  return <DataTable columns={assetOwnerTableColumns} data={owners} />
}

export function AssetOwnersTableTab({ owners }: { owners: AssetOwner[] }) {
  return (
    <TabsContent value="asset-owners" className="w-full">
      <AssetOwnersTable owners={owners} />
    </TabsContent>
  )
}
