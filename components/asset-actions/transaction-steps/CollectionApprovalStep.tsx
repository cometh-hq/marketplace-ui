import { manifest } from "@/manifests/manifests"
import { useApproveCollection } from "@/services/token-approval/approveCollectionService"
import { TokenType } from "@cometh/marketplace-sdk"

import { Button } from "@/components/ui/Button"
import { ButtonLoading } from "@/components/ButtonLoading"

export type CollectionApprovalStepProps = {
  asset: {
    contractAddress: string
    tokenId: string
    tokenType: TokenType
  }
  onValid: () => void
}

export function CollectionApprovalStep({
  asset,
  onValid,
}: CollectionApprovalStepProps) {
  const { mutate: approveCollection, isPending } = useApproveCollection({
    tokenAddress: asset.contractAddress,
    tokenId: asset.tokenId,
    onSuccess: onValid,
    tokenType: asset.tokenType
  })

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-8">
      <h3 className="text-xl font-semibold">Permissions</h3>
      <p className="text-center">
        {manifest.marketplaceName} would like to be able to transfer your NFT,
        when a user buys it. Your wallet is going to ask you to approve that
        allowance.
      </p>
      {isPending ? (
        <ButtonLoading />
      ) : (
        <Button onClick={() => approveCollection()}>
          Approve
        </Button>
      )}
    </div>
  )
}
