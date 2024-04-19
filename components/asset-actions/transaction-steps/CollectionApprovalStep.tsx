import { manifest } from "@/manifests/manifests"
import { useApproveCollection } from "@/services/token-approval/approveCollectionService"

import { Button } from "@/components/ui/Button"
import { ButtonLoading } from "@/components/ButtonLoading"

export type CollectionApprovalStepProps = {
  contractAddress: string
  tokenId: string
  onValid: () => void
}

export function CollectionApprovalStep({
  contractAddress,
  tokenId,
  onValid,
}: CollectionApprovalStepProps) {
  const { mutate: approveCollection, isPending } = useApproveCollection({
    tokenAddress: contractAddress,
    tokenId: tokenId,
    onSuccess: onValid,
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
