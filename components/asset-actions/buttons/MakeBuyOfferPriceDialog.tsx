import { useEffect, useMemo, useState } from "react"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils"

import globalConfig from "@/config/globalConfig"
import { cn } from "@/lib/utils/utils"
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

export type MakeBuyOfferProps = {
  asset: AssetWithTradeData | SearchAssetWithTradeData
} & React.ComponentProps<typeof Button>

type MakeBuyOfferPriceDialogProps = {
  submitCallback: (price: BigNumber, validity: string, quantity: BigInt) => void
  asset: AssetWithTradeData | SearchAssetWithTradeData
} & React.ComponentProps<typeof Button>

export function MakeBuyOfferPriceDialog({
  submitCallback,
  asset,
  size = "lg",
}: MakeBuyOfferPriceDialogProps) {
  const [price, setPrice] = useState("")
  const [validity, setValidity] = useState("1")
  const [quantity, setQuantity] = useState(BigInt(1))
  const isErc1155 = useAssetIs1155(asset)

  const orderParams = useMemo(() => {
    try {
      const parsedPrice = parseUnits(price, globalConfig.ordersErc20.decimals)
      return { price: parsedPrice, validity, quantity: quantity }
    } catch (e) {
      return null
    }
  }, [price, validity, quantity])

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

        <div className="flex w-full items-center justify-center">
          <AssetHeaderImage asset={asset} />
        </div>
        <AssetFloorPriceLine asset={asset} />

        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-col gap-3 md:w-2/3">
            <Label htmlFor="make-buy-offer-price">
              Offer price in {globalConfig.ordersDisplayCurrency.symbol} *
            </Label>
            <PriceInput
              id="make-buy-offer-price"
              onInputUpdate={(inputValue) => setPrice(inputValue)}
            />
          </div>
          <div className="flex flex-col gap-3 md:w-1/3">
            <Label htmlFor="make-buy-offer-price">Validity time</Label>
            <Select defaultValue="3" onValueChange={(v) => setValidity(v)}>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">24h</SelectItem>
                <SelectItem value="2">48h</SelectItem>
                <SelectItem value="3">72h</SelectItem>
                <SelectItem value="10">10 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isErc1155 && (
          <TokenQuantityInput
            max={BigInt(asset.supply)}
            label="Token purchase quantity*"
            onChange={setQuantity}
            initialQuantity={BigInt(1)}
          />
        )}

        <Button
          size="lg"
          disabled={!orderParams || !orderParams.price}
          onClick={() =>
            submitCallback(orderParams!.price, orderParams!.validity, orderParams!.quantity)
          }
        >
          Make offer for {isErc1155 && <>{quantity.toString()} tokens</>} at the
          price of&nbsp;
          <Price amount={orderParams?.price} />
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

  const closeDialog = () => {
    setOpen(false)
    setPrice(null)
  }

  const onClose = () => {
    setPrice(null)
    setValidity(null)
    reset()
  }

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
