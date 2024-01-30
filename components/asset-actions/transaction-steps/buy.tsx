import { useCallback } from "react"
import { useBuyAsset } from "@/services/orders/buy-asset"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { ExternalLinkIcon } from "lucide-react"

import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { InfoBox } from "@/components/ui/message-box"
import { Price } from "@/components/ui/price"
import { toast } from "@/components/ui/toast/use-toast"
import { AssetHeaderImage } from "@/components/marketplace/asset/image"

import { SwitchNetwork } from "../buttons/switch-network"

export type BuyStepProps = {
  asset: SearchAssetWithTradeData | AssetWithTradeData
  onValid: () => void
}

/**
 * Arriving at this stage means that the user has sufficient funds
 * so we don't have to do any check here
 */
export function BuyStep({ asset, onValid }: BuyStepProps) {
  const { mutateAsync: buy, isPending } = useBuyAsset()

  const onSubmit = useCallback(async () => {
    const tx = await buy({ asset: asset })
    toast({
      title: "NFT bought!",
      description: globalConfig.network.explorer?.blockUrl ? (
        <a
          href={`${globalConfig.network.explorer?.blockUrl}/${tx.transactionHash}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2"
        >
          <ExternalLinkIcon size={16} />
          View on {globalConfig.network.explorer?.name}
        </a>
      ) : (
        <div className="flex items-center gap-2">
          Copy the transaction hash{" "}
          <CopyButton size="lg" textToCopy={tx.transactionHash} />
        </div>
      ),
    })
    onValid()
  }, [asset, buy, onValid])

  return (
    <div className="flex flex-col items-center justify-center gap-[16px] pt-[16px]">
      <AssetHeaderImage asset={asset} />

      <InfoBox
        title="Secured Transaction"
        description="This transaction is secured by the blockchain. You will be prompted to confirm the transaction in your wallet."
      />

      <SwitchNetwork>
        <Button
          className="flex gap-1"
          onClick={onSubmit}
          disabled={isPending}
          isLoading={isPending}
        >
          Buy now for <Price amount={asset.orderbookStats.lowestListingPrice} />
        </Button>
      </SwitchNetwork>
    </div>
  )
}
