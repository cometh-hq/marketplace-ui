import { useEffect, useMemo, useState } from "react"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils"

import globalConfig from "@/config/globalConfig"
import { cn } from "@/lib/utils/utils"
import { useMakeBuyOfferAssetButton } from "@/lib/web3/flows/make-buy-offer"
import { useCorrectNetwork } from "@/lib/web3/network"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Price } from "@/components/ui/price"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ButtonLoading } from "@/components/button-loading"
import { TransactionDialogButton } from "@/components/dialog-button"
import { AssetHeaderImage } from "@/components/marketplace/asset/image"
import { Case, Switch } from "@/components/utils/Switch"

import { AddGasStep } from "../transaction-steps/add-gas"
import { AllowanceStep } from "../transaction-steps/allowance"
import { ConfirmMakeBuyOfferStep } from "../transaction-steps/confirm-make-buy-offer"
import { FundsStep } from "../transaction-steps/funds"
import { WrapStep } from "../transaction-steps/wrap"

export type MakeBuyOfferProps = {
  asset: AssetWithTradeData
  isVariantLink?: boolean
  variant?: string
}

export function MakeBuyOfferPriceDialog({
  onSubmit,
  asset,
  isVariantLink,
  variant,
}: {
  onSubmit: (price: BigNumber, validity: string) => void
  asset: AssetWithTradeData
  isVariantLink?: boolean
  variant?: string
}) {
  const [price, setPrice] = useState("")
  const [validity, setValidity] = useState("1")
  const orderParams = useMemo(() => {
    try {
      const parsedPrice = parseUnits(price, globalConfig.ordersErc20.decimals)
      return { price: parsedPrice, validity }
    } catch (e) {
      return null
    }
  }, [price, validity])

  const { isChainSupported } = useCorrectNetwork()

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button
          size={isVariantLink ? "default" : "lg"}
          // variant={isVariantLink ? "link" : (variant as any) || "default"}
          // className={cn(isVariantLink ? "h-auto px-0" : "")}
          disabled={!isChainSupported}
        >
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

        <div className="mt-4 flex flex-col gap-4 md:flex-row">
          <div className="flex flex-col gap-3 md:w-2/3">
            <Label htmlFor="make-buy-offer-price">
              Offer price in {globalConfig.ordersDisplayCurrency.symbol} *
            </Label>
            <Input
              id="make-buy-offer-price"
              type="number"
              onInputUpdate={(inputValue) => setPrice(inputValue)}
              min={0}
            />
          </div>
          <div className="flex w-full flex-col gap-3 md:w-1/3">
            <Label htmlFor="make-buy-offer-price">Validity time</Label>
            <Select defaultValue="3" onValueChange={(v) => setValidity(v)}>
              <SelectTrigger className="md:w-[180px]">
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
        <Button
          size="lg"
          disabled={!orderParams || !orderParams.price}
          onClick={() => onSubmit(orderParams!.price, orderParams!.validity)}
        >
          Make offer for&nbsp;
          <Price amount={orderParams?.price} />
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export function MakeBuyOfferButton({
  asset,
  isVariantLink,
  variant,
}: MakeBuyOfferProps) {
  const [open, setOpen] = useState(false)
  const {
    isLoading,
    requiredSteps,
    currentStep,
    nextStep,
    reset,
    price,
    setPrice,
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
        isVariantLink={isVariantLink}
        asset={asset}
        onSubmit={(newPrice, newValidity) => {
          setPrice(newPrice), setValidity(newValidity)
        }}
        variant={variant}
      />
    )
  }

  if (isLoading) {
    return (
      <ButtonLoading
        size={isVariantLink ? "default" : "lg"}
        variant={isVariantLink ? "link" : "default"}
        className={cn(isVariantLink && "h-auto p-0")}
      />
    )
  }

  if (!requiredSteps?.length || !currentStep) return null

  const onClose = () => {
    reset()
    setOpen(false)
    setPrice(null)
    setValidity(null)
  }

  return (
    <TransactionDialogButton
      open={open}
      label="Make an offer"
      currentStep={currentStep}
      steps={requiredSteps}
      onClose={onClose}
      isVariantLink={isVariantLink}
      isLoading={isLoading}
      isDisabled={isLoading}
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
            validity={validity ?? "1"}
            onValid={onClose}
          />
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
