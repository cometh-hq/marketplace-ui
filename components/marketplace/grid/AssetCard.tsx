"use client"

import { useMemo } from "react"
import Link from "next/link"
import {
  AssetAttribute,
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { animated, config, useSpring } from "react-spring"
import { useBoolean } from "usehooks-ts"
import { useAccount } from "wagmi"

import { getRandomArrayElement } from "@/lib/utils/arrays"
import { getAssetColor } from "@/lib/utils/colorsAttributes"
import { shortenTokenId } from "@/lib/utils/formatToken"
import { cn } from "@/lib/utils/utils"
import { Appear } from "@/components/ui/Appear"
import { AssetImage } from "@/components/ui/AssetImage"
import { Card } from "@/components/ui/Card"
import { Price } from "@/components/ui/Price"
import { BuyAssetButton } from "@/components/asset-actions/buttons/BuyAssetButton"
import { MakeBuyOfferButton } from "@/components/asset-actions/buttons/MakeBuyOfferPriceDialog"
import { SellAssetButton } from "@/components/asset-actions/buttons/SellAssetButton"
import { SwitchNetwork } from "@/components/asset-actions/buttons/SwitchNetwork"
import { ConnectButton } from "@/components/ConnectButton"

export type AssetCardProps = {
  asset: SearchAssetWithTradeData & {
    metadata: {
      attributes?: AssetAttribute[]
    }
  }
  children?: React.ReactNode | React.ReactNode[]
}

export type AssetCardBaseProps = {
  src?: string | null
  isOwnerAsset: boolean
  children?: React.ReactNode | React.ReactNode[]
  fallback?: string | null
  asset: SearchAssetWithTradeData
}

export type AssetImageContainerProps = {
  children?: React.ReactNode | React.ReactNode[]
  color?: string | null
  className?: string
  isHovered?: boolean
}

export function AssetImageContainer({
  children,
  color,
  className,
  isHovered,
}: AssetImageContainerProps) {
  const style = useSpring({
    to: {
      transform: isHovered ? `scale(${1.05})` : `scale(${1})`,
    },
    config: config.gentle,
  })

  return (
    <div className="overflow-hidden ">
      <animated.div className="z-10" style={style}>
        <div
          className={cn(
            "relative size-auto overflow-hidden  px-2 py-5  sm:h-[380px] sm:w-full sm:px-4 sm:py-10",
            !color && "bg-muted",
            className
          )}
        >
          {children}
        </div>
      </animated.div>
    </div>
  )
}

export function AssetCardBase({
  src,
  fallback,
  children,
  isOwnerAsset,
  asset,
}: AssetCardBaseProps) {
  const isHovered = useBoolean(false)
  return (
    <Appear
      enabled={false}
      condition={true}
      delay={getRandomArrayElement([0, 25, 50, 75, 100])}
      className="border-muted relative w-full justify-self-center rounded-lg"
    >
      <Card
        onMouseEnter={isHovered.setTrue}
        onMouseLeave={isHovered.setFalse}
        className={cn(
          " flex w-full flex-1 flex-row items-center bg-transparent p-0 shadow-none transition-all duration-200 ease-in-out sm:inline-flex sm:flex-col sm:items-start sm:border-2"
        )}
      >
        <div className="relative w-1/3 sm:w-full">
          <AssetImageContainer
            color={getAssetColor(asset)}
            className={cn(isOwnerAsset && "bg-[#f4f2e8]")}
            isHovered={isHovered.value}
          >
            <AssetImage
              src={src}
              fallback={fallback}
              imageData={asset.metadata.image_data}
              height={380}
              width={320}
              className="z-20 size-full  object-contain"
            />
          </AssetImageContainer>
          {isHovered.value && (
            <Link
              href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}
              className={cn(
                "text-primary flex flex-nowrap items-center text-sm font-semibold leading-tight"
              )}
            >
              <div className="absolute bottom-0 left-0 size-full bg-black/5"></div>
            </Link>
          )}
          {isHovered.value && (
            <div className="absolute bottom-4 left-[50%] translate-x-[-50%]">
              {renderAssetActions(asset, isOwnerAsset)}
            </div>
          )}
        </div>

        <div className="w-2/3 sm:w-full ">
          <Link
            href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}
            className={cn(
              "text-primary flex flex-nowrap items-center text-sm font-semibold leading-tight "
            )}
          >
            <div className="w-full">{children}</div>
          </Link>
        </div>
      </Card>
    </Appear>
  )
}

function renderAssetActions(
  asset: SearchAssetWithTradeData & {
    metadata: {
      attributes?: AssetAttribute[]
    }
  },
  isOwnerAsset: boolean
) {
  if (asset.orderbookStats.lowestListingPrice && !isOwnerAsset) {
    return (
      <SwitchNetwork>
        <BuyAssetButton asset={asset} />
      </SwitchNetwork>
    )
  } else if (!isOwnerAsset) {
    return (
      <SwitchNetwork>
        <MakeBuyOfferButton asset={asset as unknown as AssetWithTradeData} />
      </SwitchNetwork>
    )
  } else if (!asset.orderbookStats.lowestListingPrice) {
    return (
      <SwitchNetwork>
        <SellAssetButton asset={asset as unknown as AssetWithTradeData} />
      </SwitchNetwork>
    )
  }
}

export function AssetCard({ asset, children }: AssetCardProps) {
  const account = useAccount()
  const viewerAddress = account.address

  const isOwnerAsset = useMemo(() => {
    return asset.owner === viewerAddress?.toLowerCase()
  }, [viewerAddress, asset.owner])

  return (
    <AssetCardBase
      src={asset.cachedImageUrl}
      fallback={asset.metadata.image}
      isOwnerAsset={isOwnerAsset}
      asset={asset}
    >
      <div className="p-3">
        <span className="inline-block max-w-[100%_-_80px] truncate text-base">
          {asset.metadata.name ? asset.metadata.name : "Unknown NFT"}
        </span>
        {/* <div className="mb-2">#{shortenTokenId(asset.tokenId, 5)}</div> */}

        <div className="w-full rounded-lg ">
          <div className="flex flex-col items-start justify-between gap-1 sm:flex-row sm:items-center">
            <div>
              <div className="text-sm font-medium">Price</div>
              {asset.orderbookStats.lowestListingPrice ? (
                <Price
                  size="sm"
                  amount={asset.orderbookStats.lowestListingPrice}
                  shouldDisplayFiatPrice={true}
                  fiatPriceNewLine={true}
                />
              ) : (
                "Not for sale"
              )}
            </div>
            <div>
              {asset.orderbookStats.highestOfferPrice && (
                <>
                  <div className="text-sm font-medium">Best offer</div>
                  <Price
                    size="sm"
                    amount={asset.orderbookStats.highestOfferPrice}
                    shouldDisplayFiatPrice={true}
                    fiatPriceNewLine={true}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        {children}
      </div>
    </AssetCardBase>
  )
}
