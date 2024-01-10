"use client"

import { useEffect } from "react"
import { useFormatMainBalance } from "@/services/balance/main"
import { useFormatWrappedBalance } from "@/services/balance/wrapped"
import { useUnwrapToken } from "@/services/exchange/unwrap-token"
import { useWrapToken } from "@/services/exchange/wrap-token"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseUnits } from "ethers/lib/utils"
import { ArrowDownUp } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import globalConfig from "@/config/globalConfig"
import { useCorrectNetwork } from "@/lib/web3/network"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { SwitchNetwork } from "../asset-actions/buttons/switch-network"

export type WrapDialogFormProps = {
  onClose: () => void
  isUnwrap?: boolean
  onToggleMode?: () => void
}

type TokenInputFieldProps = {
  label: string
  placeholder?: string
  value?: string
  disabled?: boolean
  tokenName: string
  useFieldProps?: boolean
}

export function WrapDialogForm({
  onClose,
  isUnwrap = false,
  onToggleMode,
}: WrapDialogFormProps) {
  const { isChainSupported } = useCorrectNetwork()
  const wrapToken = useWrapToken()
  const unwrapToken = useUnwrapToken()
  const balance = useFormatMainBalance()
  const wBalance = useFormatWrappedBalance()

  const tokenAction = isUnwrap ? unwrapToken : wrapToken
  const maxBalance = isUnwrap ? wBalance : balance

  useEffect(() => {
    if (tokenAction.isSuccess) onClose()
  }, [tokenAction, onClose])

  const schema = z.object({
    amount: z
      .string()
      .refine((value) => parseFloat(value) <= parseFloat(maxBalance), {
        message: `The amount exceeds your ${
          isUnwrap ? "wrapped" : "main"
        } balance`,
      }),
  })

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { amount: "" },
  })

  const receivedAmount = form.watch("amount")

  const handleSubmitForm = async (values: { amount: string }) => {
    const parsedAmount = parseUnits(values.amount, 18)
    tokenAction.mutate({ amount: parsedAmount })
  }

  const renderTokenName = (isMain = true) => {
    return isMain
      ? isUnwrap
        ? globalConfig.network.wrappedNativeToken.name
        : globalConfig.network.nativeToken.name
      : isUnwrap
      ? globalConfig.network.nativeToken.name
      : globalConfig.network.wrappedNativeToken.name
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="space-y-6"
      >
        <TokenInputField
          label={`You send some ${renderTokenName()} to convert (max: ${maxBalance})`}
          placeholder="Enter an amount"
          tokenName={renderTokenName()}
          name="amount"
        />

        <div className="flex flex-col items-center">
          <TooltipProvider delayDuration={200}>
            <Tooltip defaultOpen={false}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onToggleMode}
                >
                  <ArrowDownUp size="16" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-semibold">
                  Switch to {isUnwrap ? "Wrap" : "Unwrap"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <TokenInputField
          label={`You receive some ${renderTokenName(false)}`}
          value={receivedAmount}
          disabled={true}
          tokenName={renderTokenName(false)}
          name="receivedAmount"
        />
        <SwitchNetwork>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!isChainSupported || tokenAction.isLoading}
            isLoading={tokenAction.isLoading}
          >
            Convert
          </Button>
        </SwitchNetwork>
      </form>
      <Button
        size="lg"
        variant="ghost"
        className="w-full"
        onClick={() => onClose()}
      >
        Cancel
      </Button>
    </Form>
  )
}

const TokenInputField = ({
  label,
  placeholder,
  value,
  disabled,
  tokenName,
  name,
}: TokenInputFieldProps & { name: string }) => (
  <FormField
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <span className="relative block">
            <Input
              type="number"
              placeholder={placeholder}
              className="pr-20"
              {...field}
              value={value || field.value}
              disabled={disabled}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold">
              {tokenName}
            </span>
          </span>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)
