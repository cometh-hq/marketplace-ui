"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "../../components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { useWrapToken } from "@/services/exchange/wrap-token"
import { useUnwrapToken } from "@/services/exchange/unwrap-token"
import { manifest } from "@/manifests"
import { SwitchNetwork } from "../asset-actions/buttons/switch-network"
import { useCorrectNetwork } from "@/lib/web3/network"
import { ButtonLoading } from "../button-loading"
import { parseUnits } from "ethers/lib/utils"
import { useEffect } from "react"
import { useFormatWrappedBalance } from "@/services/balance/wrapped"
import { useFormatMainBalance } from "@/services/balance/main"
import { z } from "zod"
import { ArrowDownUp } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  useFieldProps?: boolean,
}

export function WrapDialogForm({ onClose, isUnwrap = false, onToggleMode }: WrapDialogFormProps) {
  const { isChainSupported } = useCorrectNetwork()
  const wrapToken = useWrapToken()
  const unwrapToken = useUnwrapToken()
  const balance = useFormatMainBalance()
  const wBalance = useFormatWrappedBalance()

  const tokenAction = isUnwrap ? unwrapToken : wrapToken
  const maxBalance = isUnwrap ? wBalance : balance
  
  useEffect(() => {
    if (tokenAction.isSuccess)
      onClose()
  }, [tokenAction.isSuccess, onClose])


  const WrapFormSchema = z.object({
    amount: z.string().refine(
      (value) => parseFloat(value) <= parseFloat(maxBalance), 
      { message: `The amount exceeds your ${isUnwrap ? "wrapped" : "main"} balance` }
    ),
  })
  
  const form = useForm({
    resolver: zodResolver(WrapFormSchema),
    defaultValues: { amount: "" },
  });

  const receivedAmount = form.watch('amount')

  const handleSubmitForm = async (values: {
    amount: string
  }) => {
    const parsedAmount = parseUnits(values.amount, 18);
    tokenAction.mutate({ amount: parsedAmount })
  };

  const renderTokenName = (isMain = true) => {
    return isMain 
      ? (isUnwrap ? manifest.currency.wrapped.name : manifest.currency.main.name)
      : (isUnwrap ? manifest.currency.main.name : manifest.currency.wrapped.name)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
        <TokenInputField
          label={`Amount of ${renderTokenName()} to convert`}
          placeholder="Enter a amount"
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
          label={`You receive ${renderTokenName(false)}`}
          value={receivedAmount}
          disabled={true}
          tokenName={renderTokenName(false)}
          name="receivedAmount"
        />
        <SwitchNetwork>
          {tokenAction.isLoading ? (
            <ButtonLoading size="lg" className="w-full" />
          ) : (
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!isChainSupported}
            >
              Convert
            </Button>
          )}
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
  );
}

const TokenInputField = ({
  label,
  placeholder,
  value,
  disabled,
  tokenName,
  name
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
            <span className="font-semibold text-sm absolute top-1/2 right-4 -translate-y-1/2">
              {tokenName}
            </span>
          </span>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)
