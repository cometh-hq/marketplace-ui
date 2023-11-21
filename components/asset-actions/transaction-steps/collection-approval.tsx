import { manifest } from "@/manifests"
import { useApproveCollection } from "@/services/token-approval/approve-collection"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"

import { Button } from "@/components/ui/button"
import { ButtonLoading } from "@/components/button-loading"

export type CollectionApprovalStepProps = {
  asset: AssetWithTradeData
  onValid: () => void
}

export function CollectionApprovalStep({
  asset,
  onValid,
}: CollectionApprovalStepProps) {
  const { mutate: approveCollection, isLoading } = useApproveCollection({
    tokenId: asset.tokenId,
    onSuccess: onValid,
  })

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-8">
      <h3 className="text-xl font-semibold">Permissions</h3>
      <p>
        {manifest.name} would like to be able to transfer your NFT, when a user
        buys it. Your wallet is going to ask you to approve that.
      </p>
      {isLoading ? (
        <ButtonLoading />
      ) : (
        <Button size="sm" onClick={() => approveCollection()}>
          Approve
        </Button>
      )}
    </div>
  )
}
