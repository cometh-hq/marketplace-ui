import { useCallback, useState } from "react"
import { useAcceptBuyOffer } from "@/services/orders/acceptBuyOfferService"
import { OrderWithAsset, TokenType } from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"

import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/Button"
import { Price } from "@/components/ui/Price"
import { PriceDetails } from "@/components/ui/PriceDetails"
import { toast } from "@/components/ui/toast/hooks/useToast"
import { ButtonLoading } from "@/components/ButtonLoading"
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"
import TokenQuantityInput from "@/components/erc1155/TokenQuantityInput"

export type ConfirmBuyOfferStepProps = {
  offer: OrderWithAsset
  onValid: () => void
}

export function ConfirmAcceptBuyOfferStep({
  offer,
  onValid,
}: ConfirmBuyOfferStepProps) {
  const isErc1155 = offer.tokenType === TokenType.ERC1155
  const {
    mutateAsync: acceptBuyOffer,
    isPending,
    isSuccess,
  } = useAcceptBuyOffer()

  const [quantity, setQuantity] = useState(BigInt(1))

  const onConfirm = useCallback(async () => {
    const tx = await acceptBuyOffer({ offer, quantity: quantity })
    if (isSuccess) {
      toast({
        title:
          "The purchase offer for your NFT has been accepted with success!",
        description: `${globalConfig.network.explorer}/${tx.transactionHash}`,
      })
      onValid()
    }
  }, [acceptBuyOffer, offer, onValid, isSuccess, quantity])

  const amount = offer.erc20TokenAmount
  const fees = offer.totalFees
  const amountWithFees = BigNumber.from(amount).add(fees).toString()

  return (
    <div className="flex w-full flex-col justify-center gap-4 pt-4">
      <h3 className="w-full text-center text-xl font-semibold">Summary</h3>
      {isErc1155 ? (
        <p className="text-center">
          You are about to fill part of an offer for{" "}
          <span className="font-bold">{offer.asset?.metadata.name}</span>. There
          is a quantity of <span className="font-bold">{offer.tokenQuantityRemaining} NFTs</span> available to sell on
          this order for a unit price of{" "}
          <Price size="default" amount={offer.totalUnitPrice} /> (fees
          included)
        </p>
      ) : (
        <p className="text-center">
          You are about to accept an offer for <br />
          <span className="font-bold">
            {offer.asset?.metadata.name}
          </span> for <Price size="default" amount={amountWithFees} /> (fees
          included)
        </p>
      )}

      {isErc1155 && (
        <TokenQuantityInput
          max={BigInt(offer.tokenQuantityRemaining)}
          label="Quantity to sell*"
          onChange={setQuantity}
          initialQuantity={BigInt(1)}
        />
      )}
      <PriceDetails
        quantity={quantity}
        unitPrice={BigInt(offer.erc20UnitTokenAmount)}
      />
      {isPending ? (
        <ButtonLoading />
      ) : (
        <Button onClick={onConfirm}>Confirm</Button>
      )}
    </div>
  )
}
