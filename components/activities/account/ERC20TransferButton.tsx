"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Address, erc20Abi, parseUnits } from "viem"
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import { z } from "zod"

import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { toast } from "@/components/ui/toast/hooks/useToast"

const addressSchema = z
  .string()
  .length(42, "Address must be 42 characters long.")
  .regex(
    /^0x[a-fA-F0-9]{40}$/,
    "Invalid address. Must be a valid Ethereum address."
  )
const amountSchema = z
  .number()
  .min(0.0000000000001, "Amount must be greater than zero.")

type ERC20TransferButtonProps = {
  tokenAddress?: string // Optional. If not provided, assume native token transfer.
  tokenSymbol: string
  decimalNumber?: number // Optional. Default to 18 if not provided or if native token transfer.
} & React.ComponentProps<typeof Button>

const ERC20TransferButton = ({
  tokenAddress,
  tokenSymbol,
  decimalNumber = 18, // Default to 18 decimals if not specified
  ...buttonProps
}: ERC20TransferButtonProps) => {
  const [receiverAddress, setReceiverAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [isPristine, setIsPristine] = useState(true)
  const {
    data: txHash,
    sendTransaction,
    isPending: isPendingSendTransaction,
    isSuccess: isSuccessSendTransaction,
  } = useSendTransaction()
  const { data: hash, writeContract, error, isPending } = useWriteContract()
  const [open, setOpen] = useState(false)

  const account = useAccount()
  const viewerAddress = account.address

  const receiverAddressValidation = useMemo(
    () => addressSchema.safeParse(receiverAddress),
    [receiverAddress]
  )
  const amountValidation = useMemo(
    () => amountSchema.safeParse(parseFloat(amount)),
    [amount]
  )

  const onReceiverAddressChange = useCallback((newAddress: string) => {
    setReceiverAddress(newAddress)
    setIsPristine(false)
  }, [])

  const onAmountChange = useCallback((newAmount: string) => {
    setAmount(newAmount)
    setIsPristine(false)
  }, [])

  const transferTokens = useCallback(() => {
    if (!viewerAddress) return

    if (tokenAddress) {
      // ERC20 token transfer
      writeContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "transfer",
        args: [receiverAddress as Address, parseUnits(amount, decimalNumber)],
      })
    } else {
      // Native token transfer
      sendTransaction({
        to: receiverAddress as Address,
        value: parseUnits(amount, decimalNumber),
      })
    }
  }, [
    viewerAddress,
    tokenAddress,
    receiverAddress,
    amount,
    writeContract,
    sendTransaction,
    decimalNumber,
  ])

  const { data: tx, isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: hash || txHash })
  console.log("tx", tx)

  useEffect(() => {
    if (
      (tokenAddress && isConfirmed) ||
      (!tokenAddress && isSuccessSendTransaction)
    ) {
      toast({
        title: "Transfer confirmed",
      })
      setOpen(false)
    }
  }, [tokenAddress, isConfirmed, isSuccessSendTransaction, setOpen])

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps}>
          {tokenAddress
            ? "Send Tokens " + tokenSymbol
            : "Send Native Tokens " + tokenSymbol}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tokenAddress
              ? "Token Transfer " + tokenSymbol
              : "Native Token Transfer" + tokenSymbol}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {tokenAddress && (
            <div className="mb-3">
              ERC20 Token Address:{" "}
              <span className="font-bold">{tokenAddress}</span>
            </div>
          )}
          <Label htmlFor="receiver-address">Receiver Address:</Label>
          <Input
            id="receiver-address"
            placeholder="0x123..."
            inputUpdateCallback={onReceiverAddressChange}
          />
          {!isPristine && !receiverAddressValidation.success && (
            <div className="mt-1 text-sm text-red-500">
              {receiverAddressValidation.error.issues[0].message}
            </div>
          )}
        </div>
        <div className="mt-4">
          <Label htmlFor="amount">Amount:</Label>
          <Input
            id="amount"
            placeholder="Amount"
            inputUpdateCallback={onAmountChange}
          />
          {!isPristine && !amountValidation.success && (
            <div className="mt-1 text-sm text-red-500">
              {amountValidation.error.issues[0].message}
            </div>
          )}
        </div>
        <div className="mt-4">
          <strong>
            Make sure to enter a valid address for this network. You will
            permanently loose ownership of your tokens once the transfer is
            validated.
          </strong>
        </div>
        <Button
          size="lg"
          disabled={
            !receiverAddressValidation.success ||
            !amountValidation.success ||
            isConfirming ||
            isPending ||
            isPendingSendTransaction
          }
          isLoading={isConfirming || isPending}
          onClick={transferTokens}
        >
          {isConfirming || isPending || isPendingSendTransaction
            ? "Processing..."
            : tokenAddress
              ? "Transfer Tokens"
              : "Send Native Tokens"}
        </Button>
        <div className="mt-2">{error && <div>Error: {error.message}</div>}</div>
      </DialogContent>
    </Dialog>
  )
}

export default ERC20TransferButton
