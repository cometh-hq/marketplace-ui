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

import { getRandomArrayElement } from "@/lib/utils/arrays"
import { getAssetColor } from "@/lib/utils/colors-attributes"
import { shortenTokenId } from "@/lib/utils/token"
import { cn } from "@/lib/utils/utils"
import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { Appear } from "@/components/ui/appear"
import { AssetImage } from "@/components/ui/asset-image"
import { Card } from "@/components/ui/card"
import { BuyAssetButton } from "@/components/asset-actions/buttons/buy"
import { MakeBuyOfferButton } from "@/components/asset-actions/buttons/make-buy-offer"
import { SellAssetButton } from "@/components/asset-actions/buttons/sell"
import { SwitchNetwork } from "@/components/asset-actions/buttons/switch-network"
import { ConnectButton } from "@/components/connect-button"

import { Price } from "../../ui/price"

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
  owner?: boolean
  children?: React.ReactNode | React.ReactNode[]
  fallback?: string | null
  asset: SearchAssetWithTradeData
}

export type AssetImageContainerProps = {
  children?: React.ReactNode | React.ReactNode[]
  color?: string | null
  className?: string
}

export function AssetImageContainer({
  children,
  color,
  className,
}: AssetImageContainerProps) {
  const active = useBoolean(false)
  const hover = useBoolean(false)

  const style = useSpring({
    to: {
      transform: hover.value
        ? `rotateX(2deg) rotateY(0deg) rotateZ(0deg) translateY(-8px) scale(${
            active.value ? 1 : 1.01
          })`
        : "rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateY(0px) scale(1)",
    },
    config: config.gentle,
  })

  return (
    <animated.div
      className="z-10"
      onMouseEnter={hover.setTrue}
      onMouseLeave={hover.setFalse}
      onMouseDown={active.setTrue}
      onMouseUp={active.setFalse}
      style={style}
    >
      <div
        className={cn(
          "relative h-auto w-[84px] overflow-hidden rounded-md max-sm:rounded-md sm:h-[380px] sm:w-full",
          // !color && "bg-[rgba(255,255,255,0.01)]",
          className
        )}
      >
        {children}
      </div>
    </animated.div>
  )
}

export function AssetCardBase({
  src,
  fallback,
  children,
  owner,
  asset,
}: AssetCardBaseProps) {
  return (
    <Appear
      enabled={false}
      condition={true}
      delay={getRandomArrayElement([0, 25, 50, 75, 100])}
      className="relative w-full justify-self-center"
    >
      <Card
        className={cn(
          "card-ghost flex w-full flex-1 flex-row items-center border-transparent p-0 shadow-none transition-all duration-200 ease-in-out sm:inline-flex sm:flex-col sm:items-start sm:border-2",
          owner && "bg-[#f4f2e8]/[.02]"
        )}
      >
        <Link href={`/marketplace/${asset.tokenId}`} className="sm:w-full">
          <AssetImageContainer color={getAssetColor(asset)}>
            <AssetImage
              src={src}
              fallback={fallback}
              imageData={asset.metadata.image_data}
              height={380}
              width={320}
              className="z-20 size-full rounded-lg object-contain"
            />
          </AssetImageContainer>
        </Link>
        <div className="w-full p-5">{children}</div>
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
  owner: boolean
) {
  if (asset.orderbookStats.lowestListingPrice && !owner) {
    return (
      <ConnectButton isLinkVariant customText="Login to buy">
        <SwitchNetwork>
          <BuyAssetButton isSmall asset={asset} isLinkVariant />
        </SwitchNetwork>
      </ConnectButton>
    )
  } else if (asset.orderbookStats.highestOfferPrice) {
    return <Price variant="accent" amount={asset.orderbookStats.highestOfferPrice} />
  } else if (!owner) {
    return (
      <ConnectButton customText="Buy">
        <SwitchNetwork>
          <MakeBuyOfferButton
            asset={asset as unknown as AssetWithTradeData}
            isVariantLink
          />
        </SwitchNetwork>
      </ConnectButton>
    )
  } else {
    return "No offer yet"
  }
}

export function AssetCard({ asset, children }: AssetCardProps) {
  const viewerAddress = useCurrentViewerAddress()

  const owner = useMemo(() => {
    return asset.owner === viewerAddress?.toLowerCase()
  }, [viewerAddress, asset.owner])

  return (
    <AssetCardBase
      src={asset.cachedImageUrl}
      fallback={asset.metadata.image}
      owner={owner}
      asset={asset}
    >
      <>
        <Link
          href={`/marketplace/${asset.tokenId}`}
          className={cn(
            "mb-4 flex flex-nowrap items-center text-xl font-semibold text-white"
          )}
        >
          <span className="inline-block max-w-[100%_-_80px] truncate">
            {asset.metadata.name ? asset.metadata.name : "Unknown NFT"}
          </span>
          <span>&nbsp;#{shortenTokenId(asset.tokenId, 5)}</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            {!owner && (
              <div className="mb-1 text-sm font-medium">Price</div>
            )}
            {asset.orderbookStats.lowestListingPrice ? (
              <Price variant="accent" amount={asset.orderbookStats.lowestListingPrice} />
            ) : owner ? (
              <SellAssetButton
                asset={asset as unknown as AssetWithTradeData}
                isVariantLink
              />
            ) : (
              "No listed yet"
            )}
          </div>
          <div>
            {asset.orderbookStats.highestOfferPrice && (
              <div className="text-sm font-medium">Best offer</div>
            )}
            <div className="text-end">{renderAssetActions(asset, owner)}</div>
          </div>
        </div>
        {children}
      </>
    </AssetCardBase>
  )
}
