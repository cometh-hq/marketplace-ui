import { comethMarketplaceClient } from "@/lib/clients"

const _isTransferTxIndexedWithStats = async (transferTxHash: string) => {
  const indexingState =
    await comethMarketplaceClient.transfer.getTransactionTransfersIndexingState(
      transferTxHash
    )
  return indexingState.isIndexed && indexingState.hasUpdatedTokenStats
}

const POLLING_INTERVAL = 500

export const waitForTransferTxIndexingAndStats = async (
  transferTxHash: string
) => {
  while (!(await _isTransferTxIndexedWithStats(transferTxHash))) {
    await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL))
  }
}
