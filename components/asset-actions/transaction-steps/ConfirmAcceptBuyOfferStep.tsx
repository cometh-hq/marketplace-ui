import { useCallback, useState } from "react"
import { useAcceptBuyOffer } from "@/services/orders/acceptBuyOfferService"
import { OrderWithAsset, TokenType } from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"
import { Button } from "@/components/ui/Button"
import { Price } from "@/components/ui/Price"
import { PriceDetails } from "@/components/ui/PriceDetails"
import { ButtonLoading } from "@/components/ButtonLoading"
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
    await acceptBuyOffer({ offer, quantity: quantity })
    setQuantity(BigInt(1))
    onValid()
  }, [acceptBuyOffer, offer, quantity, onValid])

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
          is a quantity of{" "}
          <span className="font-bold">{offer.tokenQuantityRemaining} NFTs</span>{" "}
          available to sell on this order for a unit price of{" "}
          <Price size="default" amount={offer.totalUnitPrice} /> (fees included)
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
        isErc1155={isErc1155}
        unitPrice={BigInt(offer.totalUnitPrice)}
      />
      {isPending ? (
        <ButtonLoading />
      ) : (
        <Button onClick={onConfirm}>Confirm</Button>
      )}
    </div>
  )
}
