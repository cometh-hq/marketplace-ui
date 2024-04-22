import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils"
import { parseEther } from "viem"

import globalConfig from "@/config/globalConfig"
import { useMakeBuyOfferAssetButton } from "@/lib/web3/flows/makeBuyOffer"
import { useCorrectNetwork } from "@/lib/web3/network"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Label } from "@/components/ui/Label"
import { Price } from "@/components/ui/Price"
import { PriceDetails } from "@/components/ui/PriceDetails"
import { PriceInput } from "@/components/ui/PriceInput"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { ButtonLoading } from "@/components/ButtonLoading"
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"
import TokenQuantityInput from "@/components/erc1155/TokenQuantityInput"
import { AssetHeaderImage } from "@/components/marketplace/asset/AssetHeaderImage"
import AssetFloorPriceLine from "@/components/marketplace/asset/floorPrice/AssetFloorPriceLine"
import { TransactionDialogButton } from "@/components/TransactionDialogButton"
import { Case, Switch } from "@/components/utils/Switch"

import { AddGasStep } from "../transaction-steps/AddGasStep"
import { AllowanceStep } from "../transaction-steps/AllowanceStep"
import { ConfirmMakeBuyOfferStep } from "../transaction-steps/ConfirmMakeBuyOfferStep"
import { FundsStep } from "../transaction-steps/FundsStep"
import { WrapStep } from "../transaction-steps/WrapStep"
<<<<<<< HEAD
=======
import { OrderExpirySelect } from "./OrderExpirySelect"
>>>>>>> 4ce83fac072dcfa9c4c10d0363e1165eb8cae9c0

export type MakeBuyOfferProps = {
  asset: AssetWithTradeData | SearchAssetWithTradeData
} & React.ComponentProps<typeof Button>

type MakeBuyOfferPriceDialogProps = {
  submitCallback: (price: BigNumber, validity: string, quantity: BigInt) => void
  asset: AssetWithTradeData | SearchAssetWithTradeData
} & React.ComponentProps<typeof Button>

const DEFAULT_VALIDITY = "3"

export function MakeBuyOfferPriceDialog({
  submitCallback,
  asset,
  size = "lg",
}: MakeBuyOfferPriceDialogProps) {
<<<<<<< HEAD
  const [unitPrice, setUnitPrice] = useState("")
  const [validity, setValidity] = useState("1")
  const [quantity, setQuantity] = useState(BigInt(1))
  const isErc1155 = useAssetIs1155(asset)

  const parsedUnitPrice = useMemo(
    () =>
      unitPrice
        ? parseUnits(unitPrice, globalConfig.ordersErc20.decimals)
        : BigNumber.from(0),
    [unitPrice]
  )
  const totalPrice = useMemo(
    () => parsedUnitPrice.mul(quantity),
    [parsedUnitPrice, quantity]
  )
=======
  const [price, setPrice] = useState("")
  const [validity, setValidity] = useState(DEFAULT_VALIDITY)
>>>>>>> 4ce83fac072dcfa9c4c10d0363e1165eb8cae9c0
  const orderParams = useMemo(() => {
    try {
      return { price: totalPrice, validity, quantity: quantity }
    } catch (e) {
      return null
    }
  }, [totalPrice, validity, quantity])

  const { isChainSupported } = useCorrectNetwork()

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button size={size} disabled={!isChainSupported}>
          Make an offer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buy Offer</DialogTitle>
        </DialogHeader>

        <div className="flex w-full flex-col items-center justify-center">
          <AssetHeaderImage asset={asset} />
          <div>
            <h1 className="mt-2 text-2xl font-bold">{asset.metadata.name}</h1>
          </div>
        </div>

        <AssetFloorPriceLine asset={asset} />

        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-col gap-3 md:w-2/3">
            <Label htmlFor="make-buy-offer-price">
              {isErc1155 ? "Unit offer" : "Offer"} price in{" "}
              {globalConfig.ordersDisplayCurrency.symbol} *
            </Label>
            <PriceInput
              id="make-buy-offer-price"
              onInputUpdate={(inputValue) => setUnitPrice(inputValue)}
            />
          </div>
          <div className="flex flex-col gap-3 md:w-1/3">
            <OrderExpirySelect
              setValidity={setValidity}
              defaultValidity={DEFAULT_VALIDITY}
            />
          </div>
        </div>

        {isErc1155 && (
          <>
            <TokenQuantityInput
              max={BigInt(asset.supply)}
              label="Token purchase quantity*"
              onChange={setQuantity}
              initialQuantity={BigInt(1)}
            />
            <PriceDetails
              quantity={quantity}
              unitPrice={parseEther(unitPrice)}
              isErc1155={isErc1155}
            />
          </>
        )}

        <Button
          size="lg"
          disabled={!totalPrice || totalPrice.isZero()}
          onClick={() =>
            submitCallback(
              orderParams!.price,
              orderParams!.validity,
              orderParams!.quantity
            )
          }
        >
          Make offer for {isErc1155 && <>{quantity.toString()} tokens</>} at the
          price of&nbsp;
          <Price amount={totalPrice.toString()} />
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export function MakeBuyOfferButton({ asset, size }: MakeBuyOfferProps) {
  const [open, setOpen] = useState(false)
  const {
    isLoading,
    requiredSteps,
    currentStep,
    nextStep,
    reset,
    price,
    setPrice,
    quantity,
    setQuantity,
    validity,
    setValidity,
  } = useMakeBuyOfferAssetButton({ asset })

  useEffect(() => {
    if (price && validity) {
      setOpen(true)
    }
  }, [price, validity])

  const closeDialog = useCallback(() => {
    setOpen(false)
    setPrice(null)
    setQuantity(BigInt(1))
  }, [setOpen, setPrice, setQuantity])

  const onClose = useCallback(() => {
    setPrice(null)
    setValidity(null)
    setQuantity(BigInt(1))
    reset()
  }, [setPrice, setValidity, setQuantity, reset])

  if (!price) {
    return (
      <MakeBuyOfferPriceDialog
        size={size}
        asset={asset}
        submitCallback={(newPrice, newValidity, newQuantity) => {
          setPrice(newPrice)
          setValidity(newValidity)
          setQuantity(newQuantity)
        }}
      />
    )
  }

  if (isLoading) {
    return <ButtonLoading size={size} />
  }

  if (!requiredSteps?.length || !currentStep) return null

  return (
    <TransactionDialogButton
      open={open}
      onOpenChange={setOpen}
      label="Make an offer"
      currentStep={currentStep}
      steps={requiredSteps}
      onClose={onClose}
      size={size}
      isLoading={isLoading}
    >
      <Switch value={currentStep.value}>
        <Case value="add-gas">
          <AddGasStep onValid={nextStep} />
        </Case>
        <Case value="add-funds">
          <FundsStep price={price} onValid={nextStep} />
        </Case>
        <Case value="wrap">
          <WrapStep price={price} onValid={nextStep} />
        </Case>
        <Case value="allowance">
          <AllowanceStep price={price} onValid={nextStep} />
        </Case>
        <Case value="confirm-buy-offer">
          <ConfirmMakeBuyOfferStep
            asset={asset}
            price={price}
            quantity={quantity}
            validity={validity ?? "1"}
            onValid={closeDialog}
          />
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
