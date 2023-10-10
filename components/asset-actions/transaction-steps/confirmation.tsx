import { ExternalLinkIcon } from "lucide-react"

import { AssetWithTradeData, SearchAssetWithTradeData } from "@alembic/nft-api-sdk"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShareButton } from "@/components/ui/share-button"

export type ConfirmationStepProps = {
  asset?: AssetWithTradeData | SearchAssetWithTradeData
  txHash?: string | null
  onValid?: () => void
}

export function ConfirmationStep({ asset, txHash, onValid }: ConfirmationStepProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-8">
      <h3 className="text-xl font-semibold">Transaction submitted</h3>
      <p>
        Your transaction has been submitted with success. <br />
        {txHash && <>You can view the status of your transaction on Etherscan.</>}
      </p>
      <div className="flex items-center gap-2">
        {txHash && (
          <Link href={`https://polygonscan.com/tx/${txHash}`} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLinkIcon size={16} className="mr-2" />
              View on Polygonscan
            </Button>
          </Link>
          )}
          <ShareButton asset={asset} />
      </div>
    </div>
  )
}
