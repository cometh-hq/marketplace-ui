"use client"

import { useMemo } from "react"
import Link from "next/link"
import { AssetTransfers } from "@alembic/nft-api-sdk"
import { ArrowRightIcon, ExternalLink } from "lucide-react"
import { DateTime } from "luxon"
import { Address, isAddressEqual } from "viem"

import { TransferListLine } from "@/types/transfers"
import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

import { CopyButton } from "../ui/copy-button"
import { UserButton } from "../ui/user-button"

type TransfersListProps = {
  assetTransfers: AssetTransfers
  maxTransfersToShow?: number
}

export function TransfersList({
  assetTransfers,
  maxTransfersToShow,
}: TransfersListProps) {
  const viewerAddress = useCurrentViewerAddress()

  const getUsername = (address: Address) => {
    if (viewerAddress && isAddressEqual(address, viewerAddress)) {
      return "You"
    }
  }

  const data = useMemo(() => {
    return (assetTransfers ?? [])
      .slice(0, maxTransfersToShow ?? assetTransfers?.length - 1)
      .map((asset) => ({
        id: asset.id.toString(),
        createdAt: DateTime.fromMillis(asset.timestamp),
        emitter: {
          username: getUsername(asset.fromAddress as Address),
          address: asset.fromAddress,
        },
        receiver: {
          username: getUsername(asset.toAddress as Address),
          address: asset.toAddress,
        },
        txHash: asset.transactionHash,
      })) as TransferListLine[]
  }, [assetTransfers, maxTransfersToShow])

  return (
    <Table>
      <TableBody>
        {data?.length ? (
          data?.map((transfer) => (
            <TableRow key={transfer.id}>
              <TableCell className="justify-start">
                <div className="flex items-center gap-2">
                  <UserButton user={transfer.emitter} />
                  <CopyButton textToCopy={transfer.emitter.address} />
                  <ArrowRightIcon size={18} />
                  <UserButton user={transfer.receiver} />
                  <CopyButton textToCopy={transfer.receiver.address} />
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href={`https://polygonscan.com/tx/${transfer.txHash}`}
                  className="flex items-center justify-end gap-2 text-sm font-medium text-muted-foreground hover:text-secondary-foreground"
                >
                  {transfer.createdAt.toLocaleString(DateTime.DATE_MED)}
                  <ExternalLink size="18" className="" />
                </Link>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell className="h-24 text-center">No results.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
