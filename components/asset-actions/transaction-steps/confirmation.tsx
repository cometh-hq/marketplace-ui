import Link from "next/link"
import { ExternalLinkIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export type ConfirmationStepProps = {
  txHash?: string | null
}

export function ConfirmationStep({
  txHash,
}: ConfirmationStepProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-8">
      <h3 className="text-xl font-semibold">Transaction submitted</h3>
      <p className="text-center">
        Your transaction has been submitted with success. <br />
        {txHash && (
          <>You can view the status of your transaction on Etherscan.</>
        )}
      </p>
      <div className="flex items-center gap-2">
        {txHash && (
          <Link
            href={`https://polygonscan.com/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline" size="sm">
              <ExternalLinkIcon size={16} className="mr-2" />
              View on Polygonscan
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
