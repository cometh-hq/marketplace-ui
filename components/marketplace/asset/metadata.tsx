import Link from "next/link"
import { AssetWithTradeData } from "@alembic/nft-api-sdk"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { manifest } from "@/manifests"

export function AssetMetadata({ asset }: { asset: AssetWithTradeData }) {
  const attributes = asset.metadata.attributes

  return (
    <TabsContent value="overview">
      <Card className="border-0 shadow-none">
        <CardHeader className="bg-background pt-0">
          <CardTitle>Description</CardTitle>
          <CardDescription>
            Item #{asset.tokenId} of the {manifest.name} collection.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Attributes</CardTitle>
        </CardHeader>
        <CardContent className="-mx-2 px-2 pb-2">
          <Table className="flex-1">
            <TableBody>
              {attributes?.map((attribute, index) => (
                <TableRow key={index}>
                  <TableCell className="py-1 pl-6">{attribute.trait_type}</TableCell>
                  <TableCell className="py-1 text-right font-medium">
                    <Button asChild variant="link">
                      <Link href={`/marketplace?trait=${attribute.value}`}>
                        {attribute.value}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
