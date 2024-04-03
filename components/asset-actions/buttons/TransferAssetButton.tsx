"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { useQueryClient } from "@tanstack/react-query"
import { SendHorizonal } from "lucide-react"
import { Address, erc721Abi } from "viem"
import {
  BaseError,
  useAccount,
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
import { AssetHeaderImage } from "@/components/marketplace/asset/AssetHeaderImage"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/Tooltip"

type Inputs = {
  example: string
  exampleRequired: string
}

type TransferAssetButtonProps = {
  asset: SearchAssetWithTradeData | AssetWithTradeData
} & React.ComponentProps<typeof Button>

const addressSchema = z
  .string()
  .length(42, "Address must be 42 characters long.")
  .regex(
    /^0x[a-fA-F0-9]{40}$/,
    "Invalid address. Must be a valid Ethereum address."
  )

export function TransferAssetButton({
  asset,
  ...buttonProps
}: TransferAssetButtonProps) {
  const [receiverAddress, setReceiverAddress] = useState("")
  const [isPristine, setIsPristine] = useState(true)
  const { data: hash, writeContract, error, isPending } = useWriteContract()
  const [open, setOpen] = useState(false)
  const client = useQueryClient()

  const account = useAccount()
  const viewerAddress = account.address

  const receiverAddressValidation = useMemo(() => {
    const urlParseRes = addressSchema.safeParse(receiverAddress)
    return urlParseRes
  }, [receiverAddress])

  const onReceiverAddressChange = useCallback((newAddress: string) => {
    setReceiverAddress(newAddress)
    setIsPristine(false)
  }, [])

  const transferAsset = useCallback(() => {
    if (!viewerAddress) return
    writeContract({
      address: asset.contractAddress as Address,
      abi: erc721Abi,
      functionName: "safeTransferFrom",
      args: [
        asset.owner as Address,
        receiverAddress as Address,
        BigInt(asset.tokenId),
      ],
    })
  }, [
    viewerAddress,
    asset.contractAddress,
    asset.owner,
    receiverAddress,
    asset.tokenId,
    writeContract,
  ])

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Transfer confirmed",
      })
      setOpen(false)
      client.invalidateQueries({
        queryKey: ["cometh", "assets", asset.tokenId],
      })
    }
  }, [isConfirmed, asset.tokenId, client, setOpen])

  const isViewerNotOwner = useMemo(() => {
    return (
      !asset.owner ||
      !viewerAddress ||
      asset.owner.toLowerCase() !== viewerAddress.toLowerCase()
    )
  }, [asset.owner, viewerAddress])

  if (isViewerNotOwner) return null

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <TooltipProvider delayDuration={200}>
          <Tooltip defaultOpen={false}>
            <TooltipTrigger asChild>
              <Button {...buttonProps}>
                <SendHorizonal size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm font-bold">Transfer asset</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asset transfer</DialogTitle>
        </DialogHeader>
        <div className="flex w-full items-center justify-center">
          <AssetHeaderImage asset={asset} />
        </div>
        <div className="mt-4">
          <Label htmlFor="transfer-address">Transfer asset to address:</Label>
          <Input
            id="transfer-address"
            placeholder="0x1a..."
            inputUpdateCallback={onReceiverAddressChange}
          />
          {!isPristine && !receiverAddressValidation.success && (
            <div className="mt-1 text-sm text-red-500">
              {receiverAddressValidation.error.issues[0].message}
            </div>
          )}
        </div>
        <div className="mt-4">
          <strong>
            Make sure to enter a valid address for this network. You will
            permanently loose ownership of your asset once the transfer is
            validated.
          </strong>
        </div>
        <Button
          size="lg"
          disabled={
            !receiverAddressValidation.success || isConfirming || isPending
          }
          isLoading={isConfirming || isPending}
          onClick={transferAsset}
        >
          {isConfirming || isPending
            ? "Transferring asset..."
            : "Transfer asset"}
        </Button>
        <div className="mt-2">
          {isConfirmed && <div>Transaction confirmed.</div>}
          {error && (
            <div>
              Error: {(error as BaseError).shortMessage || error.message}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
